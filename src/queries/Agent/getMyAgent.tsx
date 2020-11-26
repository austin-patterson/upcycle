/**
 * A method to get the current users Agent
 *
 * @package: REA app
 * @author:  Steven Fontaine <fontainesw@msoe.edu>
 * @since:   2017-12-04
 */

import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import { agentInterface } from "./agentInterface";

export const query = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        ...agentInterface
      }
    }
  }
  ${agentInterface}
`;

export default compose(
  // bind input data from the store
  connect(state => ({
    variables: {
      token: state.getUserInfo.currentUserToken
    }
  })),

  graphql(query, {
    // read query vars into query from input data above
    options: props => ({
      variables: {
        ...props.variables
      }
    }),
    // transform output data
    props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
      loading,
      error,
      refetchAgent: refetch, // :NOTE: call this in the component to force reload the data
      agent: viewer ? viewer.myAgent : null
    })
  })
);
