import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Alert, Button } from 'react-bootstrap';
import api, { Post } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { useTheme } from '../contexts/ThemeContext';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string>('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { focusOnElement } = useFocusManagement();
  const announce = useAnnouncement();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        announce('Loading article', { politeness: 'polite' });
        setLoading(true);
        setError(null);
        const response = await api.posts.get(slug);
        setPost(response.data);
        announce('Article loaded successfully', { politeness: 'polite' });
        
        // Focus on the heading after content loads
        setTimeout(() => {
          if (headingRef.current) {
            headingRef.current.focus();
          }
        }, 100);
      } catch (err) {
        setError('Failed to load the post. It may have been removed or is unavailable.');
        announce('Error loading article', { politeness: 'assertive' });
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, announce]);

  const handleShare = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    try {
      const url = window.location.href;
      const text = post?.title || 'Sustainable Living Blog Post';
      
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      };

      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
      const message = `Article shared on ${platform}`;
      setShareStatus(message);
      announce(message, { politeness: 'polite' });
      setTimeout(() => setShareStatus(''), 3000);
    } catch (error) {
      const errorMessage = `Failed to share on ${platform}. Please try again.`;
      setShareStatus(errorMessage);
      announce(errorMessage, { politeness: 'assertive' });
      setTimeout(() => setShareStatus(''), 3000);
    }
  };

  const handleBackToList = () => {
    announce('Navigating back to blog listing', { politeness: 'polite' });
    navigate('/blog');
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading Article..." />
        <div role="status" aria-live="polite" className="sr-only">
          Loading article content...
        </div>
        <LoadingSpinner fullPage />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <SEO title="Article Not Found" description="The requested blog post could not be found." />
        <Container className="py-5">
          <Alert variant="danger" role="alert">
            {error || 'Unable to load post'}
          </Alert>
          <Button 
            variant="primary" 
            onClick={handleBackToList}
            className="mt-3"
            aria-label="Return to blog listing"
          >
            Return to Blog
          </Button>
        </Container>
      </>
    );
  }

  return (
    <Container className="py-4">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.featured_image || undefined}
        article={true}
      />

      <article>
        {/* Article Header */}
        <header className="mb-4">
          <h1 
            ref={headingRef}
            className="mb-3" 
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {post.title}
          </h1>
          <div className="mb-3" role="contentinfo">
            <span className="text-muted me-3">
              By {post.author.first_name || post.author.username}
            </span>
            <span className="text-muted">
              {post.published_at 
                ? `Published on ${new Date(post.published_at).toLocaleDateString()}`
                : `Created on ${new Date(post.created_at).toLocaleDateString()}`
              }
            </span>
          </div>
          <div 
            className="mb-3" 
            role="navigation" 
            aria-label="Article categories and tags"
          >
            <Badge bg="primary" className="me-2">
              {post.category.name}
            </Badge>
            {post.tags.map((tag) => (
              <Badge 
                key={tag.slug} 
                bg="secondary" 
                className="me-1"
                role="listitem"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <Row className="mb-4">
            <Col>
              <img
                src={post.featured_image}
                alt={`Featured image for article: ${post.title}`}
                className="img-fluid rounded w-100"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        )}

        {/* Article Content */}
        <Row className="mb-5">
          <Col>
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Col>
        </Row>

        {/* Social Sharing */}
        <Row className="mt-4 border-top pt-4">
          <Col>
            <h2 className="h5">Share this article</h2>
            <div 
              className="d-flex gap-2"
              role="group"
              aria-label="Social sharing buttons"
            >
              <Button
                variant="outline-primary"
                onClick={() => handleShare('facebook')}
                aria-label="Share on Facebook"
              >
                Share on Facebook
              </Button>
              <Button
                variant="outline-info"
                onClick={() => handleShare('twitter')}
                aria-label="Share on Twitter"
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline-success"
                onClick={() => handleShare('linkedin')}
                aria-label="Share on LinkedIn"
              >
                Share on LinkedIn
              </Button>
            </div>
            {shareStatus && (
              <div 
                className="mt-2" 
                role="status" 
                aria-live="polite"
              >
                {shareStatus}
              </div>
            )}
          </Col>
        </Row>

        {/* Navigation */}
        <Row className="mt-4">
          <Col>
            <nav aria-label="Blog navigation">
              <Button
                variant="outline-primary"
                onClick={handleBackToList}
                aria-label="Return to blog listing"
              >
                ← Back to Blog
              </Button>
            </nav>
          </Col>
        </Row>
      </article>
    </Container>
  );
};

export default BlogPost;