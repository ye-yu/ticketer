import React from 'react';
const validate = require("email-validator").validate;

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      em: "",
      pw: "",
      isWaitingResponse: false
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleInputs(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleButton(event, keepSession) {
    console.log("Sent event:", event, "=> keepSession:", keepSession);
  }

  disableButton() {
    return !validate(this.state.em) || this.state.pw.length < 10
  }

  render() {
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
    </form>;

    return <div>
      <div className="d-none d-md-block position-relative">
        <div className="position-absolute" style={{right: 0, zIndex: 99, width: "300px"}}>
          <div className="px-3 py-4 shadow">
            {loginForm}
          </div>
        </div>
      </div>
      <div className="d-block d-md-none container py-3 px-5">
        {loginForm}
      </div>
    </div>;
  }
}
