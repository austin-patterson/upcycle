import { graphql } from "react-apollo";
import { connect } from "react-redux";
import React from "react";
import getMyAgent from "../queries/Agent/getMyAgent";
import "semantic-ui-css/semantic.min.css";
import { withRouter } from "react-router-dom";
import { Item, Loader } from "semantic-ui-react";

// import { DiscussionEmbed } from "disqus-react";
import { query as GetEconomicResourceByIDQuery } from "../queries/EconomicResource/getEconomicResourceById";

import { isNullOrUndefined } from "util";

let default_image = require("../resources/default_resource_img.jpg");
let orgId = -1;

const GetConnected = getMyAgent(({ agent, loading, error, setConnected }) => {
  if (loading) {
    return <Loader>Loading</Loader>;
  } else if (error) {
    return <p style={{ color: "#F00" }}>API error</p>;
  } else {
    for (let i = 0; i < agent.agentRelationships.length; i++) {
      if (agent.agentRelationships[i].object.id === orgId) {
        setConnected(true);
      }
    }
    return <div />;
  }
});

//TODO: Replace hardcoded token by fetching actual token

const ItemInfoQuery = (props) => {
  props.data.variables = {
    EconomicResourceId: props.EconomicResouceId,
    token: props.currentUserToken,
  };
  props.data.refetch(props.data.variables);
};

export class ItemInfoCard extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-unused-vars
    let image = "";
    this.state = {
      image: "",
      trackingIdentifier: "",
      note: "",
      numericValue: "",
      unitName: "",
      createdDate: "",
      stateSet: false,
    };
  }
  setConnected = (connected) => {
    if (this.state.connected !== connected) {
      this.setState({ connected: connected });
    }
  };
  loadData = () => {
    ItemInfoQuery(this.props);
    if (!this.props.data.loading && !this.props.data.error) {
      if (!this.state.stateSet) {
        this.setState({
          image: this.props.data.viewer.economicResource.image,
          trackingIdentifier: this.props.data.viewer.economicResource
            .trackingIdentifier,
          note: this.props.data.viewer.economicResource.note,
          numericValue: this.props.data.viewer.economicResource.currentQuantity
            .numericValue,
          unitName: this.props.data.viewer.economicResource.currentQuantity.unit
            .name,
          createdDate: this.props.data.viewer.economicResource.createdDate,
          stateSet: true,
        });
      }
    }
    // eslint-disable-next-line no-unused-vars
    let itemID = this.props.EconomicResouceId;
  };
  render() {
    // let DISQUS_SITENAME = "http://learndeepmkedev.com/"
    //TODO: Change this next variable to 'development/', if in dev environment, and playing around
    // But not that you won't be able to moderate (delete comments) in a dev DISQUS config so make sure
    // this is an empty string '' if switching to prod environment.
    // Only workaround to moderate this would be to delete the whole item, and thereby lose all comments
    // let NODE_ENV = ''
    // let URL = DISQUS_SITENAME + NODE_ENV + "orginventory/" + this.props.EconomicResouceId;
    // console.log(URL)
    return (
      <div className="ui container">
        <GetConnected setConnected={this.setConnected} />
        <Item className={""}>
          <Item.Image
            className={"ui small rounded image"}
            src={
              isNullOrUndefined(this.state.image) || this.state.image === ""
                ? default_image
                : this.state.image
            }
            onError={(i) => (i.target.src = default_image)}
          />
          {this.loadData()}
          <Item.Content>
            <Item.Header as="h1">{this.state.trackingIdentifier}</Item.Header>
            <Item.Description>
              <p>
                {this.state.note === ""
                  ? "(no description available)"
                  : this.state.note}
              </p>
              <p>
                Quantity: {this.state.numericValue} {this.state.unitName}(s)
              </p>
              <p>Added on: {this.state.createdDate}</p>
            </Item.Description>
          </Item.Content>
        </Item>
        {/*<DiscussionEmbed*/}
        {/*  shortname="shahbazupcycle"*/}
        {/*  config={{ url: URL }}*/}
        {/*/>*/}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentUserToken: state.getUserInfo.currentUserToken,
  };
}
export default withRouter(
  connect(mapStateToProps)(graphql(GetEconomicResourceByIDQuery)(ItemInfoCard))
);
