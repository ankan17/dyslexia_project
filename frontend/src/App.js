import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from './components/index';


const AppRouter = () => {
  return (
    <div>
      <Router>
        <Route path="/" exact component={Index} />
      </Router>
    </div>
  );
}

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <AppRouter />
      </div>
    );
  }
}
