import { gql } from '@apollo/client';
import { POST_COMMON_FIELDS_FRAGMENT } from "./fragments";

export const POST_ADDED = gql`
  subscription Subscription {
    postAdded {
        ...postInfo
    }
  }
  ${POST_COMMON_FIELDS_FRAGMENT}
`;
