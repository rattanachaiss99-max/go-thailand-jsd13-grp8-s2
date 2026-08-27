/* ============================================================
   components/Footer.jsx
   The dark-blue footer used at the bottom of every page.

   Layout (3 columns):
   1. "Contact Us"  -> phone / email / address with gold icons
   2. Social icons  -> Facebook, Instagram, LINE + "For private group"
   3. Temple skyline silhouette (decorative SVG)

   Bottom bar: copyright text on the left, "Sitemap | Terms of
   Use" on the right.
   ============================================================ */

import { Link } from "react-router-dom";
import { contactInfo, socialLinks, footerBottom } from "../moc-data/siteInfo";

/* --- Small helper components (only used inside this file) ---- */

// Gold circle with a navy icon inside (used for the social buttons)
function SocialIcon({ type, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      title={label}
      onClick={(e) => e.preventDefault()} // mock links should not jump to top
      className="flex h-11 w-11 items-center justify-center rounded-full bg-thai-gold text-thai-navy
                 transition-all duration-150 hover:bg-thai-gold-light hover:scale-110
                 active:scale-90 active:bg-thai-gold-dark"
    >
      {type === "facebook" && (
        /* Facebook "f" letter */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.5-.13-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.65v8h3.35z" />
        </svg>
      )}
      {type === "instagram" && (
        /* Instagram: rounded square + circle + small dot */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )}
      {type === "line" && (
        /* LINE messenger: speech bubble with "LINE" text */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.5 2 2 5.7 2 10.2c0 4 3.5 7.4 8.3 8.1.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 6-3.6 8.2-6.1 1.5-1.6 1.8-3 1.8-5C22 5.7 17.5 2 12 2z" />
          <text x="12" y="13.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#f2b429">LINE</text>
        </svg>
      )}
    </a>
  );
}

/* Generates one "prang" (temple tower) silhouette path.
   x = horizontal position, h = height of the tower. */
function prangPath(x, h) {
  const baseY = 120; // bottom line of the skyline
  return `M ${x} ${baseY}
          C ${x + 2} ${baseY - h * 0.45} ${x + 10} ${baseY - h * 0.5} ${x + 12} ${baseY - h}
          L ${x + 16} ${baseY - h}
          C ${x + 18} ${baseY - h * 0.5} ${x + 26} ${baseY - h * 0.45} ${x + 28} ${baseY} Z`;
}

// Decorative Thai temple skyline drawn with SVG (right side of the footer)
function TempleSkyline() {
  return (
    <svg viewBox="0 0 520 120" className="h-24 w-full max-w-sm opacity-90" aria-hidden="true">
      <g fill="#26357c">
        {/* a row of temple towers with different heights */}
        <path d={prangPath(10, 60)} />
        <path d={prangPath(60, 95)} />
        <path d={prangPath(115, 75)} />
        <path d={prangPath(170, 110)} />
        <path d={prangPath(230, 80)} />
        <path d={prangPath(285, 100)} />
        {/* two rounded stupas (dome + small spire) */}
        <path d="M340 120 C340 92 352 82 362 82 C372 82 384 92 384 120 Z M359 82 L365 82 L362 62 Z" />
        <path d="M400 120 C400 98 410 90 418 90 C426 90 436 98 436 120 Z M415 90 L421 90 L418 74 Z" />
        {/* the giant swing (Sao Chingcha): two posts + crossbar */}
        <rect x="465" y="30" width="7" height="90" rx="3" />
        <rect x="505" y="30" width="7" height="90" rx="3" />
        <path d="M461 34 Q488 14 516 34 L513 42 Q488 26 464 42 Z" />
        {/* ground line */}
        <rect x="0" y="116" width="520" height="4" />
      </g>
    </svg>
  );
}

// Gold four-pointed sparkle under "For private group"
function Sparkle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#f2b429" aria-hidden="true">
      <path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z" />
    </svg>
  );
}

/* --- The main Footer component -------------------------------- */
export default function Footer() {
  return (
    <footer className="bg-thai-navy text-white">
      {/* ----- Upper area: contact / social / skyline ----- */}
      {/* CHANGED: reduced footer height to 80% - vertical padding changed from py-3 (0.75rem) to py-[0.6rem] */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-[0.6rem] md:grid-cols-[1fr_auto_1fr]">
        {/* Column 1: Contact Us */}
        <div>
          <h3 className="font-display text-2xl font-bold text-thai-gold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {/* phone row */}
            <li className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#f2b429" className="mt-0.5 shrink-0">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
              </svg>
              <span>{contactInfo.phone}</span>
            </li>
            {/* email row */}
            <li className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#f2b429" className="mt-0.5 shrink-0">
                <path d="M2 5c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5zm2 1.4V18h16V6.4l-8 5.3-8-5.3zM19.2 6H4.8L12 10.8 19.2 6z" />
              </svg>
              <span>{contactInfo.email}</span>
            </li>
            {/* address row */}
            <li className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#f2b429" className="mt-0.5 shrink-0">
                <path d="M12 2C8 2 5 5 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>{contactInfo.address}</span>
            </li>
          </ul>
        </div>

        {/* Thin gold divider line between the columns (desktop only) */}
        <div className="hidden w-px self-stretch bg-thai-gold/50 md:block" />

        {/* Column 2: social icons + private group note */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <SocialIcon key={social.type} type={social.type} label={social.label} />
            ))}
          </div>
          <p className="font-display text-xl font-semibold text-thai-gold">For private group</p>
          <Sparkle />
        </div>

        {/* Column 3: temple skyline (hidden on small screens) */}
        <div className="hidden items-center justify-end lg:flex">
          {/* <TempleSkyline />  */}
        </div>
      </div>

      {/* ----- Bottom bar: copyright + sitemap / terms ----- */}
      <div className="border-t border-white/10 bg-[#0b1640]">
        {/* CHANGED: reduced footer height to 80% - vertical padding changed from py-4 (1rem) to py-[0.8rem] */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-[0.8rem] text-sm text-white/80 sm:flex-row">
          <p>{footerBottom.copyright}</p>
          <p className="flex items-center gap-3">
            {footerBottom.links.map((label, index) => (
              <span key={label} className="flex items-center gap-3">
                {index > 0 && <span className="text-white/40">|</span>}
                <Link
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  className="transition-colors hover:text-thai-gold active:text-thai-gold-dark"
                >
                  {label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
