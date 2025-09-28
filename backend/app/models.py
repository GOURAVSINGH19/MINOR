from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
	email: EmailStr
	password: str = Field(min_length=6)


class UserInDB(BaseModel):
	id: str
	email: EmailStr
	passwordHash: str
	createdAt: datetime


class UserPublic(BaseModel):
	id: str
	email: EmailStr
	createdAt: datetime


class TokenResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"


class ChatCreate(BaseModel):
	pass


class ChatInDB(BaseModel):
	id: str
	userId: str
	createdAt: datetime


class ChatPublic(BaseModel):
	id: str
	createdAt: datetime


class MessageCreate(BaseModel):
	text: str


class MessageInDB(BaseModel):
	id: str
	chatId: str
	sender: Literal["user", "bot"]
	text: str
	timestamp: datetime


class MessagePublic(BaseModel):
	id: str
	sender: Literal["user", "bot"]
	text: str
	timestamp: datetime


class FAQInDB(BaseModel):
	id: str
	question: str
	answer: str


