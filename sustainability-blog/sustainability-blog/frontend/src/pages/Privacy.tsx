import React from 'react';
import { Container } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import SEO from '../components/SEO';

const Privacy = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="Privacy Policy - Sustainable Living"
        description="Our privacy policy and data protection practices"
      />
      <Container 
        as="main" 
        id="main-content" 
        className={`py-4 bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}
        tabIndex={-1}
      >
        <h1>Privacy Policy</h1>
        <section className="mb-4">
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you use our website,
            subscribe to our newsletter, or interact with our content.
          </p>
        </section>

        <section className="mb-4">
          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to provide and improve our services,
            communicate with you, and enhance your experience on our platform.
          </p>
        </section>

        <section className="mb-4">
          <h2>Data Protection</h2>
          <p>
            We implement appropriate technical and organizational measures to ensure
            the security of your personal data.
          </p>
        </section>

        <section className="mb-4">
          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information.
            Contact us if you would like to exercise these rights.
          </p>
        </section>

        <section className="mb-4">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our privacy policy, please contact us at{' '}
            <a href="mailto:privacy@sustainableliving.com">privacy@sustainableliving.com</a>
          </p>
        </section>
      </Container>
    </>
  );
};

export default Privacy;