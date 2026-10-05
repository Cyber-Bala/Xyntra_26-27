import React, { useState } from 'react'
import './Register.css'

export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    collegeName: '',
    track: 'Prometheus (AI & Autonomous Intelligence)',
    members: [
      { name: '', email: '', phone: '', role: 'Frontend / UI' },
      { name: '', email: '', phone: '', role: 'Backend / Architecture' },
    ],
  })

  const [paymentStatus, setPaymentStatus] = useState('idle') // idle | processing | success

  const handleLeaderChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members]
    updatedMembers[index][field] = value
    setFormData({ ...formData, members: updatedMembers })
  }

  const addMember = () => {
    if (formData.members.length < 3) {
      setFormData({
        ...formData,
        members: [...formData.members, { name: '', email: '', phone: '', role: 'Full Stack / ML' }],
      })
    }
  }

  const removeMember = (index) => {
    if (formData.members.length > 1) {
      const updatedMembers = formData.members.filter((_, i) => i !== index)
      setFormData({ ...formData, members: updatedMembers })
    }
  }

  const handleRazorpayPayment = (e) => {
    e.preventDefault()
    if (!formData.teamName || !formData.leaderName || !formData.leaderEmail) {
      alert('Please fill in the Team Name, Leader Name, and Leader Email before proceeding to checkout.')
      return
    }

    setPaymentStatus('processing')
    setTimeout(() => {
      setPaymentStatus('success')
    }, 1800)
  }

  const totalMembers = 1 + formData.members.length
  const regFee = 499

  return (
    <section className="register-page-section" id="register">
      <div className="register-main-container">
        
        {/* HEADER BLOCK */}
        <div className="register-header-block">
          <div className="register-kicker-tag">
            <span className="kicker-pulse-gold" />
            <span>OFFICIAL ENROLLMENT PORTAL</span>
          </div>
          <h1 className="register-main-title">REGISTER YOUR SQUAD</h1>
          <p className="register-lead-desc">
            Secure your team's berth in the 2026 arena. Assemble your builders, declare your track, 
            and complete registration via the secure Razorpay checkout gateway.
          </p>
        </div>

        {/* DEADLINE BANNER */}
        <div className="reg-deadline-banner">
          <span className="deadline-badge-icon">⏰</span>
          <div className="deadline-banner-text">
            <strong>Registration Window Closes:</strong> October 20, 2026 at 11:59 PM IST
          </div>
          <span className="deadline-status-pill">PORTAL ACTIVE</span>
        </div>

        {/* REGISTRATION FORM CARD */}
        <form className="register-glass-form" onSubmit={handleRazorpayPayment}>
          
          {/* SECTION A: TEAM & LEADER DETAILS */}
          <div className="form-section-group">
            <h2 className="form-group-title">
              <span className="group-num">A</span>
              <span>Squad & Leadership Info</span>
            </h2>

            <div className="form-grid-two">
              <div className="input-group">
                <label>Team / Squad Name *</label>
                <input
                  type="text"
                  name="teamName"
                  placeholder="e.g. CyberTitans"
                  required
                  value={formData.teamName}
                  onChange={handleLeaderChange}
                />
              </div>

              <div className="input-group">
                <label>Selected Track / Domain *</label>
                <select name="track" value={formData.track} onChange={handleLeaderChange}>
                  <option value="Prometheus (AI & Autonomous Intelligence)">PS I: Prometheus (AI / Autonomous)</option>
                  <option value="Hermes (Web3 & Protocols)">PS II: Hermes (Web3 / Protocols)</option>
                  <option value="Athena (Open Innovation & Deep Tech)">PS III: Athena (Open Innovation)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Team Leader Full Name *</label>
                <input
                  type="text"
                  name="leaderName"
                  placeholder="e.g. Alex Sterling"
                  required
                  value={formData.leaderName}
                  onChange={handleLeaderChange}
                />
              </div>

              <div className="input-group">
                <label>Leader College / Society Email *</label>
                <input
                  type="email"
                  name="leaderEmail"
                  placeholder="leader@college.edu"
                  required
                  value={formData.leaderEmail}
                  onChange={handleLeaderChange}
                />
              </div>

              <div className="input-group">
                <label>Leader Phone Number *</label>
                <input
                  type="tel"
                  name="leaderPhone"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.leaderPhone}
                  onChange={handleLeaderChange}
                />
              </div>

              <div className="input-group">
                <label>College / University Name *</label>
                <input
                  type="text"
                  name="collegeName"
                  placeholder="e.g. College of Engineering"
                  required
                  value={formData.collegeName}
                  onChange={handleLeaderChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION B: ADDITIONAL TEAM MEMBERS (DYNAMIC) */}
          <div className="form-section-group">
            <div className="members-header-row">
              <h2 className="form-group-title">
                <span className="group-num">B</span>
                <span>Team Members ({totalMembers} of 4 Total)</span>
              </h2>

              {formData.members.length < 3 && (
                <button type="button" className="add-member-btn" onClick={addMember}>
                  <span>+ Add Member</span>
                </button>
              )}
            </div>

            <div className="dynamic-members-list">
              {formData.members.map((member, idx) => (
                <div key={idx} className="member-row-card">
                  <div className="member-card-top">
                    <span className="member-index-tag">Member 0{idx + 2} Details</span>
                    <button
                      type="button"
                      className="remove-member-btn"
                      onClick={() => removeMember(idx)}
                      title="Remove Member"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="form-grid-three">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="member@college.edu"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Specialization</label>
                      <input
                        type="text"
                        placeholder="e.g. Full Stack / UI"
                        value={member.role}
                        onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: FEE & RAZORPAY CHECKOUT */}
          <div className="checkout-summary-box">
            <div className="checkout-info">
              <span className="checkout-label">Total Team Registration Pass</span>
              <div className="checkout-fee">
                <span className="fee-currency">₹</span>
                <span className="fee-amount">{regFee}</span>
                <span className="fee-tier">/ Team (All {totalMembers} Members Included)</span>
              </div>
            </div>

            <button
              type="submit"
              className={`razorpay-checkout-btn ${paymentStatus === 'processing' ? 'loading' : ''}`}
              disabled={paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? (
                <>
                  <span className="spinner-dot" />
                  <span>Connecting Secure Gateway...</span>
                </>
              ) : (
                <>
                  <span className="razorpay-logo-badge">⚡ Razorpay</span>
                  <span>Pay ₹{regFee} & Lock Squad Registration</span>
                  <span className="btn-chevron">→</span>
                </>
              )}
            </button>
          </div>

          <p className="razorpay-legal-note">
            🔒 256-bit encrypted checkout via Razorpay Payment Gateway. Automated receipt & discord invite sent upon verification.
          </p>
        </form>

        {/* SUCCESS CONFIRMATION MODAL */}
        {paymentStatus === 'success' && (
          <div className="success-modal-overlay">
            <div className="success-modal-card">
              <div className="success-icon-badge">🎉</div>
              <h2 className="success-title">Squad Berth Confirmed!</h2>
              <p className="success-desc">
                Welcome to the Xyntra 2026 Arena, <strong>{formData.teamName || 'Warrior Team'}</strong>!
                Your registration pass has been successfully generated.
              </p>
              <div className="success-details-box">
                <div><span>Team:</span> <strong>{formData.teamName}</strong></div>
                <div><span>Leader:</span> <strong>{formData.leaderName}</strong></div>
                <div><span>Track:</span> <strong>{formData.track}</strong></div>
                <div><span>Status:</span> <strong className="status-green">ACTIVE & VERIFIED</strong></div>
              </div>
              <button
                className="success-close-btn"
                onClick={() => {
                  setPaymentStatus('idle')
                  onNavigate(5)
                }}
              >
                <span>View Sponsors & Prize Pool →</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
