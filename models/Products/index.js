import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { productMapper } from '../../utils/mapper';

class Products {
  static async get(_, { ids },{ dataSources}) {
    return await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .find(ids.length > 0 && { _id: { $in: [ids.map((id) => ObjectId(id))] } })
      .limit(50)
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(`Products.get() error=${error}`));
  }

  static async create(_, { inputProduct },{ dataSources}) {
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

  static async update(_, { _id, inputProduct },{ dataSources}) {
    if (!_id) logger.error('UpdateProduct: !_id');

    const mappedProduct = productMapper(inputProduct);
    if (!mappedProduct) console.error('mappedProduct error!');

    const result = await db
      .collection(COLLECTION.PRODUCT)
      .findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { ...mappedProduct, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }

  static async delete(parent, args, context, info) {
    if (!args?._id) console.error('DeleteProduct: !args?._id');

    const result = await db
      .collection(COLLECTION.PRODUCT)
      .findOneAndDelete({ _id: ObjectId(args._id) })
      .then((res) => res)
      .catch((err) => logger.error(err));

    return result?.value && result?.value;
  }
}

export default Products;
