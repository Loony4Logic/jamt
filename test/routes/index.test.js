import request from "supertest";
import app from "#app";

let server;
let agent;
beforeAll((done) => {
  server = app.listen(3500, () => {
    agent = request.agent(server);
    done();
  });
});

afterAll((done) => {
  server.close();
  done();
});

describe("checking server is up and running", () => {
  it("responds on index", (done) => {
    agent
      .get("/")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.res).toMatch(/Server Working/);
        done();
      });
  });
});
