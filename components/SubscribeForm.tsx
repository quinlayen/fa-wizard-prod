// 'use client';

// import React from 'react';
// import { useState } from 'react';
// import { createClient } from '@/libs/supabase/client';
// import ButtonCheckout from './ButtonCheckout';
// import config from '@/config';
// import Image from 'next/image';
// import logo from '@/app/icon.png';

// export default function SubscribeForm() {
//   const [loading, setLoading] = useState(false);
//   const supabase = createClient();

//   const handleSubscriptionSuccess = async () => {
//     setLoading(true);
//     try {
//       // Redirect to the dashboard
//       window.location.href = '/dashboard';
//     } catch (error) {
//       console.error('Error redirecting to dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="prose max-w-none">
//         <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
//         <p className="text-gray-600 mb-6">
//           Subscribe to FA Wizard™ to get access to all features and start managing your school&apos;s information.
//         </p>
//         <p className="text-sm text-gray-500">
//           We&apos;ll never share your email with anyone else.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {config.stripe.plans.map((plan) => (
//           <div 
//             key={plan.priceId}
//             className={`bg-white p-6 rounded-lg shadow ${
//               plan.isFeatured ? 'border-2 border-[#003767]' : ''
//             }`}
//           >
//             <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
//             <p className="text-gray-600 mb-4">{plan.description}</p>
//             <div className="flex items-baseline mb-6">
//               <span className="text-3xl font-bold">${plan.price}</span>
//               {plan.priceAnchor && (
//                 <span className="text-gray-400 line-through ml-2">${plan.priceAnchor}</span>
//               )}
//               <span className="text-gray-600 ml-2">/month</span>
//             </div>
            
//             <ul className="space-y-2 mb-6">
//               {plan.features.map((feature, index) => (
//                 <li key={index} className="flex items-center">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                   {feature.name}
//                 </li>
//               ))}
//             </ul>
//             <ButtonCheckout
//               mode="subscription"
//               priceId={plan.priceId}
//               onSuccess={handleSubscriptionSuccess}
//               className="w-full bg-[#003767] text-white hover:bg-[#002a4d]"
//             />
//             <br/>
//             <p className="text-gray-600 mb-4"> * Enter Coupon Code <strong>{plan.couponCode}</strong> for 24-month promotion price!</p>
//           </div>
//         ))}
//       </div>

//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded-lg">
//             <p>Processing your subscription...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 

'use client';

import React, { useState } from 'react';
import { createClient } from '@/libs/supabase/client';
import ButtonCheckout from './ButtonCheckout';
import config from '@/config';
import Image from 'next/image';
import logo from '@/app/icon.png';
import { motion } from 'framer-motion';

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubscriptionSuccess = async () => {
    setLoading(true);
    try {
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error redirecting to dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Subscription form */}
      <div className="w-full md:w-1/2 p-8 md:p-12">
        <div className="max-w-md mx-auto">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to FA Wizard™ to get access to all features and start managing your school&apos;s information.
            </p>
            <p className="text-sm text-gray-500">
              We&apos;ll never share your email with anyone else.
            </p>
          </div>

          <div className="mt-8">
            {config.stripe.plans.map((plan) => (
              <div
                key={plan.priceId}
                className={`bg-white p-6 rounded-lg shadow mb-6 ${
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
                <br/>
                <p 
                  className="text-gray-600 mb-4"> * Enter Coupon Code <strong>{plan.couponCode}</strong> for 24-month promotion price!
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Why Choose FA Wizard */}
      <div className="hidden md:flex w-1/2 bg-[#003767] text-white min-h-screen flex-col justify-center p-12">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-24 h-24 mb-6"
              width={96}
              height={96}
            />
            <h2 className="text-3xl font-bold mb-4">Why Choose FA Wizard™?</h2>
            {/* <p className="text-lg opacity-90 mb-6">
              Join hundreds of schools that trust FA Wizard™ for their compliance needs.
            </p> */}
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Ready-to-Use Compliance Manual — Fully Aligned with Title IV and Accreditor Standards',
                desc: 'A customized Policy and Procedure Manual with more than 35 required P&P statements - compliant with Title IV, accreditor, and state requirements.',
              },
              {
                title: 'Customized Consumer Website',
                desc: "'Consumer Information' webpages page tailored to your school - with 30 different required Title IV disclosures, matching your site’s fonts and colors.",
              },
              {
                title: 'Automated Compliance Calendar for Staff & Management',
                desc: 'An automated calendar to remind staff (and management) of upcoming federal deadlines, reports, and administrative tasks.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start"
                initial="hidden"
                animate="visible"
                custom={idx}
                variants={itemVariants}
              >
                <svg
                  className="w-6 h-6 text-[#FDB913] mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="opacity-90">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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