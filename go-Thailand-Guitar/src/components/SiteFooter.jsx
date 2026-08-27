export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#071327] px-6 pb-12 pt-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2"><div className="font-serif text-2xl font-bold tracking-wide">Go<span className="text-[#C69B59]">Thailand</span></div><p className="max-w-sm text-xs leading-relaxed text-gray-400">Curating Thailand&apos;s most exclusive and luxurious travel experiences.</p></div>
        <FooterLinks title="LINKS" links={["About Us", "Sustainability", "Privacy Policy", "Terms of Service", "Press Kit"]} />
        <FooterLinks title="CONNECT" links={["Contact Us", "Luxury Standards", "Services"]} />
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-gray-800/80 pt-8 text-center"><p className="text-[11px] text-gray-500">© 2024 GoThailand Luxury Travel. All rights reserved.</p></div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return <div><h3 className="mb-4 text-xs font-bold tracking-wider text-gray-300">{title}</h3><ul className="space-y-2.5 text-xs text-gray-400">{links.map((link) => <li key={link}><a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-white">{link}</a></li>)}</ul></div>;
}