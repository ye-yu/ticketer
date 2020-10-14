import React from 'react';

const DEF_AVT = process.env.PUBLIC_URL + "/def-avt.png";

export default class ProfileBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.avatar = this.props.avatarSmall || DEF_AVT;
  }

  render() {
    return <div className={this.props.className} style={{width: 200}}>
      <img src={this.state.avatar} className="rounded-circle" style={{width: 35, height: 35}} />
      <div className="px-4">
        {this.props.name}
      </div>
    </div>
  }
}
