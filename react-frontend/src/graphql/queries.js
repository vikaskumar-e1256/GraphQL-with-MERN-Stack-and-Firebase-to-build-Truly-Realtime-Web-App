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
