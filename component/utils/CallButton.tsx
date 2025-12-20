"use client";
import React, { useEffect, useState } from "react";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '060810810';

const CallButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleCall = () => {
    // Track click event if Google Analytics is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'Phone',
        event_label: 'Mobile Call Button',
        value: PHONE_NUMBER
      });
    }
    
    // Open phone dialer
    window.location.href = `tel:${PHONE_NUMBER.replace(/[^0-9]/g, '')}`;
  };

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div
      className="mobile-call-button"
      role="button"
      onClick={handleCall}
      aria-label="Call us"
      style={{
        position: 'static',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#ff6b35',
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
        transition: 'all 0.3s ease',
        margin: '20px auto',
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.backgroundColor = '#e55a2b';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = '#ff6b35';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
      }}
    >
      <i 
        className="fa fa-phone" 
        style={{ 
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      ></i>
    </div>
  );
};

export default CallButton;
