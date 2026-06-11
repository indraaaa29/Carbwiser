import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== '/assessment' && <Navbar />}
      <Outlet />
      {location.pathname !== '/assessment' && <Footer />}
    </>
  );
};

export default RootLayout;
