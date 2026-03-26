// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

const requiredPaths = [
  "docs/README.md",
  "docs/architecture/SUPABASE_ARCHITECTURE.md",
  "docs/domain/AUDIT_MODEL.md",
  "docs/governance/SUPABASE_RULES.md",
  "docs/saas-blueprint.md",
  "tests/README.md",
  "tools/stress-harness/README.md",
  "supabase/README.md"
];

describe("documentation contracts", () => {
  it("keeps the secure foundation docs in place", () => {
    for (const relativePath of requiredPaths) {
      expect(fs.existsSync(path.resolve(relativePath))).toBe(true);
    }
  });

  it("removes the old recruiting-product surfaces from the docs index", () => {
    const docsReadme = fs.readFileSync(
      path.resolve("docs/README.md"),
      "utf8"
    );

    expect(docsReadme).not.toContain("/candidate/*");
    expect(docsReadme).not.toContain("/workspace/*");
  });
});
