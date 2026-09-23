# XYNTRA 2026–2027 🚀

Yo! Welcome to the **XYNTRA** codebase. 

Instead of juggling 5 different GitHub tabs and losing our minds, we threw the whole project under one roof. Two folders, zero headache:

```text
Xyntra_26-27/
├── Frontend/      --> The pretty stuff (website, forms, buttons)
└── Backend/       --> The brain (Django, database, money/Razorpay, emails)
```

---

## What's Inside?

### 🎨 [Frontend](./Frontend)
This is where the user interface lives (or will live once the frontend wizards cook it up).
* Countdown timer so folks know when time's ticking down.
* Form 1 to sign up teams and upload presentation decks.
* Form 2 to handle checkout once teams get picked.
* Status check page so participants stop DMing organizers asking "am I selected yet?".

👉 Check out the [Frontend README](./Frontend/README.md) for endpoint cheat-sheets.

---

### ⚙️ [Backend](./Backend)
The engine under the hood. Powered by **Django 5** and **Razorpay**, locked down tight so nobody hacks their way into free tickets.
* **Stage 1 (Review)**: Collects PPTs, verifies email tokens, checks IEEE ID cards.
* **Stage 2 (Checkout)**: Only selected teams get a VIP payment link. Reconciles directly with Razorpay's servers so fake payment screenshots won't work.
* **Rock solid**: 49 automated tests passing, clean modular code, no junk files floating around.

👉 Peep the [Backend README](./Backend/README.md) for local setup, endpoints, and commands.  
👉 Webmaster setting up production? Hand them the [Production Checklist](./Backend/PRODUCTION_CHECKLIST.md).
