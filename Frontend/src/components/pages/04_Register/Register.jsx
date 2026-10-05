import { useEffect, useState } from "react";
import "./Register.css";

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "");
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const emptyMember = () => ({
  full_name: "",
  email: "",
  phone: "",
  college: "",
  ieee_member: false,
  ieee_membership_id: "",
  ieee_card: null,
});

function getLinkTokens() {
  const path = window.location.pathname;
  const paymentMatch = path.match(/^\/payment\/([^/]+)\/?$/);
  const verificationMatch = path.match(/^\/verify-email\/([^/]+)\/?$/);
  return {
    payment: paymentMatch?.[1] || new URLSearchParams(window.location.search).get("payment_token"),
    verification: verificationMatch?.[1] || new URLSearchParams(window.location.search).get("verify_token"),
    status: path.replace(/\/$/, "") === "/registration-status"
      ? new URLSearchParams(window.location.search).get("status_token")
      : null,
  };
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || result.message || "The request could not be completed.");
  return result;
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error("Razorpay Checkout could not be loaded. Check your connection and try again.")), { once: true });
  });
}

export default function Register({ onNavigate }) {
  const linkTokens = getLinkTokens();
  const [members, setMembers] = useState(() => Array.from({ length: 4 }, emptyMember));
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState({ loading: false, details: null, error: "", message: "", busy: false });
  const [emailVerification, setEmailVerification] = useState({ loading: false, error: "", message: "" });
  const [registrationStatus, setRegistrationStatus] = useState({ loading: false, error: "", details: null });

  useEffect(() => {
    if (!linkTokens.payment) return undefined;
    const controller = new AbortController();
    setPayment((current) => ({ ...current, loading: true, error: "", details: null }));
    fetch(`${API_ROOT}/payment-details/${encodeURIComponent(linkTokens.payment)}/`, { signal: controller.signal })
      .then(readResponse)
      .then((details) => setPayment((current) => ({ ...current, loading: false, details })))
      .catch((error) => {
        if (error.name !== "AbortError") setPayment((current) => ({ ...current, loading: false, error: error.message }));
      });
    return () => controller.abort();
  }, [linkTokens.payment]);

  useEffect(() => {
    if (!linkTokens.verification) return undefined;
    const controller = new AbortController();
    setEmailVerification({ loading: true, error: "", message: "" });
    fetch(`${API_ROOT}/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: linkTokens.verification }),
      signal: controller.signal,
    })
      .then(readResponse)
      .then((result) => setEmailVerification({ loading: false, error: "", message: result.message }))
      .catch((error) => {
        if (error.name !== "AbortError") setEmailVerification({ loading: false, error: error.message, message: "" });
      });
    return () => controller.abort();
  }, [linkTokens.verification]);

  useEffect(() => {
    if (!linkTokens.status) return undefined;
    const controller = new AbortController();
    setRegistrationStatus({ loading: true, error: "", details: null });
    fetch(`${API_ROOT}/registration-status/?status_token=${encodeURIComponent(linkTokens.status)}`, { signal: controller.signal })
      .then(readResponse)
      .then((details) => setRegistrationStatus({ loading: false, error: "", details }))
      .catch((error) => {
        if (error.name !== "AbortError") setRegistrationStatus({ loading: false, error: error.message, details: null });
      });
    return () => controller.abort();
  }, [linkTokens.status]);

  function updateMember(index, key, value) {
    setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? { ...member, [key]: value } : member));
  }

  async function submitRegistration(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const pptFile = values.get("ppt_file");
    if (pptFile.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", message: "The presentation deck must be 10 MB or smaller." });
      return;
    }

    for (const [index, member] of members.entries()) {
      if (member.ieee_member && member.ieee_card?.size > 5 * 1024 * 1024) {
        setStatus({ type: "error", message: `The IEEE card for member ${index + 1} must be 5 MB or smaller.` });
        return;
      }
    }

    const roster = members.map((member) => {
      const entry = { ...member };
      delete entry.ieee_card;
      return entry;
    });
    if (!roster.some((member) => member.email.trim().toLowerCase() === String(values.get("leader_email")).trim().toLowerCase())) {
      setStatus({ type: "error", message: "The team leader email must match one of the team member emails." });
      return;
    }

    const payload = new FormData();
    payload.append("team_name", values.get("team_name"));
    payload.append("leader_email", values.get("leader_email"));
    payload.append("leader_phone", values.get("leader_phone"));
    payload.append("ppt_file", pptFile);
    payload.append("members", JSON.stringify(roster));
    members.forEach((member, index) => {
      if (member.ieee_card) payload.append(`ieee_card_${index + 1}`, member.ieee_card);
    });

    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch(`${API_ROOT}/register/`, { method: "POST", body: payload });
      const result = await readResponse(response);
      const emailNote = result.confirmation_email_sent
        ? "A verification link has been sent to the team leader’s email."
        : "Your registration was saved, but the verification email could not be sent. Please contact the organizers.";
      setStatus({
        type: "success",
        message: `${result.message} Save your registration status token: ${result.status_token}. ${emailNote} No payment is collected in Round 1.`,
      });
      form.reset();
      setMembers(Array.from({ length: 4 }, emptyMember));
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not reach the registration server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function startPayment() {
    if (!linkTokens.payment || !payment.details?.email_verified || payment.details.is_paid) return;
    setPayment((current) => ({ ...current, busy: true, error: "", message: "" }));
    try {
      const orderResponse = await fetch(`${API_ROOT}/create-order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_token: linkTokens.payment }),
      });
      const order = await readResponse(orderResponse);
      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay Checkout did not initialize. Please try again.");

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount_paise,
        currency: order.currency,
        name: payment.details.event_title || "XYNTRA",
        description: `Round 2 registration · ${order.team_name}`,
        order_id: order.order_id,
        prefill: { email: payment.details.leader_email, name: order.team_name },
        theme: { color: "#0004EB" },
        modal: { ondismiss: () => setPayment((current) => ({ ...current, busy: false })) },
        handler: async (checkoutResult) => {
          try {
            const verifyResponse = await fetch(`${API_ROOT}/verify-payment/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: checkoutResult.razorpay_order_id,
                razorpay_payment_id: checkoutResult.razorpay_payment_id,
                razorpay_signature: checkoutResult.razorpay_signature,
              }),
            });
            const verified = await readResponse(verifyResponse);
            if (!verified.is_paid) throw new Error(verified.message || "Payment is awaiting confirmation. Check your status shortly.");
            setPayment((current) => ({ ...current, busy: false, details: { ...current.details, is_paid: true }, message: verified.message }));
          } catch (error) {
            setPayment((current) => ({ ...current, busy: false, error: error.message }));
          }
        },
      });
      checkout.on("payment.failed", (failure) => {
        setPayment((current) => ({ ...current, busy: false, error: failure.error?.description || "Payment did not complete. You can safely try again." }));
      });
      checkout.open();
    } catch (error) {
      setPayment((current) => ({ ...current, busy: false, error: error.message || "Unable to start checkout. Please try again." }));
    }
  }

  if (linkTokens.verification) {
    return (
      <section className="register-section register-stage-page" id="register" aria-live="polite">
        <p className="section-kicker">XYNTRA / EMAIL VERIFICATION</p>
        <h1 className="registration-title">Confirm your team email.</h1>
        <div className="stage-card">
          {emailVerification.loading && <p>Verifying your email…</p>}
          {emailVerification.message && <p className="form-message success">{emailVerification.message}</p>}
          {emailVerification.error && <p className="form-message error">{emailVerification.error}</p>}
          <p>This confirms the team leader’s address for the Round 1 PPT submission.</p>
          <button className="primary-btn" type="button" onClick={() => onNavigate?.(1)}>Return to Xyntra</button>
        </div>
      </section>
    );
  }

  if (linkTokens.status) {
    const details = registrationStatus.details;
    return (
      <section className="register-section register-stage-page" id="register" aria-live="polite">
        <p className="section-kicker">XYNTRA / APPLICATION STATUS</p>
        <h1 className="registration-title">Your team’s progress.</h1>
        <div className="stage-card">
          {registrationStatus.loading && <p>Loading registration status…</p>}
          {registrationStatus.error && <p className="form-message error">{registrationStatus.error}</p>}
          {details && <>
            <p className="stage-event">{details.event_title}</p>
            <h2>{details.team_name}</h2>
            <dl className="stage-details">
              <div><dt>Presentation review</dt><dd>{details.selection_status}</dd></div>
              <div><dt>Email verified</dt><dd>{details.email_verified ? "Yes" : "Pending"}</dd></div>
              <div><dt>Round 2 payment</dt><dd>{details.is_paid ? "Complete" : details.selection_status === "selected" ? "Awaiting payment" : "Not open"}</dd></div>
              <div><dt>Team members</dt><dd>{details.member_count}</dd></div>
            </dl>
          </>}
          <button className="primary-btn" type="button" onClick={() => onNavigate?.(1)}>Return to Xyntra</button>
        </div>
      </section>
    );
  }

  if (linkTokens.payment) {
    const details = payment.details;
    return (
      <section className="register-section register-stage-page" id="register" aria-live="polite">
        <p className="section-kicker">XYNTRA / ROUND 02</p>
        <h1 className="registration-title">Secure your place.</h1>
        <p className="stage-intro">This private payment link is sent only after your Round 1 presentation is selected.</p>
        <div className="stage-card payment-card">
          {payment.loading && <p>Checking your private invitation…</p>}
          {payment.error && <p className="form-message error">{payment.error}</p>}
          {details && <>
            <p className="stage-event">{details.event_title}</p>
            <h2>{details.team_name}</h2>
            <dl className="stage-details">
              <div><dt>Selection</dt><dd>{details.selection_status || (details.is_paid ? "selected" : "—")}</dd></div>
              <div><dt>Team members</dt><dd>{details.member_count ?? "—"}</dd></div>
              <div><dt>Pricing</dt><dd>{details.pricing_tier === "ieee_discount" ? "Verified IEEE team rate" : details.pricing_tier === "regular" ? "Standard team rate" : "—"}</dd></div>
              <div><dt>Round 2 fee</dt><dd>{details.amount_inr ? `₹${details.amount_inr}` : details.payment_details?.amount ? `₹${details.payment_details.amount}` : "—"}</dd></div>
            </dl>
            {!details.email_verified && <p className="form-message error">Verify the team leader’s email using the confirmation link before paying.</p>}
            {details.is_paid && <p className="form-message success">Payment is already complete for this team.</p>}
            {payment.message && <p className="form-message success">{payment.message}</p>}
            <button className="primary-btn submit-btn" type="button" onClick={startPayment} disabled={payment.loading || payment.busy || !details.email_verified || details.is_paid}>
              {payment.busy ? "Connecting to secure checkout…" : details.is_paid ? "ROUND 02 CONFIRMED" : `PAY ₹${details.amount_inr}`}<span aria-hidden="true">→</span>
            </button>
            <p className="registration-note">Your PPT was submitted in Round 1. This step only confirms your selected team’s place with payment.</p>
          </>}
          {!details && !payment.loading && !payment.error && <p>This private link is missing its payment token. Open the full link sent to your team leader.</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="register-section" id="register">
      <div className="section-heading register-heading"><p className="section-kicker">05 / ROUND 01 REGISTRATION</p><h2 className="registration-title">Bring the idea.<br />Build the future.</h2><p>Submit your team and presentation deck for the first-round review.</p></div>
      <div className="round-flow" aria-label="Hackathon rounds">
        <article className="round-card round-active"><span>ROUND 01 / OPEN NOW</span><h3>Register + submit your PPT</h3><p>Every team can apply. Share your details and presentation for the selection review. No payment at this stage.</p></article>
        <span className="round-arrow" aria-hidden="true">→</span>
        <article className="round-card"><span>ROUND 02 / SELECTED TEAMS</span><h3>Private payment link</h3><p>Only shortlisted teams receive the payment link. Payment confirms their place in the final round.</p></article>
      </div>
      <form className="registration-form" onSubmit={submitRegistration}>
        <div className="form-title"><div><span className="form-step">01 / TEAM DETAILS</span><h3>Tell us who's building.</h3></div><span className="required-note">* REQUIRED</span></div>
        <div className="form-grid">
          <label className="form-field"><span>Team name *</span><input name="team_name" required maxLength="150" placeholder="Your team name" /></label>
          <label className="form-field"><span>Team leader email *</span><input name="leader_email" type="email" required maxLength="254" placeholder="leader@college.edu" /></label>
          <label className="form-field"><span>Team leader phone *</span><input name="leader_phone" type="tel" required maxLength="20" placeholder="+91 98765 43210" /></label>
          <label className="form-field file-field"><span>Presentation deck * <small>PDF, PPT or PPTX · max 10 MB</small></span><input name="ppt_file" type="file" required accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" /></label>
        </div>
        <div className="form-title member-form-title"><div><span className="form-step">02 / TEAM ROSTER</span><h3>Your builders.</h3></div><span className="required-note">4–6 MEMBERS</span></div>
        <div className="member-fields">
          {members.map((member, index) => <fieldset className="member-fieldset" key={index}>
            <legend>MEMBER {String(index + 1).padStart(2, "0")}{index === 0 ? " / LEADER" : ""}</legend>
            <div className="form-grid member-grid">
              <label className="form-field"><span>Full name *</span><input required maxLength="150" value={member.full_name} onChange={(event) => updateMember(index, "full_name", event.target.value)} placeholder="Full name" /></label>
              <label className="form-field"><span>Email *</span><input required type="email" maxLength="254" value={member.email} onChange={(event) => updateMember(index, "email", event.target.value)} placeholder="name@college.edu" /></label>
              <label className="form-field"><span>Phone *</span><input required type="tel" maxLength="20" value={member.phone} onChange={(event) => updateMember(index, "phone", event.target.value)} placeholder="Phone number" /></label>
              <label className="form-field"><span>College *</span><input required maxLength="255" value={member.college} onChange={(event) => updateMember(index, "college", event.target.value)} placeholder="College / institution" /></label>
            </div>
            <label className="ieee-toggle"><input type="checkbox" checked={member.ieee_member} onChange={(event) => updateMember(index, "ieee_member", event.target.checked)} /><span>IEEE member</span><small>Optional · claim and provide ID details for organizer review</small></label>
            {member.ieee_member && <div className="form-grid ieee-fields">
              <label className="form-field"><span>IEEE membership ID *</span><input required maxLength="100" value={member.ieee_membership_id} onChange={(event) => updateMember(index, "ieee_membership_id", event.target.value)} placeholder="Membership ID" /></label>
              <label className="form-field"><span>IEEE ID card *</span><input required type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(event) => updateMember(index, "ieee_card", event.target.files?.[0] || null)} /></label>
            </div>}
          </fieldset>)}
        </div>
        <div className="roster-actions">
          {members.length < 6 && <button className="quiet-button" type="button" onClick={() => setMembers((current) => [...current, emptyMember()])}>+ ADD TEAM MEMBER</button>}
          {members.length > 4 && <button className="quiet-button remove-member" type="button" onClick={() => setMembers((current) => current.slice(0, -1))}>− REMOVE LAST MEMBER</button>}
        </div>
        {status.message && <p className={`form-message ${status.type}`} role="status">{status.message}</p>}
        <button className="primary-btn submit-btn" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Round 1 Registration"}<span aria-hidden="true">→</span></button>
        <p className="registration-note">No payment is collected now. Selected teams will receive a separate, private payment link.</p>
      </form>
    </section>
  );
}
