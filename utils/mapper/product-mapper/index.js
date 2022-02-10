export const productMapper = (product) => {
  try {
    return {
      title: product?.title,
      price: product?.price || -1,
      discountedPrice: product?.discountedPrice || 0,
      hasDiscount: product?.hasDiscount || false,
      images: product?.images,
      stock: product?.stock,
      description: product?.description || '',
      categoryName: product?.categoryName || 'other',
      currency: product?.currency || 'TL',
      values: product?.values || [],
      cargoDetail: {
        free: product?.cargoDetail?.free,
        price: product?.cargoDetail?.price || -1,
      },
    };
  } catch (e) {
    console.error(`productMapper error:${e}`);
  }

  return false;
};
