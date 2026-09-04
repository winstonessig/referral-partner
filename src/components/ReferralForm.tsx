"use client";

import { useState } from "react";

export default function ReferralForm({
  partnerId,
  partnerName,
}: {
  partnerId: number;
  partnerName: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, partnerId }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h3 className="heading text-orange text-3xl mb-4">
          WE&apos;LL BE IN TOUCH.
        </h3>
        <p className="text-navy text-lg mb-2">
          Thanks for reaching out through {partnerName}&apos;s page.
        </p>
        <p className="text-navy/60 text-sm">
          Your $100 discount will be applied when you book.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-navy text-xs block mb-2">
            FIRST NAME
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="subheading text-navy text-xs block mb-2">
            LAST NAME
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-navy text-xs block mb-2">
            EMAIL
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="subheading text-navy text-xs block mb-2">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="subheading text-navy text-xs block mb-2">
          PREFERRED MOVE DATE
        </label>
        <input
          type="date"
          name="moveDate"
          className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="subheading text-navy text-xs block mb-2">
          TELL US ABOUT YOUR MOVE
        </label>
        <textarea
          name="message"
          rows={3}
          className="w-full bg-white border border-navy/20 text-navy px-4 py-3 focus:border-orange focus:outline-none transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red text-sm">{errorMsg}</p>
      )}

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-brand btn-orange text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "SENDING..." : "CLAIM YOUR $100 DISCOUNT"}
        </button>
      </div>
    </form>
  );
}
