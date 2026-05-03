import { type FormEvent, useState } from "react";

type LoginProps = {
  onLogin: (user: { name: string; email: string }) => void;
  initialProfile?: { name: string; email: string } | null;
};

const demoUser = {
  name: "Ava Bennett",
  email: "ava.bennett@example.com",
};

export function Login({ onLogin, initialProfile }: LoginProps) {
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [email, setEmail] = useState(initialProfile?.email ?? "");
  const hasSaved = Boolean(initialProfile?.email);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin({ name: name.trim(), email: email.trim().toLowerCase() });
  };

  const applyDemo = () => {
    setName(demoUser.name);
    setEmail(demoUser.email);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="surface-strong glow-border relative w-full max-w-4xl overflow-hidden p-8">
        <div className="pointer-events-none absolute -top-24 right-0 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Vault Login
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold text-slate-100">
              Welcome back to Budget Vault
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to load your private budgeting timeline and insights dashboard.
            </p>
            {hasSaved && (
              <p className="mt-3 text-sm text-slate-300">
                We prefilled your last profile. Sign in to continue.
              </p>
            )}
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                Real-time category tracking and budget alerts.
              </div>
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                Intelligent monthly summaries with smart visual cues.
              </div>
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                Data stays in this browser session.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Full name</label>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input-field mt-2"
                placeholder="Jordan Lee"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-field mt-2"
                placeholder="jordan@company.com"
              />
            </div>
            <button type="submit" className="glow-button">
              Enter dashboard
            </button>
            <button type="button" onClick={applyDemo} className="ghost-button w-full">
              Use demo profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
