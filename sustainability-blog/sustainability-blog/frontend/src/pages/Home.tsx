import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { Post } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { useTheme } from '../contexts/ThemeContext';
import { getImage, IMAGE_IDS } from '../services/imageService';

interface Images {
  [key: string]: string;
}

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Images>({});
  const [imagesLoading, setImagesLoading] = useState(true);
  const announce = useAnnouncement();
  const { theme } = useTheme();

  // Fetch images from Pixabay
  useEffect(() => {
    const loadImages = async () => {
      try {
        setImagesLoading(true);
        const loadedImages: Images = {};
        
        for (const [key, id] of Object.entries(IMAGE_IDS)) {
          try {
            loadedImages[key] = await getImage(id);
          } catch (error) {
            console.error(`Error loading image ${key}:`, error);
            // Use a placeholder image or fallback
            loadedImages[key] = 'https://via.placeholder.com/800x400?text=Image+Unavailable';
          }
        }
        
        setImages(loadedImages);
      } catch (err) {
        console.error('Error loading images:', err);
        announce('Error loading some images', { politeness: 'polite' });
      } finally {
        setImagesLoading(false);
      }
    };

    loadImages();
  }, [announce]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        announce('Loading featured content', { politeness: 'polite' });
        setLoading(true);
        setError(null);
        const response = await api.posts.list({ is_featured: true, limit: 3 });
        setFeaturedPosts(response.data.results);
        announce(`Loaded ${response.data.results.length} featured articles`, { politeness: 'polite' });
      } catch (err) {
        setError('Failed to load featured content. Please try again later.');
        announce('Error loading featured content', { politeness: 'assertive' });
        console.error('Error fetching featured posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, [announce]);

  const handleCardKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, slug: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/blog/${slug}`;
    }
  };

  if (imagesLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <>
      <SEO
        title="Sustainable Living - Home"
        description="Explore sustainable living practices and eco-friendly lifestyle tips for a better tomorrow."
        image={images.hero}
      />

      {/* Hero Section with Background Image */}
      <section 
        className="hero-section text-center text-white position-relative"
        style={{
          backgroundImage: `url(${images.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '120px 0',
          position: 'relative',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
        <Container className="position-relative">
          <h1 className="display-4 mb-4 fw-bold">Welcome to Sustainable Living</h1>
          <p className="lead mb-4">
            Discover practical tips and insights for living a more sustainable lifestyle
          </p>
          <Link
            to="/blog"
            className="btn btn-success btn-lg"
            role="button"
            aria-label="Explore our blog articles"
          >
            Explore Our Blog
          </Link>
        </Container>
      </section>

      {/* Sustainability Categories */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Explore Sustainable Living</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={images.ecoLiving}
                  alt="Lush green forest at sunrise"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <Card.Title>Eco-Living Tips</Card.Title>
                  <Card.Text>
                    Discover simple ways to reduce your environmental impact in daily life.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={images.renewable}
                  alt="Wind turbines against blue sky"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <Card.Title>Renewable Energy</Card.Title>
                  <Card.Text>
                    Learn about clean energy solutions for a sustainable future.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={images.sustainable}
                  alt="Person planting a tree"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <Card.Title>Sustainable Practices</Card.Title>
                  <Card.Text>
                    Explore practical ways to live more sustainably every day.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Posts Section */}
      <section 
        className="py-5"
        aria-labelledby="featured-posts-heading"
      >
        <Container>
          <h2 
            id="featured-posts-heading" 
            className="text-center mb-4"
          >
            Featured Articles
          </h2>

          {error && (
            <div 
              className="alert alert-danger" 
              role="alert"
            >
              {error}
            </div>
          )}

          <Row>
            {loading ? (
              <Col className="text-center">
                <LoadingSpinner />
                <div className="sr-only" role="status">
                  Loading featured articles...
                </div>
              </Col>
            ) : featuredPosts.length === 0 ? (
              <Col className="text-center">
                <p role="status">No featured articles available.</p>
              </Col>
            ) : (
              <div 
                role="feed" 
                aria-busy={loading}
                aria-label="Featured blog posts"
              >
                {featuredPosts.map((post) => (
                  <Col 
                    key={post.id} 
                    md={4} 
                    className="mb-4"
                  >
                    <Card 
                      className="h-100 shadow-sm"
                      role="article"
                      tabIndex={0}
                      onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => handleCardKeyPress(e, post.slug)}
                    >
                      {post.featured_image && (
                        <Card.Img
                          variant="top"
                          src={post.featured_image}
                          alt=""
                          aria-hidden="true"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <Card.Body>
                        <Card.Title>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-decoration-none"
                            aria-label={`Read full article: ${post.title}`}
                          >
                            {post.title}
                          </Link>
                        </Card.Title>
                        <Card.Text>{post.excerpt}</Card.Text>
                        <div className="mt-auto">
                          <small className="text-muted d-block mb-2">
                            {new Date(post.created_at).toLocaleDateString()}
                          </small>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="btn btn-outline-primary"
                            aria-label={`Read more about ${post.title}`}
                          >
                            Read More
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </div>
            )}
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-5 bg-light"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${images.ecoLiving})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-labelledby="newsletter-heading"
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="text-center p-5 bg-white rounded shadow-sm">
                <h2 id="newsletter-heading" className="mb-4">
                  Stay Updated
                </h2>
                <p className="mb-4">
                  Subscribe to our newsletter for the latest sustainability tips and updates.
                </p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    announce('Thank you for subscribing to our newsletter!', { politeness: 'polite' });
                  }}
                  className="d-flex gap-2 justify-content-center"
                >
                  <div className="form-group flex-grow-1">
                    <label htmlFor="email" className="visually-hidden">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      required
                      aria-required="true"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="success"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;