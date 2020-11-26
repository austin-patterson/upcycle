import { SET_CURRENT_ORG_ID } from "./actionTypes";

/**
 * Each action file defines what should be updated each time this particular action is "dispatched".
 * Note, each action takes responsibility for only one attribute in the store state?
 */

/**
 * In this project, this action creator can be called (dispatched) by passing in the new org ID, we
 * want to set for this user. This action creator then sends this info to all reducers, so any
 * concerned reducer can use it to change it's own data
 */

/**
 * This is an action creator, it creates an action and returns it
 * @param newOrgIdParam The new organization Id for the store to save
 * @returns {{type, newOrgId: *}} An action that updates the orgId in the state
 */
export function setCurrentId(newOrgIdParam) {
  return { type: SET_CURRENT_ORG_ID, newOrgId: newOrgIdParam };
}
