import { switchMockRole } from "@/app/actions/mock-role";

const roles = [
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "witness", label: "Witness" },
] as const;

export function RoleSwitcher({ currentRole }: { currentRole: string }) {
  return (
    <form action={switchMockRole} className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <button
          className={`rounded-panel border px-3 py-2 text-sm font-medium transition ${
            currentRole === role.value
              ? "border-leaf bg-leaf text-white"
              : "border-[var(--line)] bg-white/70 text-ink hover:border-leaf"
          }`}
          key={role.value}
          name="role"
          type="submit"
          value={role.value}
        >
          {role.label}
        </button>
      ))}
    </form>
  );
}
