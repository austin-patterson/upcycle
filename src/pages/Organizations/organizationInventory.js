/**
 * Form that displays the inventory of a current organization
 *
 * @author Donal Moloney
 * @date March 23, 2019
 */
import React from "react";
import "semantic-ui-css/semantic.min.css";
import getOrganizationById from "../../queries/Organization/getOrganizationById.tsx";
import getEconomicResourceById from "../../queries/EconomicResource/getEconomicResourceById.tsx";
import { Item, Button, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import EditInventoryItem from "../Inventory/EditInventoryItem";
import getMyAgent from "../../queries/Agent/getMyAgent";

import { withRouter } from "react-router-dom";
import CreateInventoryItem from "../Inventory/createInventoryItem";

let default_image = require("../../resources/default_resource_img.jpg");
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

/**
 * Gets an organizations data
 */
export const GetSingleOrganization = getOrganizationById(
  ({ organization, loading, error, connected, history }) => {
    if (loading) {
      return <Loader>Loading</Loader>;
    } else if (error) {
      return <p style={{ color: "#F00" }}>API error</p>;
    } else {
      let economicResourceList = organization.ownedEconomicResources;
      return (
        <div>
          <h2 className="ui header">{organization.name} Inventory</h2>

          {connected ? <CreateInventoryItem orgId={orgId} /> : <div />}

          <Item.Group divided>
            {economicResourceList.length === 0 ? (
              <p>Inventory Empty</p>
            ) : (
              economicResourceList.map((economicResource) => (
                <GetSingleEconomicResource
                  economicResourceId={economicResource.id}
                  connected={connected}
                  history={history}
                />
              ))
            )}
          </Item.Group>
        </div>
      );
    }
  }
);

/**
 * Gets a single economic resource that the organization owns
 */
export const GetSingleEconomicResource = getEconomicResourceById(
  ({ economicResource, loading, error, connected, history }) => {
    if (loading) {
      return <Loader>Loading</Loader>;
    } else if (error) {
      return <p style={{ color: "#F00" }}>API error</p>;
    } else {
      return (
        <EconomicResource
          economicResource={economicResource}
          connected={connected}
          history={history}
        />
      );
    }
  }
);

/**
 * Formats economicresource data
 */
export const EconomicResource = (props) => {
  let economicResource = props.economicResource;
  let itemPageUrl = "/orginventory/Item/" + economicResource.id;
  console.log(props.history);
  return (
    <Item className={""}>
      <Item.Image
        className={"ui small rounded image"}
        src={
          !economicResource ||
          economicResource.image === ""
            ? default_image
            : economicResource.image
        }
        onError={(i) => (i.target.src = default_image)}
      />
      <Item.Content>
        <Item.Header as="h1">{economicResource.trackingIdentifier}</Item.Header>
        <Item.Description>
          <p>
            {economicResource.note === ""
              ? "(no description available)"
              : economicResource.note}
          </p>
          <p>
            Quantity: {economicResource.currentQuantity.numericValue}{" "}
            {economicResource.currentQuantity.unit.name}(s)
          </p>
          <p>Added on: {economicResource.createdDate}</p>
        </Item.Description>
        <Item.Extra>
          {props.connected ? (
            <EditInventoryItem
              orgId={orgId}
              resource={props.economicResource}
            />
          ) : (
            <div />
          )}
        </Item.Extra>
        <Item.Extra>
          <Button
            className="ui right floated primary"
            onClick={() => {
              props.history.push(itemPageUrl);
              window.location.reload();
            }}
          >
            Discuss
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

class OrganizationInventory extends React.Component {
  state = {
    connected: false,
  };

  setConnected = (connected) => {
    if (this.state.connected !== connected) {
      this.setState({ connected: connected });
    }
  };
  render() {
    orgId = this.props.match.params.id;

    return (
      <div className="ui container">
        <GetConnected setConnected={this.setConnected} />
        <GetSingleOrganization
          organizationId={orgId}
          connected={this.state.connected}
          history={this.props.history}
        />
      </div>
    );
  }
  componentDidUnmount = () => {
    console.log("Should Reload");
    window.location.reload();
  };
}

function mapStateToProps(state) {
  return {
    currentUserToken: state.getUserInfo.currentUserToken,
  };
}

export default withRouter(connect(mapStateToProps)(OrganizationInventory));
