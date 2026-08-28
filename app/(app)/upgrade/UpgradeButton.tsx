"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Checkout failed");
      window.location.href = json.url;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={onClick} disabled={loading} variant="accent" size="lg" className="w-full">
        {loading ? "Redirecting..." : "Upgrade for $4.99/mo"}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
