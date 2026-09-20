 import type { ReactNode } from "react";
 export default function OnboardingLayout({ children }: {children: ReactNode}) {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">

         <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                    Brandify
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    Personalize your workspace
                </h1>

            </div>
    {children}
        </div>
        </main>
    );
 }