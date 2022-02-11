import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { upperCase } from '../../utils/helper';

class Orders {
  static async get(_, { ids }, { dataSources }) {
    return await dataSources.db
      .collection(DB_CONFIG.COLLECTION.ORDERS)
      .find(ids?.length > 0 && { _id: { $in: [...ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(err));
  }

  static async create(_, { inputOrder }, { dataSources }) {
    if (!inputOrder?.productIds?.length) return false;

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.ORDERS)
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

  static async update(_, { _id, inputOrder }, { dataSources }) {
    if (!_id) console.error('UpdateOrder: !_id');
    if (!inputOrder?.productIds.length) return false;

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.ORDERS)
      .findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { ...inputOrder, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }
}

export default Orders;
