import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  generateRecommendations,
  type ProfileInput,
  type Recommendation
} from "./gemini";

type UserGenerationOperation = "create" | "regenerate";

export class AiGenerationRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiGenerationRateLimitError";
  }
}

function translateReservationError(message: string): Error {
  if (message.includes("ai_generation_burst_limit")) {
    return new AiGenerationRateLimitError(
      "You’ve reached the short-term recommendation limit. Try again in about 10 minutes."
    );
  }
  if (message.includes("ai_generation_daily_limit")) {
    return new AiGenerationRateLimitError(
      "You’ve reached today’s recommendation limit. Try again tomorrow."
    );
  }
  if (message.includes("ai_generation_event_not_found")) {
    return new Error("Event not found");
  }
  return new Error("Unable to start recommendation generation");
}

async function finishGeneration(
  requestId: number,
  userId: string,
  status: "completed" | "failed"
) {
  const { error } = await createAdminClient().rpc("finish_ai_generation", {
    p_request_id: requestId,
    p_user_id: userId,
    p_status: status
  });
  if (error) console.error("Unable to finish AI generation reservation", error.message);
}

export async function generateUserRecommendations(input: {
  userId: string;
  eventId: string;
  operation: UserGenerationOperation;
  profile: ProfileInput;
}): Promise<Recommendation[]> {
  const { data, error } = await createAdminClient().rpc("reserve_ai_generation", {
    p_user_id: input.userId,
    p_event_id: input.eventId,
    p_operation: input.operation
  });

  if (error) throw translateReservationError(error.message);
  const requestId = Number(data);
  if (!Number.isSafeInteger(requestId) || requestId < 1) {
    throw new Error("Unable to start recommendation generation");
  }

  try {
    const recommendations = await generateRecommendations(input.profile);
    await finishGeneration(requestId, input.userId, "completed");
    return recommendations;
  } catch (generationError) {
    await finishGeneration(requestId, input.userId, "failed");
    throw generationError;
  }
}
