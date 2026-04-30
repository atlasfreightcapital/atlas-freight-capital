"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Submit clean invoice packages without the back-and-forth.",
    eyebrow: "Paperwork intake",
    body: "Carriers can send rate confirmations, invoices, signed BOL/POD files, and supporting receipts from one secure workspace. Atlas keeps the process organized so review can move faster.",
    stat: "3 core documents",
    statLabel: "rate confirmation, invoice, and BOL/POD",
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Review broker information before funding decisions move forward.",
    eyebrow: "Broker confidence",
    body: "Atlas helps carriers understand whether a broker is ready for factoring review. Carrier-facing results stay simple while Atlas keeps deeper payment and risk notes in operations.",
    stat: "Clear status",
    statLabel: "approved, caution, or not available",
    image:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Track every invoice from processing to paid.",
    eyebrow: "Invoice visibility",
    body: "Carriers see clean stages like Processing, Pending, Paid, and Needs Attention. Each invoice opens into a full detail page with lane, broker, paperwork, reserve, and payout information.",
    stat: "4 stages",
    statLabel: "built for carrier clarity",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Keep reserves and payment timing visible.",
    eyebrow: "Payment clarity",
    body: "Factoring should not feel like a black box. Atlas gives carriers a clearer view of estimated advances, reserve held, broker payment timing, and payout status.",
    stat: "Reserve tracking",
    statLabel: "by invoice and payment stage",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Built for owner-operators, new MCs, and growing fleets.",
    eyebrow: "Carrier growth",
    body: "Whether a carrier is just getting authority active or scaling into more lanes, Atlas gives them a professional portal for paperwork, broker checks, invoices, and support.",
    stat: "One portal",
    statLabel: "for dispatch, office, and ownership",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  },
];

export function AtlasStorySlider() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[#d7dfdc] bg-[#eef3f1] px-4 py-16 lg:px-10">
      <div className="atlas-glow absolute left-10 top-10 h-56 w-56 rounded-full bg-[#0a7c86]/20" />
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a7c86]">{slide.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#071426] lg:text-5xl">{slide.title}</h2>
          <p className="mt-5 text-lg leading-8 text-[#40515a]">{slide.body}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="atlas-lift rounded-2xl border border-[#d1dad6] bg-white p-5 shadow-sm">
              <p className="text-2xl font-semibold text-[#071426]">{slide.stat}</p>
              <p className="mt-2 text-sm leading-5 text-[#62737a]">{slide.statLabel}</p>
            </div>
            <div className="rounded-2xl border border-[#d1dad6] bg-white p-5 text-sm leading-6 text-[#40515a] shadow-sm">
              Atlas Freight Capital is designed to make freight factoring feel organized, professional, and easier for
              carriers to follow.
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/how-it-works">
              <Button className="gap-2">
                See how it works <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/apply-now">
              <Button variant="secondary">Start application</Button>
            </Link>
          </div>
          <div className="mt-7 flex gap-2">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.eyebrow}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  active === index ? "w-10 bg-[#0a7c86]" : "w-2.5 bg-[#b9c6c2] hover:bg-[#0a7c86]/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="atlas-perspective relative z-10 min-h-[460px]">
          {slides.map((item, index) => (
            <div
              key={item.title}
              className={`absolute inset-0 overflow-hidden rounded-3xl border border-[#d1dad6] bg-white shadow-2xl transition-all duration-700 ${
                active === index
                  ? "translate-x-0 rotate-0 scale-100 opacity-100"
                  : index < active
                    ? "-translate-x-10 -rotate-3 scale-95 opacity-0"
                    : "translate-x-10 rotate-3 scale-95 opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/85 via-[#071426]/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#65d8e1]">{item.eyebrow}</p>
                <p className="mt-2 max-w-2xl text-2xl font-semibold">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
