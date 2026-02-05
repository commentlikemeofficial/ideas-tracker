"use client";

import { useState } from "react";
import { Github, FileText, Zap, GitBranch, ArrowRight, Check } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-400 mb-8">
            <Zap className="h-4 w-4" />
            <span>Now in beta — 500+ repos documented</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
            Never write
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {" "}documentation{" "}
            </span>
            again
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            AI generates perfect READMEs, API docs, and changelogs from your code. 
            Auto-updates on every commit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-semibold transition">
              <Github className="h-5 w-5" />
              Connect GitHub — Free
            </button>
            <button className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition">
              See Demo
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">Free for 3 repos • No credit card required</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 border-t border-gray-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Github,
                title: "Connect Repository",
                desc: "One-click GitHub OAuth. We analyze your code structure, dependencies, and API endpoints."
              },
              {
                icon: FileText,
                title: "AI Generates Docs",
                desc: "Our AI reads your code and creates professional READMEs, API docs, and changelogs."
              },
              {
                icon: GitBranch,
                title: "Auto-Update on Commit",
                desc: "Docs stay fresh. We detect changes and suggest updates via pull requests."
              }
            ].map((step, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 border-t border-gray-800 bg-gray-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Documentation that actually stays current
              </h2>
              <p className="text-gray-400 mb-8">
                Stop embarrassing yourself with outdated READMEs. We monitor your code 
                and keep docs in sync automatically.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Auto-detect API endpoints from code",
                  "Generate changelogs from commit history",
                  "Smart README sections (Install, Usage, Contributing)",
                  "TypeScript / Python / Go / Rust support",
                  "One-click PR to update docs"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2">README.md</span>
              </div>
              <pre className="text-gray-300 overflow-x-auto">
{`# MyAPI

🚀 Fast, lightweight API framework

## Installation
\`\`\`bash
npm install myapi
\`\`\`

## Quick Start
\`\`\`typescript
import { createServer } from 'myapi';

const app = createServer();
app.listen(3000);
\`\`\`

## API Reference

### POST /users
Create a new user

| Param | Type | Required |
|-------|------|----------|
| name  | string | ✅ |
| email | string | ✅ |

## Changelog

### v1.2.0 (2026-02-05)
- ✨ Added authentication middleware
- 🐛 Fixed memory leak in requests
- 📚 Updated docs

---
*Generated by RepoDocs.ai*`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 border-t border-gray-800">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">Simple pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "For side projects",
                features: ["3 repos", "Basic README", "Manual updates"]
              },
              {
                name: "Pro",
                price: "$19",
                desc: "For serious builders",
                features: ["Unlimited repos", "API docs", "Auto-changelogs", "GitHub PRs", "Priority support"],
                popular: true
              },
              {
                name: "Team",
                price: "$49",
                desc: "For organizations",
                features: ["Everything in Pro", "Org-wide access", "Custom templates", "SSO", "SLA"]
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border ${plan.popular ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
                {plan.popular && (
                  <span className="inline-block bg-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}<span className="text-lg text-gray-500">/mo</span></div>
                <p className="text-gray-400 mb-6">{plan.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-semibold transition ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800 text-center text-gray-500">
        <p>© 2026 RepoDocs.ai — Built with AI, for developers</p>
      </footer>
    </main>
  );
}
