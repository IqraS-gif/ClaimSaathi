import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo" onClick={() => navigate('/')}>
              <span className="logo-claim">Claim</span>
              <span className="logo-saathi">Saathi</span>
              <span className="logo-by">by Paytm</span>
            </div>
            <p>Making health insurance claims simple, transparent, and stress-free for every Indian.</p>
          </div>
          <div className="footer-links">
            <div className="fl-col">
              <h5>Features</h5>
              <a onClick={() => navigate('/upload')}>Upload &amp; Understand</a>
              <a onClick={() => navigate('/predict')}>Predict &amp; Plan</a>
              <a onClick={() => navigate('/claim')}>Prepare &amp; Claim</a>
              <a onClick={() => navigate('/bridge')}>Financial Bridge</a>
            </div>
            <div className="fl-col">
              <h5>Support</h5>
              <a href="#">Help Center</a>
              <a href="#">IRDAI Grievance</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Paytm ClaimSaathi. All rights reserved.</span>
          <span>Regulated by IRDAI</span>
        </div>
      </div>
    </footer>
  )
}
