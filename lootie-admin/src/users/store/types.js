import { createTypes } from 'reduxsauce'

export default createTypes(
  `
  GET_USERS_ATTEMPT
  GET_USERS_SUCCESS

  GET_USER_DETAIL_ATTEMPT
  GET_USER_DETAIL_SUCCESS

  EDIT_USER_ATTEMPT
  EDIT_USER_SUCCESS

  DISABLE_USERS_ATTEMPT
  DISABLE_USERS_SUCCESS

  API_ATTEMPT
  API_SUCCESS
  API_FAILED
  `
)