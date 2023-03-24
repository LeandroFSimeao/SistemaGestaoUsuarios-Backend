const app = require("./app");
const request = require("supertest")(app);

describe("API User", () => {
  let repository;
  const container = app.get("container");

  beforeAll(async () => {
    repository = await container.getUserRepository();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    const client = container.getClient();
    await client.close();
  });

  describe("/users", () => {
    describe("POST", () => {
      test("Criar um novo usuário", async () => {
        const user = {
          name: "Leandro Simeao",
          email: "leandrosimeao@yahoo.com.br",
          password: "123456",
        };

        const response = await request
          .post("/users")
          .send(user)
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            name: "Leandro Simeao",
            email: "leandrosimeao@yahoo.com.br",
            password: "123456",
          })
        );
      });
    });
  });

  describe("/users", () => {
    describe("GET", () => {
      test("Listar todos os usuários", async () => {
        await repository.insert({
          name: "Leandro Simeao",
          email: "leandrosimeao@yahoo.com.br",
          password: "123456",
        });

        const response = await request
          .get("/users")
          .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toStrictEqual(
          expect.objectContaining({
            name: "Leandro Simeao",
            email: "leandrosimeao@yahoo.com.br",
            password: "123456",
          })
        );
      });
    });
  });

  describe("/users/:id", () => {
    describe("GET", () => {
      test("Detalhar um usuário existente", async () => {
        const user = await repository.insert({
          name: "Leandro Simeao",
          email: "leandrosimeao@yahoo.com.br",
          password: "123456",
        });

        const response = await request
          .get(`/users/${user._id}`)
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            name: "Leandro Simeao",
            email: "leandrosimeao@yahoo.com.br",
            password: "123456",
          })
        );
      });

      test("Detalhar um usuário não existente", async () => {
        const response = await request
          .get(`/users/63f8f6bd6ba024559194fe0e`)
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            error: "User not found",
            code: 404,
          })
        );
      });
    });
  });

  describe("/users/:id", () => {
    describe("PUT", () => {
      test("Alterar detalhes de um usuário existente", async () => {
        const user = await repository.insert({
          name: "Leandro Simeao",
          email: "leandrosimeao@yahoo.com.br",
          password: "123456",
        });

        const response = await request
          .put(`/users/${user._id}`)
          .send({
            name: "Leandro Ferreira",
            email: "leandroferreira@yahoo.com.br",
            password: "123456abc",
          })
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(200);

        expect(response.body).toStrictEqual(
          expect.objectContaining({
            name: "Leandro Ferreira",
            email: "leandroferreira@yahoo.com.br",
            password: "123456abc",
          })
        );
      });
      test("Alterar detalhes de um usuário não existente", async () => {
        const response = await request
          .put(`/users/63f8f6bd6ba024559194fe0e`)
          .send({
            name: "Leandro Ferreira",
            email: "leandroferreira@yahoo.com.br",
            password: "123456abc",
          })
          .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            error: "User not found",
            code: 404,
          })
        );
      });
    });
  });

  describe("/users/:id", () => {
    describe("DELETE", () => {
      test("Remover um usuário existente", async () => {
        const user = await repository.insert({
          name: "Leandro Simeao",
          email: "leandrosimeao@yahoo.com.br",
          password: "123456",
        });

        const response = await request.delete(`/users/${user._id}`);
        expect(response.statusCode).toBe(204);
      });
      test("Remover um usuário não existente", async () => {
        const response = await request
          .delete(`/users/63f8f6bd6ba024559194fe0e`)
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            error: "User not found",
            code: 404,
          })
        );
      });
    });
  });
});
