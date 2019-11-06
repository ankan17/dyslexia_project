import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from './components/index';
import Test from './components/test';


const AppRouter = () => {
  return (
    <div>
      <Router>
        <Route path="/" exact component={Index} />
        <Route path="/test/:id" exact component={Test} />
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
