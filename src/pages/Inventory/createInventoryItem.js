import React from "react";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import "semantic-ui-css/semantic.min.css";
import { withRouter } from "react-router-dom";
import {
  Form,
  Button,
  Grid,
  Header,
  Segment,
  Image,
  Label,
  Message,
  Modal,
} from "semantic-ui-react";
import CreateEconomicEvent from "../../queries/EconomicEvent/CreateEconomicEvent";
import UpdateEconomicResource from "../../queries/EconomicResource/updateEconomicResource";
import CreateUnit from "../../queries/Unit/createUnit";
import GetMyAgent from "../../queries/Agent/getMyAgent";
import GetAllResourceClassificationsAllUnitsMyAgent from "../../queries/CreateInventoryItemComponentQueries/getAllResourceClassificationsAllUnitsMyAgent";

let default_image = require("../../resources/default_resource_img.jpg");

/**
 * A map of the Mutation Variables to be passed into createEconomicEvent mutation
 */
let mutationVars = [];
// The following lines are mainly for documentation purposes, and are being initialized
// as undefined, to be used later.
mutationVars["name"] = undefined;
mutationVars["receiverId"] = undefined;
mutationVars["createResource"] = undefined;
mutationVars["resourceImage"] = undefined;
mutationVars["affectedUnitId"] = undefined;
mutationVars["resourceNote"] = undefined;
mutationVars["note"] = undefined;
mutationVars["resourceNote"] = undefined;
mutationVars["action"] = undefined;
mutationVars["affectedNumericValue"] = undefined;
mutationVars["resourceTrackingIdentifier"] = undefined;
mutationVars["scopeId"] = undefined;
mutationVars["providerId"] = undefined;
mutationVars["affectedResourceClassifiedAsId"] = undefined;

let resourceClassificationDropdown = undefined; //Will be defined in componentDidMount

class CreateInventoryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: default_image,
      orgId: this.props.orgId,
      name: "",
      resourceClassification: "",
      notes: "",
      quantity: "",
      units: "",
      errorMessageList: [],
    };
    this.resourceClassificationList = undefined;
    //TODO: Check if need to set it back to false again after component is closed since what if they wanna try again
    this.attemptedToSubmit = false;
    this.formSubmitted = false;
    this.numberOfSubmitAttempts = 0;
  }

  GetResourceClassificationDropdown = () => {
    if (this.props.loading) {
      //TODO_Shahbaz: Change this to a message on UI
    } else if (this.props.error) {
    } else {
      this.resourceClassificationList = [];
      // Generating unique_ids for dropdown labels as React requires it.
      let unique_id = 0;
      // Note that we're storing the whole event, ie, the resourceClassification
      // object as the value so you can always come back and refer to it and get
      // other info about the classification object
      this.props.allResourceClassifications.forEach(
        (resourceClassificationObject) => {
          // Known warning: passing event object as value throws warning becuase value expects
          // a string, but we pass in object because we need to query it later.
          this.resourceClassificationList.push({
            key: resourceClassificationObject.id,
            text: resourceClassificationObject.name,
            value: resourceClassificationObject,
          });
          unique_id += 1;
        }
      );
    }
  };

  setMutationVariablesFromUserInput() {
    mutationVars["name"] = this.state.name;
    mutationVars["receiverId"] = this.state.orgId;
    mutationVars["createResource"] = true;
    mutationVars["resourceImage"] = this.state.image;
    mutationVars["affectedUnitId"] = this.getUnitsID();
    mutationVars["note"] = this.state.notes;
    mutationVars["resourceNote"] = this.state.notes;
    mutationVars["action"] = "produce";
    mutationVars["affectedNumericValue"] = this.state.quantity;
    mutationVars["resourceTrackingIdentifier"] = this.state.name;
    mutationVars["scopeId"] = this.state.orgId;
    mutationVars["providerId"] = this.props.agent.id;
    mutationVars[
      "affectedResourceClassifiedAsId"
    ] = this.getResourceClassificationID(this.state.resourceClassification);
    mutationVars["affectedNumericValue"] = this.state.quantity;
    mutationVars["resourceImage"] = this.state.image;
  }

  //TODO: Handle if returns -1
  getResourceClassificationID = (resourceClassificationName) => {
    let resourceClassificationID = -1;
    if (this.props.loading) {
    } else if (this.props.error) {
    } else {
      let listOfResourceClassificationObjects = this.props
        .allResourceClassifications;
      let i = 0;
      for (i = 0; i < listOfResourceClassificationObjects.length; i++) {
        if (
          resourceClassificationName ==
          listOfResourceClassificationObjects[i].name
        ) {
          resourceClassificationID = listOfResourceClassificationObjects[i].id;
        }
      }
    }
    return resourceClassificationID;
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  onImageSelected = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({ image: reader.result, error: false });
    };
    reader.onerror = (error) => {
      //TODO: Handle Error
    };
  };

  handleOnChangeDropdown = (event, data) => {
    // TODO: This is a problematic way of changing unit value, as it isn't currently being done through
    // the state. But to do it through the state, we need to be able to lookup the schema ID for a
    // classification so we can query and see what its units are. But since the schema doesn't
    // currently allow it, we're doing this in an unorthodox way.
    let resourceClassificationObject = data.value;
    this.setState({
      resourceClassification: resourceClassificationObject.name,
      units: resourceClassificationObject.unit.name,
    });
    if (resourceClassificationObject.unit) {
      this.setState({
        units: resourceClassificationObject.unit.name,
      });
    }
    if (
      resourceClassificationObject.image &&
      resourceClassificationObject.image !== ""
    ) {
      this.setState({ image: resourceClassificationObject.image });
    }
  };

  handleSubmit = () => {
    // Call function to set all the mutation variables
    // Check inputs valid
    // If unit exists, associate. If doesn't exist, create new unit and associate
    // Create event (resource)
    this.attemptedToSubmit = true;
    this.numberOfSubmitAttempts += 1;
    if (!this.props.loading && !this.props.error && !this.formSubmitted) {
      this.validateInput();
      if (this.state.errorMessageList.length == 0) {
        this.setMutationVariablesFromUserInput();
        this.createInventoryItem();
        //State state to true and display message
        this.acknowledgeFormSubmit();
      } else {
        //this.displayErrorMessages();
      }
    }
    // To ensure any error messages are displayed
    this.forceUpdate();
  };

  validateInput = () => {
    this.state.errorMessageList = [];
    if (this.state.name == "") {
      this.state.errorMessageList.push("\nPlease enter a name for the item. ");
    }
    if (this.state.resourceClassification == "") {
      this.state.errorMessageList.push(
        "\nPlease select a resource classification type. "
      );
    }
    if (this.state.quantity == "") {
      this.state.errorMessageList.push("\nPlease enter a quantity. ");
    }
  };

  createInventoryItem = () => {
    this.props
      .createEconomicEvent({ variables: mutationVars })
      .then(() => {})
      .catch((error) => {});
  };

  acknowledgeFormSubmit = () => {
    this.formSubmitted = true;
    // To ensure the form submit div gets rendered
    this.forceUpdate();
  };

  onClose = () => {
    window.location.reload();
  };

  /**
   * If the unit exists in the database, we populate the state with the corresponding unit object.
   * If the unit doesn't exist, we create a unit in the database, and then associate the entry
   * with it.
   */
  getUnitsID = () => {
    let unitID = -1;
    if (this.props.GetAllUnitsQueryLoading) {
    } else if (this.props.GetAllUnitsQueryError) {
    } else {
      let listOfUnitObjectsInDB = this.props.unitList;
      let userUnitInput = this.state.units;
      if (
        this.unitExistsInDatabase(userUnitInput, listOfUnitObjectsInDB) == false
      ) {
        this.createUnitInDB(userUnitInput);
      }
      let i = 0;
      for (i = 0; i < listOfUnitObjectsInDB.length; i++) {
        let unitObject = listOfUnitObjectsInDB[i];
        if (unitObject.name.toLowerCase() == userUnitInput.toLowerCase()) {
          unitID = unitObject.id;
        }
      }
    }
    return unitID;
  };

  /**
   * Checks if the unit the user typed is already stored in the database
   */
  unitExistsInDatabase = (userUnitInput, listOfUnitObjectsInDB) => {
    let unitExistsInDatabase = false;
    let i = 0;
    for (i = 0; i < listOfUnitObjectsInDB.length; i++) {
      let unitObject = listOfUnitObjectsInDB[i];
      if (unitObject.name.toLowerCase() == userUnitInput.toLowerCase()) {
        unitExistsInDatabase = true;
      }
    }
    return unitExistsInDatabase;
  };

  createUnitInDB = (unitName) => {
    let unitMutationVars = [];
    unitMutationVars["name"] = unitName;
    unitMutationVars["symbol"] = unitName;
    this.props.createUnit({ variables: unitMutationVars }).catch((error) => {
      //TODO_Shahbaz: Handle Error
    });
    //this.props.CreateUnit();
  };

  //Rerun this.GetResourceClassificationDropdown() everytime re-rendered so that we have latest
  //data. Especially important when data changes from loading to loaded.
  render() {
    return (
      <Modal
        trigger={
          <Button className="ui right floated primary">Create Item</Button>
        }
        basic
        closeIcon
        centered
        onClose={this.onClose}
      >
        <Modal.Content>
          <div className="createItem">
            <style>
              {`
                body > div,
                body > div > div,
                body > div > div > div.createItem {
                    height: 100%;
                }
            `}
              {mutationVars["providerId"] === undefined ? (
                <GetMyAgent />
              ) : (
                <div />
              )}
            </style>
          </div>
          <Grid
            textAlign="center"
            style={{ height: "100%" }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" textAlign="center" color="blue">
                Create an Item
              </Header>
              <Form size="large" onSubmit={this.handleSubmit}>
                <Segment stacked>
                  <Form.Field>
                    <Form.Input
                      fluid
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  {this.GetResourceClassificationDropdown()}
                  <Form.Select
                    fluid
                    id={"typeDropdown"}
                    placeholder="Choose a resource classification"
                    options={this.resourceClassificationList}
                    onChange={this.handleOnChangeDropdown}
                  />
                  <Form.Field>
                    <Form.Input
                      fluid
                      placeholder="Notes"
                      name="notes"
                      value={this.state.notes}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Grid>
                      <Grid.Column floated="left" width={7}>
                        <Form.Input
                          fluid
                          placeholder="Quantity"
                          name="quantity"
                          right="true"
                          value={this.state.quantity}
                          onChange={this.handleChange}
                        />
                      </Grid.Column>
                      <Grid.Column floated="right" width={9}>
                        <Form.Input
                          fluid
                          placeholder="Units"
                          name="units"
                          left="true"
                          value={this.state.units}
                          onChange={this.handleChange}
                        />
                      </Grid.Column>
                    </Grid>
                  </Form.Field>
                  <Form.Field>
                    <Image src={this.state.image} size="small" centered />
                  </Form.Field>
                  <Form.Field>
                    <Grid centered>
                      <Grid.Column textAlign={"center"}>
                        <Label
                          as="label"
                          htmlFor="imageButton"
                          size="large"
                          width={6}
                        >
                          Upload Image
                        </Label>
                        <input
                          id="imageButton"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(event) => this.onImageSelected(event)}
                        />
                      </Grid.Column>
                    </Grid>
                  </Form.Field>
                  <Button color="blue" fluid type="submit" size="large">
                    Create
                  </Button>
                </Segment>
              </Form>
              {this.attemptedToSubmit &&
              this.state.errorMessageList.length > 0 ? (
                <Message
                  color="red"
                  error
                  visible
                  content={this.state.errorMessageList}
                />
              ) : (
                <div />
              )}
              {this.formSubmitted ? (
                <Message color="green" error visible content={"Item Created"} />
              ) : (
                <div />
              )}
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withRouter(
  UpdateEconomicResource(
    CreateUnit(
      CreateEconomicEvent(
        GetAllResourceClassificationsAllUnitsMyAgent(CreateInventoryItem)
      )
    )
  )
);
