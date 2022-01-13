const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'year'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        year: {
          bsonType: 'int',
          minimum: 5,
          maximum: 10,
          description: 'must be an integer in [ 5, 10 ] and is required',
        },
      },
    },
  },
};

module.exports = { userSchema };
