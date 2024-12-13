import { render } from "@testing-library/react";
import Input from "./Input";

it("should inlcude is-invalid class for input when error is set", () => {
  const { container } = render(<Input error="Error Message" />);
  const input = container.querySelector("input");
  expect(input.classList).toContain("is-invalid");
});
it("should include invalid-feedback class for span when help is set", () => {
  const { container } = render(<Input error="Error Message" />);
  const input = container.querySelector("span");
  expect(input.classList).toContain("invalid-feedback");
});
it("should not include 'is-invalid' class for input when there is no error", () => {
  const { container } = render(<Input />);
  const input = container.querySelector("span");
  expect(input.classList).not.toContain("invalid-feedback");
});
