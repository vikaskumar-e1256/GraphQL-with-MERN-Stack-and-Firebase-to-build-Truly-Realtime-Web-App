import { gql } from '@apollo/client';

export const USER_COMMON_FIELDS_FRAGMENT = gql`
  fragment userInfo on User {
        _id
        username
        email
        name
        images {
            url
            public_id
        }
        about
        createdAt
        updatedAt
  }
`;
