import { gql } from '@apollo/client';
import { USER_COMMON_FIELDS_FRAGMENT, POST_COMMON_FIELDS_FRAGMENT } from "./fragments";

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
    getAllPosts {
        ...postInfo
    }
  }
  ${POST_COMMON_FIELDS_FRAGMENT}
`;

export const GET_USERS = gql`
  query Query {
    allUsers {
       ...userInfo
    }
  }
  ${USER_COMMON_FIELDS_FRAGMENT}
`;

export const GET_USER_BY_USERNAME = gql`
  query Query($username: String!) {
    getProfile(username: $username) {
       ...userInfo
    }
  }
  ${USER_COMMON_FIELDS_FRAGMENT}
`;
