import React from "react";
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
      <Header section="Home" />
      <div className="container mt-md-5">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-column flex-md-row">
              <div className="h3 mr-md-auto text-center py-3">Activity</div>
              <div className="d-flex d-md-inline justify-content-around py-3">
                <button className="btn btn-danger btn-sm rounded-pill mx-1 px-3">
                  Hot Tickets
                </button>
                <button className="btn btn-outline-primary btn-sm rounded-pill mx-1 px-3">
                  Top Community
                </button>
                <button className="btn btn-outline-dark btn-sm rounded-pill mx-1 px-3">
                  Controversial
                </button>
              </div>
            </div>
          </div>
          <div className="col-3 d-none d-lg-block px-4 pt-3">
            <div className="h3">What do I do?</div>
          </div>
        </div>
      </div>
    </div>;
  }
}
