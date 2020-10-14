import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Users from "./components/users";
import Register from "./components/register"
import LogOut from "./components/logout";
import NotFound from "./components/notfound"

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/logout">
            <LogOut />
          </Route>
          <Route path="/top">
            <Home posts="top" />
          </Route>
          <Route path="/controversial">
            <Home posts="controversial" />
          </Route>
          <Route exact path="/">
            <Home posts="hot" />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}
