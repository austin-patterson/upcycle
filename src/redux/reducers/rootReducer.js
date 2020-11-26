import { combineReducers } from "redux";
import getUserInfo from "./userInfoReducer.js";

/**
 * Simply combines all reducers. This is because a store can only have one main reducer.
 * Each reducer added in here has a separate store
 */
export const rootReducer = combineReducers({
  getUserInfo
});
