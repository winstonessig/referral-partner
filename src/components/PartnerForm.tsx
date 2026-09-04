"use client";

import { useState } from "react";

export default function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [partnerSlug, setPartnerSlug] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setPartnerSlug(data.slug);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    const partnerUrl = `${window.location.origin}/partner/${partnerSlug}`;
    return (
      <div className="text-center py-16">
        <h3 className="heading text-orange text-3xl mb-4">YOU&apos;RE IN.</h3>
        <p className="text-blue text-lg mb-4">
          Your co-branded page is live. Share it with your clients:
        </p>
        <a
          href={partnerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand btn-outline-white text-sm inline-block mb-6"
        >
          VIEW YOUR PAGE
        </a>
        <p className="text-white/40 text-xs break-all max-w-md mx-auto">
          {partnerUrl}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            FIRST NAME
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            LAST NAME
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            EMAIL
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            COMPANY NAME
          </label>
          <input
            type="text"
            name="companyName"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            BROKERAGE
          </label>
          <input
            type="text"
            name="brokerage"
            required
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 focus:border-orange focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            YOUR HEADSHOT
          </label>
          <input
            type="file"
            name="headshot"
            accept="image/*"
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 file:mr-4 file:bg-orange file:text-white file:border-0 file:px-4 file:py-1 file:cursor-pointer file:font-bold file:text-xs file:uppercase file:tracking-wider"
          />
        </div>
        <div>
          <label className="subheading text-blue text-xs block mb-2">
            COMPANY LOGO
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-3 file:mr-4 file:bg-orange file:text-white file:border-0 file:px-4 file:py-1 file:cursor-pointer file:font-bold file:text-xs file:uppercase file:tracking-wider"
          />
        </div>
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
          {status === "submitting" ? "SUBMITTING..." : "SUBMIT"}
        </button>
      </div>
    </form>
  );
}
