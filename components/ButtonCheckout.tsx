"use client";

import React from "react";
import { useState } from "react";
import apiClient from "@/libs/api";
import config from "@/config";
import Image from "next/image";
import logo from "@/app/icon.png";


// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// Users must be authenticated. It will prefill the Checkout data with their email and/or credit card (if any)
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({
  priceId,
  mode = "payment",
  onSuccess,
  className,
}: {
  priceId: string;
  mode?: "payment" | "subscription";
  onSuccess?: () => void;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-checkout",
        {
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode,
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      window.location.href = url;
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <button
      className={`btn btn-primary btn-block group ${className || ''}`}
      onClick={() => handlePayment()}
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
