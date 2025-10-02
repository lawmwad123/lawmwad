/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://lawmwad.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/server-sitemap.xml'],
  additionalPaths: async (config) => [
    await config.transform(config, '/#solutions'),
    await config.transform(config, '/#features'),
    await config.transform(config, '/#about'),
    await config.transform(config, '/#contact'),
    await config.transform(config, '/#stats'),
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://lawmwad.vercel.app/server-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Set higher priority for main pages
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'weekly';
    } else if (path.includes('#contact')) {
      customConfig.priority = 0.9;
    } else if (path.includes('#solutions') || path.includes('#features')) {
      customConfig.priority = 0.8;
    } else if (path.includes('#stats')) {
      customConfig.priority = 0.6;
    }

    return customConfig;
  },
};
