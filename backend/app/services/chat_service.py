from app.schemas.chat import ChatRequest, ChatResponse


def generate_mock_reply(payload: ChatRequest) -> ChatResponse:
    text = payload.message.lower()

    if "project" in text or "health" in text:
        reply = (
            "Project health looks stable in this prototype. "
            "Recommended next steps: add authentication, tenant isolation, role permissions, "
            "audit logs, and production deployment configuration."
        )
    elif "dashboard" in text:
        reply = (
            "The dashboard shows total projects, active modules, review queue, revenue trend, "
            "and AI support activity using mock data."
        )
    else:
        reply = (
            "This is a mock AI chatbot response. Later, connect this service to OpenAI, Azure OpenAI, "
            "or another LLM provider from the backend."
        )

    return ChatResponse(reply=reply)
