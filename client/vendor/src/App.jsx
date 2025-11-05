import React from "react";
import Layout from "./Layout";
import store from "./app/store";
import { Provider } from "react-redux";
import QueryProvider from "./provider/query-provider";

const App = () => {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Layout />
      </QueryProvider>
    </Provider>
  );
};

export default App;
