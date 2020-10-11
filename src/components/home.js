import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from "./commons/header";

export default class Home extends React.Component {
  render() {
    return <div>
    <Header />
    <h1>Home</h1>
    </div>;
  }
}
