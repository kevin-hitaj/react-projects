import { createTypes } from 'reduxsauce'

export default createTypes(
  `
  GET_WITHDRAWALS_ATTEMPT
  GET_WITHDRAWALS_SUCCESS

  EDIT_WITHDRAWAL_ATTEMPT
  EDIT_WITHDRAWAL_SUCCESS

	REMOVE_WITHDRAWALS_ATTEMPT
	REMOVE_WITHDRAWALS_SUCCESS
	
  API_ATTEMPT
  API_SUCCESS
  API_FAILED
  `
)