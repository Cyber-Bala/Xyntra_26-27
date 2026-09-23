# XYNTRA — Frontend Crib 🎨

This folder is reserved for the frontend crew. Dump your React, Next.js, Vite, or good ol' HTML/CSS/JS right here.

---

## Talking to the Backend

The backend is chilling right next door in the [`Backend/`](../Backend) directory.

All backend API routes start with `/api/`:

| What you need | Method | Endpoint | What it does |
|---|---|---|---|
| **Countdown & Event Info** | `GET` | `/api/countdown/` | Grabs deadlines, prices, and remaining seconds. |
| **Team Registration (Form 1)** | `POST` | `/api/register/` | Sends team roster & PPT deck (multipart form). |
| **Verify Email** | `POST` | `/api/verify-email/` | Confirms the leader's email (`{ "token": "<uuid>" }`). |
| **Payment Pre-flight (Form 2)** | `GET` | `/api/payment-details/<token>/` | Checks if team is selected and gives calculated price. |
| **Create Razorpay Order** | `POST` | `/api/create-order/` | Fetches an official Razorpay `order_id` for checkout. |
| **Verify Payment** | `POST` | `/api/verify-payment/` | Sends signature back to confirm payment and lock in slot. |
| **Check Team Status** | `GET` | `/api/registration-status/?status_token=<token>` | Lets teams check their status without leaking private data. |

👉 Need exact payload examples or status codes? Check the [Backend Documentation](../Backend/README.md).
