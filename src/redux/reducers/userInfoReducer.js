import { initialUserState } from "../store/initialState.js";
import { SET_CURRENT_ORG_ID, SET_USER_TOKEN } from "../actions/actionTypes";

/**
 * Reducers basically are the only thing that actually affect the state of the store.
 * Everytime you run an action, the corresponding reducer gets called, which writes to
 * the store whatever change the action did, i.e., writes the new state to the store
 * Once you understand this, move onto reducers to understand boilerplate for actions.
 * Reducers are the actual data. Each reducer represents a piece of data.
 * The store is a collection of all reducers (all data)
 */

/**
 * Reducer that performs the action onto the state
 * Note Object.assign()  takes all the multiple objects passed in, and combines them to one object
 * @param state The initial state for this reducer.
 * @param action The action being performed
 * @returns {*} The new state
 */
export default function getUserInfogetUserInfo(
  state = initialUserState,
  action
) {
  switch (action.type) {
    case SET_CURRENT_ORG_ID:
      return Object.assign({}, state, {
        currentOrgId: action.newOrgId
      });
    case SET_USER_TOKEN:
      return Object.assign({}, state, {
        currentUserToken: action.newUserToken
      });

    default:
      return state;
  }
}
