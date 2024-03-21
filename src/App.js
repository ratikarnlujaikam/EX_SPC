import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Helmet } from 'react-helmet';

import Home from "./components/home";

import MOTORDIM from "./components/MOTORDIM/screwheight";

import Header from "./components/header";
import SideMenu from "./components/sidemenu";
import Footer from "./components/footer";




export default class App extends Component {
  // rcc = react component ใช้ export render ออกหน้าเว็บ
  redirectToLogin = () => {
    return <Redirect to="/home" />;
  };

    render() {
    return (
      <Router>
             <Header/>
        {" "}
        <Helmet>
        <title>FDB 4.0</title>
      </Helmet>
        <div>
          <SideMenu />
          {/* {window.location.pathname === "/home" && <SideMenu />} */}
          <Switch>
                   
            <Route path="/home" component={Home} />
            <Route path="/screwheight" component={MOTORDIM} />
            <Route exact={true} path="/" component={this.redirectToLogin} />
            <Route exact={true} path="*" component={this.redirectToLogin} />

          </Switch>{" "}
                  
          <Footer />
        </div>
              
      </Router>
    );
  }
}
