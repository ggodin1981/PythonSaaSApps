from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import generate_mock_reply

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest):
    return generate_mock_reply(payload)
