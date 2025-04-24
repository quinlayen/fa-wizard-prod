"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

const ButtonSigninIconOnly = ({
    extraStyle,
  }: {
    extraStyle?: string;
  }) => {
    const supabase = createClient();
    const [user, setUser] = useState<User>(null);
  
    useEffect(() => {
      const getUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      };
  
      getUser();
    }, [supabase]);
  
    if (user) {
      const displayName =
        user?.user_metadata?.display_name || user?.email?.toLowerCase() || "Account";
  
      return (
        <Link
          href={config.auth.callbackUrl}
          className={`btn ${extraStyle ? extraStyle : ""}`}
          aria-label="Account"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user?.user_metadata?.avatar_url}
              alt="Account avatar"
              className="w-6 h-6 rounded-full shrink-0"
              referrerPolicy="no-referrer"
              width={24}
              height={24}
            />
          ) : (
            <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
      );
    }
  
    return (
      <Link
        className={`btn ${extraStyle ? extraStyle : ""}`}
        href={config.auth.loginUrl}
      >
        Sign in
      </Link>
    );
  };
  
  export default ButtonSigninIconOnly;