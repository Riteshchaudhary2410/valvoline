'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

const footerLinks = {
  shop: [
    { label: 'Engine Oil', href: '/products?oilType=ENGINE_OIL' },
    { label: 'Gear Oil', href: '/products?oilType=GEAR_OIL' },
    { label: 'Grease', href: '/products?oilType=GREASE' },
    { label: 'Industrial Oils', href: '/products?oilType=INDUSTRIAL_OILS' },
  ],
  business: [
    { label: 'B2B Solutions', href: '/b2b' },
    { label: 'Vehicle Selector', href: '/vehicle-selector' },
    { label: 'Garage Dashboard', href: '/dashboard' },
    { label: 'Checkout', href: '/checkout' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-[linear-gradient(180deg,#081224_0%,#0f2140_100%)]">
      <div className="container-max py-14">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(255,255,255,0.16)]">
                <Image src="/vlogo.png" alt="Valvoline Logo" width={50} height={50} className="h-12 w-12 object-contain" />
              </div>
              <div>
                <p className="text-lg font-black tracking-[0.2em] text-white">SHREE LAXMI NARAYAN TRADERS</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Dealer platform</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-300">
              Automotive lubricant commerce for retail drivers, mechanics, garages, and fleet buyers.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, url: 'https://www.facebook.com/share/1HRqTirmCd/?mibextid=wwXIfr' },
                { icon: FiInstagram, url: 'https://www.instagram.com/its_ritesh55?igsh=MW13MDNlMm1lMmQ0Ng%3D%3D&utm_source=qr' },
                { icon: FiLinkedin, url: 'https://www.linkedin.com/in/ritesh-chaudhary-765650294?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-300 transition-colors hover:border-[#df3b2f] hover:text-white"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Shop</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-200 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Business</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-200 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-200">
              <a href="tel:+977-9816749733" className="flex items-center gap-2 hover:text-white transition-colors">
                <FiPhone className="text-[#df3b2f]" />
                +977 9816749733
              </a>
              <a href="mailto:shreelaxminarayantraders@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <FiMail className="text-[#df3b2f]" />
                shreelaxminarayantraders@gmail.com
              </a>
              <p className="leading-6 text-slate-300">
                Bulk purchasing support, compatibility guidance, and garage onboarding.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Valvoline dealer platform. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
