import { describe, expect, it } from "vitest";
import { canViewChildNote, type PermissionActor } from "../../packages/shared/src/permissions";

const note = {
  childId: "child-1",
  visibility: "child_private" as const,
};

describe("ChildNote privacy boundary", () => {
  it("allows child to read their own ChildNote", () => {
    const child: PermissionActor = {
      id: "child-1",
      role: "child",
      familyId: "family-1",
    };

    expect(canViewChildNote(child, note)).toBe(true);
  });

  it("denies parent reading ChildNote", () => {
    const parent: PermissionActor = {
      id: "parent-1",
      role: "parent",
      familyId: "family-1",
    };

    expect(canViewChildNote(parent, note)).toBe(false);
  });

  it("denies witness reading ChildNote", () => {
    const witness: PermissionActor = {
      id: "witness-1",
      role: "witness",
      familyId: "family-1",
    };

    expect(canViewChildNote(witness, note)).toBe(false);
  });
});
