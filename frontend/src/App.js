import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from './components/index';
import Test from './components/test';
import Subjects from './components/subjects';


const AppRouter = () => {
  return (
    <div>
      <Router>
        <Route path="/" exact component={Index} />
        <Route path="/test/:lang/:id" exact component={Test} />
        <Route path="/subjects" exact component={Subjects} />
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
