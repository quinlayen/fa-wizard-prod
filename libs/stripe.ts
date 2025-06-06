import Stripe from "stripe";

interface CreateCheckoutParams {
  priceId: string;
  setupFeePriceId?: string;
  couponCodes?: string[];
  mode?: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

// This is used to create a Stripe Checkout for one-time payments. It's usually triggered with the <ButtonCheckout /> component. Webhooks are used to update the user's state in the database.
export const createCheckout = async ({
  user,
  mode = "subscription",
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  setupFeePriceId,
  couponCodes,
}: CreateCheckoutParams): Promise<string> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    const extraParams: {
      customer?: string;
      customer_creation?: "always";
      customer_email?: string;
      invoice_creation?: { enabled: boolean };
      payment_intent_data?: { setup_future_usage: "on_session" };
      tax_id_collection?: { enabled: boolean };
    } = {};

    if (user?.customerId) {
      extraParams.customer = user.customerId;
    } else {
      if (mode === "payment") {
        extraParams.customer_creation = "always";
        // The option below costs 0.4% (up to $2) per invoice. Alternatively, you can use https://zenvoice.io/ to create unlimited invoices automatically.
        // extraParams.invoice_creation = { enabled: true };
        extraParams.payment_intent_data = { setup_future_usage: "on_session" };
      }
      if (user?.email) {
        extraParams.customer_email = user.email;
      }
      extraParams.tax_id_collection = { enabled: true };
    }

    // Create line items array
    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },

    ];

    // Add setup fee if provided
    if (typeof setupFeePriceId === 'string' && setupFeePriceId.trim().length > 0) {
      lineItems.push({
        price: setupFeePriceId,
        quantity: 1,
      });
    }
    console.log("Stripe Line Items:", lineItems)
    // if (setupFeePriceId) {
    //   lineItems.push({
    //     price: setupFeePriceId,
    //     quantity: 1,
    //   });
    // }

    console.log('Creating Stripe checkout session with line items:', lineItems);

    // If there are coupon codes, use the first one as the discount
    // (Stripe Checkout currently only supports one coupon at a time)
    const discounts = couponCodes && couponCodes.length > 0 
      ? [{ coupon: couponCodes[0] }]
      : undefined;

    const stripeSession = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      client_reference_id: clientReferenceId,
      line_items: lineItems,
      discounts,
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...extraParams,
    });

    if (!stripeSession.url) {
      throw new Error("No URL returned from Stripe checkout session");
    }

    return stripeSession.url;
  } catch (e) {
    console.error("Stripe checkout error:", e);
    throw e;
  }
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
    typescript: true,
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
