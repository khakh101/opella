"use client";

import React, { useState } from "react";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Shield,
  Cloud,
  Terminal,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { resetToDefaults } from "@/lib/storage";

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [copied, setCopied] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const sqlSchema = `-- Opella AI Operating Model (AmplifAI) Database Schema
-- Run this in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS opella_use_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL,
  mode TEXT NOT NULL,
  risk_tier TEXT NOT NULL,
  current_gate TEXT NOT NULL,
  status TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE opella_use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON opella_use_cases FOR SELECT USING (true);

CREATE POLICY "Allow public insert access"
  ON opella_use_cases FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON opella_use_cases FOR UPDATE USING (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = async () => {
    await resetToDefaults();
    onResetData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-opella-forest flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-700" />
          Backend Configuration & Vercel Deployment Setup
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          The app works seamlessly out of the box with reactive browser local storage, and easily connects to Supabase for multi-user enterprise cloud persistence.
        </p>
      </div>

      {/* Backend Status Card */}
      <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSupabaseConfigured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {isSupabaseConfigured
                  ? "Supabase Backend Connected"
                  : "Browser LocalStorage Active (Zero Setup Needed)"}
              </h3>
              <p className="text-xs text-gray-500">
                {isSupabaseConfigured
                  ? "All use cases, gates, and business case forms sync in real-time with your PostgreSQL cloud instance."
                  : "All data is persisted safely in your browser session. Connect Supabase anytime to share with your team."}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isSupabaseConfigured
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {isSupabaseConfigured ? "CLOUD LIVE" : "LOCAL READY"}
          </span>
        </div>

        {/* Setup Instructions */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            How to Connect Supabase (Optional for Team Cloud Sync)
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-xs text-gray-700">
            <li>
              Create a free project at{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-opella-forest font-semibold underline inline-flex items-center gap-1"
              >
                supabase.com <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              Go to the <strong>SQL Editor</strong> in Supabase and paste the table schema below, then click <strong>Run</strong>.
            </li>
            <li>
              In your Vercel project dashboard (or local <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>), add:
              <pre className="bg-gray-900 text-emerald-400 p-3 rounded-lg mt-2 font-mono text-[11px] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# OR: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`}
              </pre>
            </li>
          </ol>
        </div>
      </div>

      {/* SQL Schema Box */}
      <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-gray-900 text-sm">Supabase Database Schema SQL</h3>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy SQL
              </>
            )}
          </button>
        </div>

        <pre className="bg-gray-950 text-gray-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed">
          {sqlSchema}
        </pre>
      </div>

      {/* Vercel Deployment Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-opella-forest">
          <Cloud className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-base text-gray-900">Vercel & GitHub Deployment Instructions</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          This repository is fully configured with standard Next.js 14 App Router and Tailwind CSS. To deploy:
        </p>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs text-gray-700 font-mono">
          <div># 1. Initialize git and commit:</div>
          <div className="text-gray-900">git add . && git commit -m &quot;Initial commit: Opella AmplifAI Lifecycle App&quot;</div>
          <div className="pt-1"># 2. Link your remote GitHub repository:</div>
          <div className="text-gray-900">git remote add origin https://github.com/&lt;your-username&gt;/&lt;your-repo-name&gt;.git</div>
          <div className="text-gray-900">git push -u origin main</div>
          <div className="pt-1"># 3. Import repo directly in Vercel:</div>
          <div className="text-gray-600">Connect to vercel.com &gt; &quot;Add New Project&quot; &gt; select your repository &gt; Deploy!</div>
        </div>
      </div>

      {/* Reset Data */}
      <div className="bg-white rounded-2xl p-6 border border-opella-border shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Reset Sample Initiatives</h4>
          <p className="text-xs text-gray-500">
            Restore standard sample Opella initiatives from the presentation (GIDE, Lumen, IBP, Wonka, etc.).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {resetMessage && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sample data restored!
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
