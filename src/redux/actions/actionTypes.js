/**
 * Basically boilerplate. Redux requires you to declare action types as consts,
 * so that they can be used elsewhere.
 * In this project, we have a separate file for each action definition
 */

/**
 * In this project these actions can happen throughout the app, ie, these action creators
 * can be called :
 * SET_CURRENT_ORG_ID: The app can call (dispatch) this action creator to set a new org ID
 * SET_USER_TOKEN: The app can call (dispatch) this action creator to set a new user token
 */

export const SET_CURRENT_ORG_ID = "SET_CURRENT_ORG_ID";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
