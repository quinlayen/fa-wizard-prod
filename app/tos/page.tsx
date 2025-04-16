import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: April 16, 2025

Terms of Service

Effective Date: April 16, 2025

Welcome to FA Wizard™! By accessing or using our website at https://fawizard.com, you agree to be bound by the following Terms of Service (“Terms”). Please read them carefully.

If you do not agree with any part of these Terms, you should not use our services.

⸻

1. Who We Are

FA Wizard™ provides comprehensive tools to simplify Title IV compliance, automate financial aid processes, and help educational institutions stay ahead of regulatory requirements.

For questions or support, you can contact us at:
📧 david.canaski@faexperts.com

⸻

2. Using FA Wizard

You agree to use FA Wizard only for lawful purposes and in accordance with all applicable federal, state, and local laws. We may suspend or terminate your access if you violate these Terms.

⸻

3. User Data

We collect certain information to provide our services effectively, including:
	•	Your name
	•	Email address
	•	School information
	•	Payment details

We also use cookies and other technologies to collect non-personal data to improve your experience.

For more details, please review our Privacy Policy.

⸻

4. Your Account

You are responsible for maintaining the confidentiality of your account login credentials. If you suspect unauthorized activity on your account, please contact us immediately.

⸻

5. Payments

Access to certain features may require payment. All billing information must be accurate and kept up to date. We may use third-party services to process payments securely.

⸻

6. Intellectual Property

All content, trademarks, and tools on FA Wizard are the property of FA Wizard™ or its licensors and may not be copied, distributed, or used without our permission.

⸻

7. Disclaimer

FA Wizard™ is provided “as is” and “as available.” We do our best to ensure reliability, but we do not guarantee uninterrupted service or error-free content.

⸻

8. Limitation of Liability

To the fullest extent permitted by law, FA Wizard™ shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.

⸻

9. Governing Law

These Terms are governed by the laws of the United States. Any disputes shall be resolved in accordance with U.S. legal procedures.

⸻

10. Updates to These Terms

We may update these Terms from time to time. When we do, we’ll notify you via email. Continued use of the service after updates constitutes acceptance of the new Terms.

⸻

By using FA Wizard™, you acknowledge that you have read, understood, and agree to these Terms of Service.

⸻
`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
