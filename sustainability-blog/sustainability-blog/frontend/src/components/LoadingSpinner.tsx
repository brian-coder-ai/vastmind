import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

interface LoadingSpinnerProps {
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false }) => {
  const spinner = (
    <Spinner
      animation="border"
      role="status"
      variant="primary"
      className="m-2"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  if (fullPage) {
    return (
      <Container 
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        {spinner}
      </Container>
    );
  }

  return spinner;
};

export default LoadingSpinner;