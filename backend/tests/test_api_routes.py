from app.main import app


def test_frontend_document_api_routes_exist():
    paths = {route.path for route in app.routes}
    expected = {
        "/api/upload",
        "/api/document/{doc_id}",
        "/api/summarize/{doc_id}",
        "/api/quiz/{doc_id}",
        "/api/flashcards/{doc_id}",
        "/api/notes/{doc_id}",
        "/api/formulas/{doc_id}",
        "/api/important/{doc_id}",
        "/api/interview/{doc_id}",
        "/api/revision/{doc_id}",
        "/api/chat/{doc_id}",
    }
    assert expected.issubset(paths)
