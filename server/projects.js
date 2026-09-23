// Seed data for the mock API. Edits made through the app live in memory
// and reset when the dev server restarts.
export const seedProjects = [
  {
    id: 1,
    name: "Weather App",
    description: "Displays the current forecast for any city.",
    tech: ["React", "OpenWeather API"],
  },
  {
    id: 2,
    name: "Recipe Finder",
    description: "Search recipes by ingredient and save favorites.",
    tech: ["React", "React Router"],
  },
  {
    id: 3,
    name: "Habit Tracker",
    description: "Track daily habits and visualize streaks.",
    tech: ["React", "Custom Hooks"],
  },
];
