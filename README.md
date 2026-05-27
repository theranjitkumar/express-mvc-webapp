# Express MVC Web App

A lightweight Express.js MVC web application built with Handlebars (`hbs`) to demonstrate a simple company website structure, dynamic service pages, and sitemap generation.

## Key Features

- Express.js application using `express` and `hbs`
- Server-side rendered pages with Handlebars templates
- Dynamic service details pages under `/services/:slug`
- Location-aware service pages under `/services/:serviceSlug/:location`
- Auto-generated `sitemap.xml` for SEO-friendly URL discovery
- Static assets served from `public/`

## Prerequisites

- Node.js (recommended 16.x or newer)
- npm

## Installation

1. Clone or download the repository.
2. Open a terminal in the project folder.
3. Install dependencies:

```bash
npm install
```

## Run the Project

Start the server using:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The app will run by default on `http://localhost:3000` when started with the standard `bin/www` server script.

## Project Structure

- `app.js` - Express application setup and middleware configuration
- `router.js` - Application routes and sitemap generation logic
- `bin/www` - Startup script for Node server
- `views/` - Handlebars templates for pages and partials
- `public/` - Static assets (CSS, JS, images)
- `data/` - Metadata, service definitions, and location slugs

## Available Routes

- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/services` - Services overview page
- `/services/web-development` - Web Development service detail page
- `/services/digital-marketing` - Digital Marketing service detail page
- `/services/:serviceSlug/:location` - Location-specific service pages, for example:
  - `/services/web-development/gurgaon`
  - `/services/digital-marketing/mumbai`
- `/sitemap.xml` - Generated sitemap of site URLs

## Customization

- Add or edit services in `data/services.js`
- Add new location slug values in `data/location.js`
- Update page metadata in `data/meta.js`
- Add new Handlebars views in `views/` and register them in `router.js`

## Notes

- The app uses `morgan`, `cookie-parser`, and `http-errors` for middleware support.
- `hbs.registerPartials` loads shared header/footer partials from `views/partials/`.
- The sitemap includes static routes plus all service and service-location combinations.
