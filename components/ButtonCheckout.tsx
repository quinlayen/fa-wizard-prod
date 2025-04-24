"use client";

import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import apiClient from "@/libs/api";
import config from "@/config";
import Image from "next/image";
import logo from "@/app/icon.png";
import { useRouter } from "next/navigation";

// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// Users must be authenticated. It will prefill the Checkout data with their email and/or credit card (if any)
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({
  priceId,
  setupFeePriceId,
  couponCode,
  mode = "subscription",
  onSuccess,
  className,
}: {
  priceId: string;
  setupFeePriceId?: string;
  couponCode?: string;
  mode?: "subscription" | "payment";
  onSuccess?: () => void;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      if (!user) {
        // If user is not authenticated, redirect to sign in
        router.push(config.auth.loginUrl);
        return;
      }

      // Construct proper URLs using the domain from config
      const baseUrl = `https://${config.domainName}`;
      const currentPath = window.location.pathname;
      const successUrl = `${baseUrl}${currentPath}`;
      const cancelUrl = `${baseUrl}${currentPath}`;

      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-checkout",
        {
          priceId,
          setupFeePriceId,
          couponCode,
          successUrl,
          cancelUrl,
          mode,
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (e) {
      console.error(e);
      // If there's an error, redirect to sign in
      router.push(config.auth.loginUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-primary btn-block group ${className || ''}`}
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Image
          src={logo}
          alt={`${config.appName} logo`}
          priority={true}
          className="w-10 h-10"
          width={24}
          height={24}
        />
      )}
      Get {config?.appName}
    </button>
  );
};

export default ButtonCheckout;
