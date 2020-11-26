import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Item, Form} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { isNullOrUndefined } from "util";
import getAllEconomicResources from "../queries/EconomicResource/getAllEconomicResources";
import {
  filterByDistance,
  filterByResourceClassification,
  sortByIdentifier
} from "../utilities";
import getAllResourceClassifications from "../queries/ResourceClassification/getAllResourceClassifications";

let default_image = require("../resources/defaultImage.jpg");
let msoeCC = { latitude: 43.044004, longitude: -87.90902 };
let resourceClassificationList = [];

class ItemCard extends React.Component {
  render() {
    return (
      <Item className={""}>
        <Item.Image
          className="ui small rounded image"
          src={
            isNullOrUndefined(this.props.item.image) ||
            this.props.item.image === ""
              ? default_image
              : this.props.item.image
          }
        />
        <Item.Content>
          <Item.Header as="h1">
            {this.props.item.trackingIdentifier}
          </Item.Header>

          <Item.Description>
            <p>
              {isNullOrUndefined(this.props.item.currentQuantity)
                ? "(no quantity on item)"
                : this.props.item.currentQuantity.numericValue}
            </p>
            <p>
              {isNullOrUndefined(this.props.item.note)
                ? "(no notes on item)"
                : this.props.item.note}
            </p>
          </Item.Description>
        </Item.Content>
      </Item>
    );
  }
}

// Unused as of 11/2020, commented out
// const optionSort = [
//   { key: "alp", text: "Alphabetical", value: "alphabetical" },
//   { key: "dis", text: "Distance", value: "distance" },
// ];

class ItemCatalog extends React.Component {
  constructor() {
    super();
    this.state = {
      sorting: "alphabetical",
      typeFilter: "",
      typeFilterId: "",
      distanceFilter: 50,
      load: true,
      nameFilter: "",
      userEnteredDistance: "",
    };
    this.filterAndSortItems = this.filterAndSortItems.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onDistanceFilterChange = this.onDistanceFilterChange.bind(this);
  }

  filterAndSortItems = function (economicResourceList) {
    let filteredItems = [];

    for (let item of economicResourceList) {
      let itemName = item.trackingIdentifier.toLowerCase();
      let stateItemName = this.state.nameFilter.toLowerCase();
      if (
          this.state.nameFilter === null ||
          this.state.nameFilter === "undefined" ||
          (itemName.includes(stateItemName) &&
              item.currentQuantity.numericValue > 0)
      ) {
        filteredItems.push(item);
      }
    }

    if (this.state.typeFilterId !== "") {
      filteredItems = filterByResourceClassification(
          filteredItems,
          this.state.typeFilterId
      );
    }

    if (this.state.distanceFilter !== "") {
      filteredItems = filterByDistance(
          filteredItems,
          this.state.distanceFilter,
          msoeCC
      );
    }

    if (this.state.sorting === "alphabetical") {
      filteredItems = sortByIdentifier(filteredItems);
    }

    const itemCardArray = filteredItems.map((item) => (
        <ItemCard item={item} history={this.props.history}/>
    ));

    return (
        <div>
          <Item.Group divided>{itemCardArray}</Item.Group>
        </div>
    );
  };

  handleReset = function (event) {
    //0 mean the enter key was hit
    if (event.detail !== 0) {
      this.setState({
        sorting: "alphabetical",
        typeFilter: "",
        typeFilterId: "",
        distanceFilter: 50,
        load: true,
        nameFilter: "",
        userEnteredDistance: ""
      });
    }
  };

  handleTypeChange = function (event) {
    let targetName = event.target.innerText;
    this.setState({typeFilter: targetName});
    let type = resourceClassificationList.find((resourceClassification) => {
      return resourceClassification.text === targetName;
    });
    this.setState({typeFilterId: type.key});
  };

  onNameChange = function (event) {
    this.setState({nameFilter: event.target.value});
  };

  onDistanceFilterChange = function(event) {
  // if (event.target.value === "") {
  //     this.setState({ distanceFilter: "", userEnteredDistance: ""});
  // } else {
  //     this.setState({
  //         distanceFilter: parseInt(event.target.value),
  //         userEnteredDistance: parseInt(event.target.value)
  //     });
  // }
  // const itemCardArray = filteredItems.map(item => (
  //     <ItemCard item={item} history={this.props.history}/>
  // ));
  // return (
  //     <div>
  //         <Item.Group divided>{itemCardArray}</Item.Group>
  //     </div>
  // );
}

  render() {
    const ItemList = getAllEconomicResources(
      ({ economicResourceList, loading, error }) => {
        if (loading) {
          console.log("LOADING");
          return <strong>Loading...</strong>;
        } else if (error) {
          console.log(error);
          return <p style={{ color: "#F00" }}>API error</p>;
        } else {
          console.log(ItemList);
          return this.filterAndSortItems(economicResourceList);
        }
      }
    );

    const ResourceClassificationList = getAllResourceClassifications(
        ({ allResourceClassifications, loading, error, onChange }) => {
          if (loading) {
            return (
                <Form.Select
                    fluid
                    label="Search For Type"
                    loading
                    text={"Loading"}
                    id={"ItemTypesDropdown"}
                />
            );
          } else if (error) {
            return (
                <Form.Select
                    fluid
                    label="Search For Type"
                    error
                    text={"Error Loading Item Types"}
                    id={"ItemTypesDropdown"}
                />
            );
          } else {
            let typeList = [];
            allResourceClassifications.forEach(event => {
              typeList.push({
                key: event.id,
                text: event.name,
                value: event.name
              });
            });
            resourceClassificationList = typeList;
            return (
                <Form.Select
                    fluid
                    label="Search For Type"
                    id={"ItemTypesDropdown"}
                    placeholder="Choose an Item Type"
                    value={this.state.typeFilter}
                    options={typeList}
                    onChange={this.handleTypeChange}
                />
            );
          }
        }
    );


    return (
      <div className={"ui container"}>
        <Form>
          <h2 className={"ui header"}>All Items</h2>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Search For Item"
              placeholder="Search"
              value={this.state.nameFilter}
              onChange={this.onNameChange}
            />
            <ResourceClassificationList/>
            <Form.Field>
              <Form.Input
                fluid
                label="Search Distance"
                placeholder="Initially 50 mi"
                value={this.state.userEnteredDistance}
                onChange={this.onDistanceFilterChange}
              />
            </Form.Field>
            <Form.Field>
              <Form.Button
                fluid
                label="Reset" // to line it up with the other elements
                className="ui negative"
                color={'red'}
                size={'large'}
                onClick={this.handleReset}>
                Reset filters
              </Form.Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <div className={"ui container"}>
          <ItemList />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUserToken: state.getUserInfo.currentUserToken,
  };
}

export default withRouter(connect(mapStateToProps)(ItemCatalog));
