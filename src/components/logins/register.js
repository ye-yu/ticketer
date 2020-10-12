import React from 'react';
import { Link } from "react-router-dom";
import Header from "../commons/header.js";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dn: "",
      em: "",
      pw: "",
      isWaitingResponse: false,
      errorMessage: ""
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleInputs(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleButton(button) {
    this.setState({isWaitingResponse: true});
    setTimeout(() => this.setState({
      isWaitingResponse: false,
      errorMessage: "Server is not responding"
    }), 2000);
  }

  disableButton() {
    return !this.state.dn || !this.state.em || !this.state.pw || !this.isEmailValid(this.state.em) || !this.isPasswordValid(this.state.pw) || this.state.isWaitingResponse;
  }

  isEmailValid(emailStr) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailStr.toLowerCase());
  }

  isPasswordValid(pw) {
    return pw.length >= 10;
  }

  render() {
    let error = this.state.errorMessage ? <div class="small alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Error in sending request:</strong> {this.state.errorMessage}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div> : "";
    return <div>
      <Header simple={true} section="Register" />
      <div className="container">
        <div className="row mt-5 px-5 py-3">
          <div className="col shadow rounded bg-light">
            <div className="py-4">
              <div className="form-group">
                <label for="registerName"><b>Display Name</b></label>
                <input type="text" className="form-control form-control-sm" name="dn" id="registerName" placeholder="Enter name" onChange={this.handleInputs} />
              </div>
              <div className="form-group">
                <label for="registerEmail"><b>Email address</b></label>
                <input type="email" className="form-control form-control-sm" name="em" id="registerEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInputs} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label for="registerPassword"><b>Password</b></label>
                <input type="password" className="form-control form-control-sm" name="pw" id="registerPassword" placeholder="Password" minlength="10" onChange={this.handleInputs} />
              </div>
              <small id="notice" className="form-text text-muted text-center py-3">By registering, you agree to the Terms & Conditions and Privacy Policy.</small>
              {error}
              <button type="submit" className="btn btn-primary btn-sm btn-block py-2" disabled={this.disableButton()} onClick={this.handleButton}>Submit</button>
            </div>
          </div>

          <div className="col d-none d-lg-block">
          </div>

        </div>
      </div>
    </div>;
  }
}
