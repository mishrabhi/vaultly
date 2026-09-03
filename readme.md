# Vaultly

**Vaultly is an AI-powered document intelligence platform that turns static documents into an interactive knowledge base.**

Instead of manually reading through long documents, users can upload their documents, search across their knowledge base, and ask questions in natural language. Vaultly uses **semantic search, vector embeddings, Retrieval-Augmented Generation (RAG), and an LLM** to retrieve relevant information and generate grounded answers from uploaded documents.

The project combines a React frontend, FastAPI backend, PostgreSQL with vector search, document processing, REST APIs, and LLM-powered question answering into a single end-to-end system.


# What Problem Does Vaultly Solve?

Important information is often buried inside PDFs, reports, policies, manuals, research papers, and other documents.

Traditional document search generally relies on matching exact words. This becomes limiting when the user asks a question using different terminology from the document.

For example, a document might say:

> "Employees are eligible for reimbursement after completing the required travel documentation."

A user might ask:

> "When can I claim my travel expenses?"

A traditional keyword search may struggle to connect the two.

Vaultly uses **semantic search** to retrieve document content based on meaning rather than relying only on exact keyword matches.

For questions that require an answer, the retrieved document context can then be provided to an **LLM through a RAG pipeline**, allowing the model to generate a response grounded in the available document content.


# How Vaultly Works

At a high level, the system follows this flow:

```text
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                         Upload / Search / Ask
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │       FastAPI       │
                    └──────┬────────┬─────┘
                           │        │
                     Upload│        │Question
                           │        │
                           ▼        ▼
                  ┌────────────┐ ┌─────────────────┐
                  │  Document  │ │ Query Processing│
                  │ Processing │ └────────┬────────┘
                  └─────┬──────┘          │
                        │                 ▼
                        ▼          ┌─────────────────┐
                  ┌────────────┐  │ Semantic Search │
                  │    Text    │  └────────┬────────┘
                  │  Chunking  │           │
                  └─────┬──────┘           ▼
                        │          ┌─────────────────┐
                        ▼          │ Relevant Chunks │
                  ┌────────────┐   └────────┬────────┘
                  │ Embeddings │            │
                  └─────┬──────┘            ▼
                        │          ┌─────────────────┐
                        ▼          │       RAG       │
                  ┌────────────┐   └────────┬────────┘
                  │ PostgreSQL │◄───────────┤
                  │ + pgvector │            ▼
                  └────────────┘     ┌─────────────┐
                                     │     LLM      │
                                     └──────┬───────┘
                                            │
                                            ▼
                                     ┌───────────────┐
                                     │ Grounded Answer│
                                     └───────┬───────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  Frontend   │
                                      └─────────────┘
```

# Core AI Architecture

The most important part of Vaultly is its **Retrieval-Augmented Generation (RAG) pipeline**.

Rather than sending an entire document to an LLM whenever a user asks a question, Vaultly first finds the most relevant parts of the document and uses those sections as context for the model.

This makes responses more relevant, keeps the context manageable, and allows the application to answer questions using information from the uploaded knowledge base.

## 1. Document Upload

The user uploads a supported document through the frontend.

The backend receives the document and begins the document-processing pipeline.

The document becomes a knowledge source that can later be searched and used for question answering.

## 2. Text Extraction

The uploaded document is processed and its textual content is extracted.

This converts the original document into text that can be processed by the retrieval pipeline.

The extracted text becomes the foundation of the searchable knowledge base.

## 3. Text Chunking

Large documents cannot efficiently be passed to an LLM as one huge block of text.

Vaultly therefore breaks extracted content into smaller, meaningful **chunks**.

Conceptually:

```text
Document
   │
   ├── Chunk 1
   ├── Chunk 2
   ├── Chunk 3
   ├── Chunk 4
   └── ...
```

Chunking allows the retrieval system to work with smaller pieces of information and retrieve only the sections relevant to a user's query.

## 4. Embeddings

Each document chunk is converted into a numerical representation called an **embedding**.

Embeddings represent the semantic meaning of text in vector form.

For example:

```text
"How much leave can an employee take?"
```

and:

```text
"Employees are entitled to 24 days of annual leave."
```

may use very different words while still having related meaning.

Embedding models allow Vaultly to represent that semantic relationship mathematically.


## 5. Vector Storage

The generated embeddings are stored in **PostgreSQL with pgvector**.

Instead of searching only for exact words, Vaultly can compare the vector representation of a query against vectors representing document chunks.

This enables **semantic vector search** and allows relevant information to be retrieved based on meaning.

# Question Answering Pipeline

When a user asks a question through **Ask Vaultly**, the system follows a retrieval-and-generation flow.

```text
User Question
      │
      ▼
Query Processing
      │
      ▼
Semantic / Vector Search
      │
      ▼
Relevant Document Chunks
      │
      ▼
Context Construction
      │
      ▼
LLM Prompt + Retrieved Context
      │
      ▼
     LLM
      │
      ▼
Generated Answer
      │
      ▼
Answer + Sources
```

## Step 1 — Query

The user asks a natural-language question about the uploaded knowledge base.

For example:

> "What are the eligibility requirements?"

## Step 2 — Query Embedding

The question is converted into an embedding using the same semantic representation approach used for document chunks.

## Step 3 — Semantic Retrieval

The query representation is compared against stored document embeddings.

The system retrieves document chunks that are most semantically relevant to the question.

This is the **retrieval** part of RAG.

## Step 4 — Context Construction

The retrieved chunks are assembled into contextual information for the LLM.

Conceptually:

```text
Question:
What are the eligibility requirements?

Relevant document context:
[retrieved document content]
```

This gives the model the information it needs to produce a grounded response.

## Step 5 — LLM Generation

The LLM receives the user's question together with the retrieved context.

Its job is primarily to **understand and synthesize the retrieved information into a natural-language answer**.

The retrieval system finds the information.

The LLM explains it.

That separation is the core idea behind Vaultly's RAG architecture.

# Search

Vaultly also provides a dedicated **Search** interface for directly exploring retrieved document sections.

The search workflow is:

```text
Search Query
     │
     ▼
Backend Search API
     │
     ▼
Semantic Retrieval
     │
     ▼
Relevant Chunks
     │
     ▼
Search Results
```

Search results expose information such as:

- Document
- Relevant content
- Similarity score
- Page number when available
- Chunk information

The interface also provides client-side filtering of returned results by:

- Document
- Minimum similarity
- Page

# Why RAG Instead of Sending the Entire Document to an LLM?

A simple implementation could send an entire document to an LLM whenever a user asks a question.

That approach becomes increasingly inefficient as documents and document collections grow.

RAG provides a more scalable approach:

- **Retrieval** finds relevant information.
- **Semantic search** understands meaning rather than only exact keywords.
- **Chunking** keeps retrieved context manageable.
- **Embeddings** provide semantic representations of document content.
- **LLMs** turn retrieved information into useful natural-language answers.
- **Sources** allow the application to expose the document material used for the answer.

This architecture also makes the system easier to extend to larger document collections in the future.

# Frontend

The frontend provides the user-facing interface for interacting with Vaultly.

It is built using **React, TypeScript, Vite, and React Router**.

Its responsibilities include:

- Document upload
- Document management
- Semantic search
- Search filtering
- Natural-language question input
- Displaying AI-generated answers
- Displaying answer sources
- Handling API communication with the backend
- Managing loading, error, and response states
- Providing navigation between the application views

The main user-facing areas are:

```text
Home
Documents
Search
Ask Vaultly
Settings
About
```

The frontend does not perform the RAG pipeline itself.

Instead:

```text
Frontend
   │
   │ HTTP REST API
   ▼
Backend
   │
   ├── Document Processing
   ├── Chunking
   ├── Embeddings
   ├── Retrieval
   └── LLM
```

This keeps AI and data-processing logic on the server side and gives the frontend a clean API-driven architecture.

# Backend

The backend acts as the central orchestration layer of Vaultly.

It is built with **FastAPI** and is responsible for:

- Receiving uploaded documents
- Processing document content
- Splitting content into chunks
- Generating embeddings
- Storing searchable representations
- Processing user questions
- Performing semantic retrieval
- Constructing LLM context
- Calling the configured LLM service
- Returning generated answers and sources
- Managing application data and persistence

The backend therefore connects the traditional application layer with the AI and retrieval layers.


# Database & Data Layer

Vaultly uses **PostgreSQL** for persistent application data and **pgvector** for vector-based retrieval.

The application maintains relationships between:

```text
Documents
   │
   ├── Processed content
   ├── Chunks
   └── Embeddings / vectors
```

This allows Vaultly to move beyond simple document storage into a searchable knowledge system.

# API Layer

The frontend communicates with the backend through REST APIs.

The currently used application endpoints include:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/documents` | Retrieve uploaded documents |
| `GET` | `/documents/{id}` | Retrieve a specific document |
| `POST` | `/documents/upload` | Upload a document |
| `POST` | `/search` | Perform semantic document search |
| `POST` | `/ask` | Ask Vaultly a question |
| `GET` | `/health` | Check backend health |

The API layer provides a clean boundary between:

```text
User Interface
      ↕
   REST API
      ↕
Application Logic
      ↕
 AI / RAG Pipeline
      ↕
Database / Vector Storage
```

This separation makes the application easier to test, maintain, and extend.

# Technology Stack

| Technology / Concept | Purpose |
|----------------------|---------|
| **React** | Builds the interactive frontend |
| **TypeScript** | Provides type-safe frontend development |
| **Vite** | Frontend development and build tooling |
| **React Router** | Handles frontend navigation |
| **Lucide React** | Provides interface icons |
| **FastAPI** | Backend REST API and application logic |
| **PostgreSQL** | Persistent application data |
| **pgvector** | Vector similarity search |
| **Embeddings** | Converts text into semantic vector representations |
| **RAG** | Connects document retrieval with LLM generation |
| **LLM** | Generates natural-language answers from retrieved context |
| **Document Processing** | Extracts usable text from uploaded documents |
| **REST APIs** | Connects frontend and backend |
| **Automated Testing** | Validates application and integration behavior |
| **Git / GitHub** | Source control and collaboration |


# End-to-End Example

Imagine a user uploads a 100-page company policy document.

The document goes through:

```text
100-page document
       ↓
Text extraction
       ↓
Text chunking
       ↓
Embedding generation
       ↓
Vector storage
```

The user then asks:

> "How many days of parental leave are employees entitled to?"

Vaultly processes the question:

```text
Question
   ↓
Query embedding
   ↓
Semantic search
   ↓
Relevant policy chunks
   ↓
RAG context
   ↓
LLM
   ↓
Answer + Sources
```

The user receives a concise answer based on the relevant sections of the uploaded policy instead of having to manually search through all 100 pages.

# Project Architecture

Vaultly is structured into two primary applications:

```text
Vaultly
│
├── Frontend
│   ├── UI
│   ├── Document Upload
│   ├── Document Management
│   ├── Search Interface
│   ├── Ask Vaultly Interface
│   └── API Integration
│
└── Backend
    ├── REST API
    ├── Document Processing
    ├── Text Chunking
    ├── Embedding Generation
    ├── Vector Search
    ├── RAG Pipeline
    ├── LLM Integration
    ├── Database
    └── Testing
```

The architecture intentionally keeps presentation, application logic, persistence, retrieval, and generation as separate concerns.

# Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python
- Python virtual environment support
- PostgreSQL with pgvector
- Git
- Required LLM / embedding provider credentials

## Clone the Repository

```bash
git clone <repository-url>
cd vaultly
```

The repository contains separate frontend and backend applications.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies using the dependency configuration included in the repository.

Configure PostgreSQL and the required AI provider credentials before starting the FastAPI server.

# Environment Variables

The backend requires configuration for the database and AI services.

The exact environment variable names should match the configuration used by the backend.

Typical configuration includes:

```env
DATABASE_URL=...
LLM_API_KEY=...
EMBEDDING_API_KEY=...
```

Additional variables may be required depending on the configured AI provider and deployment environment.

**Never commit real API keys, database credentials, or other secrets to the repository.**

Use environment-specific configuration files and keep them excluded through `.gitignore`.

# Using Vaultly

## 1. Upload Documents

Open the **Documents** section and upload a supported PDF.

Vaultly processes the document so its content can be used by the retrieval system.

## 2. Search

Open **Search** and enter a keyword or natural-language query.

Vaultly returns relevant document chunks along with information such as similarity, page number, and document source.

Search results can be refined using the available filters.

## 3. Ask Vaultly

Open **Ask Vaultly** and enter a natural-language question.

Vaultly retrieves relevant document content and uses the configured LLM to generate an answer. Relevant sources are displayed underneath the generated response.


# Testing

Vaultly includes testing across the application to validate individual components and interactions between different parts of the system.

Testing is particularly important for the backend because the application combines:

- API requests
- Database operations
- Document processing
- Vector retrieval
- AI services

Integration testing helps ensure these components work correctly together rather than only testing them in isolation.


# Security Considerations

Because Vaultly works with potentially sensitive documents, security is an important part of the architecture.

Key considerations include:

- Keeping API credentials outside source control
- Validating uploaded files
- Protecting backend configuration
- Separating frontend and backend responsibilities
- Avoiding exposure of internal infrastructure details
- Validating API inputs
- Controlling access to stored document data
- Handling AI provider credentials securely

The application should treat uploaded documents as potentially sensitive user data.


# What Makes Vaultly Interesting?

Vaultly isn't simply a document upload application with an LLM attached to it.

The core system combines several layers:

```text
Documents
    ↓
Document Processing
    ↓
Chunking
    ↓
Embeddings
    ↓
Semantic Search
    ↓
Retrieval
    ↓
RAG
    ↓
LLM
    ↓
Natural-Language Answer
    ↓
Sources
```

This makes Vaultly an example of building an **AI-native application**, where the LLM is integrated into a larger retrieval and application architecture rather than being used as an isolated chatbot.

# Future Improvements

Potential future improvements include:

- Conversation history
- Improved retrieval and reranking
- Hybrid keyword + semantic search
- Document access controls
- Support for additional document formats
- Streaming LLM responses
- Better hallucination detection
- Evaluation pipelines for RAG quality
- Analytics around search and retrieval performance
- Production-scale vector infrastructure
- More advanced source inspection and document navigation
- Improved multi-document knowledge management


# Key Takeaway

Vaultly demonstrates an end-to-end approach to building an AI-powered application:

**Upload → Process → Chunk → Embed → Store → Retrieve → Augment → Generate → Answer → Source**

The project brings together full-stack development, backend architecture, databases, semantic search, embeddings, RAG, and LLM integration into one practical system.