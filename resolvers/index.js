const resolvers = {
  Query: {
    Products: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.PRODUCT)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .limit(50)
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },
    Categories: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.CATEGORIES)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },
    Orders: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.ORDERS)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },
    Coupons: async (parent, args, context, info) => {
      return await db
        .collection(COLLECTION.COUPONS)
        .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
        .toArray()
        .then((res) => res)
        .catch((err) => logger.error(err));
    },
  },

  Mutation: {
    AddProduct: async (parent, { inputProduct }, context, info) => {
      const mappedProduct = productMapper(inputProduct);
      if (!mappedProduct) logger.error('mappedProduct error!');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .insertOne({ ...mappedProduct, createdAt: new Date() })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return (
        result?.insertedId && {
          ...mappedProduct,
          _id: result?.insertedId,
          createdAt: new Date(),
        }
      );
    },
    UpdateProduct: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateProduct: !args?._id');

      const mappedProduct = productMapper(args?.inputProduct);
      if (!mappedProduct) logger.error('mappedProduct error!');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...mappedProduct, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },
    DeleteProduct: async (parent, args, context, info) => {
      if (!args?._id) logger.error('DeleteProduct: !args?._id');

      const result = await db
        .collection(COLLECTION.PRODUCT)
        .findOneAndDelete({ _id: ObjectId(args._id) })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    AddCategory: async (parent, { inputCategory }, context, info) => {
      const upperText = upperCase(inputCategory?.name);

      const checkDublicate = await db
        .collection(COLLECTION.CATEGORIES)
        .findOne({ name: upperText })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!checkDublicate) {
        const result = await db
          .collection(COLLECTION.CATEGORIES)
          .insertOne({ name: upperText })
          .then((res) => res)
          .catch((err) => logger.error(err));

        return (
          result?.insertedId && {
            ...inputCategory,
            _id: result?.insertedId,
          }
        );
      }
    },
    UpdateCategory: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateCategory: !args?._id');

      const upperText = upperCase(args?.inputCategory?.name);

      const result = await db
        .collection(COLLECTION.CATEGORIES)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCategory, name: upperText } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },
    DeleteCategory: async (parent, args, context, info) => {
      if (!args?.categoryName) logger.error('DeleteCategory: !args?.categoryName');

      const useProductCheck = await db
        .collection(COLLECTION.PRODUCT)
        .findOne({ categoryName: args?.categoryName })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!useProductCheck) {
        const result = await db
          .collection(COLLECTION.CATEGORIES)
          .findOneAndDelete({ name: args?.categoryName })
          .then((res) => res)
          .catch((err) => logger.error(err));
        return result?.value && result?.value;
      }
    },

    AddOrder: async (parent, { inputOrder }, context, info) => {
      if (!inputOrder?.productIds?.length) return false;

      const result = await db
        .collection(COLLECTION.ORDERS)
        .insertOne({ ...inputOrder, createdAt: new Date() })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return (
        result?.insertedId && {
          ...inputOrder,
          _id: result?.insertedId,
        }
      );
    },
    UpdateOrder: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateOrder: !args?._id');
      if (!args?.inputOrder?.productIds.length) return false;

      const result = await db
        .collection(COLLECTION.ORDERS)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputOrder, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },

    AddCoupon: async (parent, { inputCoupon }, context, info) => {
      const upperCodeName = upperCase(inputCoupon?.code);

      const checkDublicate = await db
        .collection(COLLECTION.COUPONS)
        .findOne({ code: upperCodeName })
        .then((res) => res)
        .catch((err) => logger.error(err));

      if (!checkDublicate) {
        const result = await db
          .collection(COLLECTION.COUPONS)
          .insertOne({ ...inputCoupon, code: upperCodeName, createdAt: new Date() })
          .then((res) => res)
          .catch((err) => logger.error(err));

        return (
          result?.insertedId && {
            ...inputCoupon,
            _id: result?.insertedId,
          }
        );
      }
    },
    UpdateCoupon: async (parent, args, context, info) => {
      if (!args?._id) logger.error('UpdateOrder: !args?._id');
      const upperCodeName = upperCase(args?.inputCoupon?.code);

      const result = await db
        .collection(COLLECTION.COUPONS)
        .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCoupon, code: upperCodeName, updatedAt: new Date() } })
        .then((res) => res)
        .catch((err) => logger.error(err));

      return result?.value && result?.value;
    },
    DeleteCoupon: async (parent, args, context, info) => {
      if (!args?._id) logger.error('DeleteCoupon: !args?._id');

      const result = await db
        .collection(COLLECTION.COUPONS)
        .findOneAndDelete({ _id: ObjectId(args._id) })
        .then((res) => res)
        .catch((err) => logger.error(err));
      return result?.value && result?.value;
    },
  },
};

export default resolvers;
