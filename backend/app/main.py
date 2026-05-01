from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, lahan, users, organizations, history, chat, chat_live, admin

app = FastAPI(title="Orbitani Edu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(lahan.router, prefix="/api/lahan", tags=["Lahan"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(chat_live.router, prefix="/api/chat-live", tags=["Chat Live"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Orbitani Edu API"}
