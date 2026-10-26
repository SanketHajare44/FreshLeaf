import { BikeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { footerData } from "../data/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-app-green text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {/* Brand Section */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <BikeIcon size={26} className="shrink-0 text-white" />

              <span className="text-xl font-bold tracking-wide">
                {footerData.brand.name}
              </span>
            </Link>

            <p className="max-w-md text-sm leading-7 text-white/70">
              {footerData.brand.description}
            </p>

            {/* Social Links */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {footerData.brand.socials.map((social, i) => {
                const Icon = social.icon;

                return (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Social media link ${i + 1}`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors duration-200 hover:bg-white/15"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Footer Sections */}
          {footerData.sections.map((section, i) => (
            <div key={i} className="min-w-0 lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j} className="break-words">
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm leading-6 text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href || "#"}
                        className="text-sm leading-6 text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="min-w-0 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>

            <ul className="space-y-4">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon;

                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-6 text-white/70"
                  >
                    <Icon className="mt-1 size-4 shrink-0 text-white" />

                    <span className="min-w-0 break-words">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between item-center gap-4">
          <p className="text-xs text-white/50">{footerData.bottom.copyright}</p>
          <div className="flex gap-4 ">
            {footerData.bottom.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs text-white/50 hover:text-white/70"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
