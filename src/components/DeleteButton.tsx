"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
  type,
}: {
  id: number;
  type: "partner" | "referral";
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    const endpoint =
      type === "partner" ? "/api/admin/partners" : "/api/admin/referrals";

    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    router.refresh();
    setConfirming(false);
  }

  if (confirming) {
    return (
      <span className="flex gap-2">
        <button
          onClick={handleDelete}
          className="text-orange text-xs font-bold hover:underline"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-blue/50 text-xs hover:underline"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red text-xs hover:text-orange transition-colors"
    >
      Delete
    </button>
  );
}
