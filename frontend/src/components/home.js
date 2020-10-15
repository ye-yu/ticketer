import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from "./commons/header";
import TicketSmall from "./commons/ticket-small";

const topic = {};
topic.hot = <small>
  <b>Hot ticket</b> is for showing tickets that has been gaining too many attention
  due to their their vote count and fork activity. Get on the queue and investigate
  why did they become the center of attention this week!
</small>;
topic.top = <small>
  <b>Top community</b> is for showing the communities that has been active since the
  past week. An active community means a community that has a lot of hot tickets, forked
  tickets, and ticket updates.
</small>;
topic.controversial = <small>
  <b>Bad reputation</b> is for showing tickets that did not perform well on the platform.
  This may include tickets that has low votes, has negative impact on the community, etc.
  Go ahead and study what does the community consider as a bad ticket.
</small>;

const topicBorder = {
  hot: "danger",
  top: "primary",
  controversial: "warning"
}

class ActivityBadge extends React.Component {
  render() {
    if (this.props.linkTo) return <a href={this.props.linkTo} className={this.props.classNameExtra + " d-inline-block border px-3 py-2 small"}>
      {this.props.title}
    </a>;
    return <div className={this.props.classNameExtra + " d-inline-block border px-3 py-2 small"}>
      {this.props.title}
    </div>
  }
}

export default class Home extends React.Component {
  render() {
    return <div>
      <Header section="Home" />
      <div className="container mt-md-5 mt-3">
        <div className="row">
          <div className="col-3 d-none d-lg-block">
            <div className="mb-3 px-3 py-3 d-none d-lg-block bg-white border rounded-lg d-flex flex-column text-justify" style={{lineHeight:"1.15rem"}}>
              {topic[this.props.posts]}
            </div>
            <div className="bg-white border rounded-lg d-flex flex-column">
              <div className="h6 border-bottom py-2 text-center bg-light shadow-sm">What do I do?</div>
              <div href="#" className="py-1 px-3 small">
                Vote on a ticket
              </div>
              <a href="#" className="d-block pt-1 pb-3 px-3 small">
                Post your first ticket
              </a>
            </div>
          </div>
          <div className="col px-4">
            <div className="border bg-white border rounded-lg">
              <div className="d-flex flex-column flex-md-row px-3">
                <div className="h5 mr-md-auto text-center py-3 my-auto d-none d-md-inline ml-3">This Week's Activity</div>
                <div className="d-flex d-md-inline justify-content-center py-3">
                  {this.props.posts == "hot" ? <ActivityBadge classNameExtra="hover-bg-border-danger rounded-left" title="Hot Ticket" /> :  <ActivityBadge linkTo="/" classNameExtra="hover-with-border-danger rounded-left" title="Hot Ticket" />}
                  {this.props.posts == "top" ? <ActivityBadge classNameExtra="hover-bg-border-primary rounded-0 border-left-0 border-right-0" title="Top Community" /> :  <ActivityBadge linkTo="/top" classNameExtra="hover-with-border-primary rounded-0 border-left-0 border-right-0" title="Top Community" />}
                  {this.props.posts == "controversial" ? <ActivityBadge classNameExtra="hover-bg-border-warning rounded-right" title="Bad Reputation" /> :  <ActivityBadge linkTo="/controversial" classNameExtra="hover-with-border-warning rounded-right" title="Bad Reputation" />}
                </div>
              </div>
            </div>
            <div className="mt-3 px-3 py-3 border bg-white border rounded-lg d-block d-lg-none">
              {topic[this.props.posts]}
            </div>
            <TicketSmall classNameExtra="mt-3" borderColor={topicBorder[this.props.posts]} />
          </div>
        </div>
      </div>
    </div>;
  }
}
