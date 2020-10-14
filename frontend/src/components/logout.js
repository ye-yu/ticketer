import React from "react";
import { Redirect } from "react-router-dom";
import Requests from "../requests";

export default class LogOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Logging out...",
      redirect: ""
    };
  }
  componentDidMount() {
    Requests.Server.sendGetRequest(Requests.logout, {},
      (success) => this.setState({redirect: "/"}),
      (err) => {
        let reason = err ? err.content.reason : "Cannot extract the reason.";
        this.setState({
          message: `[${err.status}] ${reason}`
        });
      }
    )
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    return <div className="w-100 text-center h2">{this.state.message}</div>
  }
}
