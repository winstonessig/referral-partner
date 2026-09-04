import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { eq } from "drizzle-orm";
import ReferralForm from "@/components/ReferralForm";

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const partner = await db
    .select()
    .from(partners)
    .where(eq(partners.slug, slug))
    .get();

  if (!partner) notFound();

  const fullName = `${partner.firstName} ${partner.lastName}`;

  return (
    <main>
      {/* HERO - Navy background with $100 offer */}
      <section className="relative bg-navy min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Image
            src="/brand/pattern3_white.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="heading text-orange text-lg border border-orange px-4 py-2 inline-block">
                  SAVE $100 ON YOUR MOVE
                </span>
              </div>
              <h1 className="heading text-4xl md:text-6xl text-white leading-[0.95] mb-6">
                GET $100 OFF YOUR MOVE
                <br />
                <span className="text-orange">WITH MOVING MOUNTAINS</span>
              </h1>
              <p className="accent-text text-tan text-xl md:text-2xl mb-6">
                Moving Mountains loves {partner.firstName}&apos;s friends!
              </p>
              <p className="text-blue text-lg max-w-md">
                Book your move with Moving Mountains through {fullName} and save
                $100 instantly.
              </p>
            </div>

            {/* Partner info card */}
            <div className="bg-dark-teal p-8 border border-blue/20">
              <div className="flex flex-col items-center text-center">
                {partner.headshotUrl && (
                  <div className="w-32 h-32 mb-6 overflow-hidden">
                    <Image
                      src={partner.headshotUrl}
                      alt={fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="heading text-white text-2xl mb-1">
                  {fullName.toUpperCase()}
                </h2>
                <p className="subheading text-blue text-xs mb-4">
                  {partner.companyName.toUpperCase()} &bull;{" "}
                  {partner.brokerage.toUpperCase()}
                </p>
                {partner.logoUrl && (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.companyName}
                    width={120}
                    height={60}
                    className="opacity-80 mt-2"
                  />
                )}

                <div className="w-full h-px bg-blue/20 my-6" />

                <div className="flex items-center gap-4">
                  <Image
                    src="/brand/mountainbadge_orange.svg"
                    alt="Moving Mountains"
                    width={48}
                    height={48}
                  />
                  <p className="subheading text-blue text-xs text-left">
                    TRUSTED PARTNER OF
                    <br />
                    MOVING MOUNTAINS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange" />
      </section>

      {/* REFERRAL FORM - Tan background */}
      <section className="bg-tan py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="heading text-navy text-3xl md:text-4xl text-center mb-3">
            BOOK YOUR MOVE
          </h2>
          <p className="text-navy/70 text-center mb-12">
            Fill out the form below and we&apos;ll reach out to schedule your move.
            Mention {partner.firstName}&apos;s name to claim your $100 discount.
          </p>

          <ReferralForm partnerId={partner.id} partnerName={partner.firstName} />
        </div>
      </section>

      {/* TEAM & CREDENTIALS - Navy background */}
      <section className="bg-navy py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 w-1/4 h-full opacity-5">
          <Image
            src="/brand/pattern1_white.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="heading text-white text-3xl md:text-4xl text-center mb-4">
            THE MOVING MOUNTAINS TEAM
          </h2>
          <p className="accent-text text-orange text-xl text-center mb-16">
            The discipline of doing it well.
          </p>

          {/* Credentials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "FULLY INSURED",
                desc: "Complete liability coverage for every move. Your belongings are protected.",
              },
              {
                title: "TRAINED PROFESSIONALS",
                desc: "Every mover is trained in precision handling and customer care.",
              },
              {
                title: "5-STAR RATED",
                desc: "Consistently rated 5 stars by homeowners across the region.",
              },
            ].map((cred) => (
              <div key={cred.title} className="text-center">
                <div className="w-12 h-0.5 bg-orange mx-auto mb-6" />
                <h3 className="heading text-white text-lg mb-3">
                  {cred.title}
                </h3>
                <p className="text-blue text-sm leading-relaxed">{cred.desc}</p>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="max-w-4xl mx-auto">
            <h3 className="heading text-orange text-2xl text-center mb-10">
              WHAT CLIENTS SAY
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote:
                    "Moving Mountains made our move completely stress-free. Professional, careful, and on time. Highly recommend.",
                  name: "Sarah M.",
                },
                {
                  quote:
                    "These guys are the real deal. They treated our stuff like it was their own. Best movers we've ever used.",
                  name: "James T.",
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="bg-dark-teal border border-blue/10 p-8"
                >
                  <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <p className="subheading text-orange text-xs">
                    — {review.name.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-teal py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/brand/secondary_orange.svg"
            alt="Moving Mountains"
            width={180}
            height={40}
          />
          <div className="text-blue text-sm text-center md:text-right">
            <p>Moving Mountains &copy; {new Date().getFullYear()}</p>
            <p className="text-blue/60 mt-1">Excellence on the move.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
