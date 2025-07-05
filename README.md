# Automated-Data-Filler-Agent

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
  * [Gradio Web UI](#gradio-web-ui)
  * [Python API / CLI](#python-api--cli)
  * [Standalone Modules](#standalone-modules)
* [Modules and Architecture](#modules-and-architecture)
* [Environment Variables](#environment-variables)
* [Database Setup](#database-setup)
* [Dependency Management](#dependency-management)
* [Logging and Debugging](#logging-and-debugging)
* [Testing](#testing)
* [Deployment](#deployment)
  * [Docker (Optional)](#docker-optional)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

A Python-based tool that automates the extraction of contact, company, and deal information from meeting summaries, detects sensitive PII, and stores leads in a MongoDB database. It provides both a user-friendly Gradio web interface and programmatic access via Python functions.

## Features

* **PII Detection:** Leverages Microsoft Presidio to identify PII spans in text.
* **Entity Extraction:** Uses OpenAI via LangChain to extract structured JSON for contact, company, and deal data.
* **Normalization:** Converts raw extraction output into a consistent schema.
* **Persistence:** Saves and retrieves leads in MongoDB.
* **Interactive UI:** Gradio dashboard for processing summaries and viewing stored leads.
* **Flexible API:** Importable Python modules for custom integrations.

## Tech Stack

* **Language:** Python 3.8+
* **AI & LLM:** OpenAI (via LangChain & langchain-community)
* **PII Detection:** Microsoft Presidio Analyzer
* **Database:** MongoDB (PyMongo)
* **UI:** Gradio
* **Config Management:** python-dotenv

## Prerequisites

* Python 3.8 or higher
* A MongoDB instance (local or Atlas)
* OpenAI API key with access to GPT models
* (Optional) Docker for containerized deployment

## Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd project
   ```
2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. **Copy the example environment file**

   ```bash
   cp .example.env .env
   ```
2. **Edit `.env`**

   ```ini
   OPENAI_API_KEY="your_openai_api_key"
   MONGO_URI="your_mongodb_connection_uri"
   OPENAI_MODEL="gpt-4o-mini"  # Optional (defaults to gpt-4o-mini)
   ```

## Usage

### Gradio Web UI

Run the web interface:

```bash
python app.py
```

Open your browser at `http://localhost:7860`.

* Paste or type a meeting summary and click **Process & Save Lead**.
* View extracted data and stored leads side by side.

### Python API / CLI

Use the core processing function in your own code or scripts:

```python
from agent_flow import run_agent

summary = (
    "Met with Jane Doe from Acme Corp. "
    "Discussed a potential $50K deal. "
    "Jane's email is jane.doe@example.com."
)

processed_data, all_leads = run_agent(summary)
print(processed_data)
print(all_leads)
```

### Standalone Modules

* **Entity Extraction**:

  ```python
  from extractor import extract_entities
  result = extract_entities("Meeting summary text...")
  ```
* **PII Detection**:

  ```python
  from pii_detector import detect_pii
  pii_spans = detect_pii("Contact at john.doe@example.com")
  ```

## Modules and Architecture

* **`agent_flow.py`**: Orchestrates the end-to-end flow:

  1. `detect_pii()`
  2. `extract_entities()`
  3. `normalize_schema()`
  4. `save_lead()` & `get_leads()`

  Exports:

  * `process_meeting_summary(summary: str) -> dict`
  * `run_agent(summary: str) -> Tuple[dict, list]`

* **`extractor.py`**: Defines `extract_entities(text: str) -> dict` with a LangChain LLMChain and prompt template to return valid JSON.

* **`pii_detector.py`**: Provides `detect_pii(text: str) -> List[dict]` using Presidio Analyzer.

* **`db.py`**: Manages MongoDB connection and CRUD:

  * `save_lead(data: dict) -> str`
  * `get_leads() -> list`

* **`app.py`**: Builds the Gradio UI and wires up `run_agent()` to front-end components.

## Environment Variables

| Key              | Description                                | Required |
| ---------------- | ------------------------------------------ | -------- |
| `OPENAI_API_KEY` | API key for OpenAI services                | Yes      |
| `MONGO_URI`      | MongoDB connection URI                     | Yes      |
| `OPENAI_MODEL`   | OpenAI model name (default: `gpt-4o-mini`) | No       |

## Database Setup

* **Local**: Install MongoDB and run `mongod` service.
* **MongoDB Atlas**: Create a free cluster, whitelist your IP, and obtain the connection string.

## Dependency Management

* All Python dependencies are listed in `requirements.txt`.
* To update dependencies:

  ```bash
  pip freeze > requirements.txt
  ```

## Logging and Debugging

* Modules print status messages to the console (e.g., PII detection, DB connection).
* Warnings are shown if `MONGO_URI` or `OPENAI_API_KEY` are missing or invalid.

## Testing

*No automated tests included.*


## Deployment

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

Build and run:

```bash
docker build -t crm-lead-processor .
docker run -d \
  -e OPENAI_API_KEY=your_api_key \
  -e MONGO_URI=your_mongo_uri \
  -p 7860:7860 \
  crm-lead-processor
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
