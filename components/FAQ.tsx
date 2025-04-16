"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "What is the FA Wizard™ system?",
    answer: <div className="space-y-2 leading-relaxed">FFA Wizard™ is an automated system designed to help small schools manage Title IV
compliance efficiently and affordably.</div>,
  },
  {
    question: "How does the reminder calendar work?",
    answer: (
      <p>
        The interactive and customizable reminder calendar sends automated emails to remind
staff (and their supervisors) of upcoming federal deadlines, ensuring compliance is
maintained.
      </p>
    ),
  },
  {
    question: "Can I customize the Policy and Procedure Manual?",
    answer: (
      <div className="space-y-2 leading-relaxed">Yes, all three components of FA Wizard™ are not only complete and compliant as
delivered, but are also completely customizable for your school’s unique needs.</div>
    ),
  },
  {
    question: "What is included in the Title IV Disclosure Websites?",
    answer: (
      <div className="space-y-2 leading-relaxed">Your school’s Consumer Information website will include menus linking to thirty different
pages of disclosures. We provide a custom URL to be linked from your website.</div>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email and we will get back to you ASAP.</div>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          // className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
          className={`flex-1 transition-colors duration-300 ${isOpen ? "text-[#FDB913]" : "text-base-content"}`}>
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-[#FDB913] mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
