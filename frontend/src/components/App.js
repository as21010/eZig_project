import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homePage";
import DocView from "./docView";



export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docView" element={<DocView />} />
      </Routes>
    </Router>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);