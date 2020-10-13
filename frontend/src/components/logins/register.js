import React from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "../commons/header.js";
import Requests from "../../requests.js";
const validate = require("email-validator").validate;

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dn: "",
      em: "",
      pw: "",
      isWaitingResponse: false,
      errorMessage: undefined,
      redirect: undefined
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleInputs(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleButton(button) {
    this.setState({
      isWaitingResponse: true,
      errorMessage: undefined
    });
    Requests.Server.sendPostRequest(Requests.register, {...this.state},
      (successful) => {
        this.setState({
          isWaitingResponse: false,
          errorMessage: undefined,
          redirect: "/"
        });
      },
      (err) => {
        let reason = err ? err.content.reason : "Cannot extract the reason.";
        this.setState({
          isWaitingResponse: false,
          errorMessage: `[${err.status}] ${reason}`
        });
      }
    );

    setTimeout(() => {
      if (this.state.isWaitingResponse) {
        this.setState({
          isWaitingResponse: false,
          errorMessage: "Server is not responding"
        });
      }
    }, 36000);
  }

  disableButton() {
    return !this.state.dn || !this.state.em || !this.state.pw || !this.isEmailValid(this.state.em) || !this.isPasswordValid(this.state.pw) || this.state.isWaitingResponse;
  }

  isEmailValid(emailStr) {
    return validate(emailStr);
  }

  isPasswordValid(pw) {
    return pw.length >= 10;
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />
    let error = this.state.errorMessage ? <div className="small alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Error in sending request:</strong> {this.state.errorMessage}
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div> : "";
    return <div>
      <Header simple={true} section="Register" />
      <div className="container">
        <div className="row mt-5 px-5 py-3">
          <div className="col-lg-1 d-none d-lg-block"></div>
          <div className="col-lg-4 col shadow rounded bg-light">
            <div className="py-4">
              <div className="pt-3 pb-5 text-center d-block d-lg-none">
                <div className="pl-3">
                  <span className="h6 text-center font-weight-bold">Register now to unlock ticketer services:</span>
                  <div className="small pt-3 mx-5">
                    Build project <br />
                    Vote and comment tickets <br />
                    Gain reputations <br />
                    Use reputation points to bump stale tickets <br />
                    Recruit contributors for a ticket <br />
                    Hide votes to prevent voting biases <br />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registerName"><b>Display Name</b></label>
                <input type="text" className="form-control form-control-sm" name="dn" id="registerName" placeholder="Enter name" onChange={this.handleInputs} />
              </div>
              <div className="form-group">
                <label htmlFor="registerEmail"><b>Email address</b></label>
                <input type="email" className="form-control form-control-sm" name="em" id="registerEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInputs} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword"><b>Password</b></label>
                <input type="password" className="form-control form-control-sm" name="pw" id="registerPassword" placeholder="Password" minLength="10" onChange={this.handleInputs} />
              </div>
              <small id="notice" className="form-text text-muted text-center py-3">By registering, you agree to the Terms & Conditions and Privacy Policy.</small>
              {error}
              <button type="button" className="btn btn-primary btn-sm btn-block py-2" disabled={this.disableButton()} onClick={this.handleButton}>Submit</button>
              <button type="button" className="btn btn-outline-primary btn-sm btn-block py-2">Cancel</button>
            </div>
          </div>

          <div className="col-lg-7 d-none d-lg-block pt-5 px-5">
            <div className="h5 pl-3 py-3" style={{lineHeight: "2rem"}}>
              Ticketer makes feature request tickets and issue tickets more visible and personalised to the target audience.
            </div>

            <div className="pl-3 pt-3 pb-5" style={{lineHeight: "1.5rem"}}>
              <span className="font-weight-bold">Register now to unlock ticketer services:</span>
              <ul>
                <li>Build project</li>
                <li>Vote and comment tickets</li>
                <li>Gain reputations</li>
                <li>Use reputation points to bump stale tickets</li>
                <li>Recruit contributors for a ticket</li>
                <li>Hide votes to prevent voting biases</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>;
  }
}
