# Live Session Script: Custom Hooks + React Router (60 min)

**Modules:** 5 (custom hooks) and 6 (React Router) in depth.
Module 7 (testing) and AI-assisted testing get a light touch at the end.

**How to read this script**

- **SAY** is a talking point, not a word-for-word script.
- **ASK** is a question for the room, with the answer you are listening for.
- **TYPE** is code to live-code.
- **CHECK** is what the browser or terminal should show before you move on.
- **RESCUE** is how to recover if you get stuck: `git checkout solution -- <file>` copies the finished file into place.

The `main` branch is the starter.
The `solution` branch is the finished app.

---

## Before students join

```bash
git checkout main
npm install
npm run dev          # leave running: http://localhost:5173
```

- Open the browser at `http://localhost:5173` with DevTools open on the **Network** tab.
- Open `src/pages/NewProject.jsx` and `src/pages/ProjectList.jsx` in your editor.
- Keep a second terminal ready for `npm run test:run`.

Starting state of the app:

- The navbar uses plain `<a>` tags.
- The "New project" form and the project list are stacked on one page.
- There is no router and there are no custom hooks.
- `src/pages/ProjectDetails.jsx` contains planted bugs for the debugging segment. Leave it alone until then.
- The tests fail until you finish. That is expected, and you run them at the end as the payoff.

The mock API runs inside the Vite dev server (`server/mockApi.js`).
It delays each response by 500ms so the loading state is visible.
Projects you create are lost when the dev server restarts.

## Timeline

| Clock | Segment | Files touched |
| --- | --- | --- |
| 0:00 | Q&A warm-up | none |
| 0:05 | `useInput` | `hooks/useInput.js`, `NewProject.jsx` |
| 0:12 | `useFetch` | `hooks/useFetch.js`, `ProjectList.jsx` |
| 0:22 | Add the router | `main.jsx`, `App.jsx`, `Navbar.jsx` |
| 0:30 | Nested routes and `<Outlet />` | `ProjectsLayout.jsx`, `App.jsx`, `ProjectCard.jsx` |
| 0:36 | Debugging challenge | `ProjectDetails.jsx` |
| 0:44 | `useNavigate()` | `NewProject.jsx` |
| 0:50 | Tests and AI prompt | test files (read only) |
| 0:56 | Exit check | none |

**If you fall behind:**

1. First, skip the `ignore` stretch in `useFetch`.
2. Next, RESCUE `ProjectsLayout.jsx` instead of typing it.
3. Next, shorten the AI prompt discussion to a single sentence.
4. Never cut the debugging challenge or the exit check.

---

## 0:00 - Q&A warm-up (5 min)

**SAY:** "Today we build a small version of your summative project live. Before we start, what's blocking you?"

**ASK** one or two of these:

- "What still feels fuzzy about custom hooks?"
- "Anything confusing about nested routes or `<Outlet />`?"
- "Anything in the summative requirements you're unsure about?"

Listen for:

- Treating a custom hook like a normal helper function.
- Mixing up `<Link>` and `useNavigate()`.
- Confusion about `:id` params.

Park questions that the session will answer: "Great question, we'll hit that in about 20 minutes."

**SAY:** "Here's the app right now."
Show the browser.
"Everything is on one page. There's no router and no custom hooks. By the end, it will be a real multi-page app."

---

## 0:05 - `useInput` (7 min)

Open `src/pages/NewProject.jsx`.

**SAY:** "Look at the two inputs. The state, the change handler, and the wiring are the same pattern written twice. Imagine a signup form with eight fields."

**ASK:** "What exactly is repeated here, the UI or the behavior?"
Expected answer: the behavior (a piece of state plus an `onChange` that updates it).

**TYPE:** create `src/hooks/useInput.js`:

```js
import { useState } from "react";

// Reuses *behavior* (state + change handler), not UI.
// Spread the result onto an input: <input {...name} />
function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  function onChange(event) {
    setValue(event.target.value);
  }

  return { value, onChange };
}

export default useInput;
```

**SAY** while typing:

- "The name starts with `use`. That's how React and the linter know it's a hook."
- "It calls another hook, `useState`. Only components and hooks may do that."
- "It returns data, not JSX."

**TYPE:** in `src/pages/NewProject.jsx`, add the import below `import { useState } from "react";`:

```js
import useInput from "../hooks/useInput";
```

Replace the two `useState` lines for `name` and `description` with:

```js
  const name = useInput("");
  const description = useInput("");
```

Update the request body:

```js
        body: JSON.stringify({
          name: name.value,
          description: description.value,
        }),
```

Replace the two inputs:

```jsx
      <label htmlFor="project-name">Name</label>
      <input id="project-name" {...name} required />

      <label htmlFor="project-description">Description</label>
      <textarea id="project-description" {...description} rows={3} />
```

**ASK:** "What does `{...name}` expand to?"
Expected answer: `value={name.value} onChange={name.onChange}`.

**ASK:** "If I type in Name, does Description change too?"
Expected answer: no. Each call to a hook gets its own separate state.

**CHECK:** type in both fields in the browser. Each field updates on its own.

**RESCUE:** `git checkout solution -- src/hooks/useInput.js`

**SAY:** "Key line for today: **components reuse UI; custom hooks reuse stateful logic.**"

---

## 0:12 - `useFetch` (10 min)

Open `src/pages/ProjectList.jsx`.

**ASK:** "Our summative app needs the project list, a project detail page, and maybe a profile page. What happens if every one of them has this 25-line `useEffect`?"
Expected answers:

- Duplication.
- Each page handles errors differently.
- A bug fix has to be made in five places.

**TYPE:** create `src/hooks/useFetch.js`.
Cut the state and the effect out of `ProjectList` and generalize them.
`projects` becomes `data`, and the hard-coded URL becomes a `url` argument:

```js
import { useEffect, useState } from "react";

// Owns the fetch/loading/error lifecycle so components only decide what to render.
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the url changes (e.g. /projects/1 -> /projects/2) before the first
    // request finishes, ignore the stale response instead of rendering it.
    let ignore = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
```

> **Pacing:** type it first **without** the `ignore` lines and without `setLoading(true); setError(null);`.
> Add them at the end as a stretch if you are on time (see below).

**SAY** while typing:

- "`url` goes in the dependency array. When the URL changes, the effect runs again. That will matter when we get to `/projects/:id`."
- "`fetch` doesn't throw on a 404. That's why we check `response.ok` ourselves."
- "`finally` turns off loading on both success and failure."

**TYPE:** replace the whole of `src/pages/ProjectList.jsx`:

```jsx
import ProjectCard from "../components/ProjectCard";
import useFetch from "../hooks/useFetch";

function ProjectList() {
  const { data: projects, loading, error } = useFetch("/api/projects");

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Unable to load projects.</p>;

  return (
    <div className="grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
```

**ASK:** "What does `data: projects` do?"
Expected answer: it renames `data` to `projects` while destructuring.

**CHECK:** reload the page. You briefly see "Loading...", then three cards.
Turn on DevTools **Network > Throttling > Slow 4G** to make the loading state last longer.

**Stretch (only if on time):** add the `ignore` lines.
**SAY:** "If the user clicks from project 1 to project 2 quickly, project 1's slow response could arrive last and overwrite project 2. The cleanup function marks the old request as stale."

**RESCUE:** `git checkout solution -- src/hooks/useFetch.js src/pages/ProjectList.jsx`

---

## 0:22 - Add the router (8 min)

**SAY:** "Click 'About' in the navbar."
Click it.
"The URL changes, but we get the same page. And the Network tab shows the whole app reloading from the server. We want different screens without a full reload. That's React Router."

**TYPE:** in `src/main.jsx`, add the import below the `App` import, then wrap `<App />`:

```jsx
import { BrowserRouter } from "react-router";
```

```jsx
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
```

**SAY:** "The router goes in `main.jsx`, not in `App`. That way our tests can wrap `App` in a different router. You'll see why at the end."

**TYPE:** replace `src/App.jsx` with a flat route table first:

```jsx
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProjectList from "./pages/ProjectList";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
```

`Home`, `About`, and `NotFound` already exist. They are static pages.

**CHECK:** `/about` shows the About page, and `/nope` shows "Page not found".
The Network tab still shows full reloads, because the navbar still uses `<a>`.

**TYPE:** replace `src/components/Navbar.jsx`:

```jsx
import { NavLink } from "react-router";

// NavLink is a Link that knows whether it matches the current URL
// (adds an "active" class), which is what a nav bar needs.
function Navbar() {
  return (
    <nav className="navbar" aria-label="Main">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}

export default Navbar;
```

**CHECK:** click around.
There are no document reloads in the Network tab, and the current page is highlighted.

**ASK:** "Why does Home need `end`?"
Expected answer: without it, `/` counts as a match for every URL, so Home would always be highlighted.
Remove `end` to show this, then put it back.

---

## 0:30 - Nested routes and `<Outlet />` (6 min)

**SAY:** "Every projects page (the list, the detail page, and the new form) should share a heading and a sub-nav. We don't want to copy them into three files."

**TYPE:** create `src/pages/ProjectsLayout.jsx`:

```jsx
import { NavLink, Outlet } from "react-router";

function ProjectsLayout() {
  return (
    <section>
      <h1>Projects</h1>
      <nav className="subnav" aria-label="Projects">
        <NavLink to="/projects" end>
          All projects
        </NavLink>
        <NavLink to="/projects/new">New project</NavLink>
      </nav>

      {/* The matching child route renders here */}
      <Outlet />
    </section>
  );
}

export default ProjectsLayout;
```

**TYPE:** replace `src/App.jsx` with the nested version:

```jsx
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProjectsLayout from "./pages/ProjectsLayout";
import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";
import NewProject from "./pages/NewProject";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Nested routes: ProjectsLayout renders once, children render in its <Outlet /> */}
          <Route path="/projects" element={<ProjectsLayout />}>
            <Route index element={<ProjectList />} />
            <Route path="new" element={<NewProject />} />
            <Route path=":id" element={<ProjectDetails />} />
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
```

**SAY:**

- "`index` means 'render this at exactly `/projects`'."
- "Child paths are relative: `new` means `/projects/new`."
- "`<Outlet />` is the slot where the matching child renders."

**ASK:** "`/projects/new` could match both `new` and `:id`. Which one wins?"
Expected answer: `new`, because a static segment beats a dynamic one.

**CHECK:** switch between "All projects" and "New project".
The heading and sub-nav stay on screen, and only the content below them changes.

**TYPE:** in `src/components/ProjectCard.jsx`, add the import at the top and a link below the description:

```jsx
import { Link } from "react-router";
```

```jsx
      <p>{project.description}</p>
      <Link to={`/projects/${project.id}`}>View Project</Link>
```

**CHECK:** click "View Project".
**The page crashes (blank screen, error in the console). This is intentional.** Go straight into the next segment.

**RESCUE:** `git checkout solution -- src/pages/ProjectsLayout.jsx src/App.jsx src/components/ProjectCard.jsx`

---

## 0:36 - Debugging challenge (8 min)

Open `src/pages/ProjectDetails.jsx` and put it on screen:

```jsx
function ProjectDetails() {
  const { id } = useParams();

  const { data } = useFetch("/api/projects/id");

  return <h1>{data.name}</h1>;
}
```

**SAY:** "Hands off the keyboard. Find the bugs by reading. Put them in chat."
Give them 2 minutes.

Hints if they are stuck:

- "Look at the Network tab. What URL did we actually request?"
- "Run `npm run lint`. What does it complain about?"
  (It reports that `id` is assigned but never used.)
- "What is `data` on the very first render?"

**Bug 1:** `"/api/projects/id"` requests the literal word `id`.
The fix is a template literal: `` `/api/projects/${id}` ``.

**Bug 2:** `data` is `null` until the fetch finishes, so `data.name` crashes.
The fix is to handle `loading` and `error` before reading `data`.

**TYPE:** replace the whole file:

```jsx
import { Link, useParams } from "react-router";
import useFetch from "../hooks/useFetch";

function ProjectDetails() {
  const { id } = useParams(); // URL information
  const { data: project, loading, error } = useFetch(`/api/projects/${id}`); // data behavior

  // presentation
  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Project not found.</p>;

  return (
    <article className="details">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      {project.tech.length > 0 && (
        <ul className="tags" aria-label="Tech used">
          {project.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <Link to="/projects">Back to all projects</Link>
    </article>
  );
}

export default ProjectDetails;
```

**SAY:** "Look at how little this component does."

- `useParams()` provides URL information.
- `useFetch()` provides data behavior.
- The component handles presentation.
- The router decides which component shows up.

"We wrote `useFetch` once, 25 minutes ago, and it just worked here."

**CHECK:** `/projects/2` shows Recipe Finder, and `/projects/999` shows "Project not found."

**RESCUE:** `git checkout solution -- src/pages/ProjectDetails.jsx`

---

## 0:44 - `useNavigate()` (6 min)

**SAY:** "Go to 'New project' and save one."
Save one.
"It saved, but nothing happened. The user is stuck on the form. Where should they go?"
Expected answer: to the new project's page.

**ASK:** "Could we use a `<Link>` here?"
Expected answer: no. There's nothing to click. The navigation should happen *because the save succeeded*.

**TYPE:** in `src/pages/NewProject.jsx`, add the import below `import { useState } from "react";`:

```js
import { useNavigate } from "react-router";
```

Add this below the `error` state line:

```js
  const navigate = useNavigate();
```

Replace these lines:

```js
      await response.json();

      // TODO: send the user to the new project's page.
      setSaving(false);
```

with:

```js
      const project = await response.json();

      // Navigation triggered by application logic, not a user click on a link.
      navigate(`/projects/${project.id}`);
```

**CHECK:** create a project. You land on `/projects/4` and it shows the project.

**SAY:**

- "Use **`<Link>`** when the user clicks to go somewhere. It renders a real `<a>`, so it supports cmd-click, 'open in new tab', and screen readers."
- "Use **`useNavigate()`** when your code decides to navigate: after a save, a login, or a delete."

Show this common mistake:

```jsx
<button onClick={() => navigate("/projects")}>Projects</button>
```

"It works, but it's a button pretending to be a link. Choose the tool based on what the element *is*, not just whether it works."

**RESCUE:** `git checkout solution -- src/pages/NewProject.jsx`

---

## 0:50 - Tests and AI prompt (6 min, light)

**TYPE** in the second terminal:

```bash
npm run test:run
```

**CHECK:** 3 test files and 7 tests pass.

**SAY:** "These tests were already in the repo and were failing when we started. Everything we just built made them pass."

Open `src/components/ProjectCard.test.jsx`:

- "`MemoryRouter` is there because the card renders a `<Link>`, and a `<Link>` needs a router. That's why `BrowserRouter` lives in `main.jsx` and not in `App`."
- "The queries use roles: `heading` and `link`. That's how a user or screen reader finds things."
- "The test checks *what the user sees*, not which functions were called. So it survives refactoring. We refactored `ProjectList` today and nothing broke."

Point briefly to `src/pages/NewProject.test.jsx`: "One test types into the form, clicks save, and checks that the new project's page shows up. It covers `useInput`, `fetch`, `useNavigate`, and the route table in one go."

**AI prompt comparison.**
Show the weak prompt:

> Write tests for my React ProjectCard component.

**ASK:** "What's missing?"
Expected answers: the libraries, the props, the router context, the expected behavior, and the edge cases.

Show the better prompt:

> Using Vitest and React Testing Library, write tests for this `ProjectCard` component. Test user-visible behavior, not implementation details. Verify that the title and description render and that the "View Project" link points to `/projects/:id`. Wrap it in a `MemoryRouter`. Explain why each test is valuable.

**SAY:** "AI can write the test scaffolding. You still decide whether the test proves anything. A passing test is not automatically a good test."

---

## 0:56 - Exit check (4 min)

**SAY:** "No notes. Answer in chat."

1. What problem does a custom hook solve?
   *It reuses stateful logic, not UI.*
2. When would you use `useNavigate()` instead of `<Link>`?
   *When code decides to navigate (after a save, login, or delete) rather than a user click.*
3. What does `<Outlet />` do?
   *It is where a nested route's child renders inside the parent layout.*
4. Why test user-visible behavior?
   *Those tests check what matters to users and survive refactors.*

**SAY:** "For your summative, be ready to explain three things. Where does your reusable logic live? Why are your routes structured the way they are? What do your tests prove?"

---

## After the session

To reset the repo for the next cohort:

```bash
git checkout -- . && git clean -fd src
```

To see the finished app:

```bash
git checkout solution
```

Extra exercises if a cohort moves fast:

- Add a "Next project" link on the details page, to show why `useFetch` needs the `ignore` flag.
- Add a `/contact` route.
- Write a test for the `NotFound` route.
