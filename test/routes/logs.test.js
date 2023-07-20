import request from "supertest";
import app from "#app";

let server; let
  agent;
beforeAll(async () => {
  server = await app.listen(3501);
  agent = request.agent(server);
});

afterAll((done) => {
  server.close();
  done();
});

describe("checking logs services", () => {
  it("requesting all logs", (done) => {
    agent
      .get("/logs")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.meta.count).toBe(0);
        done();
      });
  });
});
