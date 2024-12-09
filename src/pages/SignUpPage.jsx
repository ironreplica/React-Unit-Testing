import React, { Component } from "react";
import axios from "axios";
// import { setupServer } from "msw/node";
// import { useState } from "react";

// skim through msw video, then watch proxy. msw breaks everything for no reason.

class SignUpPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  };

  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    fetch("/api/1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    // axios.post("/api/1.0/users", body);
  };
  render() {
    let disabled = true;
    const { password, repeatPassword } = this.state;
    if (password && repeatPassword) {
      disabled = password !== repeatPassword;
    }
    return (
      <div>
        <form>
          <h1>Sign up</h1>
          <label htmlFor="username">Username</label>
          <input id="username" onChange={this.onChange} />
          <label htmlFor="email">Email</label>
          <input id="email" onChange={this.onChange} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" onChange={this.onChange} />
          <label htmlFor="repeatPassword">Repeat Password</label>
          <input id="repeatPassword" onChange={this.onChange} type="password" />
          <button disabled={disabled} onClick={this.submit}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpPage;
