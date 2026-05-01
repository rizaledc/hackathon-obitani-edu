from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from typing import Any
from pydantic import BaseModel

from app.db.database import supabase
from app.models.schemas import UserCreate, UserOut, Token
from app.core.security import create_access_token, get_current_user

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PasswordUpdate(BaseModel):
    new_password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=UserOut)
def register(user: UserCreate) -> Any:
    # Check if username already exists
    existing_user = supabase.table("users").select("*").eq("username", user.username).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system."
        )

    # Check if email exists
    existing_email = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing_email.data:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system."
        )

    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    
    new_user = supabase.table("users").insert(user_dict).execute()
    
    if not new_user.data:
        raise HTTPException(status_code=500, detail="Failed to create user.")
        
    return new_user.data[0]

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user_response = supabase.table("users").select("*").eq("username", form_data.username).execute()
    
    if not user_response.data:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
        
    user = user_response.data[0]
    
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(
        data={"sub": user["username"], "organization_id": user.get("organization_id"), "role": user.get("role")}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"]
    }

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)) -> Any:
    return current_user

@router.put("/update-password")
async def update_password(body: PasswordUpdate, current_user: dict = Depends(get_current_user)) -> Any:
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        
    hashed_password = get_password_hash(body.new_password)
    
    update_response = supabase.table("users").update({"password": hashed_password}).eq("id", current_user["id"]).execute()
    
    if not update_response.data:
        raise HTTPException(status_code=500, detail="Failed to update password")
        
    return {"message": "Password updated successfully"}
