import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes.js";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import configureStore from "./redux/store/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

// Redux commands: Creates redux store (common state tree throughout the app)
let storeAndPersistor = configureStore();
const store = storeAndPersistor.store;
// Redux persistor helps save data even when browser is closed
const persistor = storeAndPersistor.persistor;

//Setting up GraphQL connection
const client = new ApolloClient({ uri: "http://sdlupcycling.pythonanywhere.com/api/graph" });

// Renders the app
ReactDOM.render(
  // BrowserRouter: React Router (uses route.js)
  // Provider: Redux provider makes the store available to everything it encompasses (Refer to src/redux)
  // PersistGate: Redux that delays rendering off the app's UI until after the state has loaded
  // ApolloProvider: GraphQL
  // Routes: Basically gets replaced with the routes.js file, which is like a big switch and only
  // one component gets loaded based on what URL you're on
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <Routes />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
