export default [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false,
    },
  },
  {
    name: 'strapi::session',
    config: {
      cookie: {
        sameSite: 'Lax',
        secure: false,
        httpOnly: true,
      },
    },
  },
];
