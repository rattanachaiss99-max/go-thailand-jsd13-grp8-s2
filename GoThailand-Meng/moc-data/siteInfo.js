/* ============================================================
   moc-data/siteInfo.js
   General information about the GoThailand company that is
   shown in the Navbar and in the Footer (contact info, social
   links, copyright...). Keeping it here makes it easy to change
   the data in one single place.
   ============================================================ */

// Small text shown under the "GoThailand" logo in the header
export const tagline = "- Experience the Best of Asia -";

// Main navigation menu of the website.
// "to" is the react-router path, "hash" links scroll to a section
// id on the home page (for example /#services scrolls to the
// services section of the home page).
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "Destinations", to: "/#destinations" },
  { label: "About Us", to: "/about" },
];

// Contact details displayed in the footer "Contact Us" block
export const contactInfo = {
  phone: "+01 9802 2231 0320",
  email: "email@gotgmail.com",
  address: "190 Nor Si Rd, T.Ndasades, Thailand",
};

// Social media links shown in the middle of the footer.
// "type" tells the Footer which icon to draw.
export const socialLinks = [
  { type: "facebook", label: "Facebook" },
  { type: "instagram", label: "Instagram" },
  { type: "line", label: "LINE" },
];

// Text lines at the very bottom of the footer
export const footerBottom = {
  copyright: "\u00A9 2024 GoThailand. All Rights Reserved. (This website is for study only. No real services provide.)",
  links: ["Sitemap", "Terms of Use"],
};
