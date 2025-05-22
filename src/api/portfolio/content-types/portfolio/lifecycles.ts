export default {
  async afterCreate(event) {
    const { result } = event;
    try {
      const portfolioOrderService = strapi.service(
        'api::portfolio-order.portfolio-order'
      );

      const orderEntry = await portfolioOrderService.ensureOrderExists();
      
      await portfolioOrderService.updateOrCreate({
        order: [...orderEntry.order, result.id]
      }, { pass: "PS22052025" });

    } catch (error) {
      strapi.log.error('Portfolio order update error:', error);
    }
  }
};