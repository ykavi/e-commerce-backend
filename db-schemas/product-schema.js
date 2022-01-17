const productSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'price', 'stock', 'images', 'cargoDetail', 'categoryCode'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        price: {
          bsonType: 'int',
          minimum: 1,
          maximum: 999999,
          description: 'must be an integer in [ 1, 999999 ] and is required',
        },
        discountedPrice: {
          bsonType: 'int',
          minimum: 0,
          maximum: 999999,
          description: 'must be an integer in [ 1, 999999 ] and is required',
        },
        hasDiscount: {
          bsonType: 'bool',
          description: 'must be an bool',
        },
        categoryCode: {
          bsonType: 'string',
          enum: ['A', 'B', 'C'],
          description: 'must be one of the values listed and is required',
        },
        currency: {
          bsonType: 'string',
          enum: ['TL', 'USD', 'EURO'],
          description: 'must be one of the values listed and is required',
        },
        values: {
          bsonType: ['array'],
          description: 'must be an array',
          items: {
            bsonType: 'string',
            description: 'must be a string',
          },
        },
        description: {
          bsonType: 'string',
          description: 'must be an string',
        },
        stock: {
          bsonType: 'int',
          minimum: 1,
          maximum: 999999,
          description: 'must be an integer in [ 1, 999999 ] and is required',
        },
        images: {
          bsonType: ['array'],
          minItems: 1,
          items: {
            bsonType: 'string',
            description: 'must be a string and is required',
          },
        },
        cargoDetail: {
          bsonType: 'object',
          required: ['free'],
          properties: {
            free: {
              bsonType: 'bool',
              description: "'cargoDetail.free' must be bool",
            },
            price: {
              bsonType: 'int',
              description: "'cargoDetail.price' must be a int",
            },
          },
        },
      },
    },
  },
};

module.exports = { productSchema: productSchema };
