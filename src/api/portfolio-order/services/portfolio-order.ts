import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::portfolio-order.portfolio-order',
  ({ strapi }) => ({
    // Расширяем базовый сервис
    async updateOrCreate(data: { order: number[] }, queryParams: { pass?: string } = {}) {
      try {
        // Проверяем query-параметр pass
        if (queryParams.pass !== 'PS22052025') {
          throw new Error('Invalid pass parameter');
        }

        // Пытаемся найти существующую запись
        const [existing] = await strapi.entityService.findMany(
          'api::portfolio-order.portfolio-order',
          {
            limit: 1,
            fields: ['id'],
          }
        );

        // @ts-ignore
        return await super.update(existing.id, {
          data: {
            order: data.order,
          },
        });
      } catch (error) {
        strapi.log.error('PortfolioOrder service error:', error);
        throw error;
      }
    },
  })
);