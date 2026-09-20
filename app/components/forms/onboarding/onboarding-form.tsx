"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { useOnboardingForm } from "@/app/hooks/onboarding";

type SingleOption = {
  label: string;
  value: string;
};

const nicheOptions: SingleOption[] = [
  { label: "Fashion", value: "fashion" },
  { label: "Fitness", value: "fitness" },
  { label: "Gaming", value: "gaming" },
  { label: "Beauty", value: "beauty" },
  { label: "Business", value: "business" },
  { label: "Education", value: "education" },
  { label: "Lifestyle", value: "lifestyle" },
];

const followerOptions: SingleOption[] = [
  { label: "Less than 500", value: "under_500" },
  { label: "500 - 1,000", value: "500_1000" },
  { label: "1,000 - 5,000", value: "1000_5000" },
  { label: "5,000 - 10,000", value: "5000_10000" },
  { label: "More than 10,000", value: "over_10000" },
];

const creatorOptions: SingleOption[] = [
  { label: "New creator", value: "new" },
  { label: "Growing creator", value: "growing" },
  { label: "Established creator", value: "established" },
  { label: "Brand or business", value: "brand" },
];

const goalOptions: SingleOption[] = [
  { label: "Grow my audience", value: "grow" },
  { label: "Increase engagement", value: "engage" },
  { label: "Sell products or services", value: "sell" },
  { label: "Build my personal brand", value: "brand" },
  { label: "Post consistently", value: "consistency" },
];

const struggleOptions: SingleOption[] = [
  { label: "Coming up with ideas", value: "ideas" },
  { label: "Reaching more people", value: "reach" },
  { label: "Staying consistent", value: "consistency" },
  { label: "Feeling confident", value: "confidence" },
  { label: "Turning content into sales", value: "selling" },
];

const totalSteps = 5;

export function OnboardingForm() {
  const router = useRouter();
  const { submit, isSubmitting, error } = useOnboardingForm();

  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [followerRange, setFollowerRange] = useState("");
  const [creatorType, setCreatorType] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [struggles, setStruggles] = useState<string[]>([]);

  const selectedNiche = niche === "other" ? customNiche : niche;

  const selectSingleOption = (
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    setStep((currentStep) => currentStep + 1);
  };

  const toggleOption = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void
  ) => {
    setter(
      currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value]
    );
  };

  const canContinue = () => {
    if (step === 1) {
      return Boolean(selectedNiche.trim());
    }

    if (step === 2) {
      return Boolean(followerRange);
    }

    if (step === 3) {
      return Boolean(creatorType);
    }

    if (step === 4) {
      return goals.length > 0;
    }

    return struggles.length > 0;
  };

  const handleNext = () => {
    if (!canContinue()) {
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue()) {
      return;
    }

    const saved = await submit({
      niche: selectedNiche,
      followerRange,
      creatorType,
      goals,
      struggles,
    });

    if (saved) {
      router.push("/dashboard");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Personalize your workspace</span>
          <span>
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {
        step === 1 ? (
          <section>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
            Your content
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            What is your niche?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This helps us recommend ideas that are relevant to you.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {nicheOptions.map((option) => (
              <OptionButton key={option.value}
              option={option}
              selected={niche === option.value}
              onClick={() => selectSingleOption(option.value, setNiche)}/>
            ))}
            <OptionButton option={{ label: "Something else", value: "other"}}
            selected={niche === "other"}
            onClick={() => setNiche("other")}/>
          </div>
          {
            niche === "other" ? (
              <input autoFocus
              value={customNiche}
              onChange={(event) => setCustomNiche(event.target.value)}
              placeholder="Enter your niche"
              className="mt-4 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"/>

            ) : null
          }
          </section>
        ) : null
      }
      {step === 2 ? (
        <StepOptions
        eyebrow="Your audience"
        title="How large is your audience?"
        description="Choose the range the best describes your current audience."
        options={followerOptions}
        selectedValue={followerRange}
        onSelect={(value) => selectSingleOption(value, setFollowerRange)}/>
      ) : null}
      {
        step === 3 ? (
         <StepOptions 
         eyebrow="Your Stage"
         title="Which best describes you?"
         description="We will use this to tailor the level of your recommendations."
         options={creatorOptions}
         selectedValue={creatorType}
         onSelect={(value) => selectSingleOption(value, setCreatorType)}/>  
        ) : null}
        {
          step === 4 ? (
            <MultiSelectStep
            eyebrow="Your direction"
            title="What are your main goals?"
            description="Choose all that apply."
            options={goalOptions}
            selectedValues={goals}
            onToggle={(value) => toggleOption(value, goals, setGoals)}/>
          ) : null}
          {step === 5 ? (
            <MultiSelectStep
            eyebrow="Your challenges"
            title="What would you like help with?"
            description="Goose all that apply."
            options={struggleOptions}
            selectedValues={struggles}
            onToggle={(value) => toggleOption(value, struggles, setStruggles)}/>
          ) : null}

          {error ? (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div className="mt-10 flex items-center justify-between gap-3">
            <Button 
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}>Back</Button>
            {
              step < totalSteps ? (
                <Button type="button"
                onClick={handleNext}
                disabled={!canContinue()}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={!canContinue() || isSubmitting}>
                  {isSubmitting ? "Saving.." : "Finish onboarding"}
                </Button>
              )
            }
          </div>
    </form>
  );
}
function OptionButton({
  option,
  selected,
  onClick,
} : {
  option: SingleOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button"
    onClick={onClick}
    className={`rounded-2xl border p-4 text-left text-sm font-medium transition ${
      selected ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/10"
      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
    }`}>{option.label}</button>
  );
}
 
function StepOptions({
  eyebrow,
  title,
  description,
  options,
  selectedValue,
  onSelect,
}: {
  eyebrow: string,
  title: string,
  description: string,
  options: SingleOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <OptionButton 
          key={option.value}
          option={option}
          selected={selectedValue === option.value}
          onClick={() => onSelect(option.value)}/>
        ))}
      </div>
    </section>
  );
}
function MultiSelectStep({
  eyebrow,
  title,
  description,
  options,
  selectedValues,
  onToggle,
}: {
  eyebrow: string;
  title: string;
  description: string;
  options: SingleOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <OptionButton
          key={option.value}
          option={option}
          selected={selectedValues.includes(option.value)}
          onClick={() => onToggle(option.value)}/>
        ))}
      </div>
    </section>
  )
}