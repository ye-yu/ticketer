import React from "react";

const TITLE = "DUMMY TICKET DUMMY TICKET DUMMY TICKET DUMMY TICKET";
const NUMBER = "-1";
const VOTES = "4";
const COMMENTS = "8";
const CONTENT_LONG = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const DATE = (new Date()).toLocaleString();
const ARROW = {
  up: {
    active: process.env.PUBLIC_URL + "/icons/up-active.png",
    normal: process.env.PUBLIC_URL + "/icons/up.png"
  },
  down: {
    active: process.env.PUBLIC_URL + "/icons/down-active.png",
    normal: process.env.PUBLIC_URL + "/icons/down.png"
  }
};
const SELECTED_NONE = 0;
const SELECTED_UP = 1;
const SELECTED_DOWN = 2;

export default class TicketSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseEnterArrowUp: false,
      mouseEnterArrowDown: false,
      selection: SELECTED_NONE
    }

    this.enterArrowUp = this.enterArrowUp.bind(this);
    this.enterArrowDown = this.enterArrowDown.bind(this);
    this.resetArrow = this.resetArrow.bind(this);
    this.selectUpArrow = this.selectUpArrow.bind(this);
    this.selectDownArrow = this.selectDownArrow.bind(this);
  }

  enterArrowUp() {
    if (this.state.selection !== SELECTED_NONE) return;
    this.setState({
      mouseEnterArrowUp: true,
      mouseEnterArrowDown: false,
    });
  }

  enterArrowDown() {
    if (this.state.selection !== SELECTED_NONE) return;
    this.setState({
      mouseEnterArrowUp: false,
      mouseEnterArrowDown: true,
    });
  }

  resetArrow() {
    this.setState({
      mouseEnterArrowUp: false,
      mouseEnterArrowDown: false,
    });
  }

  selectUpArrow() {
    if (this.state.selection == SELECTED_UP) this.setState({
      selection: SELECTED_NONE,
      mouseEnterArrowUp: true
    });
    else this.setState({selection: SELECTED_UP});
  }

  selectDownArrow() {
    if (this.state.selection == SELECTED_DOWN) this.setState({
      selection: SELECTED_NONE,
      mouseEnterArrowDown: true
    });
    else this.setState({selection: SELECTED_DOWN});
  }

  render() {
    const title = this.props.title || TITLE;
    const number = this.props.number || NUMBER;
    const votes = this.props.votesPositive || VOTES;
    const comments = this.props.comments || COMMENTS;
    const date = this.props.date || DATE;
    const content = this.props.content || CONTENT_LONG;
    return <div className={this.props.classNameExtra + " card px-1 px-lg-4"}>
      <div className="card-body">
        <div className="container-fluid">
          <div className="row border-bottom">
            <div className="col-9 px-0">
              <h5 className="card-title py-2 text-truncate"><span className="h1 text-muted py-0 pr-2">#{number}</span>{title}</h5>
              <h6 className="card-subtitle pb-2 mb-2 text-muted">Date: {date}</h6>
            </div>
            <div className="col d-flex flex-column align-items-end">
              <img className="mt-auto" src={this.state.mouseEnterArrowUp || this.state.selection == SELECTED_UP ? ARROW.up.active : ARROW.up.normal} style={{width: 15, height: 15}} onMouseEnter={this.enterArrowUp} onMouseLeave={this.resetArrow} onClick={this.selectUpArrow} />
              <div className="text-center small" style={{width: 15}} >{votes}</div>
              <img className="mb-auto" src={this.state.mouseEnterArrowDown || this.state.selection == SELECTED_DOWN ? ARROW.down.active : ARROW.down.normal} style={{width: 15, height: 15}} onMouseEnter={this.enterArrowDown} onMouseLeave={this.resetArrow} onClick={this.selectDownArrow} />
            </div>
          </div>
        </div>
        <p className="card-text">{content}</p>
      </div>
    </div>;
  }
}
