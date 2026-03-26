import {
  isAuditableAction,
  isCriticalErrorSeverity
} from "@operapyme/domain";

describe("audit helpers", () => {
  it("recognizes auditable actions", () => {
    expect(isAuditableAction("create")).toBe(true);
    expect(isAuditableAction("assign_role")).toBe(true);
    expect(isAuditableAction("archive_forever")).toBe(false);
  });

  it("flags critical severities explicitly", () => {
    expect(isCriticalErrorSeverity("critical")).toBe(true);
    expect(isCriticalErrorSeverity("error")).toBe(false);
  });
});
