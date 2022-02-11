import { Products, Coupons, Categories, Orders } from '../models';

const resolvers = {
  Query: {
    Products: async (...props) => {
      return await Products.get(...props);
    },
    Categories: async (...props) => {
      return await Categories.get(...props);
    },
    Orders: async (...props) => {
      return await Orders.get(...props);
    },
    Coupons: async (...props) => {
      return await Coupons.get(...props);
    },
  },

  Mutation: {
    AddProduct: async (...props) => {
      return await Products.create(...props);
    },
    UpdateProduct: async (...props) => {
      return await Products.update(...props);
    },
    DeleteProduct: async (...props) => {
      return await Products.delete(...props);
    },

    AddCategory: async (...props) => {
      return await Categories.create(...props);
    },
    UpdateCategory: async (...props) => {
      return await Categories.update(...props);
    },
    DeleteCategory: async (...props) => {
      return await Categories.update(...props);
    },

    AddOrder: async (...props) => {
      return await Orders.create(...props);
    },
    UpdateOrder: async (...props) => {
      return await Orders.update(...props);
    },

    AddCoupon: async (...props) => {
      return await Coupons.create(...props);
    },
    UpdateCoupon: async (...props) => {
      return await Coupons.update(...props);
    },
    DeleteCoupon: async (...props) => {
      return await Coupons.delete(...props);
    },
  },
};

export default resolvers;
