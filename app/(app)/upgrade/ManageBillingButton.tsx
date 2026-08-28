"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Billing portal failed");
      window.location.href = data.url;
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Billing portal failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={onClick} disabled={loading} variant="accent" size="lg" className="w-full">
        {loading ? "Opening billing..." : "Manage billing"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
