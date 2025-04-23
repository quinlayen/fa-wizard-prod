"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import config from "@/config";
import PhoneInput from "@/components/PhoneInput";

// This a login/singup page for Supabase Auth.
// Successfull login redirects to /api/auth/callback where the Code Exchange is processed (see app/api/auth/callback/route.js).
export default function Login() {
  const supabase = createClient();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  // Check if user exists when email is entered and blurred
  const checkUserExists = async (email: string) => {
    if (!email) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      setUserExists(!!profile);
      
      // If user exists and trying to sign up, or doesn't exist and trying to sign in
      if ((!!profile && isSignUp) || (!profile && !isSignUp)) {
        setIsSignUp(!isSignUp);
        toast.error(profile ? 'Email already registered. Please sign in.' : 'Email not found. Please sign up.');
      }
    } catch (error) {
      console.log('Error checking user:', error);
      setUserExists(null);
    }
  };

  const validateForm = () => {
    if (!email) {
      toast.error('Email is required');
      return false;
    }

    if (isSignUp) {
      if (!firstName || !lastName) {
        toast.error('First and last name are required');
        return false;
      }
      if (!phone || !/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
        toast.error('Valid phone number is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if user exists before proceeding
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      const userExists = !!existingProfile;

      // If user exists and trying to sign up, show error
      if (userExists && isSignUp) {
        toast.error('Email already registered. Please sign in.');
        setIsSignUp(false);
        setIsLoading(false);
        return;
      }

      // If user doesn't exist and trying to sign in, show error
      if (!userExists && !isSignUp) {
        toast.error('Email not found. Please sign up.');
        setIsSignUp(true);
        setIsLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/api/auth/callback',
          data: isSignUp ? {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone
          } : undefined
        },
      });

      if (signInError) throw signInError;

      toast.success("Check your email for the magic link!");
      setIsDisabled(true);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/" className="btn btn-ghost btn-sm">
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
          Home
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </h1>
        <p className="text-base-content/60">
          {isSignUp ? 'Enter your details to create an account' : 'Welcome back! Enter your email to sign in'}
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <form className="form-control w-full space-y-4" onSubmit={handleSubmit}>
          <input
            required
            type="email"
            value={email}
            autoComplete="email"
            placeholder="Email address"
            className="input input-bordered w-full placeholder:opacity-60"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => checkUserExists(email)}
          />

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  value={firstName}
                  autoComplete="given-name"
                  placeholder="First Name"
                  className="input input-bordered w-full placeholder:opacity-60"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  required
                  type="text"
                  value={lastName}
                  autoComplete="family-name"
                  placeholder="Last Name"
                  className="input input-bordered w-full placeholder:opacity-60"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <PhoneInput
                value={phone}
                onChange={setPhone}
                required={true}
              />
            </>
          )}

          <button
            className="btn btn-primary btn-block"
            disabled={isLoading || isDisabled}
            type="submit"
          >
            {isLoading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            Send Magic Link
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-base-content/60">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Need an account?{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
