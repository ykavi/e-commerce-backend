import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../../config/db-config';
import { upperCase } from '../../utils/helper';

class Categories {
  static async get(_, { ids }, { dataSources }) {
    return await dataSources.db
      .collection(DB_CONFIG.COLLECTION.CATEGORIES)
      .find(ids?.length > 0 && { _id: { $in: [...ids.map((id) => ObjectId(id))] } })
      .toArray()
      .then((res) => res)
      .catch((err) => console.error(err));
  }

  static async create(_, { inputCategory }, { dataSources }) {
    const upperText = upperCase(inputCategory?.name);

    const checkDublicate = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.CATEGORIES)
      .findOne({ name: upperText })
      .then((res) => res)
      .catch((err) => console.error(err));

    if (!checkDublicate) {
      const result = await dataSources.db
        .collection(DB_CONFIG.COLLECTION.CATEGORIES)
        .insertOne({ name: upperText })
        .then((res) => res)
        .catch((err) => console.error(err));

      return (
        result?.insertedId && {
          ...inputCategory,
          _id: result?.insertedId,
        }
      );
    }
  }

  static async update(_, { _id, inputCategory }, { dataSources }) {
    if (!_id) console.error('UpdateCategory: !_id');

    const upperText = upperCase(inputCategory?.name);

    const result = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.CATEGORIES)
      .findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { inputCategory, name: upperText } })
      .then((res) => res)
      .catch((err) => console.error(err));

    return result?.value && result?.value;
  }

  static async delete(_, { categoryName }, { dataSources }) {
    if (!categoryName) console.error('DeleteCategory: !categoryName');

    const useProductCheck = await dataSources.db
      .collection(DB_CONFIG.COLLECTION.PRODUCT)
      .findOne({ categoryName: categoryName })
      .then((res) => res)
      .catch((err) => console.error(err));

    if (!useProductCheck) {
      const result = await dataSources.db
        .collection(DB_CONFIG.COLLECTION.CATEGORIES)
        .findOneAndDelete({ name: categoryName })
        .then((res) => res)
        .catch((err) => console.error(err));
      return result?.value && result?.value;
    }
  }
}

export default Categories;
