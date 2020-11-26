/**
 * HoC to send currently active user data to UI
 *
 * @package: REA app
 * @author:  pospi <pospi@spadgos.com>
 * @since:   2017-04-24
 */

import { connect } from 'react-redux'
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import { coreAgentFields, coreOrganizationFields } from '../_fragments/Agent'

const query = gql`
query($token: String) {
  viewer(token: $token) {
    myAgent {
      ...coreAgentFields,
      agentRelationships {
        id
        relationship {
          label
          category
        }
        object {
          name
          type
          image
          id
        }
      }
    }
  }
}
${coreAgentFields}
`

export default compose(
  // bind input data from the store
  connect((state) => ({
    variables: {
      token: state.getUserInfo.currentUserToken,
    },
  })),
  graphql(query, {
    // read query vars into query from input data above
    options: (props) => ({ variables: props.variables }),
    // transform output data
    props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
      loading,
      error,
      refetchCurrentUser: refetch,  // :NOTE: call this in the component to force reload the data
      user: viewer ? viewer.myAgent : null,
    }),
  })
)
