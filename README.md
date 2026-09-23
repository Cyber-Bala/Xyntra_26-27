# Xyntra 2026–2027

Welcome to the **XYNTRA** platform repository. This repository is organized as a monorepo containing both the frontend client interface and the backend API service for the hackathon registration and payment workflow.

---

## Repository Structure

```text
Xyntra_26-27/
├── Frontend/                 # Client web application (UI & registration forms)
│   ├── README.md
│   └── ...
│
└── Backend/                  # Django REST API & payment reconciliation backend
    ├── events/               # Core application (models, views, services, tests, admin)
    ├── xyntra/               # Django project configuration (settings, urls, asgi, wsgi)
    ├── media/                # Uploaded participant files (.gitkeep)
    ├── manage.py             # Django CLI
    ├── requirements.txt      # Python dependencies
    ├── build.sh              # Deployment build script
    ├── Procfile              # Gunicorn web process definition
    ├── render.yaml           # Render deployment configuration
    ├── README.md             # Detailed backend technical documentation
    └── PRODUCTION_CHECKLIST.md # Webmaster deployment checklist & audit
```

---

## Projects Overview

### 📁 [Frontend](./Frontend)
The user-facing website where participants can:
* View event countdown and information
* Submit team registration and presentation decks (Form 1)
* Verify team leader email addresses
* Complete gated team registration payments via Razorpay (Form 2)
* Check registration status using their unique opaque token

👉 See [Frontend README](./Frontend/README.md) for frontend development notes.

---

### 📁 [Backend](./Backend)
A production-hardened **Django 5** REST API service featuring:
* Two-stage submission and payment pipeline
* Cryptographic Razorpay signature verification and server-to-server reconciliation
* Anti-IDOR/BOLA security with opaque UUID tokens
* Magic-byte file validation (PDF, PPTX, PPT, JPEG, PNG)
* Organizer administration panel for reviewing decks, verifying IEEE credentials, and issuing payment invitations
* 49/49 automated tests with sandboxed temporary media storage

👉 See [Backend README](./Backend/README.md) for setup guides, environment variables, and API documentation.  
👉 See [Production Deployment Checklist](./Backend/PRODUCTION_CHECKLIST.md) for webmaster deployment instructions.
