# Project Showcase

A small portfolio app for a live session on custom React hooks, React Router, and component testing.
It is a simplified version of the summative Personal Project Showcase App.

The step-by-step live-coding script is in [docs/LIVE_SCRIPT.md](docs/LIVE_SCRIPT.md).

## Branches

- `main` is the **starter**.
  There is no router and there are no custom hooks yet, and `ProjectDetails` contains planted bugs.
  The tests fail until the session's live coding is finished.
- `solution` is the **finished app**.
  During the session, `git checkout solution -- <file>` copies any finished file into place.

## Run it

```bash
npm install
npm run dev        # app + mock API at http://localhost:5173
npm run test:run   # run the tests once
npm test           # run the tests in watch mode
npm run lint
```

## What's inside (finished app)

```text
server/mockApi.js      in-memory /api/projects API served by the Vite dev server
src/
├── hooks/             useInput, useFetch
├── components/        Navbar, ProjectCard
├── pages/             Home, ProjectsLayout, ProjectList, ProjectDetails, NewProject, About, NotFound
├── App.jsx            route table (nested /projects routes)
└── main.jsx           <BrowserRouter>
```

| Route | Page | Shows |
| --- | --- | --- |
| `/` | Home | `<Link>` |
| `/projects` | ProjectsLayout + ProjectList | nested routes, `<Outlet />`, `useFetch` |
| `/projects/new` | NewProject | `useInput`, `useNavigate()` after a save |
| `/projects/:id` | ProjectDetails | `useParams()` + `useFetch` |
| `/about` | About | static route |
| `*` | NotFound | catch-all route |

The mock API delays each response by 500ms so the loading state is visible.
Projects created in the app are kept in memory and reset when the dev server restarts.
