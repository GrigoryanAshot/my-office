"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import NavigationSection from "./NavigationSection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMobileNavClose, toggleMobileNavOpen } from "@/redux/features/mobileNavSlice";

type Props = {
  style: string;
  logo: string;
}

const LOGO = '/images/logo.png'; // Use the same path as the main page

// Phone number constant - update with your actual phone number
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '060810810';

const NavbarSection = ({ style, logo }: Props) => {
  // Sticky Header Section on Scroll
  const dispatch = useAppDispatch()
  const isMobileNavOpen = useAppSelector(state => state.mobileNav.isMobileNavOpen);
  const handleMobileNavOpen = () => {
    dispatch(toggleMobileNavOpen());
  }
  const handleMobileNavClose = () => {
    dispatch(toggleMobileNavClose())
  } 
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      // On mobile, always keep navbar fixed (always apply menu_fix)
      if (window.innerWidth <= 991) {
        setIsHeaderFixed(true);
      } else {
        // On desktop, only fix after scrolling
        if (window.scrollY >= 50) {
          setIsHeaderFixed(true);
        } else {
          setIsHeaderFixed(false);
        }
      }
    };

    // Set initial state for mobile
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  const navMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to handle clicks outside the navigation menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target as Node) &&
        isMobileNavOpen
      ) {
        handleMobileNavClose()
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileNavOpen]);

  // On mobile, always keep navbar sticky, just add menu_fix for styling
  const shouldAddMenuFix = isHeaderFixed;

  return (
    <nav
      className={`navbar navbar-expand-lg main_menu ${style} ${
        shouldAddMenuFix ? "menu_fix" : ""
      }`}
      ref={navMenuRef}
      style={{ position: 'relative' }}
    >
      <div className="container" style={{ position: 'relative' }}>
        {/* Header row wrapper - logo, phone button, and burger button */}
        <div className="navbar-header-row" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0 }}>
          <Link className="navbar-brand" href="/">
            <img
              src={LOGO}
              alt="MyOffice"
              className="navbar-logo"
              style={{
                maxHeight: '90px',
                minHeight: '60px',
                width: 'auto',
                display: 'block',
                margin: '0 auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          {/* Click to Call Button - Centered, visible only on mobile (when burger menu appears) */}
          <div 
            className="navbar-phone-button"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(calc(-50% + 20px), -50%)',
              display: 'none', // Hidden by default (desktop)
              pointerEvents: 'auto', // Ensure it's clickable
            }}
          >
            <a 
              href={`tel:${PHONE_NUMBER.replace(/[^0-9]/g, '')}`}
              className="nav-link navbar-phone-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ff6b35',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                padding: '8px 16px',
                borderRadius: '25px',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                border: '2px solid #ff6b35',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
              }}
              onClick={(e) => {
                // Track click event if Google Analytics is available
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'click', {
                    event_category: 'Phone',
                    event_label: 'Navbar Call Button',
                    value: PHONE_NUMBER
                  });
                }
              }}
            >
              <i className="fa fa-phone navbar-phone-icon" style={{ fontSize: '18px' }}></i>
              <span>Զանգահարել</span>
            </a>
          </div>

          {isMobileNavOpen ? (
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleMobileNavClose}
            >
              <i className="fa fa-times close_icon"></i>
            </button>
          ) : (
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleMobileNavOpen}
            >
              <i className="fa fa-bars menu_icon"></i>
            </button>
          )}
        </div>

        <NavigationSection
          position=""
          btnPosition={false}
          navRef={navMenuRef}
        />
      </div>
    </nav>
  );
};

export default NavbarSection;
