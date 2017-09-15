// @flow weak

import React, {
  Component
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  Route,
  Redirect,
  withRouter
}                         from "react-router-dom";
import auth               from '../../services/auth';

import navigationModel        from '../../models/navigation.json';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
// import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

class PrivateRoute extends Component {
  static propTypes = {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    component:  PropTypes.any.isRequired,
    path:       PropTypes.string
  };

  state = {
    navModel : navigationModel
  };

  render() {
    const { navModel } = this.state;

    const {
      component: Component,
      ...rest
    } = this.props;
    const { location } = this.props;

    const isUserAuthenticated = this.isAuthenticated();
    const isTokenExpired      = this.isExpired();

    return (
      <Route
        {...rest}
        render={
          props => (
          !isTokenExpired && isUserAuthenticated
            ?
            <div className="app">
              <Header />
              <div className="app-body">
                <Sidebar
                  {...this.props}
                  brand={navModel.brand}
                  navModel={navModel}
                />
                <main className="main">
                  <Breadcrumb />
                  <div className="container-fluid">
                    <Component {...props} />
                  </div>
                </main>
                {/* <Aside /> */}
              </div>
              <Footer />
            </div>
            : <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
        }
      />
    );
  }

  isAuthenticated() {
    const checkUserHasId = user => user && user.id && user.id.length > 0;
    const user = auth.getUserInfo() ? auth.getUserInfo() : null;
    const isAuthenticated =
      auth.getToken() && checkUserHasId(user) ? true : false;

    return isAuthenticated;
  }

  isExpired() {
    return auth.isExpiredToken(auth.getToken());
  }
}

export default withRouter(PrivateRoute);
