import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  variant?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`border-t mt-auto ${
        isDark
          ? 'bg-[#003527] border-[#064e3b] text-white'
          : 'bg-[#f1f3ff]/50 border-[#bfc9c3]/30'
      }`}
    >
      <div className="w-full py-8 px-4 md:px-10 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className={`font-geist text-xl font-semibold tracking-tight ${isDark ? 'text-[#b0f0d6]' : 'text-[#003527]'}`}>
            CarbWiser
          </span>
          <span className={`font-inter text-sm text-center md:text-left max-w-sm ${isDark ? 'text-[#95d3ba]' : 'text-[#404944]'}`}>
            © 2025 CarbWiser. Helping individuals understand and reduce their carbon footprint.
          </span>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
          {['Privacy Policy', 'Methodology', 'Support', 'Terms of Service'].map((item) => {
            const href = item === 'Methodology' ? '/methodology' : '#';
            return (
              <Link
                key={item}
                to={href}
                className={`font-inter text-sm transition-colors duration-200 hover:underline ${
                  isDark ? 'text-[#95d3ba] hover:text-white' : 'text-[#404944] hover:text-[#003527]'
                }`}
              >
                {item}
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
