import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lightbulb,
  Sparkles,
  PlayCircleIcon,
  SendIcon,
  HeartIcon,
  MessageCircle,
  BookmarkIcon,
} from "lucide-react";
import { PricingSection } from "@/src/pricing";
const steps = [
  {
    number: "01",
    title: "Tell us what you create",
    description: "Share your niche, audience, and what you want your content to do.",
  },
  {
    number: "02",
    title: "Find your spark",
    description: "Get specific hooks and formats to help you start creating.",
  },
  {
    number: "03",
    title: "Make it yours",
    description: "Save ideas, post the ones you like, and keep your next idea close.",
  },
];

const features = [
  {
    eyebrow: "01 / PERSONALIZED",
    title: "Ideas that start with you.",
    description:
      "Your niche, creator stage, and goals shape suggestions that are more relevant than a generic prompt list.",
    note: "A hook that fits your niche",
    color: "landing-note--yellow",
    rotation: "-3deg",
  },
  {
    eyebrow: "02 / PRACTICAL",
    title: "A starting point, not homework.",
    description:
      "Each idea gives you a hook and a format direction, so you can move from thinking about content to making it.",
    note: "One idea. One Banger. A clear next step.",
    color: "landing-note--coral",
    rotation: "2deg",
  },
  {
    eyebrow: "03 / YOURS TO MANAGE",
    title: "Keep the good ones close.",
    description:
      "Save ideas for later, dismiss what does not fit, and mark the posts you have made.",
    note: "Saved you time spent on overthinking.",
    color: "landing-note--pine",
    rotation: "-2deg",
  },
];

function StickyNote({
  children,
  className = "",
  rotation = "0deg",
  delay = "0s",
}: {
  children: React.ReactNode;
  className?: string;
  rotation?: string;
  delay?: string;
}) {
  return (
    <article
      className={`landing-note ${className}`}
      style={
        {
          "--note-rotation": rotation,
          "--note-delay": delay,
        } as React.CSSProperties
      }
    >
      {children}
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-container landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="landing-eyebrow">
              For the creator with a dozen drafts
            </p>

            <h1 id="landing-title" className="landing-display landing-hero__title">
              Stop staring at a blank page before you post.
            </h1>

            <p className="landing-lede">
              Turn your niche and ambitions into thoughtful content ideas you
              can make your own.
            </p>

            <div className="landing-actions">
              <Link className="landing-button landing-button--primary" href="/signup">
                Get your first ideas free
                <ArrowRight aria-hidden="true" size={18} />
              </Link>

              <a className="landing-text-link" href="#how-it-works">
                See how it works
                <PlayCircleIcon aria-hidden="true" size={16} />
              </a>
            </div>

           
          </div>

          <div
            className="landing-board"
            aria-label="Examples of creator content ideas"
          >
            <div className="landing-board__label">
              <Sparkles aria-hidden="true" size={15} />
              A little less blank-page energy
            </div>

            <StickyNote
              className="landing-note--yellow landing-board__note landing-board__note--one"
              rotation="-5deg"
              delay="0.05s"
            >
              <span className="landing-note__eyebrow">A quick video</span>
              <p>“The tiny habit that made me consistent again”</p>
              <span className="landing-note__tag">Creator routines</span>
            </StickyNote>

            <StickyNote
              className="landing-note--paper landing-board__note landing-board__note--two"
              rotation="4deg"
              delay="0.18s"
            >
              <span className="landing-note__eyebrow">Try a carousel</span>
              <p>3 beginner mistakes I would avoid in your niche</p>
              <span className="landing-note__tag">Share what you love better.</span>
            </StickyNote>

            <StickyNote
              className="landing-note--coral landing-board__note landing-board__note--three"
              rotation="-2deg"
              delay="0.3s"
            >
              <span className="landing-note__eyebrow">A story to tell</span>
              <p>The moment I realized my audience needed something different</p>
            </StickyNote>

            <StickyNote
              className="landing-note--pine landing-board__note landing-board__note--four"
              rotation="3deg"
              delay="0.42s"
            >
              <Check aria-hidden="true" className="landing-note__check" size={17} />
              <p>Ideas should feel like a beginning, not homework.</p>
          
              <span className="landing-note__tag">
                <BookmarkIcon aria-hidden="true" size={13}/>Bookmark</span>
            </StickyNote>

            <span className="landing-board__spark landing-board__spark--one">✳</span>
            <span className="landing-board__spark landing-board__spark--two">✳</span>
          </div>
        </div>
      </section>

      <section className="landing-problem" aria-labelledby="problem-title">
        <div className="landing-container landing-problem__inner">
          <p className="landing-eyebrow landing-eyebrow--light">
            The familiar loop
          </p>
          <h2 id="problem-title" className="landing-display">
            Open app. Doomscroll. Close app. We Fix that.
          </h2>
          <p>
            Making content takes enough energy already. Finding a starting
            point should not be the hardest part.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-how"
        aria-labelledby="how-title"
      >
        <div className="landing-container">
          <div className="landing-section-heading">
            <p className="landing-eyebrow">A small nudge goes a long way</p>
            <h2 id="how-title" className="landing-display">
              From “what do I post?” to “that one’s good.”
            </h2>
          </div>

          <div className="landing-steps">
            {steps.map((step) => (
              <article className="landing-step" key={step.number}>
                <span className="landing-step__number">{step.number}</span>
                <h3 className="landing-display">{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-features" aria-labelledby="features-title">
        <div className="landing-container">
          <div className="landing-section-heading landing-section-heading--center">
            <p className="landing-eyebrow">
              A creative sidekick, not a content factory
            </p>
            <h2 id="features-title" className="landing-display">
              Make room for the ideas worth Gems.
            </h2>
          </div>

          <div className="landing-feature-list">
            {features.map((feature, index) => (
              <article
                className={`landing-feature ${
                  index % 2 ? "landing-feature--reverse" : ""
                }`}
                key={feature.eyebrow}
              >
                <div className="landing-feature__note-wrap">
                  <StickyNote
                    className={feature.color}
                    rotation={feature.rotation}
                  >
                    
                    <span className="landing-note__eyebrow">
                      {feature.eyebrow}
                    </span>
                     
                    <p>{feature.note}</p>
                   <span className="landing-note__scribble">
                        <HeartIcon aria-hidden="true" size={10}/>
                      <MessageCircle aria-hidden="true" size={10}/>
                      <SendIcon aria-hidden="true" size={10}/> 
                    </span>
                  </StickyNote>
                </div>

                <div className="landing-feature__copy">
                  <p className="landing-eyebrow">{feature.eyebrow}</p>
                  <h3 className="landing-display">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PricingSection/>

      <section className="landing-cta" aria-labelledby="cta-title">
        <div className="landing-container landing-cta__inner">
          <div>
            <p className="landing-eyebrow landing-eyebrow--light">
              Your next post starts somewhere
            </p>
            <h2 id="cta-title" className="landing-display">
              Let’s find your first idea.
            </h2>
          </div>

          <Link className="landing-button landing-button--paper" href="/signup">
            Get started free
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
      

      <footer className="landing-footer">
        <div className="landing-container landing-footer__inner">
          <div>
            <p className="landing-footer__brand">Brandify<span>.</span></p>
            <p>A thoughtful start for your next good idea.</p>
          </div>

          <nav className="landing-footer__links" aria-label="Footer">
            <Link href="/signup">Get started</Link>
            <Link href="/login">Log in</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#how-it-works">How it works</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}