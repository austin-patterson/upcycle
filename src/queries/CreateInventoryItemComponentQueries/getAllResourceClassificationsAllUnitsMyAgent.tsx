/**
 * A method to get all Resource Classifications (Lumber, Tire),
 * all Units, and the user agent currently using the website
 *
 * @author:  Shahbaz Mogal <mogals@msoe.edu>
 * @since:   2020-02-18
 */

import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { unitInterface } from "../Unit/unitInterface";
import { agentInterface } from "../Agent/agentInterface";

export const query = gql`
  query($token: String) {
    viewer(token: $token) {
      allResourceClassifications {
        id
        name
        unit {
          name
          symbol
        }
        image
      }
      myAgent {
        ...agentInterface
      }

      allUnits {
        ...unitInterface
      }
    }
  }
  ${unitInterface}
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
      allResourceClassifications: viewer
        ? viewer.allResourceClassifications
        : null,
      agent: viewer ? viewer.myAgent : null,
      unitList: viewer ? viewer.allUnits : null
    })
  })
);
