import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { productMapper } from '../../utils/mapper';

class Products {
  static async get(parent, args, context, info) {
    return await context.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .find(args.ids.length > 0 && { _id: { $in: [...args.ids.map((id) => ObjectId(id))] } })
      .limit(50)
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(`Products.get() error=${error}`));
  }

  static async create(parent, { inputProduct }, context, info) {
    const mappedProduct = productMapper(inputProduct);
    if (!mappedProduct) console.error('mappedProduct error!');

    const result = await db
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

  static async update(parent, args, context, info) {
    if (!args?._id) logger.error('UpdateProduct: !args?._id');

    const mappedProduct = productMapper(args?.inputProduct);
    if (!mappedProduct) logger.error('mappedProduct error!');

    const result = await db
      .collection(COLLECTION.PRODUCT)
      .findOneAndUpdate({ _id: ObjectId(args._id) }, { $set: { ...mappedProduct, updatedAt: new Date() } })
      .then((res) => res)
      .catch((err) => logger.error(err));

    return result?.value && result?.value;
  }

  static async delete(parent, args, context, info) {
    if (!args?._id) logger.error('DeleteProduct: !args?._id');

    const result = await db
      .collection(COLLECTION.PRODUCT)
      .findOneAndDelete({ _id: ObjectId(args._id) })
      .then((res) => res)
      .catch((err) => logger.error(err));

    return result?.value && result?.value;
  }
}

export default Products;
