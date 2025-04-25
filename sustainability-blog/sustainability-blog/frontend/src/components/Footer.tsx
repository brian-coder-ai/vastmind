import React from 'react';
import { Container } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-3 mt-4 bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}>
      <Container className="text-center">
        <p className="mb-0">
          © {currentYear} Sustainability Blog. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;