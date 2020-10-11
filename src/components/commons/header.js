import React from 'react';
import "./header.css";
import { Link, Router } from "react-router-dom";

export default class Header extends React.Component {
  render() {
    return <nav className="navbar border-bottom border-header shadow-sm d-flex flex-row">
      <div className="ml-4 mt-1 py-2 px-3 navbar-brand rounded-pill bg-primary text-white flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <img src={process.env.PUBLIC_URL + '/ticketer-light.png'} className="logo my-auto" />
            <span className="pl-2 pr-1 my-auto h6 d-none d-lg-block">
              Ticketer ≫ <b>{this.props.section}</b>
            </span>
          </div>
      </div>


      <form className="mr-4 mt-1 py-2 flex-grow-0 flex-md-grow-1 flex-column justify-content-center">
        <div>
          <input class="form-control form-control-sm rounded-pill px-3" type="text" placeholder="Search ticket by title or number" />
        </div>
      </form>

      <div className="pr-1 mt-1 mr-3 flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <Link to="/login">
              <span className="h6 font-weight-bold my-0 py-0">Log In</span>
            </Link>
          </div>
      </div>

      <div className="pr-1 mt-1 mr-3 flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <Link to="/register">
              <u className="h6 font-weight-bold my-0 py-0">Register</u>
            </Link>
          </div>
      </div>
    </nav>;
  }
}
