from fastapi import FastAPI
from app.routes.analyze import router as analyze_router
from app.routes.report import router as report_router
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="PharmaGuard API")

# ✅ Add CORS FIRST (clean origin, no trailing slash)
origins = [
    "https://pharma-guard-ai-rho.vercel.app",   # production frontend
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount routers
app.include_router(analyze_router, prefix="/analyze")
app.include_router(report_router, prefix="/report")

# ✅ Health routes
@app.get("/")
def root():
    return {"message": "PharmaGuard running"}

@app.get("/healthz")
def health():
    return {"status": "ok", "service": "PharmaGuard"}