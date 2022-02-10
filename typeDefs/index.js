import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';

export default gql`
  ${importSchema('./typeDefs/schema.graphql')}
`;
