import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders } from "#util";

let storage;
beforeAll(async () => {
  storage = new StorageProvider("test.json");
  await asyncPlaceholders("sleep", 1000);
});

afterAll(async () => {
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

  it("Checking filter", () => {
    const logs = [
      { level: "test", message: "test", timestamp: "test" },
      { level: "test", message: "xyz", timestamp: "test" },
    ];
    logs.forEach((log) => storage.write(log));

    const filterText = "xyz";
    const filteredLogs = storage.filter(filterText);
    expect(filteredLogs.length).toBe(1);
  });
});
