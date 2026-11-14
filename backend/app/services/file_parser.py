import io
import zipfile

import fitz
from pptx import Presentation
from docx import Document


def parse_file(file_bytes: bytes, filename: str) -> dict:
    if not file_bytes:
        raise ValueError("The uploaded file is empty.")

    file_type = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if file_type not in {"pdf", "pptx", "docx"}:
        raise ValueError("Only PDF, PPTX, and DOCX files are supported.")

    raw_text = []
    try:
        if file_type == "pdf":
            if not file_bytes.startswith(b"%PDF-"):
                raise ValueError("The uploaded file is not a valid PDF.")
            with fitz.open(stream=file_bytes, filetype="pdf") as document:
                if document.is_encrypted and not document.authenticate(""):
                    raise ValueError("Password-protected PDFs are not supported.")
                raw_text.extend(page.get_text() for page in document)

        elif file_type in {"pptx", "docx"}:
            if not zipfile.is_zipfile(io.BytesIO(file_bytes)):
                raise ValueError(f"The uploaded file is not a valid {file_type.upper()} document.")

            if file_type == "pptx":
                presentation = Presentation(io.BytesIO(file_bytes))
                for slide in presentation.slides:
                    for shape in slide.shapes:
                        if getattr(shape, "has_text_frame", False) and shape.has_text_frame:
                            raw_text.append(shape.text)
                        if getattr(shape, "has_table", False) and shape.has_table:
                            for row in shape.table.rows:
                                raw_text.append(" | ".join(cell.text for cell in row.cells))
            else:
                document = Document(io.BytesIO(file_bytes))
                raw_text.extend(para.text for para in document.paragraphs if para.text)
                for table in document.tables:
                    for row in table.rows:
                        raw_text.append(" | ".join(cell.text for cell in row.cells))

    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(f"The uploaded {file_type.upper()} file is invalid or unreadable.") from exc

    extracted_text = "\n".join(part for part in raw_text if part).strip()
    if not extracted_text:
        raise ValueError("No extractable text was found in the document.")

    word_count = len(extracted_text.split())
    page_count = max(1, (word_count + 299) // 300)

    return {
        "raw_text": extracted_text,
        "word_count": word_count,
        "page_count": page_count
    }
