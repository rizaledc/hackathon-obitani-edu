from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_]+$")
    password: str = Field(..., min_length=8)
    email: EmailStr
    name: str
    organization_id: Optional[int] = None
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: Optional[str]
    name: Optional[str]
    role: str
    organization_id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class LahanCreate(BaseModel):
    nama: str
    deskripsi: Optional[str] = None
    koordinat: Dict[str, Any]  # GeoJSON dict

class LahanUpdate(BaseModel):
    nama: Optional[str] = None
    deskripsi: Optional[str] = None

class MlFeedbackCreate(BaseModel):
    lahan_id: int
    n: float
    p: float
    k: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    actual_label: str
    rating: int

class MlFeedbackOut(BaseModel):
    id: int
    lahan_id: int
    n: float
    p: float
    k: float
    rating: int
    created_at: datetime

class RetrainResponse(BaseModel):
    message: str
    accuracy: float
    f1_score: float

class OrganizationCreate(BaseModel):
    nama: str

class OrganizationOut(BaseModel):
    id: int
    nama: str
    created_at: datetime

class ChatRequest(BaseModel):
    message: str
    lahan_id: Optional[int] = None
    user_api_key: Optional[str] = None
