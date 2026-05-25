import Link from "next/link";
import {
  confirmPrinciplesFromOnboarding,
  createFamilyFromOnboarding,
  getParentOnboardingState,
  initializeRewardPoolFromOnboarding,
  onboardingPrinciples,
} from "@/lib/server/onboarding";

type SearchParams = Promise<{
  step?: string;
  error?: string;
}>;

const forbiddenRewardTypes = [
  "Basic care, love, safety, sleep, food, medical care",
  "Cash, wallet, merchant shopping, gift cards",
  "School, class, teacher, institution tasks",
  "Video monitoring, location tracking, hard device lock",
  "Ranking, public child social, random paid rewards",
];

function ErrorMessage({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  const copy: Record<string, string> = {
    "family-name": "Please enter a family name with at least two characters.",
    principles: "Please confirm all five principles before continuing.",
    "principles-required": "Principles must be confirmed before creating a reward pool.",
    "reward-pool": "Please add a safe small wish and avoid blocked reward categories.",
  };

  return (
    <p className="rounded-panel border border-berry/30 bg-white px-3 py-2 text-sm text-berry">
      {copy[error] ?? "This step needs one more check before it can be saved."}
    </p>
  );
}

export default async function ParentOnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const state = await getParentOnboardingState();
  const step =
    params.step ??
    (!state.family
      ? "welcome"
      : !state.principlesDone
        ? "principles"
        : !state.rewardPoolDone
          ? "reward-pool"
          : "done");

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="border-b border-[var(--line)] pb-5">
          <Link className="text-sm font-medium text-leaf" href="/">
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Parent onboarding</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Set up the family space, confirm the shared rules, then create a small
            wish pool for the first promise.
          </p>
        </header>

        <ErrorMessage error={params.error} />

        <nav className="grid gap-2 text-sm sm:grid-cols-4">
          {["welcome", "family", "principles", "reward-pool"].map((item, index) => (
            <div
              className={`rounded-panel border px-3 py-2 ${
                step === item
                  ? "border-leaf bg-leaf text-white"
                  : "border-[var(--line)] bg-white/70"
              }`}
              key={item}
            >
              {index + 1}. {item}
            </div>
          ))}
        </nav>

        {step === "welcome" ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-xl font-semibold">Start with one clear family promise</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Reward records what was agreed, what the child tried, and how the
              parent responded. It keeps the first loop small enough to test on this
              computer.
            </p>
            <div className="mt-5">
              <Link
                className="rounded-panel bg-leaf px-4 py-2 text-sm font-semibold text-white"
                href="/parent/onboarding?step=family"
              >
                Create family
              </Link>
            </div>
          </section>
        ) : null}

        {step === "family" ? (
          <form
            action={createFamilyFromOnboarding}
            className="rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <h2 className="text-xl font-semibold">Family name</h2>
            <label className="mt-4 flex flex-col gap-2 text-sm font-medium">
              Display name
              <input
                className="rounded-panel border border-[var(--line)] px-3 py-2"
                defaultValue="Demo Family"
                name="familyName"
                required
              />
            </label>
            <button className="mt-5 rounded-panel bg-leaf px-4 py-2 text-sm font-semibold text-white">
              Save family
            </button>
          </form>
        ) : null}

        {step === "principles" && state.family ? (
          <form
            action={confirmPrinciplesFromOnboarding}
            className="rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <input name="familyId" type="hidden" value={state.family.id} />
            <h2 className="text-xl font-semibold">Five principles</h2>
            <div className="mt-4 flex flex-col gap-3">
              {onboardingPrinciples.map((principle) => (
                <label
                  className="flex gap-3 rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 text-sm leading-6"
                  key={principle.id}
                >
                  <input
                    className="mt-1 size-4"
                    name="principles"
                    type="checkbox"
                    value={principle.id}
                  />
                  <span>{principle.text}</span>
                </label>
              ))}
            </div>
            <button className="mt-5 rounded-panel bg-leaf px-4 py-2 text-sm font-semibold text-white">
              Confirm principles
            </button>
          </form>
        ) : null}

        {step === "reward-pool" && state.family ? (
          <form
            action={initializeRewardPoolFromOnboarding}
            className="rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <input name="familyId" type="hidden" value={state.family.id} />
            <h2 className="text-xl font-semibold">Reward pool</h2>
            <div className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Small wish
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2"
                  defaultValue="Choose tonight's bedtime story"
                  name="smallWish"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Medium wish
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2"
                  defaultValue="Plan a weekend park walk"
                  name="mediumWish"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Large wish
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2"
                  defaultValue="Create a family movie night"
                  name="largeWish"
                />
              </label>
            </div>
            <section className="mt-5 rounded-panel border border-[var(--line)] bg-[var(--background)] p-4">
              <h3 className="text-sm font-semibold">Blocked reward types</h3>
              <ul className="mt-2 list-inside list-disc text-sm leading-6 text-[var(--muted)]">
                {forbiddenRewardTypes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <button className="mt-5 rounded-panel bg-leaf px-4 py-2 text-sm font-semibold text-white">
              Create reward pool
            </button>
          </form>
        ) : null}

        {step === "done" ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-xl font-semibold">Onboarding complete</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Family setup, principles, and reward pool are ready. The next step is
              the first small contract.
            </p>
            <Link
              className="mt-5 inline-flex rounded-panel bg-leaf px-4 py-2 text-sm font-semibold text-white"
              href="/"
            >
              Return to dashboard
            </Link>
          </section>
        ) : null}
      </section>
    </main>
  );
}
