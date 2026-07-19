import { Activity, BrainCircuit, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import ScanPanel from "./components/ScanPanel";

const metrics = [
    { label: "Critical Findings", value: "24", tone: "text-rose-300" },
    { label: "Security Score", value: "92/100", tone: "text-emerald-300" },
    { label: "AI Fixes", value: "118", tone: "text-sky-300" },
];

const recentFindings = [
    { title: "SQL injection in orders query", severity: "High", context: "Node.js / Express" },
    { title: "JWT validation bypass", severity: "Critical", context: "NestJS API" },
    { title: "Unsafe file upload handling", severity: "Medium", context: "Laravel service" },
];

export default function HomePage() {
    return (
        <main className="min-h-screen px-6 py-10 text-slate-100 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <header className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                                <Sparkles className="h-4 w-4" />
                                AI-native application security platform
                            </div>
                            <div>
                                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">VulnPilot AI</h1>
                                <p className="mt-3 text-lg text-slate-300">
                                    An experienced security engineer in every pull request, helping teams catch,
                                    prioritize, and fix vulnerabilities before deployment.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
                            <div className="flex items-center gap-2 font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                Enterprise-ready by design
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    {metrics.map(metric => (
                        <div
                            key={metric.label}
                            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl"
                        >
                            <p className="text-sm text-slate-400">{metric.label}</p>
                            <p className={`mt-3 text-3xl font-semibold ${metric.tone}`}>{metric.value}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-slate-100">
                            <BrainCircuit className="h-5 w-5 text-sky-300" />
                            <h2 className="text-xl font-semibold">Recent security findings</h2>
                        </div>
                        <div className="mt-6 space-y-3">
                            {recentFindings.map(finding => (
                                <div
                                    key={finding.title}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                                >
                                    <div>
                                        <p className="font-medium">{finding.title}</p>
                                        <p className="text-sm text-slate-400">{finding.context}</p>
                                    </div>
                                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-200">
                                        {finding.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-slate-100">
                            <TrendingUp className="h-5 w-5 text-emerald-300" />
                            <h2 className="text-xl font-semibold">Risk posture</h2>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                <p className="text-sm text-slate-400">OWASP coverage</p>
                                <p className="mt-2 text-2xl font-semibold text-white">Top 10 + CWE</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                <p className="text-sm text-slate-400">AI mentor</p>
                                <p className="mt-2 text-2xl font-semibold text-white">Explain, patch, and learn</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                <p className="text-sm text-slate-400">Delivery</p>
                                <p className="mt-2 text-2xl font-semibold text-white">PR-ready remediation</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-slate-100">
                        <Activity className="h-5 w-5 text-fuchsia-300" />
                        <h2 className="text-xl font-semibold">Scan your code</h2>
                    </div>
                    <div className="mt-6">
                        <ScanPanel />
                    </div>
                </section>
            </div>
        </main>
    );
}
