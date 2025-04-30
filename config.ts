import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "FA Wizard™",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Automated Title IV compliance and deadline reminders.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "fawizard.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        // priceId: "price_1RHKnO04Oq5D44E3JUIsVFRE",  //Test Key
        priceId: "price_1RJHKP04Oq5D44E39uLyee83",  //Prod Key
        // Setup fee price ID
        // setupFeePriceId: "price_1RHKpi04Oq5D44E35mOfM82i",  //Test Key
        setupFeePriceId: "price_1RJHKL04Oq5D44E3J2xDFpmu",  //Prod Key
        // Multiple coupon codes for discounts
        couponCodes: ["FAExperts2025", "ADMINTEST"],
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "FA Wizard™",
        isFeatured: true,
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Complete Title IV compliance solution",
        // The price you want to display, the one user will be charged on Stripe.
        price: 295,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 395,
        // Setup fee amount to display
        setupFee: 100,
        features: [
          {
            name: "Instantly access 36+ prewritten federal policies",
          },
          { name: "Fully customizable Policy & Procedure Manual" },
          { name: "Automated Consumer Information Disclosure website" },
          { name: "Always-on access for students, staff, and regulators" },
          { name: "Built to meet Title IV and Higher Ed Act standards" },
          { name: "Say goodbye to compliance guesswork forever" },
        ],
      },
      // Temporarily hiding FA Wizard Lite
      // {
      //   priceId:
      //     process.env.NODE_ENV === "development"
      //       ? "price_1RETMR04Oq5D44E3CWrw4gYq"
      //       : "price_456",
      //   // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
      //   isFeatured: false,
      //   name: "FA Wizard™ Lite ",
      //   description: "You need more power.  Look at our other one",
      //   price: 199,
      //   priceAnchor: 280,
      //   features: [
      //     {
      //       name: "Instantly access 36+ prewritten federal policies",
      //     },
      //     { name: "Fully customizable Policy & Procedure Manual" },
      //     { name: "Automated Consumer Information Disclosure website" },
      //     { name: "Always-on access for students, staff, and regulators" },
      //     { name: "Built to meet Title IV and Higher Ed Act standards" },
      //     { name: "Say goodbye to compliance guesswork forever" },
      //   ],
      // },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Dave at FA Wizard <david.canaski@faexperts.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Dave at FA Wizard <david.canaski@faexperts.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "david.canaski@faexperts.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
