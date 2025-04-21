"use client";

import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";

const policiesBullets = ['Over 35 required P&P statements', 
  'Institution-wide compliance, not just FA', 
  'Ready-to-go statements, fully editable', 
  'Easily create a comprehensive P&P Manual']

const disclosuresBullets = ['Over 30 Required Disclosures', 
  'Custom built for your school', 
  'Hosted 24/7 via your custom microsite', 
  'Easily updated (without web dev skills)'
];

const calendarBullets = ['Pre-loaded with ED deadlines', 
  'Automatic email reminders', 
  'Customizable for State & Accreditor', 
  'Never miss reporting deadlines'
];

const launchBullets = ['P&P Manual, Disclosure Site, Calendar', 
  'Guided setup in under one day', 
  'Instant operational readiness', 
  'Built-in audit confidence'
];

const customizeBullets = ['Every policy, web page, & reminder editable', 
  'Add school-specific rules or formatting', 
  'Merge your procedures with compliance', 
  'No technical skills required'
];

const updateBullets = ['Automatic updates to all content', 
  'Alerts of changes to responsible staff', 
  'Tracks every change for transparency', 
  'Stay compliant as the rules change'
];

const featureNames = {
  policies: "Policies & Easy Procedures",
  disclosures: "Website Disclosures",
  calendar: "Reminder Calendar",
  customize: "Totally Customizable",
  updates: "Continuous Updates",
  setup: "Setup"
};

const features: {
  name: string;
  description: JSX.Element;
  svg: JSX.Element;
  tooltip: string;
}[] = [
  {
    name: featureNames.policies,
    tooltip: "Stay compliant with zero effort.",
    description: (
      <ul className="space-y-1">
        {policiesBullets.map((item, index) => (
          <li key={item} 
          className={`flex items-center gap-3 font-medium text-lg ${
            index === policiesBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">📋</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.policies}</span>
      </div>
    ),
  },
  {
    name: featureNames.disclosures,
    tooltip: "Tailor policies to your institution's voice.",
    description: (
      <ul className="space-y-2">
        {disclosuresBullets.map((item, index) => (
          <li key={item} 
              className={`flex items-center gap-3 font-medium text-lg ${
                index === disclosuresBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">🌐</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.disclosures}</span>
      </div>
    ),
  },
  {
    name: featureNames.calendar,
    tooltip: "Never miss a beat. Time is power.",
    description: (
      <ul className="space-y-2">
        {calendarBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium text-lg ${
             index === calendarBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">📅</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.calendar}</span>
      </div>
    ),
  },
  {
    name: featureNames.customize,
    tooltip: "Real-time insight, zero guesswork.",
    description: (
      <ul className="space-y-2">
        {customizeBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium text-lg ${
             index === customizeBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">⚙️</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.customize}</span>
      </div>
    ),
  },
  {
    name: featureNames.updates,
    tooltip: "Empowering students, simplifying support.",
    description: (
      <ul className="space-y-2">
        {updateBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium text-lg ${
             index === updateBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">🔄</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.updates}</span>
      </div>
    ),
  },
  {
    name: featureNames.setup,
    tooltip: "All your policies, protected and in one place.",
    description: (
      <ul className="space-y-2">
        {launchBullets.map((item, index) => (
           <li key={item} 
           className={`flex items-center gap-3 font-medium text-lg ${
             index === launchBullets.length - 1 ? "!text-[#FDB913]" : ""
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
      <div className="flex flex-col items-center">
        <span className="text-5xl mb-2">🚀</span>
        <span className="text-center text-lg font-semibold text-[#003767]">{featureNames.setup}</span>
      </div>
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
            Get the experience, expertise, and wisdom of the nations premier Financial Aid consultants and keep your school compliant
            <span className="text-[#FDB913]"> at a price you can afford.</span>
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
                    : "text-[#003767]/60 group-hover:text-[#003767]/90"
                }`}
              >
                {feature.svg}
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
              <h3 className="font-semibold text-base-content text-xl">
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
