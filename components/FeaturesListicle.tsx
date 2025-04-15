"use client";

import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";

const trackBullets = [
  "Monitor your compliance status 24/7 with real-time alerts.",
  "Receive instant updates on new federal regulations.",
  "Eliminate manual tracking and reduce human error.",
  "Gain peace of mind knowing you’re always audit-ready.",
];

const craftBullets = [
  "Start with pre-built templates designed for compliance.",
  "Customize policies to reflect your institution's language and tone.",
  "Update documents quickly as regulations change.",
  "Ensure consistency and professionalism across all policies.",
];

const scheduleBullets = [
  "Visualize upcoming deadlines on a unified calendar.",
  "Sync with your personal or team calendars (Google, Outlook, etc.).",
  "Receive automated reminders before key submission dates.",
  "Assign responsibilities and track task completion.",
];

const vaultBullets = [
  "Store all documents in one encrypted, cloud-based hub.",
  "Search and filter files in seconds with smart indexing.",
  "Grant role-based access to ensure document security.",
  "Access your documents from anywhere, anytime.",
];

const pulseBullets = [
  "Instantly generate audit-ready reports on-demand.",
  "Highlight areas of risk or non-compliance in real time.",
  "Export reports in professional formats (PDF, Excel).",
  "Always be prepared for internal reviews or federal audits.",
];

const accessBullets = [
  "Allow students to check their financial aid status anytime.",
  "Share award letters and required documents digitally.",
  "Enable secure messaging between students and staff.",
  "Reduce office foot traffic with self-service access.",
];

const features: {
  name: string;
  description: JSX.Element;
  svg: JSX.Element;
  tooltip: string;
}[] = [
  {
    name: "Track",
    tooltip: "Stay compliant with zero effort.",
    description: (
      <ul className="space-y-1">
        {trackBullets.map((item, index) => (
          <li key={item} 
          className={`flex items-center gap-3 font-medium ${
            index === trackBullets.length - 1 ? "!text-[#FDB913]" : ""
          }`}
      >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinejoin="round" d="M12 12l3-6-6 3-3 6 6-3zm0 0v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Craft",
    tooltip: "Tailor policies to your institution's voice.",
    description: (
      <ul className="space-y-2">
        {craftBullets.map((item, index) => (
          <li key={item} 
              className={`flex items-center gap-3 font-medium ${
                index === craftBullets.length - 1 ? "!text-[#FDB913]" : ""
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    name: "Schedule",
    tooltip: "Never miss a beat. Time is power.",
    description: (
      <ul className="space-y-2">
        {scheduleBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium ${
             index === scheduleBullets.length - 1 ? "!text-[#FDB913]" : ""
           }`}
       >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-8 8h3m5.5 0H21V7a2 2 0 00-2-2h-1M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Vault",
    tooltip: "All your policies, protected and in one place.",
    description: (
      <ul className="space-y-2">
        {vaultBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium ${
             index === vaultBullets.length - 1 ? "!text-[#FDB913]" : ""
           }`}
       >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3H3V7zM3 10v7a2 2 0 002 2h14a2 2 0 002-2v-7H3z" />
      </svg>
    ),
  },
  {
    name: "Pulse",
    tooltip: "Real-time insight, zero guesswork.",
    description: (
      <ul className="space-y-2">
        {pulseBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium ${
             index === pulseBullets.length - 1 ? "!text-[#FDB913]" : ""
           }`}
       >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h1a1 1 0 001-1v-6a1 1 0 00-1-1H4m6 12h1a1 1 0 001-1v-9a1 1 0 00-1-1h-1m6 6h1a1 1 0 001-1V9a1 1 0 00-1-1h-1" />
      </svg>
    ),
  },
  {
    name: "Access",
    tooltip: "Empowering students, simplifying support.",
    description: (
      <ul className="space-y-2">
        {accessBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium ${
             index === accessBullets.length - 1 ? "!text-[#FDB913]" : ""
           }`}
       >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] inline shrink-0 opacity-80">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    ),
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0H7m5 0h5" />
      </svg>
    ),
  },
];

const FeaturesListicle = () => {
  const featuresEndRef = useRef<null>(null);
  const [featureSelected, setFeatureSelected] = useState<string>(features[0].name);
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasClicked) {
        const index = features.findIndex((feature) => feature.name === featureSelected);
        const nextIndex = (index + 1) % features.length;
        setFeatureSelected(features[nextIndex].name);
      }
    }, 5000);

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clearInterval(interval);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      if (featuresEndRef.current) {
        observer.observe(featuresEndRef.current);
      }
    } catch (e) {
      console.error(e);
    }

    return () => clearInterval(interval);
  }, [featureSelected, hasClicked]);

  return (
    <section className="py-24" id="features">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-100 max-md:px-8 max-w-3xl">
          <h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-8">
            Receive all the tools you need to remain Title IV compliant, automate deadline reminders, and
            <span className="text-[#FDB913]"> keep your school up to date.</span>
          </h2>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-4 md:flex justify-start gap-4 md:gap-12 max-md:px-8 max-w-3xl mx-auto mb-8">
          {features.map((feature) => (
            <span
              key={feature.name}
              onClick={() => {
                if (!hasClicked) setHasClicked(true);
                setFeatureSelected(feature.name);
              }}
              title={feature.tooltip}
              className={`flex flex-col items-center justify-center gap-3 select-none cursor-pointer p-2 duration-200 group`}
            >
              <span
                className={`duration-100 ${
                  featureSelected === feature.name
                    ? "text-[#003767]"
                    : "text-base-content/30 group-hover:text-base-content/50"
                }`}
              >
                {feature.svg}
              </span>
              <span
                className={`font-semibold text-sm ${
                  featureSelected === feature.name
                    ? "text-[#003767]"
                    : "text-base-content/50"
                }`}
              >
                {feature.name}
              </span>
            </span>
          ))}
        </div>
        <div className="bg-base-200">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-center md:justify-start md:items-center gap-12">
            <div
              className="text-base-content/80 leading-relaxed space-y-4 px-12 md:px-0 py-12 max-w-xl animate-opacity"
              key={featureSelected}
            >
              <h3 className="font-semibold text-base-content text-lg">
                {features.find((f) => f.name === featureSelected)["name"]}
              </h3>
              {features.find((f) => f.name === featureSelected)["description"]}
            </div>
          </div>
        </div>
      </div>
      <p className="opacity-0" ref={featuresEndRef}></p>
    </section>
  );
};

export default FeaturesListicle;
