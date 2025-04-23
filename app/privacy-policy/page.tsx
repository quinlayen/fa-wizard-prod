import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Privacy Policy
Effective Date: April 16, 2025

At FA Wizard™, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website at https://fawizard.com.

⸻
1. Information We Collect

We collect the following personal information when you interact with our website or services:
	•	Name
	•	Email address
	•	School information
	•	Payment information

We also collect non-personal information through cookies to enhance your experience on our site.

⸻
2. Purpose of Data Collection

We collect your data solely for the purpose of processing orders and providing you with our compliance and automation services.

⸻
3. Data Sharing

We do not share your personal data with any third parties. Your information is used only to deliver and improve our services.

⸻
4. Children’s Privacy

FA Wizard™ does not knowingly collect or store personal information from children under the age of 13. If we learn that we have collected such information, we will take appropriate steps to delete it.

⸻
5. Updates to This Policy

We may update this Privacy Policy from time to time. When we do, we will notify you by email. Continued use of the website after any updates indicates your acceptance of the revised policy.

⸻
// 6. Contact Us

// If you have any questions or concerns about this Privacy Policy, please contact us at:
// 📧 david.canaski@faexperts.com

⸻
Thank you for trusting FA Wizard™.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
