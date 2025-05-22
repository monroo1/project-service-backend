import { Layout } from '@strapi/icons';

export default {
  config: {
    locales: ['ru'],
  },
  // @ts-ignore
  bootstrap(app) {
    app.addMenuLink({
      to: '/portfolio-order',
      icon: Layout,
      intlLabel: {
        id: 'portfolio-order.link.label',
        defaultMessage: 'Порядок портфолио',
      },
      Component: async () => {
        const component = await import('./extensions/components/PortfolioOrderManager');
        return component;
      },
      permissions: [
        {
          action: 'plugin::content-manager.explorer.read',
          subject: 'api::portfolio.portfolio',
		  fields: ['*']
        },
      ],
    });
  },
};