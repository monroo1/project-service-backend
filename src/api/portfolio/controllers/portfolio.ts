import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::portfolio.portfolio', ({ strapi }) => ({
  async find(ctx: any) {
    const { pagination = {} } = ctx.query;
    const page = parseInt(pagination?.page, 10) || 1;
    const pageSize = parseInt(pagination?.pageSize, 10) || 9;

    const order = await strapi.entityService.findOne(
      'api::portfolio-order.portfolio-order',
      1,
      {
        fields: ['order'],
      }
    ) as unknown as { id: number, order: number[] } | null;
    
    const sortedOrder: number[] = order.order ?? [];

    const portfolios = await strapi.entityService.findMany('api::portfolio.portfolio', {
      filters: ctx.query.filters,
      populate: ctx.query.populate,
    });

    const sortedPortfolios = sortedOrder.length
      ? sortedOrder
          .map((id) => portfolios.find((p: any) => p.id === id))
          .filter((item: any): item is any => Boolean(item))
          .concat(portfolios.filter((p: any) => !sortedOrder.includes(p.id)))
      : portfolios;

    const total = sortedPortfolios.length;
    const pageCount = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedPortfolios = sortedPortfolios.slice(start, start + pageSize);
    
    return {
      data: pagination?.page ? paginatedPortfolios : sortedPortfolios,
      meta: {
        pagination: {
          page,
          pageSize: pagination?.page ? pageSize : portfolios.length,
          pageCount: pagination?.page ? pageCount : 1,
          total: pagination?.page ? total : portfolios.length,
        },
      },
    };
  },
}));