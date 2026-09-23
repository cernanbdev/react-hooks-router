import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../App";
import { mockFetch } from "../testUtils";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Creating a project", () => {
  it("saves the project and navigates to its detail page", async () => {
    const user = userEvent.setup();
    mockFetch({
      "POST /api/projects": (options) => ({
        status: 201,
        body: { id: 4, ...JSON.parse(options.body), tech: [] },
      }),
      "GET /api/projects/4": () => ({
        body: { id: 4, name: "Portfolio", description: "My site", tech: [] },
      }),
    });

    render(
      <MemoryRouter initialEntries={["/projects/new"]}>
        <App />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Name"), "Portfolio");
    await user.type(screen.getByLabelText("Description"), "My site");
    await user.click(screen.getByRole("button", { name: "Save project" }));

    expect(
      await screen.findByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();
  });

  it("stays on the form and shows an error when saving fails", async () => {
    const user = userEvent.setup();
    mockFetch({
      "POST /api/projects": () => ({ status: 500, body: {} }),
    });

    render(
      <MemoryRouter initialEntries={["/projects/new"]}>
        <App />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Name"), "Portfolio");
    await user.click(screen.getByRole("button", { name: "Save project" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to save project",
    );
    expect(screen.getByRole("button", { name: "Save project" })).toBeEnabled();
  });
});
