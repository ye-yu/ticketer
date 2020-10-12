import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class Users extends React.Component {
  render() {
    return <div>
      <h1>Users</h1>
      <p>You are now viewing users</p>
    </div>;
  }
}
