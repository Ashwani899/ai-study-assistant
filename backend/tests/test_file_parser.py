from io import BytesIO

import fitz
import pytest
from docx import Document
from pptx import Presentation

from app.services.file_parser import parse_file


def make_docx() -> bytes:
    document = Document()
    document.add_paragraph("Lecture topic: algorithms")
    table = document.add_table(rows=1, cols=2)
    table.cell(0, 0).text = "Complexity"
    table.cell(0, 1).text = "O(n log n)"
    buffer = BytesIO()
    document.save(buffer)
    return buffer.getvalue()


def make_pptx() -> bytes:
    presentation = Presentation()
    slide = presentation.slides.add_slide(presentation.slide_layouts[5])
    textbox = slide.shapes.add_textbox(0, 0, 1000, 500)
    textbox.text = "Database normalization"
    buffer = BytesIO()
    presentation.save(buffer)
    return buffer.getvalue()


def make_pdf() -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), "Operating systems lecture")
    content = document.tobytes()
    document.close()
    return content


def test_parse_docx_paragraphs_and_tables():
    parsed = parse_file(make_docx(), "notes.docx")
    assert "algorithms" in parsed["raw_text"]
    assert "O(n log n)" in parsed["raw_text"]


def test_parse_pptx_text():
    parsed = parse_file(make_pptx(), "slides.pptx")
    assert "Database normalization" in parsed["raw_text"]


def test_parse_pdf_text():
    parsed = parse_file(make_pdf(), "lecture.pdf")
    assert "Operating systems" in parsed["raw_text"]


@pytest.mark.parametrize("filename", ["legacy.doc", "legacy.ppt", "notes.txt"])
def test_reject_unsupported_legacy_formats(filename):
    with pytest.raises(ValueError, match="Only PDF, PPTX, and DOCX"):
        parse_file(b"content", filename)


def test_reject_invalid_zip_document():
    with pytest.raises(ValueError, match="valid DOCX"):
        parse_file(b"not a zip archive", "notes.docx")


def test_reject_empty_file():
    with pytest.raises(ValueError, match="empty"):
        parse_file(b"", "lecture.pdf")
