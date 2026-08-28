export const OCCASIONS = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "💍" },
  { value: "wedding", label: "Wedding", emoji: "💒" },
  { value: "baby_shower", label: "Baby shower", emoji: "👶" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "housewarming", label: "Housewarming", emoji: "🏡" },
  { value: "holiday", label: "Holiday", emoji: "🎁" }
] as const;

export type OccasionType = (typeof OCCASIONS)[number]["value"];

export const OCCASION_EMOJI: Record<string, string> = Object.fromEntries(
  OCCASIONS.map(o => [o.value, o.emoji])
);
export const OCCASION_LABEL: Record<string, string> = Object.fromEntries(
  OCCASIONS.map(o => [o.value, o.label])
);

export const ARCHETYPES = [
  "Homebody",
  "Foodie",
  "Tech Person",
  "Reader",
  "Outdoorsy",
  "Fitness Person",
  "Creative",
  "Luxury Seeker"
] as const;

export const BUDGET_TIERS = [
  { value: "low", label: "Under $50" },
  { value: "mid", label: "$50 – $150" },
  { value: "high", label: "$150+" }
] as const;

export const RELATIONSHIPS = [
  "Partner",
  "Parent",
  "Sibling",
  "Child",
  "Close friend",
  "Friend",
  "Coworker",
  "Family",
  "Other"
] as const;

export const AGE_RANGES = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;
