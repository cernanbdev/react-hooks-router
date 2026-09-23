import { seedProjects } from "./projects.js";

// A tiny in-memory REST API mounted on the Vite dev server, so the app can
// fetch real URLs (/api/projects, /api/projects/:id) without a second process.
//
//   GET  /api/projects       -> all projects
//   GET  /api/projects/:id   -> one project, or 404
//   POST /api/projects       -> create a project, 201
//
// Responses are delayed so the loading state is visible during the demo.
const DELAY_MS = 500;

function sendJson(res, status, body) {
  setTimeout(() => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  }, DELAY_MS);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

export default function mockApi() {
  const projects = structuredClone(seedProjects);

  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use("/api/projects", async (req, res) => {
        // Inside this middleware, req.url is the part after /api/projects.
        const path = req.url.split("?")[0].replace(/\/$/, "");

        if (req.method === "GET" && path === "") {
          return sendJson(res, 200, projects);
        }

        if (req.method === "GET") {
          const id = Number(path.slice(1));
          const project = projects.find((p) => p.id === id);
          return project
            ? sendJson(res, 200, project)
            : sendJson(res, 404, { error: "Project not found" });
        }

        if (req.method === "POST" && path === "") {
          let body;
          try {
            body = await readJsonBody(req);
          } catch {
            return sendJson(res, 400, { error: "Invalid JSON" });
          }

          if (!body.name?.trim()) {
            return sendJson(res, 422, { error: "Name is required" });
          }

          const project = {
            id: Math.max(0, ...projects.map((p) => p.id)) + 1,
            name: body.name.trim(),
            description: body.description?.trim() ?? "",
            tech: [],
          };
          projects.push(project);
          return sendJson(res, 201, project);
        }

        return sendJson(res, 405, { error: "Method not allowed" });
      });
    },
  };
}
