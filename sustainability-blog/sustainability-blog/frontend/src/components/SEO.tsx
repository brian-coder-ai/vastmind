import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Sustainable living tips and environmental awareness blog',
  image = '/logo512.png',
  article = false,
}) => {
  const siteTitle = 'Sustainable Living';
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;