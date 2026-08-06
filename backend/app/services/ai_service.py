import json
from openai import AsyncOpenAI
from ..config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

async def _call_openai(prompt: str, text: str, temperature: float = 0.7, json_format: bool = False) -> str:
    if not client:
        return ""
    
    truncated_text = text[:48000]
    
    try:
        kwargs = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": truncated_text}
            ],
            "temperature": temperature
        }
        if json_format:
            kwargs["response_format"] = {"type": "json_object"}
            
        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI error: {e}")
        return ""

async def generate_summary(text: str) -> str:
    prompt = "You are an expert academic tutor. Create a comprehensive, well-structured summary of the following study material. Use markdown formatting with headers, bullet points, and bold for key terms. The summary should be thorough but concise, capturing all major topics, concepts, and their relationships. Organize by topic. Make it easy to study from."
    res = await _call_openai(prompt, text, temperature=0.7)
    return res if res else "## Mock Summary\nThis is a fallback summary since no API key is provided."

async def generate_quiz(text: str, num_questions: int = 10) -> list[dict]:
    prompt = f"Generate {num_questions} multiple-choice quiz questions from this study material. Each question should test understanding, not just recall. Return as JSON array with objects having: question (string), options (array of 4 strings), correct_answer (index 0-3), explanation (string explaining why). Mix difficulty levels. Cover all major topics. Ensure the output is a JSON object with a 'questions' key containing the array."
    res = await _call_openai(prompt, text, temperature=0.7, json_format=True)
    if res:
        try:
            return json.loads(res).get("questions", [])
        except json.JSONDecodeError:
            pass
    
    return [
        {
            "question": "Mock Question 1?",
            "options": ["A", "B", "C", "D"],
            "correct_answer": 0,
            "explanation": "This is a mock explanation."
        }
    ]

async def generate_flashcards(text: str, num_cards: int = 15) -> list[dict]:
    prompt = f"Create {num_cards} study flashcards from this material. Each card should have a 'front' (question/concept/term) and 'back' (detailed answer/definition/explanation). Cover key concepts, definitions, formulas, and important facts. Return as JSON object with a 'cards' key containing the array with {{front, back}} objects."
    res = await _call_openai(prompt, text, temperature=0.7, json_format=True)
    if res:
        try:
            return json.loads(res).get("cards", [])
        except json.JSONDecodeError:
            pass
    
    return [{"front": "Mock Front", "back": "Mock Back"}]

async def generate_notes(text: str) -> str:
    prompt = "You are an expert note-taker. Transform these lecture materials into well-organized study notes using markdown. Include: ## Topic Headers, ### Sub-sections, - Key points as bullet points, **Bold** for important terms, > Blockquotes for definitions, numbered lists for processes/steps. Make notes comprehensive but scannable. Add a 'Key Takeaways' section at the end."
    res = await _call_openai(prompt, text, temperature=0.7)
    return res if res else "## Mock Notes\n- Point 1\n- Point 2"

async def generate_formulas(text: str) -> str:
    prompt = "Extract and organize ALL formulas, equations, mathematical expressions, key definitions, and important constants from this material. Format as a clean reference sheet using markdown. Group by topic. Use LaTeX notation where appropriate (wrapped in $ or $$). If no formulas exist, list key definitions and important relationships instead."
    res = await _call_openai(prompt, text, temperature=0.3)
    return res if res else "## Mock Formulas\n$E=mc^2$"

async def generate_important_points(text: str) -> str:
    prompt = "Identify and list the most important points from this study material. These are the facts, concepts, and ideas most likely to appear on an exam. Format as markdown with: 🔴 Critical (must know), 🟡 Important (should know), 🟢 Good to know. Be thorough but prioritize correctly."
    res = await _call_openai(prompt, text, temperature=0.7)
    return res if res else "🔴 Critical: Mock point"

async def generate_interview_questions(text: str) -> list[dict]:
    prompt = "Generate 10 interview/viva questions that a professor might ask about this material. Include both conceptual and application-based questions. Return as JSON object with a 'questions' key containing the array with {question, suggested_answer} objects. Answers should be detailed enough to score full marks."
    res = await _call_openai(prompt, text, temperature=0.7, json_format=True)
    if res:
        try:
            return json.loads(res).get("questions", [])
        except json.JSONDecodeError:
            pass
    return [{"question": "Mock Question?", "suggested_answer": "Mock Answer."}]

async def generate_revision_plan(text: str) -> str:
    prompt = "Create a 5-day revision plan for this material. Use markdown format. For each day: ## Day X: [Topic Focus], list specific topics to cover, suggested study techniques (active recall, spaced repetition, etc.), estimated time, and a mini self-test. End with a ## Final Review Checklist."
    res = await _call_openai(prompt, text, temperature=0.7)
    return res if res else "## Mock Revision Plan\nDay 1: Read everything."

async def chat_with_document(text: str, question: str, history: list) -> dict:
    if not client:
        return {"answer": "Mock Answer. Please set API key.", "sources": []}
    
    truncated_text = text[:48000]
    prompt = f"You are a helpful study assistant. Answer the student's question based ONLY on the provided study material. If the answer isn't in the material, say so. Cite relevant sections. Be clear and educational. Previous conversation: {json.dumps(history)} Return as JSON object with 'answer' (string) and 'sources' (array of strings)."
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Context: {truncated_text}\n\nQuestion: {question}"}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"OpenAI error: {e}")
        return {"answer": "Error generating response.", "sources": []}
