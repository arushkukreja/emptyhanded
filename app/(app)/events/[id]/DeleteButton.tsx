"use client";

import { useTransition } from "react";
import Button from "@/components/Button";
import { deleteEvent } from "../actions";

export default function DeleteButton({ eventId }: { eventId: string }) {
  const [pending, start] = useTransition();
  function onClick() {
    if (!confirm("Delete this event and its recommendations?")) return;
    start(async () => {
      await deleteEvent(eventId);
    });
  }
  return (
    <Button onClick={onClick} disabled={pending} variant="danger" size="sm">
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
