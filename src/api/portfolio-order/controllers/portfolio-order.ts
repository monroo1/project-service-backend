import { factories } from '@strapi/strapi';

export default factories.createCoreController(
    'api::portfolio-order.portfolio-order',
    ({ strapi }) => ({
    async update(ctx: any) {
        try {
            const queryParams = ctx.query;
            const { data } = ctx.request.body;

            if (!data || !data.order) {
                return ctx.badRequest('Missing or invalid order data');
            }

            const result = await strapi
                .service('api::portfolio-order.portfolio-order')
                .updateOrCreate(data, queryParams);

            return result;
        } catch (error) {
            strapi.log.error('Error in portfolio-order controller:', error);
            return ctx.internalServerError('Something went wrong');
        }
    }})
);