import React from 'react';
import "./header.css";
import { Link } from "react-router-dom";

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {profile: null};
  }

  componentDidMount() {
    this.timerID = setTimeout(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  tick() {
    this.setState({
      profile: "profile"
    });
  }

  renderSimple() {
    let brand = <div className="mt-1 py-2 px-3 navbar-brand flex-column justify-content-center">
      <Link to="/">
        <div className="d-flex justify-content-center">
          <img src={process.env.PUBLIC_URL + '/ticketer.png'} className="logo my-auto" />
          <span className="pl-2 pr-1 my-auto h6">
              Ticketer ≫ <b>{this.props.section}</b>
          </span>
        </div>
      </Link>
    </div>;

    return <nav className="navbar border-bottom border-header shadow-sm d-flex flex-row justify-content-center">
      {brand}
    </nav>;

  }

  renderMore() {
    let brand = <div className="mx-0 my-0 px-4 px-lg-5 h-100 d-flex flex-column justify-content-center h-100 border-right">
        <div className="d-flex justify-content-center">
          <img src={process.env.PUBLIC_URL + '/ticketer.png'} className="logo my-auto" />
          <span className="pl-2 pr-1 my-auto h6">
              Ticketer ≫ <b>{this.props.section}</b>
          </span>
      </div>
    </div>;

    let searchField = <input className="form-control form-control-sm rounded-pill px-3" type="text" placeholder="Search ticket by title or number" />;

    let loginLink = <div className="ml-auto mr-0 my-0 px-2 px-lg-3 h-100 d-flex flex-column justify-content-center h-100">
      <div className="d-flex justify-content-center">
        <Link to="/login">
          <span className="h6 font-weight-bold my-0 py-0">Log In</span>
        </Link>
      </div>
    </div>;

    let registerLink = <div className="mx-0 my-0 pl-2 pr-3 pl-lg-3 pr-lg-5 h-100 d-flex flex-column justify-content-center h-100">
      <div className="d-flex justify-content-center">
        <Link to="/register">
          <u className="h6 font-weight-bold my-0 py-0">Register</u>
        </Link>
      </div>
    </div>;

    return <div>
      <div className="border-bottom border-header shadow-sm d-flex flex-row" style={{height: "70px"}}>
        {brand}
        <div className="d-none d-md-flex mx-0 my-0 px-5 flex-fill flex-column justify-content-center h-100">
          <div className="d-flex justify-content-center">
            {searchField}
          </div>
        </div>
        {loginLink} {registerLink}
      </div>
      <div className="d-md-none d-block w-100 px-5 pt-3">
        <div> {searchField} </div>
      </div>
    </div>;
  }

  render() {
    if (this.props.simple) return this.renderSimple();
    return this.renderMore();
  }
}
