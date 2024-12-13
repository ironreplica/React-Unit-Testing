import SignUpPage from "./SignUpPage";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", async (req, res, ctx) => {
        requestBody = await req.json();
        counter++;
        return res(ctx.status(200));
      })
    );
    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });
    beforeAll(() => {
      server.listen();
    });

    afterAll(() => {
      server.close();
    });

    let button;
    const userNameString = "newUsername";
    const emailString = "testing@email.com";
    const passwordString = "p4ssword!";

    // Setup helper function
    const setup = async () => {
      render(<SignUpPage />);
      const userNameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const repeatPasswordInput = screen.getByLabelText("Repeat Password");
      userEvent.type(userNameInput, userNameString);
      userEvent.type(emailInput, emailString);
      userEvent.type(passwordInput, passwordString);
      userEvent.type(repeatPasswordInput, passwordString);
      button = await screen.findByRole("button", { name: /submit/i });
    };
    it("should enable the button when password and repeat password fields are equal", async () => {
      await setup();
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
      await setup();
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(requestBody).toEqual({
        username: userNameString,
        email: emailString,
        password: passwordString,
      });
    });
    xit("should disable button when there is an ongoing api call", async () => {
      await setup();
      userEvent.click(button);
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(counter).toBe(1);
    });
    it("displays account activation notification after successful signup", async () => {
      await setup();
      const message = "Please check your email to activate your account.";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const text = await screen.findByText(
        "Please check your email to activate your account."
      );
      expect(text).toBeInTheDocument();
    });
    xit("should hide sign up form after successful sign up", async () => {
      await setup();
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      // await waitFor(() => {
      //   expect(form).not.toBeInTheDocument();
      // });
      await waitForElementToBeRemoved(form);
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      await setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });
  });
});
