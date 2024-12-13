import React, { Component } from "react";
import axios from "axios";
import Input from "../components/Input";
// import { useState } from "react";

class SignUpPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  submit = async (event) => {
    event.preventDefault();

    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    // try {
    //   await fetch("/api/1.0/users", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   }).then(() => {
    //     this.setState({ signUpSuccess: true });
    //   });
    // } catch (error) {
    //   if (error.response.status === 400) {
    //     this.setState({ errors: error.response.data.validationErrors });
    //   }
    // }
    try {
      await axios.post("/api/1.0/users", body);
      this.setState({ signUpSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
        this.setState({ signUpSuccess: false });

        this.setState({ apiProgress: false });
      }
    }
  };
  render() {
    const spinningClass = "spinner-border spinnner-border-sm";
    let disabled = true;
    const { password, repeatPassword, apiProgress, signUpSuccess, errors } =
      this.state;
    if (password && repeatPassword) {
      disabled = password !== repeatPassword;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form className="card mt-5" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">Sign up</h1>
            </div>
            <div className="card-body">
              <Input
                id="username"
                label="Username"
                onChange={this.onChange}
                error={errors.username}
              />
              <Input
                id="email"
                label="Email"
                onChange={this.onChange}
                error={errors.email}
              />
              <Input
                id="password"
                label="Password"
                onChange={this.onChange}
                error={errors.password}
                type="password"
              />

              <div className="mb-3">
                <label htmlFor="repeatPassword" className="form-label">
                  Repeat Password
                </label>
                <input
                  id="repeatPassword"
                  className="form-control"
                  onChange={this.onChange}
                  type="password"
                />
              </div>
              <div className="text-center">
                <button
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                  className={"btn btn-primary"}
                >
                  <span
                    className={apiProgress ? spinningClass : ""}
                    role="status"
                  ></span>
                  {apiProgress ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="alert alert-success mt-3">
            Please check your email to activate your account.
          </div>
        )}
      </div>
    );
  }
}

export default SignUpPage;
