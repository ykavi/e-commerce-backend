const logger = require('../../../logger/api.logger');

const productMapper = (product) => {
  try {
    return {
      title: product?.title,
      price: product?.price,
      discountedPrice: product?.discountedPrice || 0,
      hasDiscount: product?.hasDiscount || false,
      images: product?.images,
      stock: product?.stock,
      description: product?.description || '',
      categoryCode: product?.categoryCode,
      currency: product?.currency || 'TL',
      values: product?.values || [],
      cargoDetail: {
        free: product?.cargoDetail?.free,
        price: product?.cargoDetail?.price || -1,
      },
    };
  } catch (e) {
    logger.error(`productMapper error:${e}`);
  }

  return false;
};

module.exports = { productMapper };
