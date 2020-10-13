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
    let brand = <div className="ml-4 mt-1 py-2 px-0 px-lg-3 navbar-brand flex-column justify-content-center h-100">
      <div className="d-flex flex-column justify-content-center h-100">
        <div className="d-flex justify-content-center">
          <img src={process.env.PUBLIC_URL + '/ticketer.png'} className="logo my-auto" />
          <span className="pl-2 pr-1 my-auto h6">
              Ticketer ≫ <b>{this.props.section}</b>
          </span>
        </div>
      </div>
    </div>;

    let searchField = <form className="d-none d-lg-block mr-4 mt-1 py-2 flex-fill flex-column justify-content-center h-100">
      <div className="d-flex flex-column justify-content-center h-100">
        <input className="form-control form-control-sm rounded-pill px-3" type="text" placeholder="Search ticket by title or number" />
      </div>
    </form>;

    let loginLink = <div className="pr-1 mt-1 ml-auto mr-3 flex-column justify-content-center h-100">
      <div className="d-flex flex-column justify-content-center h-100">
        <div className="d-flex justify-content-center">
          <Link to="/login">
            <span className="h6 font-weight-bold my-0 py-0">Log In</span>
          </Link>
        </div>
      </div>
    </div>;

    let spacer = <div className="h-100 border-left" style={{width: "30px"}}>&nbsp;</div>;

    let registerLink = <div className="pr-1 mt-1 mr-3 flex-column justify-content-center h-100">
      <div className="d-flex flex-column justify-content-center h-100">
        <div className="d-flex justify-content-center">
          <Link to="/register">
            <u className="h6 font-weight-bold my-0 py-0">Register</u>
          </Link>
        </div>
      </div>
    </div>;

    return <div className="border-bottom border-header shadow-sm d-flex flex-row" style={{height: "70px"}}>
      {brand} {spacer} {searchField} {loginLink} {registerLink}
    </div>;
  }

  render() {
    if (this.props.simple) return this.renderSimple();
    return this.renderMore();
  }
}
