const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", checkIfRepositoryExists)

const repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  request.repositoryId = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { repositoryId } = request;

  const { url, title, techs } = request.body;

  const { likes } = repositories[repositoryId];

  repositories[repositoryId] = { id, url, title, techs, likes };

  return response.status(200).json(repositories[repositoryId]);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryId } = request;

  repositories.splice(repositoryId, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const { repositoryId } = request;

  const { likes, ...repository } = repositories[repositoryId];

  repositories[repositoryId] = { ...repository, likes: likes + 1 };

  return response.status(200).json({ likes: likes + 1 });
});

module.exports = app;
