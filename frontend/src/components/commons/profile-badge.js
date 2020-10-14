import React from "react";
import Collapse from "react-bootstrap/Collapse";

const DEF_AVT = process.env.PUBLIC_URL + "/def-avt.png";

class CenteredFlex extends React.Component {
  render() {
    if (this.props.linkTo) return <a href={this.props.linkTo} className={this.props.outerClass + " d-flex flex-column justify-content-center"} style={this.props.outerStyle}>
      <div className="d-flex justify-content-center">
        {this.props.children}
      </div>
    </a>;

    return <div className={this.props.outerClass + " d-flex flex-column justify-content-center"} style={this.props.outerStyle}>
      <div className="d-flex justify-content-center">
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
    return <div className="ml-auto h-100" style={{width: 200}}>
      <div className="d-flex flex-column justify-content-center w-100 h-100">
        <a href="#profile-badge" className="d-flex align-items-center justify-content-center" onClick={this.toggleProfileOptions} aria-controls="profile-badge" aria-expanded={this.state.showProfileOptions}>
          <img src={this.state.avatar} className="rounded-circle" style={{width: 35, height: 35}} />
          <div className="px-4">
            {this.props.name}
          </div>
        </a>
      </div>
      <div className="position-relative">
        <div className="position-absolute" style={{width: 200, right: "5%"}}>
          <Collapse in={this.state.showProfileOptions}>
            <div className="shadow w-100">
              <div classNme="d-flex flex-column" style={{backgroundColor: "white"}}>
                <CenteredFlex outerClass="border-bottom" outerStyle={{height: 45}} linkTo="profile">
                  <small>Visit Profile</small>
                </CenteredFlex>

                <CenteredFlex outerClass="border-bottom" outerStyle={{height: 45}} linkTo="logout">
                  <small>Logout</small>
                </CenteredFlex>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  }
}
