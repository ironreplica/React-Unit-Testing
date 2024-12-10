import SignUpPage from "./SignUpPage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { rest, post } from "msw";
import { setupServer } from "msw/node";

describe("Sign Up Page Tests", () => {
  describe("Layout Tests", () => {
    it("should have header", async () => {
      render(<SignUpPage />);
      const header = await screen.findByRole("heading", { name: /sign up/i });
      expect(header).toBeInTheDocument();
    });
    it("should include username label", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("should include email label", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });
    it("should include password label", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("password should be input type of password", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("should include repeat password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Repeat Password");
      expect(input).toBeInTheDocument();
    });
    it("should include repeat password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Repeat Password");
      expect(input.type).toBe("password");
    });
    it("should have sign up button", async () => {
      render(<SignUpPage />);
      const button = await screen.findByRole("button", { name: /submit/i });
      expect(button).toBeInTheDocument();
    });
    it("should disable the button initially", async () => {
      render(<SignUpPage />);
      const button = await screen.findByRole("button", { name: /submit/i });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    it("should enable the button when password and repeat password fields are equal", async () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const repeatPasswordInput = screen.getByLabelText("Repeat Password");
      userEvent.type(passwordInput, "p4ssword!");
      userEvent.type(repeatPasswordInput, "p4ssword!");
      const button = await screen.findByRole("button", { name: /submit/i });
      expect(button).not.toBeDisabled();
    });
    it("should disable the button when password and repeat password fields are not equal", async () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const repeatPasswordInput = screen.getByLabelText("Repeat Password");
      userEvent.type(passwordInput, "p4ssword!");
      userEvent.type(repeatPasswordInput, "p4sswor!");
      const button = await screen.findByRole("button", { name: /submit/i });
      expect(button).toBeDisabled();
    });
    it("should send username, password and email to backend after clicking submit", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200));
        })
      );

      server.listen();
      render(<SignUpPage />);
      const userNameString = "newUsername";
      const emailString = "testing@email.com";
      const passwordString = "p4ssword!";

      const userNameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const repeatPasswordInput = screen.getByLabelText("Repeat Password");
      userEvent.type(userNameInput, userNameString);
      userEvent.type(emailInput, emailString);
      userEvent.type(passwordInput, passwordString);
      userEvent.type(repeatPasswordInput, passwordString);
      const button = await screen.findByRole("button", { name: /submit/i });
      userEvent.click(button);

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(requestBody).toEqual({
        username: userNameString,
        email: emailString,
        password: passwordString,
      });

      // TODO Good practice to close the server after its being used
      // afterAll(() => server.close());
    });
  });
});
