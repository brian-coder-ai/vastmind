import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar 
      bg={theme === 'dark' ? 'dark' : 'light'}
      variant={theme === 'dark' ? 'dark' : 'light'}
      expand="lg" 
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">Sustainability Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/"
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/blog"
              active={location.pathname === '/blog'}
            >
              Blog
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about"
              active={location.pathname === '/about'}
            >
              About
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/privacy"
              active={location.pathname === '/privacy'}
            >
              Privacy
            </Nav.Link>
            <Button
              variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
              onClick={toggleTheme}
              className="ms-2"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;