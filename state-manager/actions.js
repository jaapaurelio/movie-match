import { actionTypes } from './constants'

export const setUser = user => dispatch => {
    return dispatch({ type: actionTypes.SET_USER, user: user })
}
