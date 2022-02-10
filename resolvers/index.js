import { Products, Coupons, Categories, Orders } from '../models';

const resolvers = {
  Query: {
    Products: async (parent, args, context, info) => {
      return await Products.get(parent, args, context, info);
    },
    Categories: async (parent, args, context, info) => {
      return await Categories.get(parent, args, context, info);
    },
    Orders: async (parent, args, context, info) => {
      return await Orders.get(parent, args, context, info);
    },
    Coupons: async (parent, args, context, info) => {
      return await Coupons.get(parent, args, context, info);
    },
  },

  Mutation: {
    AddProduct: async (parent, { inputProduct }, context, info) => {
      return await Products.create(parent, { inputProduct }, context, info);
    },
    UpdateProduct: async (parent, args, context, info) => {
      return await Products.update(parent, args, context, info);
    },
    DeleteProduct: async (parent, args, context, info) => {
      return await Products.delete(parent, args, context, info);
    },

    AddCategory: async (parent, { inputCategory }, context, info) => {
      return await Categories.create(parent, { inputCategory }, context, info);
    },
    UpdateCategory: async (parent, args, context, info) => {
      return await Categories.update(parent, args, context, info);
    },
    DeleteCategory: async (parent, args, context, info) => {
      return await Categories.update(parent, args, context, info);
    },

    AddOrder: async (parent, { inputOrder }, context, info) => {
      return await Orders.create(parent, { inputOrder }, context, info);
    },
    UpdateOrder: async (parent, args, context, info) => {
      return await Orders.update(parent, args, context, info);
    },

    AddCoupon: async (parent, { inputCoupon }, context, info) => {
      return await Coupons.create(parent, { inputCoupon }, context, info);
    },
    UpdateCoupon: async (parent, args, context, info) => {
      return await Coupons.update(parent, args, context, info);
    },
    DeleteCoupon: async (parent, args, context, info) => {
      return await Coupons.delete(parent, args, context, info);
    },
  },
};

export default resolvers;
