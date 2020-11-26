import React from "react";
import "semantic-ui-css/semantic.min.css";
import { withRouter } from "react-router-dom";
import ItemInfoCard from "./ItemCard";
import { Item, Button, Loader } from "semantic-ui-react";

class ItemPage extends React.Component {
  state = {
    connected: false,
  };

 

  render() {
    return <ItemInfoCard EconomicResouceId={this.props.match.params.id} />;
  }
}

export default withRouter(ItemPage);
