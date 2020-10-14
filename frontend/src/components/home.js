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
      <div className="container mt-md-5 mt-3">
        <div className="row">
          <div className="col px-4">
            <div className="d-flex flex-column flex-md-row px-3 bg-white border bg-white border rounded-lg">
              <div className="h4 mr-md-auto text-center py-3 my-0 d-none d-md-inline ml-3">Activity</div>
              <div className="d-flex d-md-inline justify-content-around py-3">
                <a className="hover-bg-border-danger border rounded-left px-3 py-2 small">
                  Hot Tickets
                </a>
                <a className="hover-with-border-primary border rounded-0 px-3 py-2 small">
                  Top Community
                </a>
                <a className="hover-with-border-dark border rounded-right mr-md-3 mr-1 px-3 py-2 small">
                  Controversial
                </a>
              </div>
            </div>
          </div>
          <div className="col-3 d-none d-lg-block">
            <div className="bg-white border rounded-lg d-flex flex-column">
              <div className="h4 border-bottom py-3 px-3">What do I do?</div>
              <div href="#" className="py-2 px-3">
                Vote on a ticket
              </div>
              <a href="#" className="d-block py-2 px-3">
                Post your first ticket
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
