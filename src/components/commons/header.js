import React from 'react';
import "./header.css";

export default class Header extends React.Component {
  render() {
    return <nav className="navbar bg-secondary d-flex flex-row">
      <div className="ml-4 mt-1 py-2 shadow navbar-brand h1 rounded-pill bg-dark text-white px-3 flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <img src={process.env.PUBLIC_URL + '/ticketer.png'} className="logo my-auto" />
            <span className="pl-2 pr-1 my-auto h6">Ticketer</span>
          </div>
      </div>
    </nav>;
  }
}
