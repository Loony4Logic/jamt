import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders } from "#util";

let storage;
beforeAll(async () => {
  storage = new StorageProvider("test.json");
  await asyncPlaceholders("sleep", 1000);
});

afterAll(async () => {
  console.log("I am being called atleast!");
  await storage.clear();
});

describe("Testing database", () => {
  it("checking read", () => {
    const logs = storage.read();
    expect(logs).toStrictEqual([]);
  });

  it("checking write", () => {
    const log = { level: "test", message: "test", timestamp: "test" };
    storage.write(log);
    const logs = storage.read();
    expect(logs[0]).toStrictEqual(log);
  });
});
