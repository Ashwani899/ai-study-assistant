import io
import fitz
from pptx import Presentation
from docx import Document

def parse_file(file_bytes: bytes, filename: str) -> dict:
    raw_text = ""
    file_type = filename.split(".")[-1].lower() if "." in filename else ""
    
    try:
        if file_type == "pdf":
            doc = fitz.open("pdf", file_bytes)
            for page in doc:
                raw_text += page.get_text() + "\n"
        elif file_type in ["pptx", "ppt"]:
            prs = Presentation(io.BytesIO(file_bytes))
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        raw_text += shape.text + "\n"
                    if shape.has_table:
                        for row in shape.table.rows:
                            for cell in row.cells:
                                raw_text += cell.text + " "
                            raw_text += "\n"
        elif file_type in ["docx", "doc"]:
            doc = Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                raw_text += para.text + "\n"
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        raw_text += cell.text + " "
                    raw_text += "\n"
    except Exception as e:
        print(f"Error parsing file: {e}")
        
    word_count = len(raw_text.split())
    page_count = max(1, word_count // 300)
    
    return {
        "raw_text": raw_text.strip(),
        "word_count": word_count,
        "page_count": page_count
    }
