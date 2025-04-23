import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/fa_wizard_logo.png";
import fhlogo from "@/app/FutureHonoluluLogo.png";
import faexpert from "@/app/fa-experts-logo.png";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.resend.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link
              href="/#"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-62"
                placeholder="blur"
                priority={true}
                width={245}
                height={245}
              />
            </Link>

            {/* <p className="mt-3 text-sm text-base-content/80">
              {config.appDescription}
            </p> */}
          </div>

          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            {/* <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                LINKS
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {config.resend.supportEmail && (
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    target="_blank"
                    className="link link-hover"
                    aria-label="Contact Support"
                  >
                    Support
                  </a>
                )}
                <Link href="/#pricing" className="link link-hover">
                  Pricing
                </Link>
                {/* <Link href="/blog" className="link link-hover">
                  Blog
                </Link> */}
                {/* <a href="/#" target="_blank" className="link link-hover">
                  Affiliates
                </a> */}
              {/* </div> */}
            {/* </div> */} 

            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                LEGAL
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <Link href="/tos" className="link link-hover">
                  Terms of services
                </Link>
                <Link href="/privacy-policy" className="link link-hover">
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>

          <div className="w-56 flex-shrink-0 md:mx-0 mx-auto text-center md:text-right">
            <div className="flex gap-2 justify-center md:justify-end items-center">
              
            <a href="https://faexperts.com" aria-label="FA Experts Website Link">
            <Image
                src={faexpert}
                alt="Financial Aid Experts logo"
                className="w-40"
                placeholder="blur"
                priority={true}
                width={160}
                height={160}
              />
              </a>
            </div>
            

            <p className="mt-3 text-sm text-base-content/80">
            <i><strong>FA Wizard™ is a product of Financial Aid Experts, Inc.</strong></i>
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-[#003767] py-6">
        <div className="max-w-[1920px] mx-auto flex flex-col items-center justify-between space-y-2 md:flex-row px-6">
          <div>
            <span className="text-white">
              &copy; {new Date().getFullYear()} Financial Aid Experts, Inc. All rights reserved.
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">Crafted by</span>
            <a href="https://futurehonolulu.com" aria-label="Future Honolulu Link">
              <Image
                src={fhlogo}
                alt={`${config.appName} logo`}
                className="w-48"
                placeholder="blur"
                priority={true}
                width={192}
                height={192}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
