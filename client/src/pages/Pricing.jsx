import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Pricing = () => {
  const { user, API_URL, token, reloadProfile } = useContext(AuthContext);
  
  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // { name: 'Pro', price: '2,999', rawPrice: 'Pro' }
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Contact Details, 2 = Payment Options
  const [mobileNumber, setMobileNumber] = useState('90141 89399');
  const [emailAddress, setEmailAddress] = useState(user?.email || 'student@wcode.in');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(712); // seconds (11:52)

  useEffect(() => {
    let timer;
    if (showCheckout && checkoutStep === 2) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 712));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCheckout, checkoutStep]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleOpenCheckout = (planName, priceText) => {
    setSelectedPlan({ name: planName, price: priceText });
    setCheckoutStep(1);
    setPaymentSuccess(false);
    setShowCheckout(true);
  };

  const handleProcessPayment = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/plan/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: selectedPlan.name })
      });
      if (res.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setShowCheckout(false);
          reloadProfile();
        }, 2500);
      } else {
        alert('Payment simulation failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'white' }}>Choose Your Learning Track</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Get premium access to advanced placements roadmaps, live AI mock interview coaches, and unlimited resume grading scans.
        </p>
      </div>

      {/* Pricing Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '20px' }} className="scorecard-panel">
        
        {/* FREE PLAN */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: '24px', borderTop: '4px solid #94a3b8' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700 }}>Free</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Perfect for starting your DSA journey</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>₹0</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> <strong>All 200+ DSA Problems</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Core Pattern Guide
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Basic Visualizations
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Code Editor (4 Langs)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Progress Tracking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Global Leaderboard
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> 2 ATS Resume Scans/mo
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              <span>×</span> Unlimited ATS Scans
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              <span>×</span> 1-on-1 Mentorship
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              <span>×</span> Mock Interviews
            </div>
          </div>

          <button disabled className="warroom-btn" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border-glass)', color: 'var(--text-muted)', cursor: 'default' }}>
            Current Basic Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: '24px', borderTop: '4px solid var(--accent-secondary)', transform: 'scale(1.03)', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700 }}>Pro</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Accelerate your placement prep</p>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-solved)', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>Popular Choice</span>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>₹250</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-solved)', background: 'rgba(16,185,129,0.08)', padding: '3px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>Billed ₹2999 yearly</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Everything in Free
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> <strong>Unlimited ATS Scans</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Company-Specific Tracks
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Advanced Visualizations
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Video Solutions
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> System Design Course
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Priority Support
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Certificate of Completion
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              <span>×</span> Mock Interviews
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              <span>×</span> Resume Review
            </div>
          </div>

          <button onClick={() => handleOpenCheckout('Pro', '2,999')} className="primary-btn" style={{ width: '100%', padding: '12px', background: 'var(--accent-gradient)' }}>
            Upgrade to Pro &rarr;
          </button>
        </div>

        {/* LIFETIME PLAN */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: '24px', borderTop: '4px solid #ff7a00' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700 }}>Lifetime</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>One-time investment for your career</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>₹4999</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/one-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Everything in Pro
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> <strong>Lifetime Access Forever</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> 1-on-1 Mentorship (2 hrs)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Mock Interviews (3)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Expert Resume Review
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Referral to Top Tech
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Private Discord Access
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Early Feature Access
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Future Course Updates
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>✓</span> Money-back Guarantee
            </div>
          </div>

          <button onClick={() => handleOpenCheckout('Lifetime', '4,999')} className="primary-btn" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #ff7a00 0%, #ff5c00 100%)' }}>
            Get Lifetime Access
          </button>
        </div>

      </div>

      {/* RAZORPAY CUSTOM PAYMENT MODAL OVERLAY */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000 }}>
          
          <div style={{ display: 'flex', width: '920px', height: '540px', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
            
            {/* Left Brand Panel */}
            <div style={{ width: '300px', background: '#7c3aed', padding: '32px 24px', display: 'flex', flexDirection: 'column', justifySelf: 'space-between', color: '#ffffff', position: 'relative' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>W</div>
                  <strong style={{ fontSize: '1.15rem', tracking: '0.5px' }}>W Code</strong>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#c084fc', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Price Summary</span>
                  <strong style={{ fontSize: '1.8rem', color: 'white', marginTop: '6px', display: 'block' }}>₹{selectedPlan?.price}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>👤 Using as +91 {mobileNumber}</span>
                  <span style={{ color: '#c084fc', cursor: 'pointer' }} onClick={() => setCheckoutStep(1)}>&gt;</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', color: '#34d399' }}>
                  <span>🏷️ Offers on UPI, Card and...</span>
                  <span>&gt;</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Secured by <strong>Razorpay</strong></span>
              </div>
            </div>

            {/* Right Interactive Payment Area */}
            <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', background: '#fcfcfd', color: '#111827' }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowCheckout(false)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>

              {paymentSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', gap: '16px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#059669' }}>✓</div>
                  <h3 style={{ fontSize: '1.4rem', color: '#111827' }}>Payment Successful!</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Upgraded to {selectedPlan?.name} membership successfully. Reloading workspace...</p>
                </div>
              ) : (
                <>
                  {/* STEP 1: CONTACT DETAILS ENTRY MOCKUP */}
                  {checkoutStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#1f2937', fontWeight: 700 }}>Contact details</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '4px' }}>Enter mobile & email to continue</p>
                      </div>

                      <div className="form-group">
                        <label style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600 }}>Mobile Number</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ padding: '10px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', color: '#4b5563' }}>🇮🇳 +91</span>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ flex: 1, background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} 
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="Mobile number" 
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label style={{ color: '#4b5563', fontSize: '0.8rem', fontWeight: 600 }}>Email Address</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }} 
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="Email address" 
                        />
                      </div>

                      <button 
                        onClick={() => setCheckoutStep(2)} 
                        className="primary-btn" 
                        style={{ background: '#111827', color: 'white', padding: '12px', width: '100%', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '12px' }}
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {/* STEP 2: PAYMENT OPTIONS LIST MOCKUP */}
                  {checkoutStep === 2 && (
                    <div style={{ display: 'flex', gap: '24px', flex: 1, marginTop: '10px' }}>
                      
                      {/* Left list of methods */}
                      <div style={{ width: '220px', borderRight: '1px solid #e5e7eb', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Payment Options</h4>
                        <div style={{ padding: '10px', background: '#f3f4f6', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', color: '#111827', cursor: 'pointer' }}>UPI</div>
                        <div style={{ padding: '10px', fontSize: '0.88rem', color: '#4b5563', opacity: 0.6 }}>Cards (Visa, Master, RuPay)</div>
                        <div style={{ padding: '10px', fontSize: '0.88rem', color: '#4b5563', opacity: 0.6 }}>EMI</div>
                        <div style={{ padding: '10px', fontSize: '0.88rem', color: '#4b5563', opacity: 0.6 }}>Netbanking</div>
                        <div style={{ padding: '10px', fontSize: '0.88rem', color: '#4b5563', opacity: 0.6 }}>Wallet</div>
                      </div>

                      {/* Right details / QR simulation */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937' }}>UPI QR</span>
                          <span style={{ fontSize: '0.78rem', background: '#fee2e2', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>⏱️ {formatTime(countdown)}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', background: '#f9fafb', border: '1px dashed #d1d5db', padding: '16px', borderRadius: '8px' }}>
                          {/* Mock QR image */}
                          <div style={{ background: 'white', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=simulate_success" alt="UPI QR" style={{ width: '96px', height: '96px' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Scan the QR using any UPI App</span>
                            <div style={{ display: 'flex', gap: '4px', fontSize: '0.65rem', background: '#e2f0d9', color: '#385723', padding: '3px 6px', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 700 }}>Upto 5% cashback</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', opacity: 0.5 }}>
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay'].map(brand => (
                            <span key={brand} style={{ fontSize: '0.7rem', border: '1px solid #d1d5db', padding: '3px 6px', borderRadius: '4px', color: '#4b5563' }}>{brand}</span>
                          ))}
                        </div>

                        <button 
                          onClick={handleProcessPayment} 
                          className="primary-btn" 
                          style={{ background: '#7c3aed', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 'auto' }}
                        >
                          Simulate Payment Completion &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Secure Footer message */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginTop: 'auto' }}>
                <span>By proceeding, I agree to Razorpay's Privacy Notice • Edit Preferences</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Pricing;
