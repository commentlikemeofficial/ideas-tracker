"use client";

import { useState } from "react";
import { Github, FileText, RefreshCw, Copy, Check } from "lucide-react";

export default function Dashboard() {
  const [repoUrl, setRepoUrl] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateDocs = async () => {
    if (!repoUrl) return;
    setLoading(true);
    
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, language }),
    });
    
    const data = await res.json();
    setResult(data.readme);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-xl">RepoDocs.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Free plan: 1/3 repos used</span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              RK
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Your Repositories</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <Github className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">my-awesome-project</p>
                  <p className="text-xs text-gray-500">Updated 2h ago</p>
                </div>
              </div>
              <button className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition">
                + Add Repository
              </button>
            </div>
          </div>

          <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <h3 className="font-semibold text-indigo-400 mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-gray-400 mb-4">Unlimited repos, API docs, and auto-updates</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl font-medium transition">
              $19/mo — Upgrade
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generator */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-6">Generate Documentation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Repository URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <button
                onClick={generateDocs}
                disabled={loading || !repoUrl}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Analyzing code...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Generate README
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h3 className="font-semibold">Generated README.md</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-6 overflow-x-auto text-sm text-gray-300 font-mono">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
