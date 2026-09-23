import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProjectCard from "./ProjectCard";

const project = {
  id: 1,
  name: "Weather App",
  description: "Displays the weather",
};

describe("ProjectCard", () => {
  it("shows the project name and description", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /weather app/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Displays the weather")).toBeInTheDocument();
  });

  it("links to the project's detail page", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /view project/i })).toHaveAttribute(
      "href",
      "/projects/1",
    );
  });
});
