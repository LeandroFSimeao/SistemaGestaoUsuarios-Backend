const express = require("express");
const cors = require("cors");
const AppContainer = require("./container");

const app = express();

const corsOptions = {
  origin: "*",
  exposedHeaders: "X-Total-Count",
};

app.use(cors(corsOptions));
app.use(express.json());

app.set("container", new AppContainer());

app.post("/users", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.insert(req.body);
  res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const users = (await repository.findAll()).map((row) => {
    return {
      id: row._id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
    };
  });
  res.setHeader("X-Total-Count", users.length);
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.find(req.params.id);

  if (user === null) {
    res.status(404).json({
      error: "User not found",
      code: 404,
    });
  } else {
    const result = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
    };
    res.json(result);
  }
});

app.put("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.update(req.params.id, req.body);

  if (user === null) {
    res.status(404).json({
      error: "User not found",
      code: 404,
    });
  } else {
    res.status(200).json(user);
  }
});

app.delete("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const deleted = await repository.remove(req.params.id);

  if (deleted > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({
      error: "User not found",
      code: 404,
    });
  }
});

app.delete("/users", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  await repository.clear();
  res.status(204).send();
});

let port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
