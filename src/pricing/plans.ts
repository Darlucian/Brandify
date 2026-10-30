export type PricingPlanId = "starter" | "pro" | "creator";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    priceLabel: "Free",
    description: "A simple place to capture and refine ideas before you post.",
    features: [
      "Up to 20 idea saves",
      "Profile setup and niche prompts",
      "Basic inspiration library",
      "Content idea generation",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 15000,
    priceLabel: "₦15,000 / month",
    description: "Built for creators who want steady output and better momentum.",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited saved ideas",
      "Priority AI content generation",
      "Trend-aware suggestions",
      "Export + organize ideas",
      "Monthly analytics dashboard",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    price: 35000,
    priceLabel: "₦35,000 / month",
    description: "A more advanced workflow for building a repeatable content engine.",
    features: [
      "Everything in Pro",
      "Deeper analytics and insights",
      "Faster content planning cycles",
      "Early access to new features",
      "Dedicated growth guidance",
    ],
  },
];
