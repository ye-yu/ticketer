import React from "react";
import Alert from "react-bootstrap/Alert";
import Requests from "../../requests.js";
import { Redirect } from "react-router-dom";

const validate = require("email-validator").validate;

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      em: "",
      pw: "",
      isWaitingResponse: false,
      errorMessage:""
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleInputs(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleButton(event, keepSession) {
    let loginInfo = {
      em: this.state.em,
      pw: this.state.pw,
      ks: keepSession
    }
    Requests.Server.sendPostRequest(Requests.login, loginInfo,
      (successful) => {
        window.location.reload(false);
      },
      (err) => {
        let reason = err.content ? err.content.reason : "Cannot extract the reason.";
        this.setState({
          isWaitingResponse: false,
          errorMessage: `[${err.status}] ${reason}`
        });
      }
    );
  }

  disableButton() {
    return !validate(this.state.em) || this.state.pw.length < 10
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    let loginForm = <form>
      <div className="form-group">
        <input type="email" className="form-control form-control-sm rounded-0" id="emailLogin" name="em" placeholder="Enter email" onChange={this.handleInputs} />
        <input type="password" className="form-control form-control-sm rounded-0 border-top-0" id="passwordLogin" name="pw" placeholder="Password" onChange={this.handleInputs} />
      </div>
      <div className="form-group">
      </div>
      <div className="d-flex">
        <button type="button" className="btn btn-primary btn-sm py-1 small ml-auto mr-2" disabled={this.disableButton()} onClick={(e) => this.handleButton(e, true)}>Login and Keep Session</button>
        <button type="button" className="btn btn-primary btn-sm py-1 small" disabled={this.disableButton()} onClick={(e) => this.handleButton(e, false)}>Login</button>
      </div>

      <div className="mt-3">
        <Alert show={this.state.errorMessage} variant="danger">
          <div className="d-flex">
            <div className="flex-fill">
              <small>{this.state.errorMessage}</small>
            </div>
            <div>
              <a href="#close" className="text-danger" onClick={() => this.setState({errorMessage:""})}>
              &times;
              </a>
            </div>
          </div>
        </Alert>
      </div>
    </form>;

    return <div className="bg-white border rounded">
      <div className="d-none d-md-block">
        <div className="px-3 py-4 shadow-sm">
          {loginForm}
        </div>
      </div>
      <div className="d-block d-md-none container py-3 px-5 w-100 shadow-sm">
        {loginForm}
      </div>
    </div>;
  }
}
