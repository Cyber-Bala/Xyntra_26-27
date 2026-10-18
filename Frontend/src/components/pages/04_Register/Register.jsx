import { useEffect, useState, useRef } from "react";
import PixelHeading from "../02_About/PixelHeading.jsx";
import "./Register.css";

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "");
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const AUDIO_MODES = [
  { name: "STEREO", freq: "44.1 kHz", factor: 1.0 },
  { name: "HI-RES", freq: "96.0 kHz", factor: 0.5 },
  { name: "LO-FI",  freq: "22.0 kHz", factor: 1.8 },
  { name: "STUDIO", freq: "192 kHz",  factor: 0.35 },
];

const emptyMember = () => ({
  full_name: "",
  email: "",
  phone: "",
  college: "",
  ieee_member: false,
  ieee_membership_id: "",
  ieee_card: null,
});

const KEY_POINTS = [
  {
    num: "01",
    title: "TEAM COMPOSITION",
    desc: "4 to 6 builders per crew. Cross-college, cross-department, and multi-year squads are fully welcomed.",
  },
  {
    num: "02",
    title: "100% FREE ROUND 01 ENTRY",
    desc: "Submit your idea pitch deck (PPT/PDF up to 10MB). No payment or entry fee is required for Round 01.",
  },
  {
    num: "03",
    title: "IEEE MEMBER ADVANTAGE",
    desc: "Teams with verified IEEE members unlock exclusive subsidized rates for the 24-hour onsite finale.",
  },
  {
    num: "04",
    title: "24-HOUR ONSITE FINALE",
    desc: "Shortlisted teams will hack live onsite with dedicated cloud credits, hardware sandboxes, and industry mentors.",
  },
  {
    num: "05",
    title: "PRIZES & CERTIFICATES",
    desc: "Compete for cash rewards, official IEEE Computer Society certificates, swags, and direct incubation support.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is there any registration fee for Round 01?",
    a: "No. Round 01 abstract and deck submission is 100% free for all participating teams.",
  },
  {
    q: "What is the team size requirement?",
    a: "Each team must consist of 4 to 6 members. Solo builders or teams outside this range cannot be accepted.",
  },
  {
    q: "Who is eligible to participate?",
    a: "Open to all undergraduate, postgraduate, and diploma students from any recognized educational institution.",
  },
  {
    q: "Can team members be from different colleges?",
    a: "Yes! Inter-college and inter-disciplinary teams are completely permitted and strongly encouraged.",
  },
  {
    q: "What should be included in the presentation deck?",
    a: "Your PPT/PDF deck (up to 10MB) should clearly outline the problem statement, proposed solution, system architecture, tech stack, feasibility, and impact.",
  },
  {
    q: "How does the IEEE discount work?",
    a: "If any team member provides a valid IEEE membership ID during registration, the entire team unlocks the discounted rate for Round 02.",
  },
  {
    q: "When will the Round 01 results be announced?",
    a: "Shortlisted teams will receive direct email invitations to access private Round 02 confirmation and briefing.",
  },
];

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

function RegistrationHomeButton({ onNavigate }) {
  return (
    <button className="registration-home-button" type="button" onClick={() => onNavigate?.(1)} title="Return to home page">
      <span className="registration-home-mark">XYNTRA<span>26—27</span></span>
      <span className="registration-home-action">← MAIN SITE</span>
    </button>
  );
}

// Pixel Art Album Icon for Pocket Pod Screen
function PixelAlbumArt() {
  return (
    <div className="pixel-album-art" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="pixel-art-svg" width="44" height="44">
        <rect width="48" height="48" fill="#0c1a40" rx="3" />
        <rect x="4" y="4" width="6" height="6" fill="#f37a39" />
        <rect x="12" y="4" width="6" height="6" fill="#f59e0b" />
        <rect x="20" y="4" width="6" height="6" fill="#f37a39" />
        <rect x="28" y="4" width="6" height="6" fill="#fed7aa" />
        <rect x="36" y="4" width="6" height="6" fill="#f37a39" />

        <rect x="4" y="12" width="6" height="6" fill="#f59e0b" />
        <rect x="12" y="12" width="6" height="6" fill="#1e40af" />
        <rect x="20" y="12" width="6" height="6" fill="#fed7aa" />
        <rect x="28" y="12" width="6" height="6" fill="#f37a39" />
        <rect x="36" y="12" width="6" height="6" fill="#f59e0b" />

        <rect x="10" y="18" width="28" height="18" fill="#081028" rx="2" stroke="#f37a39" strokeWidth="1.5" />
        <text x="24" y="32" fill="#fff" fontFamily="'Courier New', monospace" fontWeight="900" fontSize="13" textAnchor="middle" letterSpacing="2">XY</text>

        <rect x="4" y="38" width="6" height="6" fill="#f37a39" />
        <rect x="12" y="38" width="6" height="6" fill="#fed7aa" />
        <rect x="20" y="38" width="6" height="6" fill="#f37a39" />
        <rect x="28" y="38" width="6" height="6" fill="#f59e0b" />
        <rect x="36" y="38" width="6" height="6" fill="#f37a39" />

        <text x="7" y="46" fill="#fed7aa" fontFamily="monospace" fontSize="6" fontWeight="bold">FM</text>
      </svg>
    </div>
  );
}

// Audio visualizer equalizer bars: dynamically reacts to volume, hold, and frequency mode!
function EqualizerBars({ isPlaying = true, isHold = false, volume = 65, modeFactor = 1.0 }) {
  const bars = [
    { color: 'orange', h1: 14, h2: 28 },
    { color: 'blue',   h1: 26, h2: 12 },
    { color: 'orange', h1: 18, h2: 32 },
    { color: 'blue',   h1: 30, h2: 16 },
    { color: 'orange', h1: 22, h2: 10 },
    { color: 'orange', h1: 12, h2: 26 },
    { color: 'blue',   h1: 28, h2: 18 },
    { color: 'orange', h1: 20, h2: 34 },
    { color: 'blue',   h1: 10, h2: 24 },
    { color: 'blue',   h1: 26, h2: 14 },
    { color: 'orange', h1: 18, h2: 30 },
    { color: 'blue',   h1: 28, h2: 14 },
    { color: 'blue',   h1: 12, h2: 24 },
    { color: 'blue',   h1: 22, h2: 12 },
    { color: 'orange', h1: 14, h2: 26 },
    { color: 'orange', h1: 24, h2: 16 },
    { color: 'blue',   h1: 18, h2: 30 },
    { color: 'blue',   h1: 28, h2: 12 },
  ];

  const volRatio = volume / 100;

  return (
    <div className={`screen-eq-cluster ${!isPlaying || isHold ? 'is-paused' : ''}`} aria-hidden="true">
      {bars.map((bar, i) => {
        const animDuration = (0.7 + (i % 4) * 0.22) * modeFactor;
        const currentScale = (!isPlaying || isHold)
          ? 0.15
          : Math.max(0.2, (bar.h1 / 34) * volRatio * 1.3);

        return (
          <span
            key={i}
            className={`eq-bar-stick bar-${bar.color}`}
            style={{
              height: `${Math.round(bar.h1 * volRatio + 4)}px`,
              animationDuration: `${animDuration}s`,
              animationDelay: `${(i * 0.05) % 0.6}s`,
              transform: `scaleY(${currentScale})`,
            }}
          />
        );
      })}
    </div>
  );
}

// Integrated Control Deck at the bottom of the Pocket Pod device
function IntegratedControlDeck({
  volume,
  currentMode,
  isHold,
  isPlaying,
  deckActiveBtn,
  onDeckButton,
}) {
  return (
    <div className="pod-integrated-deck" role="region" aria-label="Pocket Pod Integrated Audio Controls">
      <div className="deck-screw screw-tl" aria-hidden="true" />
      <div className="deck-screw screw-tr" aria-hidden="true" />

      {/* Main Row: Dials, Sliders, Buttons */}
      <div className="deck-main-row">
        {/* Left: Volume Section with Numerical Readout */}
        <div className="deck-section-block vol-block">
          <div className="section-label-strip">
            <span className="lbl-tag">VOL</span>
            <span className="lbl-reading">{String(volume).padStart(3, '0')}</span>
          </div>
          <div className="vol-btn-cluster">
            <button
              type="button"
              className={`deck-push-btn vol-minus ${deckActiveBtn === 'vol-down' ? 'active' : ''}`}
              onClick={() => onDeckButton('vol-down')}
              title="Decrease Volume"
              aria-label="Decrease Volume"
            >
              <span className="btn-glyph">−</span>
            </button>
            <button
              type="button"
              className={`deck-push-btn vol-plus ${deckActiveBtn === 'vol-up' ? 'active' : ''}`}
              onClick={() => onDeckButton('vol-up')}
              title="Increase Volume"
              aria-label="Increase Volume"
            >
              <span className="btn-glyph">+</span>
            </button>
          </div>
        </div>

        {/* Center: Play/Pause, Hold, Mode */}
        <div className="deck-section-block transport-block">
          <button
            type="button"
            className={`deck-pill-btn play-pause-btn ${!isPlaying ? 'paused' : ''} ${deckActiveBtn === 'play' ? 'active' : ''}`}
            onClick={() => onDeckButton('play')}
            title={isPlaying ? "Pause Audio Waves" : "Resume Audio Waves"}
            aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
          >
            <span className="pill-dot" />
            <span className="pill-text">{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>

          <button
            type="button"
            className={`deck-pill-btn hold-btn ${isHold ? 'is-engaged' : ''} ${deckActiveBtn === 'hold' ? 'active' : ''}`}
            onClick={() => onDeckButton('hold')}
            title="Toggle Audio Wave Hold"
            aria-label="Toggle Hold"
          >
            <span className={`hold-led ${isHold ? 'lit' : ''}`} />
            <span className="pill-text">HOLD</span>
          </button>

          <button
            type="button"
            className={`deck-pill-btn mode-btn ${deckActiveBtn === 'mode' ? 'active' : ''}`}
            onClick={() => onDeckButton('mode')}
            title="Cycle Frequency Mode"
            aria-label="Cycle Mode"
          >
            <span className="mode-led" />
            <span className="pill-text">{currentMode.name}</span>
          </button>
        </div>

        {/* Right: Frequency Readout */}
        <div className="deck-section-block readout-block">
          <div className="section-label-strip">
            <span className="lbl-tag">FREQ</span>
            <span className="lbl-reading freq-display">{currentMode.freq}</span>
          </div>
          <div className="deck-knob-cluster">
            <div className={`deck-rotary-knob ${isHold ? 'locked' : ''}`} title="Frequency Tuner Dial">
              <span className="knob-notches" />
              <span className="knob-pointer" style={{ transform: `rotate(${(volume * 2.8) - 140}deg)` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── REGISTRATION HEADER (Home Button, Round Badge, Massive Title) ──
function RegistrationHeader({ onNavigate }) {
  return (
    <div className="reg-header-wrapper">
      {/* Top Breadcrumb & Home Link */}
      <div className="reg-info-top-bar">
        <RegistrationHomeButton onNavigate={onNavigate} />
        <span className="reg-round-badge">
          <span className="badge-pulse-dot" /> ROUND 01 &bull; NOW OPEN
        </span>
      </div>

      {/* Massive Registration Title */}
      <div className="reg-header-block">
        <PixelHeading
          as="h1"
          size="xl"
          level={1}
          className="reg-massive-title"
        >
          REGISTRATION
        </PixelHeading>
        <p className="reg-subtitle">
          ASSEMBLE YOUR SQUAD &bull; TRANSMIT YOUR VISION &bull; BUILD WHAT&apos;S NEXT
        </p>
      </div>
    </div>
  );
}

// ── RIGHT INFORMATIONAL COLUMN (Title + Points + FAQ) ──
function RegistrationRightColumn({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq((cur) => (cur === idx ? null : idx));
  };

  return (
    <div className="reg-right-info-column">
      {/* Desktop-only header (hidden on mobile / tablet) */}
      <div className="reg-desktop-header">
        <RegistrationHeader onNavigate={onNavigate} />
      </div>

      {/* Key Points Below Title */}
      <div className="reg-key-points-section">
        <div className="reg-section-label">
          <span>// KEY PARTICIPATION GUIDELINES</span>
          <span className="section-rule-line" />
        </div>

        <div className="reg-key-points-grid">
          {KEY_POINTS.map((pt) => (
            <div key={pt.num} className="reg-point-card">
              <span className="reg-point-num">{pt.num}</span>
              <div className="reg-point-body">
                <strong className="reg-point-title">{pt.title}</strong>
                <p className="reg-point-desc">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Section Below Points */}
      <div className="reg-faq-container">
        <div className="reg-section-label">
          <span>// FREQUENTLY ASKED QUESTIONS</span>
          <span className="section-rule-line" />
        </div>

        <div className="reg-faq-accordion">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`reg-faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="reg-faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="reg-faq-q-text">{item.q}</span>
                  <span className="reg-faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="reg-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Register({ onNavigate }) {
  const [linkTokens, setLinkTokens] = useState(() => getLinkTokens());
  const [members, setMembers] = useState(() => Array.from({ length: 4 }, () => emptyMember()));
  const [pptFileName, setPptFileName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [payment, setPayment] = useState({ loading: false, details: null, error: "", message: "", busy: false });
  const [registrationStatus, setRegistrationStatus] = useState({ loading: false, details: null, error: "" });
  const [verification, setVerification] = useState({ loading: false, success: false, message: "", error: "" });

  // Audio / Visualizer Deck interactive states
  const [volume, setVolume] = useState(65);
  const [modeIndex, setModeIndex] = useState(0);
  const [isHold, setIsHold] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [deckActiveBtn, setDeckActiveBtn] = useState(null);

  const formRef = useRef(null);
  const currentMode = AUDIO_MODES[modeIndex];

  // Control Deck Button Action Trigger
  const triggerDeckButton = (action) => {
    setDeckActiveBtn(action);
    setTimeout(() => setDeckActiveBtn(null), 180);

    if (action === "vol-up") {
      setVolume((v) => Math.min(100, v + 5));
    } else if (action === "vol-down") {
      setVolume((v) => Math.max(0, v - 5));
    } else if (action === "play") {
      setIsPlaying((p) => !p);
    } else if (action === "hold") {
      setIsHold((h) => !h);
    } else if (action === "mode") {
      setModeIndex((m) => (m + 1) % AUDIO_MODES.length);
    }
  };

  useEffect(() => {
    const handlePopState = () => setLinkTokens(getLinkTokens());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!linkTokens.verification) return;
    setVerification({ loading: true, success: false, message: "", error: "" });
    fetch(`${API_ROOT}/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: linkTokens.verification }),
    })
      .then(readResponse)
      .then((data) => {
        setVerification({
          loading: false,
          success: true,
          message: data.message || "Email verified successfully! Your team application is now confirmed.",
          error: "",
        });
      })
      .catch((err) => {
        setVerification({
          loading: false,
          success: false,
          message: "",
          error: err.message || "Email verification failed or link has expired.",
        });
      });
  }, [linkTokens.verification]);

  useEffect(() => {
    if (!linkTokens.payment) return;
    setPayment((cur) => ({ ...cur, loading: true, error: "" }));
    fetch(`${API_ROOT}/payment-details/${linkTokens.payment}/`)
      .then(readResponse)
      .then((data) => setPayment((cur) => ({ ...cur, loading: false, details: data })))
      .catch((err) => setPayment((cur) => ({ ...cur, loading: false, error: err.message })));
  }, [linkTokens.payment]);

  useEffect(() => {
    if (!linkTokens.status) return;
    setRegistrationStatus({ loading: true, details: null, error: "" });
    fetch(`${API_ROOT}/registration-status/${linkTokens.status}/`)
      .then(readResponse)
      .then((data) => setRegistrationStatus({ loading: false, details: data, error: "" }))
      .catch((err) => setRegistrationStatus({ loading: false, details: null, error: err.message }));
  }, [linkTokens.status]);

  const updateMember = (index, field, value) => {
    setMembers((current) => current.map((member, i) => (i === index ? { ...member, [field]: value } : member)));
  };

  const handlePptChange = (e) => {
    const file = e.target.files?.[0];
    setPptFileName(file ? file.name : "");
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    if (!agreed) {
      setStatus({ type: "error", message: "Please agree to the event guidelines before transmitting your application." });
      return;
    }
    if (members.length < 4 || members.length > 6) {
      setStatus({ type: "error", message: "Teams must contain between 4 and 6 builders." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      const pptFileInput = formElement.elements.namedItem("ppt_file");
      if (pptFileInput?.files?.[0]) formData.set("ppt_file", pptFileInput.files[0]);

      members.forEach((member, index) => {
        formData.set(`members[${index}][full_name]`, member.full_name);
        formData.set(`members[${index}][email]`, member.email);
        formData.set(`members[${index}][phone]`, member.phone);
        formData.set(`members[${index}][college]`, member.college);
        formData.set(`members[${index}][ieee_member]`, String(member.ieee_member));
        if (member.ieee_member) {
          formData.set(`members[${index}][ieee_membership_id]`, member.ieee_membership_id || "");
          if (member.ieee_card) formData.set(`members[${index}][ieee_card]`, member.ieee_card);
        }
      });

      const response = await fetch(`${API_ROOT}/register/`, { method: "POST", body: formData });
      const data = await readResponse(response);

      setStatus({
        type: "success",
        message: data.message || "Registration submitted successfully! Check the team leader email inbox to verify your address.",
      });
      formElement.reset();
      setPptFileName("");
      setMembers(Array.from({ length: 4 }, () => emptyMember()));
      setAgreed(false);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const startPayment = async () => {
    try {
      setPayment((cur) => ({ ...cur, busy: true, error: "" }));
      await loadRazorpay();

      const orderData = await fetch(`${API_ROOT}/create-order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_token: linkTokens.payment }),
      }).then(readResponse);

      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "XYNTRA 26—27",
        description: `Round 2 Payment — ${payment.details?.team_name || "Team"}`,
        order_id: orderData.order_id,
        prefill: { email: payment.details?.leader_email || "", contact: payment.details?.leader_phone || "" },
        theme: { color: "#f37a39" },
        handler: async (response) => {
          try {
            await fetch(`${API_ROOT}/verify-payment/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                payment_token: linkTokens.payment,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }).then(readResponse);

            setPayment((cur) => ({
              ...cur,
              busy: false,
              details: cur.details ? { ...cur.details, is_paid: true } : cur.details,
              message: "Payment verified successfully! Your team is confirmed for the 24-hour hackathon.",
            }));
          } catch (err) {
            setPayment((cur) => ({ ...cur, busy: false, error: err.message }));
          }
        },
      });

      rzp.on("payment.failed", (response) => {
        setPayment((cur) => ({ ...cur, busy: false, error: response.error?.description || "Payment failed. Try again." }));
      });
      rzp.open();
    } catch (err) {
      setPayment((cur) => ({ ...cur, busy: false, error: err.message }));
    }
  };

  // ── VIEW 0: Email Verification View ──
  if (linkTokens.verification) {
    return (
      <section className="register-section pod-page-view" id="register" aria-live="polite">
        <div className="register-page-split-layout">
          {/* Mobile Header (Rendered on mobile / tablet above the pod) */}
          <div className="reg-mobile-header">
            <RegistrationHeader onNavigate={onNavigate} />
          </div>

          <div className="reg-left-pod-column">
            <div className="pocket-pod-device-chassis left-aligned-pod">
              <header className="pod-device-header">
                <div className="pod-brand-left">
                  <span className="pod-brand-squares">
                    <i className="sq-orange" /><i className="sq-peach" /><i className="sq-amber" /><i className="sq-burnt" />
                  </span>
                  <div className="pod-brand-text">
                    <span className="pod-title">XYNTRA</span>
                    <span className="pod-model">POCKET POD / MODEL 01</span>
                  </div>
                </div>
                <div className="pod-status-right">
                  <span className="pod-led-dot active" />
                  <span className="pod-status-label">EMAIL VERIFICATION</span>
                  <span className="pod-screw" />
                </div>
              </header>

              <div className="pod-cassette-well">
                <div className="pod-cream-screen stage-screen">
                  <div className="screen-now-playing-row">
                    <PixelAlbumArt />
                    <div className="now-playing-details">
                      <span className="np-label">SECURITY HANDSHAKE</span>
                      <h2 className="np-title">EMAIL VERIFICATION</h2>
                      <span className="np-track">XYNTRA 26—27</span>
                    </div>
                    <EqualizerBars isPlaying={isPlaying} isHold={isHold} volume={volume} modeFactor={currentMode.factor} />
                  </div>

                  <div className="screen-progress-track">
                    <div className="screen-progress-bar" style={{ width: `${volume}%` }}>
                      <span className="progress-knob" />
                    </div>
                  </div>

                  <div className="pod-stage-content">
                    {verification.loading && <p className="stage-loading-text">Verifying security token with server…</p>}
                    {verification.error && <div className="pod-alert error">{verification.error}</div>}
                    {verification.success && (
                      <div className="pod-alert success" style={{ background: "rgba(185, 242, 60, 0.15)", borderColor: "rgba(185, 242, 60, 0.4)", color: "#e8eef0" }}>
                        <strong>{verification.message}</strong>
                        <p style={{ marginTop: "8px", fontSize: "0.85rem", opacity: 0.85 }}>Your team submission is verified. Results and updates will be transmitted to your inbox.</p>
                      </div>
                    )}
                    <div className="stage-actions">
                      <button className="pod-burnt-orange-btn" type="button" onClick={() => onNavigate?.(1)}>
                        <span>RETURN TO MAIN SITE ↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <IntegratedControlDeck
                volume={volume}
                currentMode={currentMode}
                isHold={isHold}
                isPlaying={isPlaying}
                deckActiveBtn={deckActiveBtn}
                onDeckButton={triggerDeckButton}
              />

              <footer className="pod-device-footer">
                <span className="footer-audio-out">■ AUDIO OUT</span>
                <span className="footer-builders">DESIGNED FOR BUILDERS</span>
                <span className="footer-version">01 ■</span>
              </footer>
            </div>
          </div>

          <RegistrationRightColumn onNavigate={onNavigate} />
        </div>
      </section>
    );
  }

  // ── VIEW 1: Application Status View ──
  if (linkTokens.status) {
    const details = registrationStatus.details;
    return (
      <section className="register-section pod-page-view" id="register" aria-live="polite">
        <div className="register-page-split-layout">
          {/* Mobile Header (Rendered on mobile / tablet above the pod) */}
          <div className="reg-mobile-header">
            <RegistrationHeader onNavigate={onNavigate} />
          </div>

          {/* ── LEFT PART: POD DEVICE (LEFT-ALIGNED) ── */}
          <div className="reg-left-pod-column">
            <div className="pocket-pod-device-chassis left-aligned-pod">
              <header className="pod-device-header">
                <div className="pod-brand-left">
                  <span className="pod-brand-squares">
                    <i className="sq-orange" /><i className="sq-peach" /><i className="sq-amber" /><i className="sq-burnt" />
                  </span>
                  <div className="pod-brand-text">
                    <span className="pod-title">XYNTRA</span>
                    <span className="pod-model">POCKET POD / MODEL 01</span>
                  </div>
                </div>
                <div className="pod-status-right">
                  <span className="pod-led-dot active" />
                  <span className="pod-status-label">STATUS TELEMETRY</span>
                  <span className="pod-screw" />
                </div>
              </header>

              <div className="pod-cassette-well">
                <div className="pod-cream-screen stage-screen">
                  <div className="screen-now-playing-row">
                    <PixelAlbumArt />
                    <div className="now-playing-details">
                      <span className="np-label">STATUS MONITOR</span>
                      <h2 className="np-title">{details?.team_name || "TEAM APPLICATION"}</h2>
                      <span className="np-track">{details?.event_title || "XYNTRA 26-27"}</span>
                    </div>
                    <EqualizerBars isPlaying={isPlaying} isHold={isHold} volume={volume} modeFactor={currentMode.factor} />
                  </div>

                  <div className="screen-progress-track">
                    <div className="screen-progress-bar" style={{ width: `${volume}%` }}>
                      <span className="progress-knob" />
                    </div>
                  </div>

                  <div className="pod-stage-content">
                    {registrationStatus.loading && <p className="stage-loading-text">Retrieving status telemetry…</p>}
                    {registrationStatus.error && <div className="pod-alert error">{registrationStatus.error}</div>}
                    {details && (
                      <div className="pod-status-grid">
                        <div className="status-cell">
                          <span className="cell-label">REVIEW STATUS</span>
                          <strong className="cell-val status-badge">{details.selection_status}</strong>
                        </div>
                        <div className="status-cell">
                          <span className="cell-label">EMAIL VERIFIED</span>
                          <strong className="cell-val">{details.email_verified ? "YES · CONFIRMED" : "PENDING"}</strong>
                        </div>
                        <div className="status-cell">
                          <span className="cell-label">ROUND 2 PAYMENT</span>
                          <strong className="cell-val">{details.is_paid ? "COMPLETE" : details.selection_status === "selected" ? "AWAITING" : "NOT OPEN"}</strong>
                        </div>
                        <div className="status-cell">
                          <span className="cell-label">BUILDERS</span>
                          <strong className="cell-val">{details.member_count} MEMBERS</strong>
                        </div>
                      </div>
                    )}
                    <div className="stage-actions">
                      <button className="pod-burnt-orange-btn" type="button" onClick={() => onNavigate?.(1)}>
                        <span>RETURN TO MAIN SITE ↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <IntegratedControlDeck
                volume={volume}
                currentMode={currentMode}
                isHold={isHold}
                isPlaying={isPlaying}
                deckActiveBtn={deckActiveBtn}
                onDeckButton={triggerDeckButton}
              />

              <footer className="pod-device-footer">
                <span className="footer-audio-out">■ AUDIO OUT</span>
                <span className="footer-builders">DESIGNED FOR BUILDERS</span>
                <span className="footer-version">01 ■</span>
              </footer>
            </div>
          </div>

          {/* ── RIGHT PART: REGISTRATION TITLE, KEY POINTS & FAQ ── */}
          <RegistrationRightColumn onNavigate={onNavigate} />
        </div>
      </section>
    );
  }

  // ── VIEW 2: Payment View ──
  if (linkTokens.payment) {
    const details = payment.details;
    return (
      <section className="register-section pod-page-view" id="register" aria-live="polite">
        <div className="register-page-split-layout">
          {/* Mobile Header (Rendered on mobile / tablet above the pod) */}
          <div className="reg-mobile-header">
            <RegistrationHeader onNavigate={onNavigate} />
          </div>

          {/* ── LEFT PART: POD DEVICE (LEFT-ALIGNED) ── */}
          <div className="reg-left-pod-column">
            <div className="pocket-pod-device-chassis left-aligned-pod">
              <header className="pod-device-header">
                <div className="pod-brand-left">
                  <span className="pod-brand-squares">
                    <i className="sq-orange" /><i className="sq-peach" /><i className="sq-amber" /><i className="sq-burnt" />
                  </span>
                  <div className="pod-brand-text">
                    <span className="pod-title">XYNTRA</span>
                    <span className="pod-model">POCKET POD / MODEL 01</span>
                  </div>
                </div>
                <div className="pod-status-right">
                  <span className="pod-led-dot active" />
                  <span className="pod-status-label">PAYMENT CHANNEL ACTIVE</span>
                  <span className="pod-screw" />
                </div>
              </header>

              <div className="pod-cassette-well">
                <div className="pod-cream-screen stage-screen">
                  <div className="screen-now-playing-row">
                    <PixelAlbumArt />
                    <div className="now-playing-details">
                      <span className="np-label">ROUND 02 PAYMENT</span>
                      <h2 className="np-title">{details?.team_name || "CONFIRM PARTICIPATION"}</h2>
                      <span className="np-track">XYNTRA 26—27</span>
                    </div>
                    <EqualizerBars isPlaying={isPlaying} isHold={isHold} volume={volume} modeFactor={currentMode.factor} />
                  </div>

                  <div className="screen-progress-track">
                    <div className="screen-progress-bar" style={{ width: `${volume}%` }}>
                      <span className="progress-knob" />
                    </div>
                  </div>

                  <div className="pod-stage-content">
                    {payment.loading && <p className="stage-loading-text">Loading checkout parameters…</p>}
                    {payment.error && <div className="pod-alert error">{payment.error}</div>}
                    {details && (
                      <>
                        <div className="pod-status-grid">
                          <div className="status-cell">
                            <span className="cell-label">TEAM NAME</span>
                            <strong className="cell-val">{details.team_name}</strong>
                          </div>
                          <div className="status-cell">
                            <span className="cell-label">BUILDERS</span>
                            <strong className="cell-val">{details.member_count ?? "—"}</strong>
                          </div>
                          <div className="status-cell">
                            <span className="cell-label">TIER</span>
                            <strong className="cell-val">{details.pricing_tier === "ieee_discount" ? "IEEE RATE" : "STANDARD"}</strong>
                          </div>
                          <div className="status-cell">
                            <span className="cell-label">ROUND 02 FEE</span>
                            <strong className="cell-val text-burnt">{details.amount_inr ? `₹${details.amount_inr}` : "—"}</strong>
                          </div>
                        </div>

                        {!details.email_verified && (
                          <div className="pod-alert error">
                            Verify the team leader email with the confirmation link before proceeding.
                          </div>
                        )}
                        {details.is_paid && <div className="pod-alert success">Payment complete! Your team is confirmed.</div>}
                        {payment.message && <div className="pod-alert success">{payment.message}</div>}

                        <div className="stage-actions">
                          <button
                            className="pod-burnt-orange-btn"
                            type="button"
                            onClick={startPayment}
                            disabled={payment.loading || payment.busy || !details.email_verified || details.is_paid}
                          >
                            <span>{payment.busy ? "CONNECTING TO RAZORPAY…" : details.is_paid ? "ROUND 02 CONFIRMED" : `PAY ₹${details.amount_inr} NOW`}</span>
                            <span className="btn-arrow">↗</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <IntegratedControlDeck
                volume={volume}
                currentMode={currentMode}
                isHold={isHold}
                isPlaying={isPlaying}
                deckActiveBtn={deckActiveBtn}
                onDeckButton={triggerDeckButton}
              />

              <footer className="pod-device-footer">
                <span className="footer-audio-out">■ AUDIO OUT</span>
                <span className="footer-builders">DESIGNED FOR BUILDERS</span>
                <span className="footer-version">01 ■</span>
              </footer>
            </div>
          </div>

          {/* ── RIGHT PART: REGISTRATION TITLE, KEY POINTS & FAQ ── */}
          <RegistrationRightColumn onNavigate={onNavigate} />
        </div>
      </section>
    );
  }

  // ── VIEW 3: Main Round 01 Registration Form (Split Layout) ──
  return (
    <section className="register-section pod-page-view" id="register">
      <div className="register-page-split-layout">
        {/* Mobile Header (Rendered on mobile / tablet above the pod) */}
        <div className="reg-mobile-header">
          <RegistrationHeader onNavigate={onNavigate} />
        </div>

        {/* ── LEFT PART: POD DEVICE CHASSIS (LEFT-ALIGNED) ── */}
        <div className="reg-left-pod-column">
          <div className="pocket-pod-device-chassis left-aligned-pod" role="region" aria-label="Xyntra Pocket Pod Model 01 Registration Terminal">
            
            {/* Top Header of Device Chassis */}
            <header className="pod-device-header">
              <div className="pod-brand-left">
                <span className="pod-brand-squares" aria-hidden="true">
                  <i className="sq-orange" />
                  <i className="sq-peach" />
                  <i className="sq-amber" />
                  <i className="sq-burnt" />
                </span>
                <div className="pod-brand-text">
                  <span className="pod-title">XYNTRA</span>
                  <span className="pod-model">POCKET POD / MODEL 01</span>
                </div>
              </div>

              <div className="pod-status-right">
                <span className="pod-led-dot active" aria-hidden="true" />
                <span className="pod-status-label">INPUT READY</span>
                <span className="pod-screw" aria-hidden="true" />
              </div>
            </header>

            {/* Inner Recessed Cassette Well */}
            <div className="pod-cassette-well">
              {/* Retro Cream Screen */}
              <div className="pod-cream-screen">
                {/* Screen Header: Album Art, Now Registering, Equalizer */}
                <div className="screen-now-playing-row">
                  <PixelAlbumArt />
                  <div className="now-playing-details">
                    <span className="np-label">APPLICATION DRAFT</span>
                    <h2 className="np-title">TEAM REGISTRATION</h2>
                    <span className="np-track">XYNTRA 26—27</span>
                  </div>
                  <EqualizerBars isPlaying={isPlaying} isHold={isHold} volume={volume} modeFactor={currentMode.factor} />
                </div>

                {/* Audio Playback Progress Track synced with Volume */}
                <div className="screen-progress-track" aria-label={`Volume level ${volume}%`}>
                  <div className="screen-progress-bar" style={{ width: `${volume}%` }}>
                    <span className="progress-knob" />
                  </div>
                </div>

                {/* Clean, Readable Registration Form */}
                <form className="pod-registration-form" onSubmit={submitRegistration} ref={formRef}>
                  
                  {/* SECTION 1: TEAM ESSENTIALS */}
                  <div className="form-group-block">
                    <div className="pod-block-label">
                      <span>01 / TEAM DETAILS &amp; PRESENTATION</span>
                    </div>

                    <div className="pod-form-grid">
                      <label className="pod-field">
                        <span className="pod-field-title">TEAM NAME *</span>
                        <input
                          name="team_name"
                          required
                          maxLength="150"
                          placeholder="Your team name"
                          className="pod-input"
                        />
                      </label>

                      <label className="pod-field">
                        <span className="pod-field-title">LEADER EMAIL *</span>
                        <input
                          name="leader_email"
                          type="email"
                          required
                          maxLength="254"
                          placeholder="leader@college.edu"
                          className="pod-input"
                        />
                      </label>

                      <label className="pod-field">
                        <span className="pod-field-title">LEADER PHONE *</span>
                        <input
                          name="leader_phone"
                          type="tel"
                          required
                          maxLength="20"
                          placeholder="+91 98765 43210"
                          className="pod-input"
                        />
                      </label>

                      <label className="pod-field file-upload-field">
                        <span className="pod-field-title">
                          PITCH DECK (PPT/PDF) *
                          <span className="file-hint">MAX 10 MB</span>
                        </span>
                        <div className="custom-file-box">
                          <input
                            name="ppt_file"
                            type="file"
                            required
                            accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            onChange={handlePptChange}
                            className="pod-file-input"
                            id="ppt-file-input"
                          />
                          <label htmlFor="ppt-file-input" className="file-pick-trigger">
                            <span className="pick-icon">📁</span>
                            <span className="pick-text">{pptFileName || "SELECT DECK FILE"}</span>
                            <span className="pick-badge">BROWSE</span>
                          </label>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 2: TEAM ROSTER (4-6 BUILDERS) */}
                  <div className="form-group-block">
                    <div className="pod-block-label">
                      <span>02 / TEAM ROSTER ({members.length} OF 6 BUILDERS)</span>
                    </div>

                    <div className="pod-roster-list">
                      {members.map((member, index) => (
                        <fieldset className="pod-member-card" key={index}>
                          <legend className="member-card-legend">
                            BUILDER {String(index + 1).padStart(2, "0")}
                            {index === 0 ? " [ TEAM LEADER ]" : ""}
                          </legend>

                          <div className="pod-form-grid">
                            <label className="pod-field">
                              <span className="pod-field-title">FULL NAME *</span>
                              <input
                                required
                                maxLength="150"
                                value={member.full_name}
                                onChange={(e) => updateMember(index, "full_name", e.target.value)}
                                placeholder="Full name"
                                className="pod-input"
                              />
                            </label>

                            <label className="pod-field">
                              <span className="pod-field-title">EMAIL ADDRESS *</span>
                              <input
                                required
                                type="email"
                                maxLength="254"
                                value={member.email}
                                onChange={(e) => updateMember(index, "email", e.target.value)}
                                placeholder="email@college.edu"
                                className="pod-input"
                              />
                            </label>

                            <label className="pod-field">
                              <span className="pod-field-title">PHONE NUMBER *</span>
                              <input
                                required
                                type="tel"
                                maxLength="20"
                                value={member.phone}
                                onChange={(e) => updateMember(index, "phone", e.target.value)}
                                placeholder="+91 98765 43210"
                                className="pod-input"
                              />
                            </label>

                            <label className="pod-field">
                              <span className="pod-field-title">COLLEGE / INSTITUTION *</span>
                              <input
                                required
                                maxLength="255"
                                value={member.college}
                                onChange={(e) => updateMember(index, "college", e.target.value)}
                                placeholder="College name"
                                className="pod-input"
                              />
                            </label>
                          </div>

                          {/* IEEE Member Option */}
                          <div className="pod-ieee-box">
                            <label className="ieee-checkbox-wrap">
                              <input
                                type="checkbox"
                                checked={member.ieee_member}
                                onChange={(e) => updateMember(index, "ieee_member", e.target.checked)}
                                className="pod-checkbox"
                              />
                              <span className="ieee-label-text">
                                IEEE MEMBER VERIFICATION <small>(OPTIONAL · CLAIM IEEE TEAM RATE)</small>
                              </span>
                            </label>

                            {member.ieee_member && (
                              <div className="pod-form-grid ieee-expanded-grid">
                                <label className="pod-field">
                                  <span className="pod-field-title">IEEE MEMBERSHIP ID *</span>
                                  <input
                                    required
                                    maxLength="100"
                                    value={member.ieee_membership_id}
                                    onChange={(e) => updateMember(index, "ieee_membership_id", e.target.value)}
                                    placeholder="e.g. 98765432"
                                    className="pod-input"
                                  />
                                </label>

                                <label className="pod-field">
                                  <span className="pod-field-title">IEEE ID CARD FILE *</span>
                                  <input
                                    required
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                    onChange={(e) => updateMember(index, "ieee_card", e.target.files?.[0] || null)}
                                    className="pod-input-file"
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </fieldset>
                      ))}
                    </div>

                    {/* Add / Remove Member Buttons */}
                    <div className="pod-roster-controls">
                      {members.length < 6 && (
                        <button
                          className="pod-sub-btn add-btn"
                          type="button"
                          onClick={() => setMembers((cur) => [...cur, emptyMember()])}
                        >
                          <span>+ ADD TEAM MEMBER ({members.length}/6)</span>
                        </button>
                      )}
                      {members.length > 4 && (
                        <button
                          className="pod-sub-btn remove-btn"
                          type="button"
                          onClick={() => setMembers((cur) => cur.slice(0, -1))}
                        >
                          <span>− REMOVE LAST MEMBER</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AGREEMENT CHECKBOX */}
                  <div className="pod-agreement-row">
                    <label className="pod-agree-label">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="pod-checkbox"
                      />
                      <span>I agree to follow the hackathon guidelines and code of conduct. *</span>
                    </label>
                  </div>

                  {/* Status feedback message */}
                  {status.message && (
                    <div className={`pod-alert ${status.type}`} role="status">
                      {status.message}
                    </div>
                  )}

                  {/* SUBMIT BUTTON ROW */}
                  <div className="pod-submit-row">
                    <button
                      className="pod-burnt-orange-btn"
                      type="submit"
                      disabled={submitting}
                    >
                      <span>{submitting ? "TRANSMITTING APPLICATION…" : "TRANSMIT APPLICATION"}</span>
                      <span className="btn-arrow">↗</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* FULLY MERGED CONTROL DECK */}
            <IntegratedControlDeck
              volume={volume}
              currentMode={currentMode}
              isHold={isHold}
              isPlaying={isPlaying}
              deckActiveBtn={deckActiveBtn}
              onDeckButton={triggerDeckButton}
            />

            {/* Chassis Footer Strip */}
            <footer className="pod-device-footer">
              <span className="footer-audio-out">■ AUDIO OUT</span>
              <span className="footer-builders">DESIGNED FOR BUILDERS</span>
              <span className="footer-version">01 ■</span>
            </footer>
          </div>
        </div>

        {/* ── RIGHT PART: REGISTRATION TITLE, KEY POINTS & FAQ ── */}
        <RegistrationRightColumn onNavigate={onNavigate} />

      </div>
    </section>
  );
}
