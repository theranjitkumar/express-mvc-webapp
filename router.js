var express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');

const meta = require('./data/meta.js');
const services = require('./data/services.js');
const locations = require('./data/location.js');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    meta: meta.about,
    year: new Date().getFullYear()
  });
});

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About',
    meta: meta.about,
  });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', {
    title: 'Contact',
    meta: meta.contact,
  });
});

router.get('/services', (req, res, next) => {
  res.render('services', {
    title: 'Services',
    meta: meta.services,
    services,
  });
});

router.get('/services/:slug', (req, res) => {
  const slug = req.params.slug;

  const service = services.find(s => s.slug === slug);

  if (!service) {
    return res.status(404).send('Service not found');
  }

  const meta = {
    title: `${service.title} in Gurgaon`,
    description: service.description,
    image: service.image,
    keywords: service.keywords.join(', '),
  };

  res.render(`services/${slug}`, {
    service: service,
    meta: meta,
  });
});

router.get('/services/:serviceSlug/:location', (req, res) => {

  const { serviceSlug, location } = req.params;

  const service = services.find(s => s.slug === serviceSlug);

  if (!service || !locations.includes(location)) {
    return res.status(404).send('Page not found');
  }

  const meta = {
    title: `${service.title} in ${location}`,
    description: `Looking for ${service.title} in ${location}? Express MVCs Global provides expert services.`,
    image: service.image,
    keywords: `${service.keywords.join(', ')}, 
    ${service.title.toLowerCase()} company in ${location}, 
    best ${service.title.toLowerCase()} company in ${location}, 
    ${location} ${service.title.toLowerCase()} company, 
    ${service.title.toLowerCase()} services in ${location},
    ${service.title.toLowerCase()} expert company in ${location},
    ${service.title.toLowerCase()} agency in ${location},
    ${service.title.toLowerCase()} firm in ${location},
    ${service.title.toLowerCase()} consultancy in ${location},
    ${service.title.toLowerCase()} specialised company in ${location},
    `,
  };
  res.render('service-location', { service, location, meta });
});

router.get('/sitemap.xml', async (req, res) => {

  const baseUrl = req.protocol + '://' + req.get('host');
  const smStream = new SitemapStream({
    hostname: baseUrl
  });

  // ✅ 1. Static pages
  smStream.write({ url: '/' });
  smStream.write({ url: '/about' });
  smStream.write({ url: '/contact' });
  smStream.write({ url: '/services' });

  // ✅ 2. Dynamic pages
  services.forEach(service => {
    smStream.write({ url: `/services/${service.slug}` });

    locations.forEach(loc => {
      smStream.write({ url: `/services/${service.slug}/${loc}` });
    });
  });

  smStream.end();

  const sitemap = await streamToPromise(smStream);

  res.header('Content-Type', 'application/xml');
  res.send(sitemap.toString());
});

module.exports = router;
