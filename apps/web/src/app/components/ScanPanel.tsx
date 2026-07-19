"use client";

import { useState } from "react";

const defaultCode = `app.get('/user', (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id;
  connection.query(query);
  res.send('done');
});`;

export default function ScanPanel() {
    const [code, setCode] = useState(defaultCode);
    const [language, setLanguage] = useState("javascript");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function runScan() {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/scans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language, filename: "sample.js" }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ message: "Scan failed. Make sure the API is running on port 4000." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <label className="mb-2 block text-sm text-slate-300">Language</label>
                <select
                    value={language}
                    onChange={event => setLanguage(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                </select>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <label className="mb-2 block text-sm text-slate-300">Paste code to scan</label>
                <textarea
                    value={code}
                    onChange={event => setCode(event.target.value)}
                    className="min-h-[240px] w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 font-mono text-sm text-slate-100"
                />
            </div>

            <button
                onClick={runScan}
                disabled={loading}
                className="rounded-xl bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Scanning..." : "Scan code"}
            </button>

            {result && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <h3 className="text-lg font-semibold text-white">Scan results</h3>
                    <p className="mt-2 text-sm text-slate-300">{result.message}</p>

                    {result.findings?.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {result.findings.map((finding: any) => (
                                <div
                                    key={finding.id}
                                    className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-medium text-white">{finding.title}</p>
                                        <span className="rounded-full bg-rose-400/20 px-2 py-1 text-xs text-rose-200">
                                            {finding.severity}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-300">{finding.recommendation}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-emerald-300">No issues detected in the sample.</p>
                    )}

                    {result.aiSummary?.content && (
                        <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
                            <p className="text-sm text-slate-200">{result.aiSummary.content}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
