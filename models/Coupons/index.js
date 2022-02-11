import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { upperCase } from '../../utils/helper';

class Coupons {
  static async get(_, { ids }, { dataSources }) {
    return await dataSources.db
      .collection(DB_CONFIG.COLLECTION.COUPONS)
      .find(ids?.length > 0 && { _id: { $in: [...ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(err));
  }

  static async create(_, { inputCoupon }, { dataSources }) {
    const upperCodeName = upperCase(inputCoupon?.code);

    const checkDublicate = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.COUPONS)
      .findOne({ code: upperCodeName })
      .then((res) => res)
      .catch((err) => console.error(err));

    if (!checkDublicate) {
      const result = await dataSources.db
        .collection(DB_CONFIG.COLLECTION.COUPONS)
        .insertOne({ ...inputCoupon, code: upperCodeName, createdAt: new Date() })
        .then((res) => res)
        .catch((err) => console.error(err));

      return (
        result?.insertedId && {
          ...inputCoupon,
          _id: result?.insertedId,
        }
      );
    }
  }

  static async update(_, { _id, inputCoupon }, { dataSources }) {
    if (!_id) console.error('UpdateOrder: !_id');
    const upperCodeName = upperCase(inputCoupon?.code);

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.COUPONS)
      .findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { ...inputCoupon, code: upperCodeName, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }

  static async delete(_, { _id }, { dataSources }) {
    if (!_id) console.error('DeleteCoupon: !_id');

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.COUPONS)
      .findOneAndDelete({ _id: ObjectId(_id) })
      .then((res) => res)
      .catch((err) => console.error(err));
    return result?.value && result?.value;
  }
}

export default Coupons;
