import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import OrganizationCatalog from "./pages/OrganizationCatalog.js";
import OrganizationInventory from "./pages/Organizations/organizationInventory";
import ErrorPage from "./pages/ErrorPage.js";
import LoginPage from "./pages/LoginPage.js";
import ProtectedRoute from "./ProtectedRoute.js";
import OrganizationRegistration from "./pages/Organizations/organizationRegistration";
import IndividualRegistration from "./pages/Individuals/individualRegistration";
import orgEdit from "./pages/Organizations/organizationEdit";
import Header from "./pages/Header/Header.js";
import ItemCatalog from "./pages/ItemCatalog";
import ItemPage from "./pages/ItemPage";
import UnitPage from "./pages/Api/unit";
import OrgTypePage from "./pages/Api/orgType";
import ProcessClassificationPage from "./pages/Api/processClassification";
import OrganizationPage from "./pages/Api/organization";
import EconomicResourcePage from "./pages/Api/economicResource";
import AgentRelationship from "./pages/Api/agentRelationship";
import AgentPage from "./pages/Api/agent";
import Process from "./pages/Api/process";
import Plan from "./pages/Api/plan";
import PersonPage from "./pages/Api/person";
import EconomicEvent from "./pages/Api/EconomicEvent";
import CreateEconomicEvent from "./pages/Api/CreateEconomicEvent";
import AgentRelationshipRoles from "./pages/Api/AgentRelationshipRole";
import CreateInventoryItem from "./pages/Inventory/createInventoryItem";

class Routes extends Component {
  render() {
    return (
      /**
       * Note: The "exact" attribute in the routes checks for an exact match of the path URL
       * Without that attribute the router only looks for a minimum match, and ignores the
       * rest of the URL. For example, if the browser is pointed to "/about", the router
       * finds a match with "/" as it is the first character in the URL and renders the home
       * page.
       */
      <div>
        {/*<Header/>*/}
        <Route
          path="/"
          render={(props) =>
            props.location.pathname.toLowerCase() !== "/login" &&
            props.location.pathname.toLowerCase() !== "/registerindividual" && (
              <Header />
            )
          }
        />
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route
            exact
            path="/RegisterIndividual"
            component={IndividualRegistration}
          />
          <ProtectedRoute
            exact
            path="/RegisterOrg"
            component={OrganizationRegistration}
          />
          <ProtectedRoute exact path="/EditOrg/:id" component={orgEdit} />
          <ProtectedRoute
            exact
            path="/OrgInventory/:id"
            component={OrganizationInventory}
          />
          <ProtectedRoute
            exact
            path="/orginventory/Item/:id"
            component={ItemPage}
          />
          <ProtectedRoute exact path="/" component={OrganizationCatalog} />
          <Route
            exact
            path="/RegisterIndividual"
            component={IndividualRegistration}
          />
          <ProtectedRoute exact path="/ItemCatalog" component={ItemCatalog} />
          {/*Below here are the api pages*/}
          <Route path="/api/processClassification" component={ProcessClassificationPage}/>
          <Route path="/api/unit" component={UnitPage}/>
          <Route path="/api/orgType" component={OrgTypePage}/>
          <Route path="/api/agent" component={AgentPage}/>
          <Route path="/api/organization" component={OrganizationPage}/>
          <Route path="/api/economicresource" component={EconomicResourcePage}/>
          <Route path="/api/agentrelationship" component={AgentRelationship}/>
          <Route path="/api/process" component={Process}/>
          <Route path="/api/plan" component={Plan}/>
          <Route path="/api/person" component={PersonPage}/>
          <Route path="/api/agentrelationshiprole" component={AgentRelationshipRoles}/>
          <Route path="/api/createeconomicevent" component={CreateEconomicEvent}/>
          <Route path="/api/economicevent" component={EconomicEvent}/>

          <Route component={ErrorPage} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
