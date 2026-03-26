// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

describe("repo contracts", () => {
  it("defines the required testing scripts at the root", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve("package.json"), "utf8")
    ) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["test"]).toBeTruthy();
    expect(packageJson.scripts["test:unit"]).toBeTruthy();
    expect(packageJson.scripts["test:integration"]).toBeTruthy();
    expect(packageJson.scripts["test:contract"]).toBeTruthy();
    expect(packageJson.scripts["test:e2e"]).toBeTruthy();
    expect(packageJson.scripts["test:e2e:smoke"]).toBeTruthy();
    expect(packageJson.scripts["verify"]).toBeTruthy();
  });
});
