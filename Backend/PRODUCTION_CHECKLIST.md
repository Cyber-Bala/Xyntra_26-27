# XYNTRA Production Deployment Chanes to make btw....

This document contains a comprehensive audit of all hardcoded placeholders and dummy values found in the codebase, followed by a step-by-step production checklist detailing every API key, credential, and environment variable required to deploy XYNTRA to production.

---

## 1. Hardcoded Placeholders, Dummy Values, and Fallbacks

The following occurrences of test keys, dummy emails, local URLs, and default fallbacks were identified in the project:

### A. Environment Files

#### [`.env`](.env)
* **Line 1**: `SECRET_KEY=dev-only-testing-secret-key-not-for-production-use-12345` — Local development secret key.
* **Line 2**: `DEBUG=True` — Debug flag enabled for local development.
* **Line 3**: `RAZORPAY_KEY_ID=rzp_test_placeholder` — Test Razorpay key ID placeholder.
* **Line 4**: `RAZORPAY_KEY_SECRET=placeholder_secret` — Test Razorpay secret placeholder.
* **Line 5**: `FRONTEND_URL=http://localhost:3000` — Local development frontend origin.

#### [`.env.example`](.env.example)
* **Line 3**: `SECRET_KEY=replace-with-a-secure-random-key` — Placeholder secret key instruction.
* **Line 4**: `DEBUG=True` — Template debug setting.
* **Line 5**: `ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com` — Staging and local allowed hosts template.
* **Line 9**: `DATABASE_URL=` — Blank connection string placeholder.
* **Line 12**: `RAZORPAY_KEY_ID=rzp_test_YourTestKeyIdHere` — Placeholder test key.
* **Line 13**: `RAZORPAY_KEY_SECRET=YourRazorpaySecretKeyHere` — Placeholder secret.
* **Line 17**: `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` — Development console email backend.
* **Line 18**: `EMAIL_HOST_USER=your_email@gmail.com` — Placeholder SMTP username.
* **Line 19**: `EMAIL_HOST_PASSWORD=your_16_char_app_password` — Placeholder password.
* **Line 20**: `DEFAULT_FROM_EMAIL=XYNTRA Organizers <your_email@gmail.com>` — Placeholder sender address.
* **Line 24**: `FRONTEND_URL=http://localhost:3000` — Local frontend URL.

---

### B. Core Application Code & Settings

#### [`xyntra/settings.py`](xyntra/settings.py)
* **Line 44**: `'localhost,127.0.0.1,.onrender.com,testserver'` — Default fallback for `ALLOWED_HOSTS` when omitted from environment.
* **Line 108**: `sqlite:///{BASE_DIR / 'db.sqlite3'}` — Fallback local SQLite database when `DATABASE_URL` is unset.
* **Line 171**: `FRONTEND_URL = 'http://localhost:3000'` — Fallback frontend URL when omitted in development mode.
* **Lines 182–184**: `'http://localhost:3000'`, `'http://localhost:5173'`, `'http://127.0.0.1:3000'` — Local development origins added to CORS list when `DEBUG=True`.
* **Line 198**: `'django.core.mail.backends.console.EmailBackend'` — Fallback email backend when `DEBUG=True`.
* **Line 202**: `EMAIL_HOST = 'smtp.gmail.com'` — Hardcoded default SMTP host.
* **Line 208**: `'noreply@xyntra.com'` — Fallback sender address if `DEFAULT_FROM_EMAIL` and `EMAIL_HOST_USER` are unset.

#### [`render.yaml`](render.yaml)
* **Line 3**: `databaseName: xyntradb` — Default managed database name.
* **Line 4**: `user: xyntra_user` — Default managed database username.
* **Line 24**: `value: ".onrender.com,localhost,127.0.0.1"` — Hardcoded allowed hosts on Render.

#### [`events/services/emails.py`](events/services/emails.py)
* **Line 66**: `'noreply@xyntra.com'` — Fallback `from_email` in `send_registration_confirmation_email`.
* **Line 140**: `'noreply@xyntra.com'` — Fallback `from_email` in `send_selection_payment_email`.

#### [`events/management/commands/seed_event.py`](events/management/commands/seed_event.py)
* **Line 14**: `title="XYNTRA 2026"` — Seed event title.
* **Line 16**: `description="National Inter-College Hackathon & Tech Symposium"` — Seed event description.
* **Line 19**: `venue="Campus Main Auditorium & Innovation Hub"` — Seed event venue.
* **Line 20**: `regular_price=Decimal("2000.00")` — Seed regular team registration fee.
* **Line 21**: `ieee_price=Decimal("1500.00")` — Seed IEEE discounted registration fee.

---

### C. Test Suite Files (`events/tests/`)
*(Note: These are mock fixtures for automated testing; safe in tests, but listed for complete auditing)*

* **[`events/tests/base.py`](events/tests/base.py)**:
  * **Line 17**: `b"%PDF-1.4 fakecontent"` — Dummy test binary PDF header.
  * **Line 35**: `SECRET_KEY='test-secret-key-for-unit-tests-only'` — Test secret key.
  * **Line 36**: `RAZORPAY_KEY_ID='rzp_test_placeholder'` — Dummy Razorpay key.
  * **Line 37**: `RAZORPAY_KEY_SECRET='placeholder_secret'` — Dummy Razorpay secret.
  * **Lines 60–90**: `leader@college.edu`, `m2@college.edu`, `m3@college.edu`, `m4@college.edu`, `"9876543210"`, `"Tech Univ"`, `"IEEE-001"` — Mock participant data.
* **[`events/tests/test_models.py`](events/tests/test_models.py)**:
  * **Line 51**: `b"NOT-A-PDF-AT-ALL"` — Fake file payload.
  * **Line 77**: `b"NOTAJPEG"` — Fake file payload.
  * **Lines 127–190**: Mock team names (`"VerifyTeam"`, `"AlphaSquad"`, `"TooSmall"`, `"TokenTeam"`) and dummy emails (`leader@test.edu`, `bob@test.edu`, `a1@test.edu`, `t@test.edu`).
* **[`events/tests/test_views.py`](events/tests/test_views.py)**:
  * **Lines 38–70**: Mock emails (`a@test.edu`, `dupleader@test.edu`, `newlead@test.edu`).
  * **Line 203**: `/api/registration-status/?email=leader@college.edu` — Test query string.
* **[`events/tests/test_payments.py`](events/tests/test_payments.py)**:
  * **Lines 52–252**: Mock Razorpay orders (`order_test_123`, `order_pay_001`, `order_mm_001`, `order_nc_001`, `order_bs_001`) and mock signatures (`sig_abc`, `sig_mm`, `bad_sig`).
* **[`events/tests/test_admin.py`](events/tests/test_admin.py)**:
  * **Lines 22, 49, 74**: Mock emails (`lead@select.com`, `lead@reject.com`, `lead@ieee.com`).

---

## 2. Production Deployment Checklist

Configure these environment variables in your production hosting dashboard (e.g., Render, Railway, AWS, DigitalOcean):

### Mandatory Credentials & Configuration

- [ ] **`SECRET_KEY` (Django Cryptographic Key)**
  - **Value**: A 50+ character random string unique to production.
  - **Generation**: Run in a terminal:
    ```bash
    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    ```
  - **Why**: Protects session signatures, CSRF cookies, and token generation.

- [ ] **`DEBUG` (Debug Switch)**
  - **Value**: `False`
  - **Why**: Mandatory. Disables error tracebacks and prevents sensitive data leaks to participants.

- [ ] **`ENVIRONMENT` (Deployment Tag)**
  - **Value**: `production`
  - **Why**: Triggers internal production validation checks in `settings.py`.

- [ ] **`ALLOWED_HOSTS` (Allowed Domains)**
  - **Value**: Comma-separated list of hostnames without protocol or trailing slash.
  - **Example**: `api.xyntra.yourdomain.com,xyntra-backend.onrender.com`
  - **Why**: Prevents HTTP Host header poisoning attacks.

- [ ] **`FRONTEND_URL` (Client Web Application URL)**
  - **Value**: Full production URL of the hosted frontend (React / Next.js / Static UI).
  - **Example**: `https://xyntra.yourdomain.com`
  - **Why**: Mandatory in production. Must begin with `https://`. Used to whitelist CORS origins and construct email confirmation/payment links.

- [ ] **`DATABASE_URL` (Production PostgreSQL Connection)**
  - **Value**: Full PostgreSQL connection URI.
  - **Example**: `postgres://xyntra_user:STRONG_PASSWORD@hostname.region.postgres.render.com:5432/xyntradb`
  - **Why**: Connects Django to the production database instead of local SQLite. (Render configures this automatically if using managed databases).

- [ ] **`RAZORPAY_KEY_ID` (Live Payment Gateway Key ID)**
  - **Value**: Live Razorpay Key ID (format: `rzp_live_...`).
  - **Source**: Razorpay Dashboard > Settings > API Keys.
  - **Why**: Mandatory. Test keys (`rzp_test_...`) will not process real payments.

- [ ] **`RAZORPAY_KEY_SECRET` (Live Payment Gateway Secret)**
  - **Value**: Live Razorpay Secret string.
  - **Source**: Generated alongside the Razorpay Key ID.
  - **Why**: Used for server-to-server order generation, HMAC-SHA256 signature verification, and authoritative payment reconciliation.

- [ ] **`RAZORPAY_WEBHOOK_SECRET` (Live Webhook Secret)**
  - **Value**: Secret passphrase configured when creating the Razorpay Webhook.
  - **Source**: Razorpay Dashboard > Settings > Webhooks > Add New Webhook.
  - **Webhook URL**: `https://<backend-domain>/api/webhook/razorpay/`
  - **Events to Select**: `payment.captured`, `order.paid`, `payment.failed`
  - **Why**: Mandatory production safety net. Authoritatively captures and reconciles payments server-to-server if the participant's browser disconnects or closes prior to the client callback.

- [ ] **`EMAIL_BACKEND` (Email Engine)**
  - **Value**: `django.core.mail.backends.smtp.EmailBackend`
  - **Why**: Sends real emails via SMTP instead of printing to console.

- [ ] **`EMAIL_HOST` (SMTP Host)**
  - **Value**: `smtp.gmail.com` (default) or custom SMTP relay.

- [ ] **`EMAIL_PORT` & `EMAIL_USE_TLS`**
  - **Values**: Port `587`, TLS `True` (already configured as default in `settings.py`).

- [ ] **`EMAIL_HOST_USER` (Outgoing Mail Account)**
  - **Value**: The society's official Gmail / Google Workspace address.
  - **Example**: `xyntra.organizers@gmail.com` or `techsociety@college.edu`

- [ ] **`EMAIL_HOST_PASSWORD` (SMTP Application Password)**
  - **Value**: 16-character Google App Password (not your account login password).
  - **How to create**:
    1. Log in to the Gmail/Google Workspace account.
    2. Go to **Google Account Settings > Security > 2-Step Verification**.
    3. Scroll to **App passwords** (or visit `https://myaccount.google.com/apppasswords`).
    4. Select App: *Mail*, Device: *Other (Django Backend)*, and click **Generate**.
    5. Copy the generated 16-character password into `EMAIL_HOST_PASSWORD`.

- [ ] **`DEFAULT_FROM_EMAIL` (Sender Identity)**
  - **Value**: Branded sender name and email visible in participants' inboxes.
  - **Example**: `XYNTRA Organizers <xyntra.organizers@gmail.com>`

---

## 3. Post-Deployment Setup Steps

Once the web service is deployed and environment variables are active:

1. **Run Database Migrations**:
   Render runs `./build.sh` automatically, which executes `python manage.py migrate`. If deploying manually, run:
   ```bash
   python manage.py migrate
   ```

2. **Create Superuser (Admin Access)**:
   Access the server's shell/console and create the primary administrator account:
   ```bash
   python manage.py createsuperuser
   ```

3. **Configure the Active Hackathon Event**:
   - Log in to the admin panel at `https://<backend-domain>/admin/`.
   - Go to **Events > Events**.
   - Either edit the seeded event or create the official event:
     - **Title**: Official event name (e.g., `XYNTRA 2026`).
     - **Event Date**: Hackathon commencement date & time.
     - **Registration Deadline**: Exact cutoff timestamp for Form 1 submissions.
     - **Regular Price & IEEE Price**: Stated registration fees in INR.
     - **Is Active**: Checked (must be the only active event).

4. **Configure Razorpay Webhook**:
   - Log in to your Razorpay Dashboard (Test mode for development, Live mode for production).
   - Go to **Settings > Webhooks > Add New Webhook**.
   - **Webhook URL**: `https://<backend-domain>/api/webhook/razorpay/`
   - **Secret**: Enter the exact secret string you set in `RAZORPAY_WEBHOOK_SECRET`.
   - **Active Events**: Check `payment.captured`, `order.paid`, and `payment.failed`.
   - Save the webhook.
