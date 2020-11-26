// /**
//  * HoC to load members for an Agent (Organisation)
//  *
//  * @package: REA app
//  * @author:  pospi <pospi@spadgos.com>
//  * @since:   2017-06-23
//  */

// import { connect } from 'react-redux'
// import { gql, graphql, compose } from 'react-apollo'


// import { coreAgentFields, coreOrganizationFields } from '../_fragments/Agent'

// const query = gql`
// query($token: String, $agentId_Members: Int) {
//   viewer(token: $token) {
//     Agent(id: $agentId_Members) {
//       id
//       ...on Organization {
//         members {
//           ...coreAgentFields
//           ...on Organization {
//             ...coreOrganizationFields
//           }
//         }
//       }
//     }
//   }
// }
// ${coreAgentFields}
// ${coreOrganizationFields}
// `

// export default compose(
//   // bind input data from the store
//   connect((state) => ({
//     variables: {
//       token: state.getUserInfo.currentUserToken,
//     },
//   })),
//   graphql(query, {
//     // read query vars into query from input data above
//     options: (props) => ({ variables: {
//       ...props.variables,
//       agentId_Members: props.agentId,
//     } }),
//     // transform output data
//     props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
//       loading,
//       error,
//       refetchMembers: refetch,  // :NOTE: call this in the component to force reload the data
//       members: viewer ? viewer.Agent.members : null,
//     }),
//   })
// )
