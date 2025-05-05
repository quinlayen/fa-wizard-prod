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
          {`
Terms and Conditions of Service for FA Wizard™

Revision/Effective Date:  April 16, 2025

Welcome to FA Wizard™!  By creating an account and providing information through our website at https://fawizard.com, you agree that the educational institution you represent will be bound by the following Terms and Conditions of Service (“Terms and Conditions” or “Terms””).  Please read them carefully before purchasing FA Wizard™.

If you do not agree with any part of these Terms, you should not purchase or use these services.

1.   WHO WE ARE:
FA Wizard™ provides comprehensive tools to simplify Title IV compliance, automate Title IV web disclosures, and help educational institutions stay ahead of regulatory requirements.  FA Wizard™ is a technology product of Financial Aid Experts, Inc. (FA Experts®).

Financial Aid Experts, Inc. 
5651 Main St.  Suite 8-305
Buffalo, NY 14221

For questions or support, you can contact us by postal mail or by telephone (during business hours in the Eastern time zone of the United States) at (866) 767-5692.

2.   DEFINITIONS:
FA WizardTM is a product to serve educational institutions.  

“You” and “your” refer to the individual purchaser who acts as a purchasing agent on behalf of the educational institution.

“Client” refers to the educational institution itself.  The purchasing agent agrees to these Terms and Conditions on behalf of the institution (client).  The purchasing agent certifies that he/she is an owner and/or officer of the educational institution and is legally authorized to commit the educational institution to a contractual arrangement under U.S. law.

3.   USING FA WIZARDTM:
FA WizardTM is a subscription-based service requiring monthly payment for continued service.  The client agrees to maintain its account in a current payment status and to notify FA Experts® in advance before any planned discontinuance of service.
   
The client agrees to use FA WizardTM only for lawful purposes and in accordance with all applicable federal, state, and local laws.  FA Experts® may suspend or terminate access for any violation of these Terms by the client or any of the client’s employees or agents.

4.   USER DATA:
FA Experts® collects certain information to provide our services effectively, including:
	•	Your name
	•	Email address
	•	Payment details
	•	Client information (including data regarding the client institution’s operations, 		academic programs, administrative policies, etc.) 

We intentionally DO NOT collect any personally identifiable information about students, employees, or other persons associated with the client, with the exception of names and business email addresses of certain client employees.

We also use cookies and other technologies to collect non-personal data of visitors to our public website to improve your experience.  For more details, please review our Privacy Policy.

5.   CLIENT ACCOUNT:
The client is responsible for issuing account login credentials to appropriate client employees and maintaining the confidentiality of login credentials.   If the client suspects unauthorized activity on its account, it should contact FA Experts® immediately.

6.   PAYMENTS:
FA WizardTM is a subscription-based service requiring the client to maintain its account payments in current status.  Payment is billed monthly on an automatic basis through the FA WizardTM subscription platform.

The client’s subscription includes access to FA WizardTM, including access to the school data platform and public-facing web outputs.  Access is contingent upon continuous current payment status.  All billing information must be accurate and kept up to date.  FA Experts® may use third-party services to process payments securely.

7.   TERM:
The term of this Agreement shall begin on the date that the subscription is initiated by the client through the fawizard.com website, with services to begin as soon as practical.  It shall remain binding on both parties until the end of the monthly payment period in which the client makes formal notice of cancellation, or FA Experts® cancels the agreement for violation of the Terms and Conditions. The provisions of Section 8 through Section 19 (below) of these Terms and Conditions are perpetual and survive notwithstanding the termination of the agreement and/or services.

8.   NO AGENCY, PARTNERSHIP OR JOINT VENTURE CREATED:
FA Experts® and the client agree that the relationship between them is that of client and technology provider, that neither party shall have any authority to represent or bind the other, and that neither party shall hold itself out or have any authority as an agent of the other for any purpose whatsoever.  Nothing herein shall be construed as creating a principal and agent, joint venture, or any other type of relationship between the client, the educational institution, or any employee/principal of the educational institution and FA Experts®. 

9.  STATUS AS A “THIRD PARTY SERVICER” AND LIMITATION ON SCOPE OF SERVICES:
By nature, FA WizardTM is NOT a “third-party servicer” arrangement under federal regulation 34CFR668.2 (specifically, the definition of a third-party servicer).  Expressly, no product, employee, or contractor of FA Experts® shall engage in any activity which would qualify as “administer(ing), through either manual or automated processing, any aspect of the institution's participation in any Title IV, HEA program”, and/or as “performing any function required by any statutory provision of or applicable to Title IV of the HEA, any regulatory provision prescribed under that statutory authority, or any applicable special arrangement, agreement, or limitation entered into under the authority of statutes applicable to Title IV of the HEA”.  

All products, text, and/or intellectual content provided by FA Experts® are strictly advisory in nature, and all management decisions, policy changes, administrative actions, and processing functions must be performed by employees of the client, including editing, approval, and implementation of any documents and/or text provided by FA Experts®.

10.  OWNERSHIP AND CONFIDENTIALITY OF INTELLECTUAL PROPERTY:
All aspects of FA WizardTM, including all text, formatting, layouts, and computer software are the intellectual property of Financial Aid Experts, Inc. (FA Experts®), and are protected by U.S. and international copyrights.   The Client understands, agrees, and commits that FA Experts® is the exclusive owner of all such intellectual property and all rights related to that content.  During the Term of the client’s FA WizardTM subscription, FA Experts® grants the client a non-exclusive, non-transferable license to use, maintain, modify, or revise the provided intellectual property solely for the client’s own administrative use.  However, the client hereby agrees that, except as necessary to use the property for its regular operations and/or to comply with applicable laws and regulations, the client shall not disclose, market, sell, lease, distribute or otherwise provide license to the intellectual property to any other institution, entity, affiliated school, consultant, third-party servicer, corporation, partnership, or individual without prior written consent from FA Experts®.

The term “intellectual property” and “property” includes (but is not limited to):  the text, layout, and formatting of policy and procedure statements, the text of all system-generated web pages, provided sample documents, standardized forms, electronic applications, software, web applications, policy manual design and table of contents, training materials, and any other outputs of the FA WizardTM product.  The term “Intellectual Property Rights” shall mean any intellectual property or proprietary rights, including, without limitation, copyright rights (including rights in audiovisual works), moral rights, trademarks (including logos, slogans, domain names, trade names, service marks), rights of privacy and publicity, patent rights (including patent applications and disclosures), know-how, inventions, rights of priority, and trade secret rights, recognized in the United States and/or any country or jurisdiction in the world.

11.   INJUNCTIVE RELIEF:
A breach or threatened breach by the client of the provisions of Section 10 ("Ownership and Confidentiality of Intellectual Property") in any respect will be material and will result in substantial and irreparable injury to FA Experts®.   In the event of a breach or threatened breach of Section 10 of this Agreement, FA Experts® will be entitled to an injunction restraining the Client therefrom.  This provision shall not be construed as prohibiting FA Experts® from pursuing any other available remedies for such breach or threatened breach, including the recovery of damages.

12.   FAILURE OF PERFORMANCE:
If either FA Experts® or the client fails in the due performance of any of its obligations under these Terms and Conditions, the other party will have the right, at its election, to sue for damages for such breach and to seek such legal and equitable remedies as may be available to it, including the right to recover all reasonable expenses, which shall include reasonable collections costs, legal fees, and court costs, incurred: (a) to pursue collections, (b) to sue for damages; (c) to seek such other legal and equitable remedies; and (d) to collect any damages and enforce any court order or settlement agreement including, but not limited to, additional application to the court for an order of contempt.  Except for specified limitations on liability (in Section 13) and agreed indemnification provisions (in Section 14), nothing contained herein shall be construed to restrict or impair the rights of either party to exercise this election.  All rights and remedies herein provided or existing at law or in equity shall be cumulative of each other and may be enforced concurrently therewith or from time to time.

13.   WARRANTY AND LIABILITY LIMITATION:
FA Experts warrants and represents that the services provided hereunder shall be delivered in a professional manner and in keeping with the standards of performance prevalent in the industry.  FA Experts makes no other warrantees or claims regarding the services provided through the FA WizardTM product.  Specifically, the client understands and agrees that FA Experts® makes no warranty of regulatory compliance at the client institution based upon the materials and services to be provided through FA WizardTM.  The client understands and agrees that all FA Experts® services are advisory in nature, and that the client institution maintains full and complete responsibility for regulatory compliance and any associated costs.  Further, the client agrees that the maximum liability for any claim by the client against FA Experts® related to the operation and outputs of the FA WizardTM product shall be limited to the subscription fees charged to the client and actually paid to FA Experts® by the client during the ninety-day period prior to legal notice of the claim being presented to FA Experts® or its attorney.

14.	INDEMNIFICATION:
The client hereby agrees to indemnify and hold FA Experts® harmless, at all times from and after the beginning date of the Term, from all counter-suits, claims, damages, liability and expense, including legal fees, arising from or in any way connected with the breach by the client of any of these Terms and Conditions, and/or FA Expert's enforcement of its rights under these Terms and Conditions, at law or in equity, including without limitation: (i) suit for damages, (ii) seeking of such other legal and equitable remedies, (iii) collection of any debts and/or damages, and (iv) enforcement of any court order or settlement, including but not limited to additional application to the court for an order of contempt.

15.   MISCELLANEOUS:
The following provisions apply:
The section headings have been prepared for convenience of reference only and shall not control, affect the meaning, or be taken as an interpretation of any provision of these Terms and Conditions.
In the event any aspect of these Terms and Conditions should be breached by either party and thereafter waived by the other party, then such waiver shall be limited to the particular breach so waived and shall not be deemed to waive any other breach either prior or subsequent to the breach so waived.
If the consent and/or cooperation of either party is required for whatever reason under these Terms and Conditions, such consent/cooperation shall not be unreasonably withheld.
Wherever necessary or appropriate, the singular shall include the plural, and the plural shall include the singular.
All understandings and agreements made by and between the parties are contained in these Terms and Conditions.  No other statements or promises made by any employee or representative of either party are valid.

16.   SEVERABILITY:
Every provision of these Terms and Conditions is intended to be severable. If any provision is held to be invalid or unenforceable by law or by a court of competent jurisdiction, all other provisions shall nevertheless continue in full force and effect. In lieu of such invalid or unenforceable provision, there shall be amended to these Terms and Conditions a legal, valid and enforceable provision as similar in terms to such invalid or unenforceable provision as may be possible.

17.   NOTICES:
Any formal legal notice or other communication which is required to be given under these Terms and Conditions shall be in writing and shall be delivered personally, or sent by registered mail, or by certified mail return receipt requested to the address set forth above for FA Experts® or to the primary address provided by the client within the FA WizardTM system.  Any notice which is mailed shall be deemed to have been given on the third business day after the day of mailing (not counting the day mailed), irrespective of the date of receipt.  Notices may be signed and given by the attorney for the party sending the notice.  A new address may be designated by notice.

18.    APPLICABLE LAW; JURISDICTION; VENUE:
This Agreement will be governed by and construed in accordance with the laws of the State of New York without regard to its principles of conflicts of law. The County of Erie in the State of New York is hereby designated as the exclusive forum for any action or proceeding arising from or in any way connected to these Terms and Conditions, and the parties hereby expressly consent to the personal jurisdiction of the New York State or federal courts in this forum.

19.    BINDING EFFECT:
By creating a client account at FA Wizard™, you attest that you are an officer or other individual with the authority to enter into a contractual agreement on behalf of the client institution.

20.    DISCLAIMER:
FA Wizard™ is an internet-based product and is provided “as is” and “as available.”  We do our best to ensure reliability, but we do not guarantee uninterrupted service or error-free content.  To the fullest extent permitted by law, FA Experts® shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.

21.   UPDATES TO THESE TERMS AND CONDITIONS:
We may update these Terms and Conditions from time to time.  When we do, we’ll notify the client via email.  Continued use of the service after updates constitutes acceptance of the new Terms and Conditions.

22.   CONFIRMATION OF AGREEMENT:
By using FA Wizard™, you acknowledge that you have read, understood, and agree to abide by the Terms and Conditions of Service on behalf of the client institution.


`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
