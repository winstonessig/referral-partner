import Image from "next/image";
import PartnerForm from "@/components/PartnerForm";

export default function Home() {
  return (
    <main>
      {/* HERO WITH FORM - Navy background */}
      <section className="relative bg-navy overflow-hidden">
        {/* Geometric line pattern bleeding off right edge */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Image
            src="/brand/pattern1_white.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24 w-full">
          {/* Bigger logo at top */}
          <div className="mb-10">
            <Image
              src="/brand/secondary_orange.svg"
              alt="Moving Mountains"
              width={280}
              height={60}
              priority
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Copy */}
            <div className="pt-4">
              <p className="accent-text text-orange text-2xl md:text-3xl mb-4">
                Setting your next chapter in motion.
              </p>
              <h1 className="heading text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
                PARTNER WITH
                <br />
                <span className="text-orange">MOVING MOUNTAINS</span>
              </h1>
              <p className="text-blue text-lg md:text-xl max-w-xl mb-8">
                Join our referral program. Give your clients $100 off their move
                when they book with Moving Mountains.
              </p>

              {/* Mountain badge */}
              <div className="hidden md:block opacity-15 mt-8">
                <Image
                  src="/brand/mountainbadge_orange.svg"
                  alt=""
                  width={200}
                  height={200}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-dark-teal border border-blue/10 p-8 md:p-10">
              <h2 className="heading text-white text-2xl mb-2">
                BECOME A PARTNER
              </h2>
              <p className="subheading text-blue text-xs mb-8">
                REAL ESTATE AGENTS & REFERRAL PARTNERS
              </p>
              <PartnerForm />
            </div>
          </div>
        </div>

        {/* Orange accent line at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange" />
      </section>

      {/* WHY MOVING MOUNTAINS - Orange background (bumped up) */}
      <section className="bg-orange py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading text-white text-4xl md:text-5xl text-center mb-16">
            WHY MOVING MOUNTAINS
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "TRUSTED MOVERS",
                desc: "Trained in the discipline of doing things well. A move so smooth, you'll never think about it again.",
              },
              {
                title: "$100 CLIENT DISCOUNT",
                desc: "Your clients save on every move they book through your referral page.",
              },
              {
                title: "YOUR OWN BRANDED PAGE",
                desc: "Custom co-branded landing page with your photo, logo, and info.",
              },
              {
                title: "DEDICATED SUPPORT",
                desc: "A team that shows up every time. Forward, together.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-0.5 bg-tan mx-auto mb-6" />
                <h3 className="heading text-white text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-tan text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Tan background */}
      <section className="bg-tan py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading text-navy text-4xl md:text-5xl text-center mb-16">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "SIGN UP",
                desc: "Fill out the partner form with your details and upload your headshot and logo.",
              },
              {
                step: "02",
                title: "GET YOUR PAGE",
                desc: "We build your custom co-branded landing page with your info and Moving Mountains branding.",
              },
              {
                step: "03",
                title: "SEND REFERRALS",
                desc: "Share your page with clients. They save $100 on their move. You build trust.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="heading text-orange text-6xl block mb-4">
                  {item.step}
                </span>
                <div className="w-12 h-0.5 bg-orange mx-auto mb-4" />
                <h3 className="heading text-navy text-xl mb-3">{item.title}</h3>
                <p className="text-navy/80 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND FORM - Navy background */}
      <section id="partner-form" className="bg-navy py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 w-1/4 h-full opacity-5">
          <Image
            src="/brand/pattern2_white.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="heading text-white text-4xl md:text-5xl text-center mb-3">
            READY TO GET STARTED?
          </h2>
          <p className="subheading text-blue text-sm text-center mb-12">
            SIGN UP BELOW AND WE&apos;LL BUILD YOUR PAGE
          </p>

          <PartnerForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-teal py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/brand/secondary_orange.svg"
            alt="Moving Mountains"
            width={220}
            height={50}
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
