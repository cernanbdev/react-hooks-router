import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("shows the getting started heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  it("starts the counter at zero", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "Count is 0" }),
    ).toBeInTheDocument();
  });

  it("increments the counter each time the button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Count is 0" }));
    await user.click(screen.getByRole("button", { name: "Count is 1" }));

    expect(
      screen.getByRole("button", { name: "Count is 2" }),
    ).toBeInTheDocument();
  });

  it("links to the React and Vite docs", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "Explore Vite" })).toHaveAttribute(
      "href",
      "https://vite.dev/",
    );
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "https://react.dev/",
    );
  });
});
