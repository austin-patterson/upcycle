import { SET_USER_TOKEN } from "./actionTypes";

/**
 * In this project, this action creator can be called (dispatched) by passing in the new user token,
 * we want to set for the current user window, ie, maybe another user logs in and we want to display their info.
 * The user token and org ID are a backend (valuenetwork) thing.
 * This action creator then sends this info (new user token) to all reducers, so any
 * concerned reducer can use it to change it's own data
 */

/**
 * This is an action creator, it creates an action and returns it
 * @param newUserTokenParam The new user token for the store to save
 * @returns {{type, newOrgId: *}} An action that updates the user token in the state
 */
export function setCurrentUserToken(newUserTokenParam) {
  return { type: SET_USER_TOKEN, newUserToken: newUserTokenParam };
}
