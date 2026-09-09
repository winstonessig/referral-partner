"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <main className="bg-navy min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <Image
            src="/brand/secondary_orange.svg"
            alt="Moving Mountains"
            width={200}
            height={44}
            className="mx-auto mb-4"
          />
          <p className="subheading text-blue text-xs">ADMIN ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="subheading text-blue text-xs block mb-2">
              ENTER PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              maxLength={10}
              autoFocus
              className="w-full bg-dark-teal border border-blue/30 text-white px-4 py-4 text-center text-2xl tracking-[0.5em] focus:border-orange focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-orange text-sm text-center">Wrong pin.</p>
          )}
          <button type="submit" className="btn-brand btn-orange text-sm w-full">
            ENTER
          </button>
        </form>
      </div>
    </main>
  );
}
