import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SEO from '../components/SEO';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="About Us - Sustainable Living"
        description="Learn about our mission to promote sustainable living practices and environmental consciousness."
      />

      <Container 
        as="main" 
        id="main-content" 
        className={`py-4 bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}
        tabIndex={-1}
      >
        <h1>About Us</h1>
        <p>
          We are dedicated to promoting sustainable living practices and environmental awareness
          through informative content and practical tips.
        </p>
      </Container>

      <main className="py-5">
        <Container>
          <section aria-labelledby="mission-heading">
            <h1 id="mission-heading" className="text-center mb-5">About Our Mission</h1>
            
            <Row className="mb-5">
              <Col lg={8} className="mx-auto">
                <p className="lead text-center mb-4">
                  We are dedicated to promoting sustainable living practices and environmental consciousness
                  through education, community engagement, and practical solutions.
                </p>
              </Col>
            </Row>
          </section>

          <section 
            className="values-section mb-5"
            aria-labelledby="values-heading"
          >
            <h2 id="values-heading" className="text-center mb-4">Our Core Values</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Body>
                    <h3 className="h5 mb-3">Environmental Stewardship</h3>
                    <p>
                      We believe in taking responsibility for our environmental impact
                      and promoting practices that protect our planet for future generations.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Body>
                    <h3 className="h5 mb-3">Community Engagement</h3>
                    <p>
                      Building strong communities through knowledge sharing and
                      collaborative efforts towards sustainable living.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Body>
                    <h3 className="h5 mb-3">Education & Awareness</h3>
                    <p>
                      Providing accessible information and resources to help people
                      make environmentally conscious decisions.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </section>

          <section 
            className="team-section"
            aria-labelledby="team-heading"
          >
            <h2 id="team-heading" className="text-center mb-4">Our Team</h2>
            <Row>
              <Col lg={8} className="mx-auto">
                <div className="text-center">
                  <p>
                    Our team consists of passionate environmentalists, writers, and
                    sustainability experts dedicated to making a positive impact on
                    the world through education and advocacy.
                  </p>
                  <p>
                    We work together to research, write, and share valuable insights
                    about sustainable living practices that anyone can implement in
                    their daily lives.
                  </p>
                </div>
              </Col>
            </Row>
          </section>

          <section 
            className="contact-section mt-5"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-center mb-4">Get in Touch</h2>
            <Row>
              <Col md={6} className="mx-auto text-center">
                <p>
                  Have questions or want to contribute? We'd love to hear from you!
                </p>
                <a
                  href="mailto:contact@sustainableliving.com"
                  className="btn btn-primary"
                  aria-label="Send us an email"
                >
                  Contact Us
                </a>
              </Col>
            </Row>
          </section>
        </Container>
      </main>
    </>
  );
};

export default About;