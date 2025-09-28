import os
from fastapi import APIRouter, HTTPException, Header

from ..services import nlp

router = APIRouter()


@router.post("/reindex")
async def reindex(admin_token: str | None = Header(None)) -> dict:
    """Trigger reloading and reindexing of backend/knowledge_base.txt at runtime.

    If environment variable ADMIN_TOKEN is set, the request must include the same value
    in the `admin-token` header.
    """
    expected = os.getenv("ADMIN_TOKEN")
    if expected:
        if not admin_token or admin_token != expected:
            raise HTTPException(status_code=401, detail="Invalid admin token")

    await nlp.load_nlp_resources()
    # report number of chunks indexed if available
    chunks = len(getattr(nlp, "_kb_chunks", []) or [])
    return {"status": "ok", "indexed_chunks": chunks}


@router.get("/debug_query")
async def debug_query(q: str, admin_token: str | None = Header(None)) -> dict:
    """Return top-K matches and model outputs for a query to help debugging.

    Requires ADMIN_TOKEN if the env var is set.
    """
    expected = os.getenv("ADMIN_TOKEN")
    if expected:
        if not admin_token or admin_token != expected:
            raise HTTPException(status_code=401, detail="Invalid admin token")

    matches = await nlp._vector_search(q, top_k=5)
    cleaned = [nlp._clean_chunk_text(m) for m, _ in matches]
    instruct_out = ""
    qa_out = ""
    combined = "\n\n".join([m for m, _ in matches])[:8000]
    if combined:
        instruct_out = await nlp.run_instruct(q, combined)
        qa_out = await nlp.run_qa(q, combined)

    return {
        "query": q,
        "matches": [{"chunk": c, "score": s} for (c, s), c in zip(matches, cleaned)],
        "cleaned_chunks": cleaned,
        "instruct_output": instruct_out,
        "qa_output": qa_out,
    }
