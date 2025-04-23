'use client';

import React from 'react';
import { useState } from 'react';
import { createClient } from '@/libs/supabase/client';
import ButtonCheckout from './ButtonCheckout';
import config from '@/config';

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubscriptionSuccess = async () => {
    setLoading(true);
    try {
      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error redirecting to dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to FA Wizard to get access to all features and start managing your school&apos;s information.
        </p>
        <p className="text-sm text-gray-500">
          We&apos;ll never share your email with anyone else.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.stripe.plans.map((plan) => (
          <div 
            key={plan.priceId}
            className={`bg-white p-6 rounded-lg shadow ${
              plan.isFeatured ? 'border-2 border-[#003767]' : ''
            }`}
          >
            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold">${plan.price}</span>
              {plan.priceAnchor && (
                <span className="text-gray-400 line-through ml-2">${plan.priceAnchor}</span>
              )}
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature.name}
                </li>
              ))}
            </ul>
            
            <ButtonCheckout
              mode="subscription"
              priceId={plan.priceId}
              onSuccess={handleSubscriptionSuccess}
              className="w-full bg-[#003767] text-white hover:bg-[#002a4d]"
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>Processing your subscription...</p>
          </div>
        </div>
      )}
    </div>
  );
} 