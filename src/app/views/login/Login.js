// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import cx             from 'classnames';
import { Link }       from 'react-router-dom';
import { ErrorAlert } from '../../components';

import {Container, Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon} from "reactstrap";

class Login extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views props:
    currentView: PropTypes.string.isRequired,
    enterLogin:  PropTypes.func.isRequired,
    leaveLogin:  PropTypes.func.isRequired,

    // apollo props:
    user: PropTypes.shape({
      username: PropTypes.string
    }),

    // auth props:
    userIsAuthenticated: PropTypes.bool.isRequired,
    mutationLoading:     PropTypes.bool.isRequired,
    error:               PropTypes.object,

    // apollo actions
    loginUser: PropTypes.func.isRequired,

    // redux actions
    onUserLoggedIn: PropTypes.func.isRequired,
    resetError:     PropTypes.func.isRequired
  };

  state = {
    viewEntersAnim: true,

    email:          '',
    password:       ''
  };

  componentDidMount() {
    const { enterLogin } = this.props;
    enterLogin();
  }

  componentWillUnmount() {
    const { leaveLogin } = this.props;
    leaveLogin();
  }

  render() {
    const {
      viewEntersAnim,
      email,
      password
    } = this.state;
    const {
      mutationLoading,
      error
    } = this.props;

    return (
      <div className={cx({ "view-enter": viewEntersAnim })}>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup className="mb-0">
                  <Card className="p-4">
                    <CardBlock className="card-body">
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                        <Input
                          type="text"
                          className="form-control"
                          id="inputEmail"
                          placeholder="Username"
                          // autoComplete="nofill"
                          // role="presentation"
                          value={email}
                          onChange={this.handlesOnEmailChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                        <Input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                          placeholder="Password"
                          value={password}
                          onChange={this.handlesOnPasswordChange}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="12" className="text-right">
                          <Button
                            color="primary"
                            className="px-4"
                            disabled={mutationLoading}
                            onClick={this.handlesOnLogin}
                          >
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </CardBlock>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
            <ErrorAlert
              showAlert={!!error}
              errorTitle={'Error'}
              errorMessage={error ? error.message : ''}
              onClose={this.closeError}
            />
          </Container>
        </div>
      </div>
    );
  }

  handlesOnEmailChange = (event) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ email: event.target.value });
  }

  handlesOnPasswordChange = (event) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ password: event.target.value });
  }

  handlesOnLogin = async (event) => {
    event.preventDefault();
    const {
      loginUser,
      history
    } = this.props;

    const {
      email,
      password
    } = this.state;

    const variables = {
      user: {
        username: email,
        password: password
      }
    };

    try {
      await loginUser({variables});
      history.push({ pathname: '/protected' });
    } catch (error) {
      console.log('login went wrong..., error: ', error);
    }
  }

  closeError = (event) => {
    event.preventDefault();
    const { resetError } = this.props;
    resetError();
  }
}

export default Login;
