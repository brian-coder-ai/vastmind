import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { Post, Category, Tag } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { useTheme } from '../contexts/ThemeContext';

const Blog = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUpdateMessage, setFilterUpdateMessage] = useState('');
  const { focusOnElement } = useFocusManagement();
  const announce = useAnnouncement();

  useEffect(() => {
    const fetchData = async () => {
      try {
        announce('Loading blog content', { politeness: 'polite' });
        setLoading(true);
        setError(null);

        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          api.posts.list({
            category: selectedCategory || undefined,
            tag: selectedTag || undefined,
          }),
          api.categories.list(),
          api.tags.list(),
        ]);

        setPosts(postsResponse.data.results);
        setCategories(categoriesResponse.data.results);
        setTags(tagsResponse.data.results);

        const categoryName = selectedCategory ? 
          categoriesResponse.data.results.find(c => c.slug === selectedCategory)?.name : 'all categories';
        const tagName = selectedTag ? 
          tagsResponse.data.results.find(t => t.slug === selectedTag)?.name : 'all tags';
        
        announce(
          `Loaded ${postsResponse.data.results.length} posts for ${categoryName} and ${tagName}`,
          { politeness: 'polite', timeout: 2000 }
        );
      } catch (err) {
        setError('Failed to load blog content. Please try again later.');
        announce('Error loading blog content', { politeness: 'assertive' });
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, announce]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const categoryName = newCategory ? 
      categories.find(c => c.slug === newCategory)?.name : 
      'all categories';
    
    setSelectedCategory(newCategory);
    setFilterUpdateMessage(`Showing posts from ${categoryName}`);
    announce(`Filtering by category: ${categoryName}`, { politeness: 'polite' });
    focusOnElement('blog-results');
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    const tagName = newTag ? 
      tags.find(t => t.slug === newTag)?.name : 
      'all tags';
    
    setSelectedTag(newTag);
    setFilterUpdateMessage(`Showing posts tagged with ${tagName}`);
    announce(`Filtering by tag: ${tagName}`, { politeness: 'polite' });
    focusOnElement('blog-results');
  };

  const handleCardKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    slug: string
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/blog/${slug}`;
    }
  };

  return (
    <>
      <SEO 
        title="Blog - Sustainable Living"
        description="Read our latest articles about sustainable living and environmental consciousness"
      />
      <Container 
        as="main" 
        id="main-content" 
        className={`py-4 bg-${theme === 'dark' ? 'dark' : 'light'} text-${theme === 'dark' ? 'light' : 'dark'}`}
        tabIndex={-1}
      >
        <h1 className="text-center mb-4">Sustainability Blog</h1>
        
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="categoryFilter">
              <Form.Label>Filter by Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                aria-label="Filter posts by category"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="tagFilter">
              <Form.Label>Filter by Tag</Form.Label>
              <Form.Select
                value={selectedTag}
                onChange={handleTagChange}
                aria-label="Filter posts by tag"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.slug} value={tag.slug}>
                    {tag.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Live region for filter updates */}
        <div 
          className="visually-hidden" 
          role="status" 
          aria-live="polite"
        >
          {filterUpdateMessage}
        </div>

        {/* Posts Grid */}
        <Row 
          as="section" 
          aria-label="Blog posts" 
          id="blog-results"
          tabIndex={-1}
        >
          {loading ? (
            <LoadingSpinner fullPage />
          ) : posts.length === 0 ? (
            <Col className="text-center">
              <p role="status">No posts found. Try adjusting your filters.</p>
            </Col>
          ) : (
            posts.map((post) => (
              <Col md={4} key={post.id} className="mb-4">
                <Card 
                  className="h-100"
                  role="article"
                  tabIndex={0}
                  as="div"
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
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-decoration-none text-dark stretched-link"
                        aria-label={`Read full article: ${post.title}`}
                      >
                        {post.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>{post.excerpt}</Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          By {post.author.first_name || post.author.username}
                        </small>
                        <small className="text-muted">
                          {new Date(post.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      {post.tags.length > 0 && (
                        <div 
                          className="mt-2" 
                          role="list" 
                          aria-label={`Tags for ${post.title}`}
                        >
                          {post.tags.map(tag => (
                            <span
                              key={tag.slug}
                              className="badge bg-secondary me-1"
                              role="listitem"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    <span>Category: {post.category.name}</span>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  );
};

export default Blog;