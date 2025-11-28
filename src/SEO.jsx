import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = "HIG AI Automation LLP";
  const defaultDescription = "We build custom AI solutions, web applications, and automation workflows to streamline operations and drive growth.";
  
  // 🚀 UPDATED: Comprehensive High-Ranking Keywords
  const defaultKeywords = [
    // Core Identity
    "HIG AI Automation", "HIG AI", "AI Automation Company", "Web Development Tirunelveli", 
    "Business Automation", "Artificial Intelligence India",

    // AI Solutions & Systems
    "artificial intelligence solutions", "intelligent ai systems", "ai powered applications", 
    "ai integration services", "enterprise ai software", "ai assistants for business", 
    "ai chat automation", "ai process automation", "ai analytics platform", 
    "ai resource optimization", "neural network ai applications", "predictive ai solutions", 
    "adaptive ai systems",

    // AI Agents & LLMs
    "large language models", "llm training", "llm deployment", "llm integration", 
    "private llm hosting", "local llm deployment", "ai reasoning models", 
    "ai agent orchestration", "agentic ai workflows", "multi-agent ai systems", 
    "ai agent platform", "retrieval augmented generation (rag)", "rag ai development", 
    "vector database solutions",

    // RPA & Hyperautomation
    "hyperautomation", "process automation company", "workflow digitization", 
    "back-office automation", "human-in-loop automation", "cognitive automation", 
    "ai + rpa automation", "end-to-end automation", "intelligent document processing (idp)", 
    "idp automation", "ai driven rpa bots", "automation dashboard solutions",

    // ERP, CRM & Business Software
    "business erp platform", "erp + billing software", "erp for MSME", "erp software india", 
    "payroll erp systems", "customizable erp software", "cloud based erp systems", 
    "best erp solution provider", "crm ai integration", "ai crm tools", 
    "lead tracking crm", "automation enabled crm",

    // Web, App & Development
    "progressive web apps (pwa)", "pwa development", "responsive web design", 
    "e-commerce website development", "ai mobile apps", "ai app backend development", 
    "software support & maintenance", "micro-saas development", "custom business software", 
    "product-based software development", "UI/UX design services", "web and app UI development",

    // Marketing & Lead Gen
    "ai lead automation", "automated lead capture", "ai campaign automation", 
    "automated marketing workflows", "marketing with rpa", "targeted b2b leads provider", 
    "sales funnel automation", "business lead scraping", "automated outreach", 
    "social media automation tools",

    // Integrations & Cloud
    "whatsapp api services", "chatbot deployment services", "payment automation tools", 
    "sms automation services", "cloud deployment service india", "aws deployment services", 
    "google cloud hosting", "firebase software solutions", "ai tool integration",

    // Trending & Strategic
    "digital transformation india", "ai digital transformation services", 
    "smart business automation", "industry 4.0 automation", "business digitization platform", 
    "ai tech startup", "innovation automation lab", "next-gen IT company",

    // Local & Regional (High Priority)
    "it startup tirunelveli", "ai company tirunelveli", "software company tirunelveli", 
    "tirunelveli digital services", "tamilnadu ai solutions", "south tamilnadu IT services", 
    "RPA services tamilnadu", "AI adoption services tamilnadu"
  ].join(", ");

  const defaultImage = "https://higaiautomation.com/images/hig-logo.png"; 
  const siteUrl = "https://higaiautomation.com";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HIG AI Automation LLP",
    "url": siteUrl,
    "logo": defaultImage,
    "description": defaultDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tirunelveli",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-6381726852",
      "contactType": "customer service"
    },
    // 🚀 UPDATED: New Social Media Links
    "sameAs": [
      "https://www.linkedin.com/company/hig-automation-in",
      "https://www.instagram.com/hig_s_ai",
      "https://www.facebook.com/share/1DF22iru91/"
    ]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={url || siteUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || siteUrl} />
      <meta property="twitter:title" content={title || siteTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={image || defaultImage} />

      {/* Structured Data for Google Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;