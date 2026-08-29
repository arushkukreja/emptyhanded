"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { RefreshCw } from "lucide-react";
import { regenerateRecommendations } from "../actions";

export default function RegenerateButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    start(async () => {
      const res = await regenerateRecommendations(eventId);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }
  return (
    <div className="text-right">
      <Button onClick={onClick} disabled={pending} variant="primary" size="sm" className="inline-flex items-center gap-2">
        <RefreshCw size={14} className={pending ? "animate-spin text-accent" : "text-accent"} />
        {pending ? "Thinking..." : "Regenerate"}
      </Button>
      {error && <p role="alert" className="mt-2 max-w-xs text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
