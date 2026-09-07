"use client";

import { useState } from "react";

export default function ReviewOutreachForm() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("running");
    setResult("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/agent/review-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName: formData.get("reviewerName"),
          reviewText: formData.get("reviewText"),
          rating: 5,
          reviewScreenshotUrl: formData.get("screenshotUrl") || undefined,
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      setStatus("done");
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Agent failed");
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="subheading text-blue text-xs block mb-2">
              REVIEWER NAME (as on Google)
            </label>
            <input
              type="text"
              name="reviewerName"
              required
              placeholder="John Smith"
              className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="subheading text-blue text-xs block mb-2">
              REVIEW SCREENSHOT URL (optional)
            </label>
            <input
              type="url"
              name="screenshotUrl"
              placeholder="https://..."
              className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            REVIEW TEXT
          </label>
          <textarea
            name="reviewText"
            required
            rows={3}
            placeholder="Paste the 5-star review text here..."
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none text-sm resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "running"}
          className="btn-brand btn-orange text-xs disabled:opacity-50"
        >
          {status === "running" ? "AGENT RUNNING..." : "RUN OUTREACH AGENT"}
        </button>
      </form>

      {result && (
        <pre className={`mt-6 p-4 text-xs overflow-x-auto ${status === "error" ? "bg-red/10 text-red" : "bg-dark-teal text-tan"} border border-blue/10`}>
          {result}
        </pre>
      )}
    </div>
  );
}
