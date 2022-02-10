class Categories {
  static async get(parent, args, context, info) {
    return await db
      .collection(COLLECTION.CATEGORIES)
      .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => logger.error(err));
  }

  static async create(parent, { inputCategory }, context, info) {
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
  }

  static async update(parent, args, context, info) {
    if (!args?._id) logger.error('UpdateCategory: !args?._id');

    const upperText = upperCase(args?.inputCategory?.name);

    const result = await db
      .collection(COLLECTION.CATEGORIES)
      .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCategory, name: upperText } })
      .then((res) => res)
      .catch((err) => logger.error(err));

    return result?.value && result?.value;
  }

  static async delete(parent, args, context, info) {
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
  }
}

export default Categories;
