import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { AppContext } from "./components/Context";
import Main from "./containers/Main";

function App() {
  return (
    <AppContext>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Redirect to={`/${uuid()}`} />
          </Route>
          <Route path="/:roomId" component={Main} />
        </Switch>
      </BrowserRouter>
    </AppContext>
  );
}

export default App;
