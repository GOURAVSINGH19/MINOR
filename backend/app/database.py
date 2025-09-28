import os
from pathlib import Path
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv, dotenv_values


def _load_env() -> None:
	# Try loading .env from backend root (parent of app/) and from CWD
	backend_root = Path(__file__).resolve().parent.parent
	candidates = [
		backend_root / ".env",
		Path.cwd() / ".env",
	]
	for env_path in candidates:
		if env_path.exists():
			# Use dotenv_values to read and then explicitly set to avoid duplicate/quote issues
			values = dotenv_values(dotenv_path=str(env_path))
			for key, value in values.items():
				if value is not None:
					os.environ[key] = value
			break


_load_env()

mongo_client: Optional[AsyncIOMotorClient] = None
mongo_db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo() -> None:
	global mongo_client, mongo_db
	# Inline fallback for development per user's request
	mongo_uri = os.getenv("MONGODB_URI") or "mongodb+srv://chlakshay007_db_user:f9c7XZkaV2mS83Iw@cluster0.ekdut74.mongodb.net/doj?retryWrites=true&w=majority&appName=Cluster0"
	if not mongo_uri:
		raise RuntimeError("MONGODB_URI is not set")
	mongo_client = AsyncIOMotorClient(mongo_uri)
	mongo_db = mongo_client.get_default_database()


async def close_mongo_connection() -> None:
	global mongo_client
	if mongo_client is not None:
		mongo_client.close()
		mongo_client = None


def get_db() -> AsyncIOMotorDatabase:
	if mongo_db is None:
		raise RuntimeError("Mongo database is not initialized")
	return mongo_db


