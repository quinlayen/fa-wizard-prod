import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  console.log('Webhook received');
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  // Create a private supabase client using the secret service_role API key
  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Webhook event received:', event.type);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        console.log('Processing checkout.session.completed event');
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);
        console.log('Session details:', session);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        console.log('Customer ID:', customerId);
        console.log('Price ID:', priceId);
        console.log('User ID:', userId);
        console.log('Plan:', plan);

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        if (!plan) {
          console.error('No matching plan found for price ID:', priceId);
          break;
        }

        let user;
        if (!userId) {
          console.log('No user ID provided, checking by email');
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", customer.email)
            .single();
          if (profile) {
            user = profile;
            console.log('Found user by email:', user.id);
          } else {
            console.log('Creating new user for email:', customer.email);
            const { data } = await supabase.auth.admin.createUser({
              email: customer.email,
            });
            user = data?.user;
          }
        } else {
          console.log('Finding user by ID:', userId);
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          user = profile;
        }

        if (!user) {
          console.error('No user found or created');
          break;
        }

        console.log('Updating user profile:', user.id);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            customer_id: customerId,
            price_id: priceId,
            is_subscribed: true,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('Profile updated successfully');
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        console.log('Processing customer.subscription.deleted event');
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;
        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        console.log('Updating subscription status for customer:', subscription.customer);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ is_subscribed: false })
          .eq("customer_id", subscription.customer);

        if (updateError) {
          console.error('Error updating subscription status:', updateError);
        } else {
          console.log('Subscription status updated successfully');
        }
        break;
      }

      case "invoice.paid": {
        console.log('Processing invoice.paid event');
        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;
        const priceId = stripeObject.lines.data[0].price.id;
        const customerId = stripeObject.customer;

        console.log('Finding profile for customer:', customerId);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.error('No profile found for customer:', customerId);
          break;
        }

        if (profile.price_id !== priceId) {
          console.error('Price ID mismatch:', profile.price_id, '!=', priceId);
          break;
        }

        console.log('Updating subscription status for profile:', profile.id);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ is_subscribed: true })
          .eq("customer_id", customerId);

        if (updateError) {
          console.error('Error updating subscription status:', updateError);
        } else {
          console.log('Subscription status updated successfully');
        }
        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
        console.log('Unhandled event type:', eventType);
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}

