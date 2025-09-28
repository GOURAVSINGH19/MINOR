import os
from typing import List, Tuple, Optional

from sentence_transformers import SentenceTransformer, util
from transformers import pipeline


# In-memory index built at startup from backend/knowledge_base.txt
_embed_model: Optional[SentenceTransformer] = None
_qa_pipeline = None
_kb_chunks: List[str] = []
_kb_embeddings = None
_instruct_pipeline = None


def _read_knowledge_base(path: str) -> str:
	try:
		with open(path, "r", encoding="utf-8") as f:
			txt = f.read()
			# remove a top-level header line like 'Department of Justice (India) Knowledge Base'
			lines = txt.splitlines()
			cleaned_lines = [l for l in lines if not l.strip().lower().startswith('department of justice')]
			return "\n".join(cleaned_lines)
	except FileNotFoundError:
		return ""


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
	"""Simple sliding-window text chunker."""
	if not text:
		return []
	# Treat each paragraph as an independent chunk. Do not merge multiple paragraphs
	# into a single chunk — this preserves Title -> content pairing.
	paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
	chunks: List[str] = []
	for p in paragraphs:
		if len(p) <= chunk_size:
			chunks.append(p)
		else:
			# split long paragraph into overlapping slices
			start = 0
			while start < len(p):
				end = min(start + chunk_size, len(p))
				chunks.append(p[start:end])
				if end == len(p):
					break
				start = end - overlap if end - overlap > start else end
	return chunks


def _clean_chunk_text(s: str) -> str:
	"""Sanitize a chunk for display: remove markdown headers and noisy lines."""
	if not s:
		return s
	lines = [l.strip() for l in s.splitlines() if l.strip()]
	cleaned = []
	for l in lines:
		# drop pure markdown headings like '# startup' or '## something'
		if l.startswith("#"):
			# if the header has useful words, keep them without '#'
			header = l.lstrip('#').strip()
			if header:
				cleaned.append(header)
			continue
		# strip leading 'Title:' markers
		if l.lower().startswith('title:'):
			cleaned.append(l.split(':', 1)[1].strip())
			continue
		cleaned.append(l)
	out = " ".join(cleaned)
	# collapse repeated whitespace
	return " ".join(out.split())


async def load_nlp_resources() -> None:
	"""Load embedding model, QA pipeline and build an in-memory vector index from knowledge_base.txt."""
	global _embed_model, _qa_pipeline, _kb_chunks, _kb_embeddings, _instruct_pipeline
	hf_home = os.getenv("HF_HOME")
	if hf_home:
		os.makedirs(hf_home, exist_ok=True)

	# Sentence-BERT model for semantic similarity
	_embed_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

	# QA pipeline (local) - HF token optional for remote private models
	_qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

	# Optional small instruction model to synthesize answers from retrieved context
	instruct_model = os.getenv("HF_INSTRUCT_MODEL") or "google/flan-t5-small"
	try:
		# Use text2text-generation (seq2seq) for instruction-like prompts
		_instruct_pipeline = pipeline("text2text-generation", model=instruct_model)
	except Exception:
		_instruct_pipeline = None

	# Build KB index from file
	kb_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "knowledge_base.txt")
	kb_text = _read_knowledge_base(kb_path)
	if not kb_text:
		# leave empty index
		_kb_chunks = []
		_kb_embeddings = None
		return

	_kb_chunks = _chunk_text(kb_text, chunk_size=1000, overlap=200)
	if _kb_chunks:
		_kb_embeddings = _embed_model.encode(_kb_chunks, convert_to_tensor=True, normalize_embeddings=True)


async def _vector_search(query: str, top_k: int = 3) -> List[Tuple[str, float]]:
	"""Return top_k matching KB chunks and their similarity scores."""
	global _embed_model, _kb_chunks, _kb_embeddings
	if not _kb_chunks or _embed_model is None or _kb_embeddings is None:
		return []
	query_emb = _embed_model.encode(query, convert_to_tensor=True, normalize_embeddings=True)
	scores = util.cos_sim(query_emb, _kb_embeddings)[0]
	vals, idxs = scores.topk(min(top_k, len(_kb_chunks)))
	results: List[Tuple[str, float]] = []
	for v, i in zip(vals, idxs):
		results.append((_kb_chunks[int(i)], float(v)))
	return results


async def run_qa(question: str, context: str) -> str:
	assert _qa_pipeline is not None
	res = _qa_pipeline({"question": question, "context": context})
	return res.get("answer") or ""


async def run_instruct(user_query: str, context: str) -> str:
	"""Run the instruction model (if available) to synthesize a helpful answer.

	The prompt format is simple: provide the context and ask the model to answer the user's question concisely.
	"""
	global _instruct_pipeline
	if _instruct_pipeline is None:
		return ""
	prompt = f"Context: {context}\n\nQuestion: {user_query}\n\nAnswer concisely:" 
	try:
		out = _instruct_pipeline(prompt, max_length=256, truncation=True)
		if isinstance(out, list) and out:
			text = out[0].get("generated_text") or out[0].get("text") or ""
			# return only if reasonably long (avoid single-word replies)
			if len(text.split()) >= 3:
				return text
			return ""
		return ""
	except Exception:
		return ""


async def generate_bot_response(user_query: str, db) -> str:
	# 1) Vector search in knowledge_base.txt
	matches = await _vector_search(user_query, top_k=5)
	if not matches:
		matches = []

	# Filter out tiny/noisy chunks (short cleaned text)
	filtered: List[Tuple[str, float, str]] = []
	for chunk, score in matches:
		cleaned = _clean_chunk_text(chunk)
		if len(cleaned.split()) >= 3:
			filtered.append((chunk, score, cleaned))
	# Compute simple lexical overlap with the query and rerank
	def _token_set(s: str) -> set:
		import re

		toks = [t.lower() for t in re.split(r"\W+", s) if len(t) > 2]
		return set(toks)

	q_tokens = _token_set(user_query)
	ranked: List[Tuple[str, float, str, float]] = []
	for chunk, score, cleaned in filtered:
		# lexical overlap fraction
		chunk_tokens = _token_set(cleaned)
		if not chunk_tokens:
			overlap_frac = 0.0
		else:
			overlap_frac = len(q_tokens & chunk_tokens) / max(1, len(q_tokens))
		# exact keyword boost for important named tokens
		keywords = {"aadhaar", "aadhar", "uidai", "e-aadhaar", "e aadhaar"}
		exact_boost = 0.0
		if q_tokens & keywords:
			# if query mentions an important token and chunk contains it, boost
			if chunk_tokens & keywords:
				exact_boost = 0.4
		# composite score: weighted sum + boost
		composite = 0.65 * score + 0.25 * overlap_frac + exact_boost
		ranked.append((chunk, score, cleaned, composite))

	# sort by composite score descending
	ranked.sort(key=lambda x: x[3], reverse=True)

	# If we have at least one good chunk, try the top-1 first to avoid confusion
	if ranked:
		top_chunk, top_score, top_cleaned, top_composite = ranked[0]
		# 2) Try instruction model on the top chunk alone
		if _instruct_pipeline is not None:
			instruct_ans = await run_instruct(user_query, top_cleaned)
			if instruct_ans and instruct_ans.strip() and len(instruct_ans.split()) >= 3:
				return instruct_ans.strip()

		# 3) Try QA on the top chunk alone
		if _qa_pipeline is not None:
			qa_ans = await run_qa(user_query, top_cleaned)
			if qa_ans and qa_ans.strip() and len(qa_ans.split()) >= 3:
				return qa_ans.strip()

	# 4) If top-1 failed, try combined top-K filtered chunks (fallback)
	if ranked:
		combined = "\n\n".join([c for c, _, _, _ in ranked[:3]])[:8000]
		if combined:
			if _instruct_pipeline is not None:
				instruct_ans = await run_instruct(user_query, combined)
				if instruct_ans and instruct_ans.strip() and len(instruct_ans.split()) >= 3:
					return instruct_ans.strip()
			if _qa_pipeline is not None:
				qa_ans = await run_qa(user_query, combined)
				if qa_ans and qa_ans.strip() and len(qa_ans.split()) >= 3:
					return qa_ans.strip()

	# 3) If QA failed, return a cleaned short summary of the best chunk (not raw chunk)
	if matches:
		best_context, score = matches[0]
		summary = _clean_chunk_text(best_context)
		# prefer returning a short sentence(s)
		if summary:
			# split into sentences (simple split) and return first 1-2 sentences
			import re

			sents = re.split(r'(?<=[.!?])\s+', summary)
			# pick sentences with at least 3 words to avoid tiny fragments
			good = [s for s in sents if len(s.split()) >= 3]
			if good:
				rtn = " ".join(good[:2]).strip()
				if len(rtn) > 0:
					return rtn[:800]
			# otherwise, fallback to whole cleaned summary if it's reasonable
			if len(summary.split()) >= 3:
				return summary[:800]

	# 4) Fallback to DB-stored FAQs (legacy support)
	try:
		fetched: List[Tuple[str, str]] = []
		async for doc in db.faqs.find({}):
			fetched.append((doc.get("question", ""), doc.get("answer", "")))
		if fetched and _embed_model is not None:
			qs = [q for q, _ in fetched]
			q_embs = _embed_model.encode(qs, convert_to_tensor=True, normalize_embeddings=True)
			query_emb = _embed_model.encode(user_query, convert_to_tensor=True, normalize_embeddings=True)
			scores = util.cos_sim(query_emb, q_embs)[0]
			best_idx = int(scores.argmax())
			best_score = float(scores[best_idx])
			if best_score >= 0.40:
				return fetched[best_idx][1]
	except Exception:
		# ignore DB errors and continue to final fallback
		pass

	# 5) Final fallback
	return "I'm unable to find an exact answer from the knowledge base. Please refer to the Department of Justice (India) resources at https://doj.gov.in/"


async def seed_default_faqs(db) -> None:
	# keep legacy function but do not seed US-centric defaults
	return


