"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import Image from "next/image";
import logo from "@/app/icon.png";

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
  
    return (
      <Link
        href={user ? config.auth.callbackUrl : config.auth.loginUrl}
        className={`btn btn-primary btn-block group ${extraStyle || ""}`}
        aria-label="FA Wizard Account Access"
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="Account avatar"
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            priority={true}
            className="w-6 h-6"
            width={24}
            height={24}
          />
        )}
        <span className="ml-2">Get {config.appName}</span>
      </Link>
    );
  };
  
  export default ButtonSigninIconOnly;