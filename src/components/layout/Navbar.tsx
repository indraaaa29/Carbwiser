import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { href: '/overview', label: 'Overview' },
  { href: '/actions', label: 'Actions' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/tracking', label: 'Tracking' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          className="font-geist text-xl font-semibold text-[#003527] tracking-tight hover:opacity-90 transition-opacity"
        >
          CarbWiser
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`font-geist text-sm font-medium transition-colors duration-200 ${
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
              className="p-2 text-[#404944] hover:text-[#003527] transition-colors rounded-full hover:bg-[#dce2f7]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            </button>
            <button
              aria-label="Account"
              className="p-2 text-[#404944] hover:text-[#003527] transition-colors rounded-full hover:bg-[#dce2f7]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </button>
          </div>

          <Link
            to="/assessment"
            className="hidden md:block bg-[#003527] text-white hover:bg-[#2b6954] transition-colors px-6 py-2.5 rounded-full font-geist text-sm font-medium"
          >
            Sign In
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open Menu"
            className="md:hidden p-2 text-[#141b2b]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#bfc9c3]/50 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-geist text-sm font-medium py-2 ${
                  isActive ? 'text-[#003527] font-bold' : 'text-[#404944]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/assessment"
            onClick={() => setMenuOpen(false)}
            className="bg-[#003527] text-white px-6 py-3 rounded-full text-center font-geist text-sm font-medium mt-2"
          >
            Start Assessment
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
