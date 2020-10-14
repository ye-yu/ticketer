import React from "react";
import Collapse from "react-bootstrap/Collapse";

const DEF_AVT = process.env.PUBLIC_URL + "/def-avt.png";
const NOTIFICATION = process.env.PUBLIC_URL + "/icons/notification.png";
const HELP = process.env.PUBLIC_URL + "/icons/help.png";
const LOGOUT = process.env.PUBLIC_URL + "/icons/logout.png";

class CenteredFlex extends React.Component {
  render() {
    if (this.props.linkTo) return <a href={this.props.linkTo} className={this.props.outerClass + " d-flex flex-column justify-content-center"} style={this.props.outerStyle}>
      <div className="d-flex justify-content-center">
        {this.props.children}
      </div>
    </a>;

    return <div className={this.props.outerClass + " d-flex flex-column justify-content-center"} style={this.props.outerStyle}>
      <div className="d-flex align-items-center justify-content-center">
        {this.props.children}
      </div>
    </div>;
  }
}

export default class ProfileBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.avatar = this.props.avatarSmall || DEF_AVT;
    this.state.showProfileOptions = false;
    this.toggleProfileOptions = this.toggleProfileOptions.bind(this);
  }

  toggleProfileOptions() {
    this.setState({showProfileOptions: !this.state.showProfileOptions});
  }

  render() {
    return <div className="ml-auto h-100 px-4">
      <div className="d-flex justify-content-center w-100 h-100">
        <a href="#profile-badge" className="px-2 d-flex align-items-center justify-content-center hover-light" onClick={this.toggleProfileOptions} aria-controls="profile-badge" aria-expanded={this.state.showProfileOptions}>
          <img src={HELP} style={{width: 25, height: 25}} />
        </a>
        <a href="#profile-badge" className="px-2 d-flex align-items-center justify-content-center hover-light" onClick={this.toggleProfileOptions} aria-controls="profile-badge" aria-expanded={this.state.showProfileOptions}>
          <img src={NOTIFICATION} style={{width: 25, height: 25}} />
        </a>
        <a href="#profile-badge" className="px-2 d-flex align-items-center justify-content-center hover-light" onClick={this.toggleProfileOptions} aria-controls="profile-badge" aria-expanded={this.state.showProfileOptions}>
          <img src={this.state.avatar} className="rounded-circle" style={{width: 25, height: 25}} />
          <div className="px-4 d-md-inline d-none">
            {this.props.name}
          </div>
        </a>
      </div>
      <div className="position-relative">
        <div className="position-absolute" style={{width: 200, right: "5%", zIndex: 99}}>
          <Collapse in={this.state.showProfileOptions}>
            <div className="shadow-sm w-100">
              <div classNme="d-flex flex-column" style={{backgroundColor: "white"}}>
                <CenteredFlex outerClass="border-bottom hover-dark" outerStyle={{height: 45}} linkTo="profile">
                  <small>Visit Profile</small>
                </CenteredFlex>

                <CenteredFlex outerClass="border-bottom hover-dark" outerStyle={{height: 45}} linkTo="logout">
                  <img className="my-auto" src={LOGOUT} style={{width: 25, height: 25}} />
                  <small className="my-auto">Logout</small>
                </CenteredFlex>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  }
}
