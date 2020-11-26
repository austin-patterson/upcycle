/**
 * The interface for a ProcessClassification
 *
 * @package: REA app
 * @author: Nicholas Roth <Lou3797>
 * @since: 2018-1-28
 */

import gql from "graphql-tag";
import {Agent} from "../Agent/agentInterface";

/**
 * GraphQL Query fragment for a ProcessClassification
 */
export const processClassificationInterface = gql`
fragment processClassificationInterface on ProcessClassification {
  id
  name
  note
  scope{
    id
  }
  estimatedDuration
}`;

/**
 * Object type specifications
 */
export interface ProcessClassification {
  id: number
  name: string
  note: string
  scope: Agent
  estimatedDuration: string
}
