import { appPromoBannerData } from "../../data/assets";
import Truck from "../../assets/delivery_truck.svg";

const AppPromoBanner = () => {
  return (
    <section className="mx-auto my-12 max-w-7xl px-4 sm:my-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-green-950 px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Left Column: Content */}
          <div className="relative z-10 text-center md:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
              {appPromoBannerData.title}
            </h2>

            <p className="text-white/70 mb-6 mx-w-md">
              {appPromoBannerData.description}
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <button
                type="button"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-950 transition-all duration-200 hover:bg-orange-100 hover:shadow-lg sm:px-6"
              >
                App Store
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 sm:px-6"
              >
                Google Play
              </button>
            </div>
          </div>

          {/* Right Column: Promotional Image */}
          <div className="flex items-center justify-center md:justify-end">
            <img
              src={Truck}
              alt="Delivery Truck"
              className="max-w-60 sm:max-w-120 xl:pr-10 "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoBanner;
