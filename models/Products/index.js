import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { productMapper } from '../../utils/mapper';

class Products {
  static async get(_, { ids }, { dataSources }) {
    return await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .find(ids?.length > 0 && { _id: { $in: [...ids.map((id) => ObjectId(id))] } })
      .limit(50)
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(`Products.get() error=${err}`));
  }

  static async create(_, { inputProduct }, { dataSources }) {
    const mappedProduct = productMapper(inputProduct);
    if (!mappedProduct) console.error('mappedProduct error!');

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .insertOne({ ...mappedProduct, createdAt: new Date() })
      .then((res) => res)
      .catch((err) => console.error(err));

    return (
      result?.insertedId && {
        ...mappedProduct,
        _id: result?.insertedId,
        createdAt: new Date(),
      }
    );
  }

  static async update(_, { _id, inputProduct }, { dataSources }) {
    if (!_id) console.error('UpdateProduct: !_id');

    const mappedProduct = productMapper(inputProduct);
    if (!mappedProduct) console.error('mappedProduct error!');

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { ...mappedProduct, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }

  static async delete(_, { _id }, { dataSources }) {
    if (!_id) console.error('DeleteProduct: !_id');

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .findOneAndDelete({ _id: ObjectId(_id) })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }
}

export default Products;
