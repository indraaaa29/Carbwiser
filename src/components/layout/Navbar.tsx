import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { href: '/overview', label: 'Overview' },
  { href: '/actions',  label: 'Actions'  },
  { href: '/roadmap',  label: 'Roadmap'  },
  { href: '/tracking', label: 'Tracking' },
];

const Navbar: React.FC = () => {
  const location  = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const menuId = 'mobile-nav-menu';
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const menuElement = menuRef.current;
    if (!menuElement) return;

    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Restore focus to toggle button when closed
  useEffect(() => {
    if (!menuOpen) {
      const timer = setTimeout(() => {
        if (
          document.activeElement === document.body ||
          (menuRef.current && menuRef.current.contains(document.activeElement))
        ) {
          toggleRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

  return (
    <header
      id="main-nav"
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-sm border-[#bfc9c3]/50'
          : 'bg-white/80 backdrop-blur-xl border-[#bfc9c3]/50'
      }`}
      style={{ backdropFilter: 'blur(24px)' }}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1440px] mx-auto py-4">

        {/* Brand */}
        <Link
          to="/"
          className="font-geist text-xl font-semibold text-[#003527] tracking-tight hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 rounded"
          aria-label="CarbWiser – go to home page"
        >
          CarbWiser
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`font-geist text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 rounded px-1 ${
                  isActive
                    ? 'text-[#003527] border-b-2 border-[#003527] pb-1 font-bold'
                    : 'text-[#404944] hover:text-[#003527]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label="Notifications"
              type="button"
              className="p-2 text-[#404944] hover:text-[#003527] transition-colors rounded-full hover:bg-[#dce2f7] focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
            >
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            </button>
            <button
              aria-label="Account settings"
              type="button"
              className="p-2 text-[#404944] hover:text-[#003527] transition-colors rounded-full hover:bg-[#dce2f7] focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
            >
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </button>
          </div>

          <Link
            to="/assessment"
            className="hidden md:block bg-[#003527] text-white hover:bg-[#2b6954] transition-colors px-6 py-2.5 rounded-full font-geist text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
          >
            Sign In
          </Link>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className="md:hidden p-2 text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 rounded"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav
        ref={menuRef}
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        className={`md:hidden bg-white border-t border-[#bfc9c3]/50 px-4 py-4 flex flex-col gap-4 ${menuOpen ? '' : 'hidden'}`}
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`font-geist text-sm font-medium py-2 focus:outline-none focus:ring-2 focus:ring-[#003527] rounded px-2 ${
                isActive ? 'text-[#003527] font-bold' : 'text-[#404944]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          to="/assessment"
          className="bg-[#003527] text-white px-6 py-3 rounded-full text-center font-geist text-sm font-medium mt-2 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
        >
          Start Assessment
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
