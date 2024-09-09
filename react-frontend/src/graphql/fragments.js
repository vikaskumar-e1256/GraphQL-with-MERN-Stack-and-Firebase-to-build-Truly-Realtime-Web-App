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

export const POST_COMMON_FIELDS_FRAGMENT = gql`
  fragment postInfo on Post {
      id
      image {
        url
        public_id
      }
      postedBy {
        username
        _id
      }
      content
      createdAt
      updatedAt
  }
`;
