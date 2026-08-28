"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { RefreshCw } from "lucide-react";
import { regenerateRecommendations } from "../actions";

export default function RegenerateButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onClick() {
    start(async () => {
      const res = await regenerateRecommendations(eventId);
      if ("error" in res && res.error) return;
      router.refresh();
    });
  }
  return (
    <Button onClick={onClick} disabled={pending} variant="primary" size="sm" className="inline-flex items-center gap-2">
      <RefreshCw size={14} className={pending ? "animate-spin text-accent" : "text-accent"} />
      {pending ? "Thinking..." : "Regenerate ideas"}
    </Button>
  );
}
