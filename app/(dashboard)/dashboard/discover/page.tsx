import { IdeasFeed } from "@/app/components/features/ideas/ideas-feed";

export default function DiscoverPage() {
  return (
    <main className="min-h-full px-4 py-8 text-[#241C1C] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-[#241C1C]/15 pb-6">
          {/* <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E0431F]">
            Your creator workspace
          </p> */}
          <div className="flex flex-wrap items-end gap-3 justify-between">
            <div>
 <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">
            Your idea feed
          </h1>
          <p className="mt-2 text-sm text-[#6B5F5A]">
            Browse your generated ideas, newest first.
          </p>
            </div>
  

          <div>Filter</div>
          </div>
       
        </header>

        <IdeasFeed />
      </div>
    </main>
  );
}