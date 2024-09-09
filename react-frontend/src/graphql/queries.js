import { gql } from '@apollo/client';
import { USER_COMMON_FIELDS_FRAGMENT } from "./fragments";

export const GET_USER_INFO = gql`
  query Query {
    profile {
        ...userInfo
    }
  }
  ${USER_COMMON_FIELDS_FRAGMENT}
`;

export const GET_POSTS = gql`
  query Query {
    all_posts {
      id
      title
      description
    }
  }
`;

export const GET_USERS = gql`
  query Query {
    allUsers {
       ...userInfo
    }
  }
  ${USER_COMMON_FIELDS_FRAGMENT}
`;
