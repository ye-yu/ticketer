import React from 'react';
import { Link } from "react-router-dom";

export default class NotFound extends React.Component {
  render() {
    return <div>
      <h1>404</h1>
      <p>The page you are looking for is not found.</p>
    </div>;
  }
}
