import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h2>
          © 2025 <span className="brand-name">Grain Works</span>. All rights reserved.
        </h2>
        {/* 
        <p>
          Bridging rice mills, logistics & buyers nationwide.
          Enabling digital access and efficient fulfillment.
        </p> 
        */}
        <div className="footer-links">
          <a href="/terms">Terms</a> |
          <a href="/privacy">Privacy Policy</a> |
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
