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
  { value: "Under $25", label: "Under $25" },
  { value: "$25 – $50", label: "$25 – $50" },
  { value: "$50 – $100", label: "$50 – $100" },
  { value: "$100 – $200", label: "$100 – $200" },
  { value: "$200 – $500", label: "$200 – $500" },
  { value: "$500+", label: "$500+" }
] as const;

const LEGACY_BUDGET_LABELS: Record<string, string> = {
  low: "Under $50",
  mid: "$50 – $150",
  high: "$150+"
};

export function getBudgetLabel(value?: string | null) {
  if (!value) return null;
  return LEGACY_BUDGET_LABELS[value.toLowerCase()] ?? value;
}

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
