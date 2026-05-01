from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, lahan

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Orbitani Edu API"}
