import { ArrowRightIcon, LeafIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { heroSectionData } from "../../data/assets";

const Hero = () => {
  return (
    <section className="relative isolate mb-6 min-h-[400px] overflow-hidden rounded-2xl bg-[#f8f5ef] sm:mb-10 sm:min-h-[420px] sm:rounded-3xl lg:min-h-[460px]">
      {/* Background Image */}
      <img
        src={heroSectionData.hero_image}
        alt="Fresh organic vegetables"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-app-green via-app-green/80 to-app-green/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[400px] items-center sm:min-h-[420px] lg:min-h-[460px]">
        <div className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            {/* Badge */}
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1.5 text-[11px] font-semibold text-orange-200 sm:mb-5 sm:px-4 sm:text-xs">
              <LeafIcon className="size-3.5" />
              {heroSectionData.badge.text}
            </span>

            {/* Heading */}
            <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
              {heroSectionData.heading.firstLine}{" "}
              <span className="text-orange-300">
                {heroSectionData.heading.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-md text-sm leading-6 text-white/85 sm:mb-7 sm:text-base sm:leading-7">
              {heroSectionData.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={heroSectionData.buttons.primary.link}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95 sm:px-7"
              >
                Shop Now
                <ArrowRightIcon className="size-4" />
              </Link>

              <Link
                to={heroSectionData.buttons.secondary.link}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-7"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
