const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

//DOC Métodos HTTP

//DOC Tipos de Parametros

// DOCS Middlewares

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}]  ${url} `;
  console.log(logLabel);
  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.use("projects/:id", validateProjectId);
app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  console.log(request.body);
  const project = { id: uuid(), title, owner };
  console.log(project);

  projects.push(project);
  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner, techs } = request.body;

  const projectIndex = projects.findIndex((project) => {
    console.log(project.id === id);
    return project.id === id;
  });

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  const project = {
    id,
    title,
    owner,
    techs,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => {
    console.log(project.id === id);
    return project.id === id;
  });

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333);
