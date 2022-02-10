class Coupons {
  static async get(parent, args, context, info) {
    return await db
      .collection(COLLECTION.COUPONS)
      .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => logger.error(err));
  }

  static async create(parent, { inputCoupon }, context, info) {
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
  }

  static async update(parent, args, context, info) {
    if (!args?._id) logger.error('UpdateOrder: !args?._id');
    const upperCodeName = upperCase(args?.inputCoupon?.code);

    const result = await db
      .collection(COLLECTION.COUPONS)
      .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputCoupon, code: upperCodeName, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => logger.error(err));

    return result?.value && result?.value;
  }

  static async delete(parent, args, context, info) {
    if (!args?._id) logger.error('DeleteCoupon: !args?._id');

    const result = await db
      .collection(COLLECTION.COUPONS)
      .findOneAndDelete({ _id: ObjectId(args._id) })
      .then((res) => res)
      .catch((err) => logger.error(err));
    return result?.value && result?.value;
  }
}

export default Coupons;
