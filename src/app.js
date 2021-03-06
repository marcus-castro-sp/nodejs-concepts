const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repIndex = repositories.findIndex(rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: `Project with id = ${id} was not found!`});
  }

  const updatedRep = {
    ...repositories[repIndex],
    title,
    url,
    techs
  };

  repositories[repIndex] = updatedRep;

  return response.json(updatedRep);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repIndex = repositories.findIndex(rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: `Project with id = ${id} was not found!`});
  }

  repositories.splice(repIndex, 1); 

  return response.status(204).send();

});

app.post("/repositories/:id/like/", (request, response) => {
  const {id} = request.params;

  const repIndex = repositories.findIndex(rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: `Project with id = ${id} was not found!`});
  }

  const rep = repositories[repIndex];  
  const updatedRep = {
    ...rep,
    likes: rep.likes + 1
  };

  repositories[repIndex] = updatedRep;
  
  return response.json(updatedRep);
});

module.exports = app;
