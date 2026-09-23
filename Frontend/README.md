# XYNTRA — Frontend Client Application

This directory is reserved for the XYNTRA frontend web application (e.g., React, Next.js, Vite, or static HTML/CSS/JS).

---

## Backend Integration

The frontend communicates with the Django REST API hosted in the [`Backend/`](../Backend) directory.

### Available API Endpoints
All backend API routes are prefixed with `/api/`:

* **Countdown & Event Metadata**: `GET /api/countdown/`
* **Stage 1 Team Registration (Form 1)**: `POST /api/register/` (multipart form with PPT and member roster)
* **Email Verification**: `POST /api/verify-email/` (JSON `{ "token": "<uuid>" }`)
* **Stage 2 Gated Payment Details (Form 2)**: `GET /api/payment-details/<payment_token>/`
* **Create Razorpay Order**: `POST /api/create-order/` (JSON `{ "payment_token": "<uuid>" }`)
* **Verify Payment & Confirm Registration**: `POST /api/verify-payment/` (JSON with Razorpay order, payment, signature)
* **Registration Status Inquiry**: `GET /api/registration-status/?status_token=<uuid>`

For full endpoint specifications, request payloads, and status codes, refer to the [Backend Documentation](../Backend/README.md).
