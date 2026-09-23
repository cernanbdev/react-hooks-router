import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ProjectDetails from "./ProjectDetails";
import { mockFetch } from "../testUtils";

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockFetch({
    "GET /api/projects/1": () => ({
      body: { id: 1, name: "Weather App", description: "Forecasts", tech: [] },
    }),
    "GET /api/projects/2": () => ({
      body: { id: 2, name: "Recipe Finder", description: "Recipes", tech: [] },
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProjectDetails", () => {
  it("shows a loading message before the project arrives", () => {
    renderAt("/projects/2");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Would fail if the component fetched "/api/projects/id" instead of using the URL param.
  it("shows the project whose id is in the URL", async () => {
    renderAt("/projects/2");

    expect(
      await screen.findByRole("heading", { name: "Recipe Finder" }),
    ).toBeInTheDocument();
  });

  it("shows a not-found message when the project does not exist", async () => {
    renderAt("/projects/999");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Project not found.",
    );
  });
});
