"use client";
import React, { useEffect, useState } from "react";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '060810810';

const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrolling = window.scrollY;
      if (scrolling > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  return (
    <>
      {/* Scroll to Top Button - visible on all devices when scrolled */}
      {isVisible && (
        <div
          className="tf__scroll_btn"
          role="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          Վերև
        </div>
      )}

      {/* Call Button - only visible on mobile (< 600px) */}
      {isMobile && (
        <div
          className="tf__scroll_btn tf__call_btn"
          role="button"
          onClick={handleCall}
          aria-label="Call us"
        >
          <i className="fa fa-phone" aria-hidden="true"></i>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;
