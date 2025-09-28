from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import EmailStr
from bson import ObjectId

from ..database import get_db
from ..models import UserCreate, UserPublic, TokenResponse
from ..security import hash_password, verify_password, create_access_token


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def serialize_user(doc: Dict[str, Any]) -> UserPublic:
	return UserPublic(
		id=str(doc["_id"]),
		email=doc["email"],
		createdAt=doc["createdAt"],
	)


@router.post("/register", response_model=UserPublic)
async def register(payload: UserCreate, db=Depends(get_db)) -> UserPublic:
	email = str(payload.email).strip().lower()
	existing = await db.users.find_one({"email": email})
	if existing:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
	user_doc = {
		"email": email,
		"passwordHash": hash_password(payload.password),
		"createdAt": datetime.now(tz=timezone.utc),
	}
	res = await db.users.insert_one(user_doc)
	user_doc["_id"] = res.inserted_id
	return serialize_user(user_doc)


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)) -> TokenResponse:
	email = form_data.username.strip().lower()
	user = await db.users.find_one({"email": email})
	if not user or not verify_password(form_data.password, user.get("passwordHash", "")):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
	token = create_access_token(str(user["_id"]))
	return TokenResponse(access_token=token)


