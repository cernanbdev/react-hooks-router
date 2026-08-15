import { render, screen } from "@testing-library/react";
import Home from "../Home";
import { MemoryRouter } from "react-router";

describe("Home", () => {
  it("renders a button to go to films", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "Go to Films" }),
    ).toBeInTheDocument();
  });

  it("does not render a button with the wrong label", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", { name: "Go to Filmssss" }),
    ).not.toBeInTheDocument();
  });
});
