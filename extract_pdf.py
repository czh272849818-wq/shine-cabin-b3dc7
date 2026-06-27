#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from PyPDF2 import PdfReader
import glob
import os

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {e}"

if __name__ == "__main__":
    # Get all PDF files
    pdf_files = glob.glob("*.pdf")

    for pdf_file in pdf_files:
        print(f"\n{'='*80}")
        print(f"FILE: {pdf_file}")
        print('='*80)
        text = extract_pdf_text(pdf_file)
        print(text)
