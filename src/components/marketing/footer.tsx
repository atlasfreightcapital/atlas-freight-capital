import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "About Atlas", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "Apply now", href: "/apply-now" },
    ],
  },
  {
    title: "Factoring",
    links: [
      { label: "Freight factoring", href: "/freight-factoring" },
      { label: "New MC factoring", href: "/new-mc-factoring" },
      { label: "Small fleet factoring", href: "/small-fleet-factoring" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Carrier Tools",
    links: [
      { label: "Broker credit check", href: "/broker-credit-check" },
      { label: "Carrier login", href: "/login" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of use", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Contact support", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.32 8.1h4.36V23H.32V8.1Zm7.18 0h4.18v2.04h.06c.58-1.1 2-2.26 4.12-2.26 4.4 0 5.22 2.9 5.22 6.68V23h-4.36v-7.48c0-1.78-.03-4.08-2.48-4.08-2.5 0-2.88 1.95-2.88 3.96V23H7.5V8.1Z" />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8ZM12 7.35A4.65 4.65 0 1 1 12 16.65 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 12 14.65 2.65 2.65 0 0 0 12 9.35Zm5.1-2.55a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46a2.75 2.75 0 0 0-1.94 1.95A28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 0 0 1.94-1.95A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81ZM10 15.27V8.73L15.45 12 10 15.27Z" />
    </svg>
  );
}

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#16314f] bg-[#071426] text-[#9fb2c1]">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#0a7c86]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#153c64]/40 blur-3xl" />

      <div className="relative w-full px-4 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#65d8e1]">Atlas Freight Capital</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-white">
              Freight factoring support built around secure carrier relationships.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b8c9d7]">
              Atlas Freight Capital helps carriers organize applications, invoices, load paperwork, broker checks,
              funding updates, reserves, and payment visibility inside one professional carrier experience.
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl border border-[#1b3554] bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-4 w-4 text-[#65d8e1]" />
                  Secure document workflows
                </div>
                <p className="mt-2 text-xs leading-5 text-[#9fb2c1]">Private files, signed access, and role-based controls.</p>
              </div>
              <div className="rounded-2xl border border-[#1b3554] bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-4 w-4 text-[#65d8e1]" />
                  Built for U.S. carriers
                </div>
                <p className="mt-2 text-xs leading-5 text-[#9fb2c1]">Owner-operators, new MCs, and small fleet operations.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="atlas-lift flex h-11 w-11 items-center justify-center rounded-full border border-[#1f4267] bg-white/5 text-[#d7e8f2] transition hover:border-[#65d8e1] hover:bg-[#0a7c86] hover:text-white"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{group.title}</p>
                <div className="mt-4 space-y-3">
                  {group.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-sm text-[#b8c9d7] transition hover:translate-x-1 hover:text-[#65d8e1]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 border-t border-[#183554] pt-7 text-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="max-w-5xl leading-6 text-[#9fb2c1]">
              Atlas Freight Capital may work with third-party funding partners for underwriting, capital deployment,
              receivables processing, collections, and related services. Funding is subject to verification, approval,
              documentation, and partner requirements.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#b8c9d7]">
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#65d8e1]" />
                support@atlasfreightcapital.com
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#65d8e1]" />
                Carrier support by account request
              </span>
            </div>
          </div>

          <p className="rounded-full border border-[#1b3554] bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d7e8f2]">
            Copyright &copy; {currentYear} Atlas Freight Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

