import Button from "./Button";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="font-serif text-2xl font-bold tracking-tight">Go<span className="text-[#C69B59]">Thailand</span></a>
        <nav className="hidden space-x-8 text-sm font-medium text-gray-700 md:flex" aria-label="Primary navigation">
          <a href="#accommodation" className="hover:text-black">Accommodation</a>
          <a href="#car-rental" className="border-b-2 border-black pb-1 font-semibold text-black">Car Rental</a>
          <a href="#guide" className="hover:text-black">Local Guide</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="link" className="text-sm font-medium">Login</Button>
          <Button variant="primary" className="rounded px-5 py-2.5 text-xs font-semibold">Register</Button>
        </div>
      </div>
    </header>
  );
}