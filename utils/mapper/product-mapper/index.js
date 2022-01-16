const logger = require('../../../logger/api.logger');

const productMapper = (product) => {
  try {
    if (
      !product?.title ||
      !product?.price ||
      !product?.stock ||
      !product?.images?.[0] ||
      !((product?.cargoDetail?.free === true || product?.cargoDetail?.free === false) && !product?.cargoDetail?.free && product?.cargoDetail?.price)
    )
      return false;

    return {
      title: product?.title,
      price: product?.price,
      discountedPrice: product?.discountedPrice,
      hasDiscount: product?.hasDiscount,
      images: product?.images,
      stock: product?.stock,
      description: product?.description,
      categoryCode: product?.categoryCode,
      currency: product?.currency,
      values: product?.values,
      cargoDetail: {
        free: product?.cargoDetail?.free,
        price: product?.cargoDetail?.price,
      },
    };
  } catch (e) {
    logger.error(`productMapper error:${e}`);
  }

  return false;
};

module.exports = { productMapper };
