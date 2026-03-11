EXEMPLO DE PDF AQUI https://www.guaruja.sp.gov.br/edicoes-diario-oficial

PROMPT

You are a senior Python engineer specialized in data pipelines and document parsing.

Your task is to generate a clean Python project that monitors Brazilian "Diário Oficial" PDFs and detects convocations from public hiring processes.

The project must extract all people listed in "EDITAL DE CONVOCAÇÃO" sections and then match them with monitored users.

Important principles:
- clean architecture
- modular code
- easy to test
- notebook for experimentation

PROJECT GOAL

Parse Diário Oficial PDFs and detect when a monitored person is called in a public hiring process.

PIPELINE

PDF → extract text → detect "ATOS OFICIAIS" section → detect "EDITAL DE CONVOCAÇÃO" blocks → extract convocados → match with monitored users.

PROJECT STRUCTURE

Generate the following project structure:

diario_monitor/

input/
diarios/

notebooks/
monitor_diario.ipynb

src/

pdf_reader.py
edital_detector.py
convocado_extractor.py
matcher.py
pipeline.py

config/
users.yaml

output/

requirements.txt
README.md

FUNCTIONAL REQUIREMENTS

1. PDF READER

Create a module pdf_reader.py that:
- loads a PDF file
- extracts text using pdfplumber
- returns the full text

2. EDITAL DETECTOR

Create edital_detector.py that:

- receives raw text
- detects the section "ATOS OFICIAIS"
- finds blocks starting with "EDITAL DE CONVOCAÇÃO"
- returns a list of edital blocks

Use regex with DOTALL.

3. CONVOCADO EXTRACTOR

Create convocado_extractor.py that extracts:

classification
name

Typical formats include:

12 JOAO SILVA
13 MARIA SANTOS

Use regex patterns to capture:

(\d+) NAME

Return a list of dictionaries:

{
  "classificacao": "...",
  "nome": "..."
}

4. MATCHER

Create matcher.py that:

- loads monitored users from a YAML file
- compares extracted names with monitored names
- returns matches

YAML format:

users:
  - id: 1
    nome: JOAO SILVA

Match should be case-insensitive.

5. PIPELINE

Create pipeline.py that orchestrates:

read pdf
detect editais
extract convocados
match users
print results

6. NOTEBOOK

Generate a Jupyter Notebook that:

- installs dependencies
- loads a test PDF
- runs the pipeline
- prints matches

7. CONFIG

Generate users.yaml example:

users:
  - id: 1
    nome: JOAO SILVA
  - id: 2
    nome: MARIA SANTOS

8. REQUIREMENTS

Include:

pdfplumber
pandas
pyyaml

9. README

Explain:

project structure
how to run
how to add monitored users

10. CODE QUALITY

Use:

functions
docstrings
type hints
clean modular design

11. OUTPUT

When matches are found print:

MATCH FOUND
User: <name>
Classification: <number>

If no match is found print:

No monitored users found.

IMPORTANT

Write production-quality Python code but keep it simple and readable.

Avoid overengineering.

Generate all files and code.
