import React from 'react';
import { Helmet } from 'react-helmet';

type SEOProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
};

export const SEO: React.FC<SEOProps> = ({ title, description, url, image }) => (
  <Helmet>
    {/* Primary Meta Tags */}
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {url && <meta property="og:url" content={url} />}
    {image && <meta property="og:image" content={image} />}

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {url && <meta name="twitter:url" content={url} />}
    {image && <meta name="twitter:image" content={image} />}

    {/* Canonical */}
    {url && <link rel="canonical" href={url} />}
  </Helmet>
);
