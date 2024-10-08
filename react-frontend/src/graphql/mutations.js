import { gql } from '@apollo/client';
import { USER_COMMON_FIELDS_FRAGMENT, POST_COMMON_FIELDS_FRAGMENT } from "./fragments";

export const POST_CREATE = gql`
  mutation Mutation($input: PostCreateInput!) {
    postCreate(input: $input) {
        ...postInfo
    }
  }
  ${POST_COMMON_FIELDS_FRAGMENT}
`;

export const POST_UPDATE = gql`
  mutation Mutation($input: PostUpdateInput!) {
    postUpdate(input: $input) {
        ...postInfo
    }
  }
  ${POST_COMMON_FIELDS_FRAGMENT}
`;

export const POST_DELETE = gql`
  mutation Mutation($postId: String!) {
    postDelete(postId: $postId) {
        id
    }
  }
`;

export const USER_UPDATE_PROFILE = gql`
  mutation Mutation($input: UserUpdateInput!) {
    userUpdate(input: $input) {
        ...userInfo
    }
  }
  ${USER_COMMON_FIELDS_FRAGMENT}
`;

export const SAVE_USER_INTO_DB = gql`
  mutation Mutation {
    userCreate {
        username
        email
    }
  }
`;
