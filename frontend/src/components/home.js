import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from "./commons/header";

class ActivityBadge extends React.Component {
  render() {
    if (this.props.linkTo) return <a href={this.props.linkTo} className={this.props.classNameExtra + " d-inline-block border px-3 py-2 small"}>
      {this.props.title}
    </a>;
    return <div className={this.props.classNameExtra + " d-inline-block border px-3 py-2 small"}>
      {this.props.title}
    </div>
  }
}

export default class Home extends React.Component {
  render() {
    return <div>
      <Header section="Home" />
      <div className="container mt-md-5 mt-3">
        <div className="row">
          <div className="col px-4">
            <div className="d-flex flex-column flex-md-row px-3 bg-white border bg-white border rounded-lg">
              <div className="h4 mr-md-auto text-center py-3 my-0 d-none d-md-inline ml-3">Activity</div>
              <div className="d-flex d-md-inline justify-content-center py-3">
                {this.props.posts == "hot" ? <ActivityBadge classNameExtra="hover-bg-border-danger rounded-left" title="Hot Ticket" /> :  <ActivityBadge linkTo="/" classNameExtra="hover-with-border-danger rounded-left" title="Hot Ticket" />}
                {this.props.posts == "top" ? <ActivityBadge classNameExtra="hover-bg-border-primary rounded-0 border-left-0 border-right-0" title="Top Community" /> :  <ActivityBadge linkTo="/top" classNameExtra="hover-with-border-primary rounded-0 border-left-0 border-right-0" title="Top Community" />}
                {this.props.posts == "controversial" ? <ActivityBadge classNameExtra="hover-bg-border-warning rounded-right" title="Bad Reputation" /> :  <ActivityBadge linkTo="/controversial" classNameExtra="hover-with-border-warning rounded-right" title="Bad Reputation" />}

              </div>
            </div>
          </div>
          <div className="col-3 d-none d-lg-block">
            <div className="bg-white border rounded-lg d-flex flex-column">
              <div className="h4 border-bottom py-3 text-center bg-light shadow-sm">What do I do?</div>
              <div href="#" className="py-1 px-3 small">
                Vote on a ticket
              </div>
              <a href="#" className="d-block pt-1 pb-3 px-3 small">
                Post your first ticket
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
