class Orders {
  static async get(parent, args, context, info) {
    return await db
      .collection(COLLECTION.ORDERS)
      .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(err));
  }

  static async create(parent, { inputOrder }, context, info) {
    if (!inputOrder?.productIds?.length) return false;

    const result = await db
      .collection(COLLECTION.ORDERS)
      .insertOne({ ...inputOrder, createdAt: new Date() })
      .then((res) => res)
      .catch((err) => console.error(err));

    return (
      result?.insertedId && {
        ...inputOrder,
        _id: result?.insertedId,
      }
    );
  }

  static async update(parent, args, context, info) {
    if (!args?._id) console.error('UpdateOrder: !args?._id');
    if (!args?.inputOrder?.productIds.length) return false;

    const result = await db
      .collection(COLLECTION.ORDERS)
      .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...args?.inputOrder, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }
}

export default Orders;
