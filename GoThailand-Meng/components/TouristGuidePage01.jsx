import { useMemo, useState } from "react";

const guideTypes = [
  "Cultural Expert",
  "Food & Culinary",
  "Adventure & Nature",
  "Photography",
];

const languages = ["English", "Mandarin", "French", "German"];

const baseGuides = [
  {
    id: 1,
    name: "Niran S.",
    location: "Bangkok & Ayutthaya",
    price: 2500,
    rating: 4.9,
    reviews: 120,
    specialty: "Culture & History",
    language: "English, Thai",
    image: "/images/Guide01.jpg",
  },
  {
    id: 2,
    name: "Mali V.",
    location: "Chiang Mai",
    price: 3000,
    rating: 5.0,
    reviews: 85,
    specialty: "Culinary Arts",
    language: "English, French",
    image: "/images/Guide02.jpg",
  },
  {
    id: 3,
    name: "Aree J.",
    location: "Bangkok",
    price: 2800,
    rating: 4.8,
    reviews: 96,
    specialty: "Art & Markets",
    language: "English, Thai",
    image: "/images/Guide03.jpg",
  },
  {
    id: 4,
    name: "Somchai K.",
    location: "Chiang Rai",
    price: 3200,
    rating: 4.9,
    reviews: 101,
    specialty: "Nature & Trekking",
    language: "English, Mandarin",
    image: "/images/Guide04.jpg",
  },
];

const featureCards = [
  {
    title: "Authentic Experiences",
    description: "Go beyond the tourist trails and experience Thailand through the eyes of a local.",
  },
  {
    title: "Verified Experts",
    description: "Every guide is thoroughly vetted to ensure professionalism, knowledge, and safety.",
  },
  {
    title: "Personalized",
    description: "Tailor your itinerary on the fly. Your guide adapts to your interests and pace.",
  },
  {
    title: "Seamless Translation",
    description: "Bridge the language gap effortlessly, ensuring smooth interactions wherever you go.",
  },
];

export default function TouristGuidePage01() {
  const [selectedType, setSelectedType] = useState("Cultural Expert");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [searchText, setSearchText] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredGuides = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return baseGuides.filter((guide) => {
      const matchesType = selectedType === "Cultural Expert" || selectedType === "All";
      const matchesSearch =
        keyword.length === 0 ||
        guide.name.toLowerCase().includes(keyword) ||
        guide.location.toLowerCase().includes(keyword) ||
        guide.specialty.toLowerCase().includes(keyword);

      const matchesLanguage = selectedLanguage === "English" || guide.language.toLowerCase().includes(selectedLanguage.toLowerCase());

      return matchesType && matchesSearch && matchesLanguage;
    });
  }, [searchText, selectedType, selectedLanguage]);

  const visibleGuides = filteredGuides.slice(0, visibleCount);

  const loadMoreGuides = () => {
    setVisibleCount((count) => Math.min(count + 2, filteredGuides.length));
  };

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] antialiased">
      <header className="sticky top-0 z-50 border-b border-[#e9e3df] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <a href="#" className="font-display text-[1.9rem] font-bold tracking-tight text-[#001f3f]">
            GoThailand
          </a>

          <nav className="hidden items-center gap-8 text-[0.75rem] font-medium text-[#43474e] md:flex">
            <a href="#" className="transition-colors hover:text-[#001f3f]">Accommodation</a>
            <a href="#" className="transition-colors hover:text-[#001f3f]">Car Rental</a>
            <a href="#" className="border-b-2 border-[#f2b429] pb-1 font-bold text-[#001f3f]" aria-current="page">
              Local Guide
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Search" className="rounded-full p-2 text-[#001f3f] transition hover:bg-[#f5f3f3]">
              <span className="text-xl">⌕</span>
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#001f3f] px-6 py-2.5 text-[0.78rem] font-semibold text-white transition hover:opacity-90"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      <section className="relative flex h-[600px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-beach.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1527]/70 via-[#0a1527]/30 to-[#0a1527]/20" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-10 text-center text-white md:px-10">
          <h1 className="max-w-3xl font-display text-[3rem] font-bold leading-[1.1] tracking-[-0.04em] md:text-[4.6rem]">
            Explore Thailand with a Local Guide
          </h1>
          <p className="mt-3 mb-[120px] max-w-2xl text-base text-white/90 md:text-[1.15rem]">
            Discover authentic experiences with trusted local experts.
          </p>

          <div className="glass-panel flex w-full max-w-[1000px] flex-col items-center justify-between gap-4 rounded-xl p-4 md:flex-row">
            <div className="flex w-full items-center gap-3 rounded-lg bg-[#f5f3f3] px-4 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#e5e1dc] focus-within:ring-[#001f3f] md:flex-1">
              <span className="text-lg text-[#60708b]">📍</span>
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Destination (e.g. Bangkok)"
                className="w-full border-none bg-transparent p-0 text-[#1b1c1c] placeholder:text-[#5f6470] focus:outline-none"
              />
            </div>

            <div className="flex w-full items-center gap-3 rounded-lg bg-[#f5f3f3] px-4 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#e5e1dc] md:flex-1">
              <span className="text-lg text-[#60708b]">📅</span>
              <input
                type="text"
                placeholder="Dates"
                className="w-full border-none bg-transparent p-0 text-[#1b1c1c] placeholder:text-[#5f6470] focus:outline-none"
              />
            </div>

            <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-[#f5f3f3] px-4 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#e5e1dc] md:w-[220px]">
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#60708b]">👥</span>
                <span>2 Guests</span>
              </div>
              <span className="text-base text-[#60708b]">⌄</span>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#fcd400] px-8 py-3.5 text-[0.8rem] font-bold text-[#001f3f] transition hover:bg-[#eac200] md:w-auto"
            >
              <span className="text-base">⌕</span>
              Find a Guide
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-4 pb-10 pt-32 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full md:w-[260px]">
            <div className="flex items-center justify-between border-b border-[#e1ddd8] pb-4">
              <h2 className="font-display text-[2rem] font-bold leading-none text-[#1b1c1c]">Filters</h2>
              <button type="button" className="text-[0.72rem] font-medium text-[#6c7077] underline-offset-2 hover:underline">
                Clear All
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#686f78]">Guide Type</h3>
                <div className="space-y-3">
                  {guideTypes.map((type) => (
                    <label key={type} className="flex cursor-pointer items-center gap-3 text-[#2a2f35]">
                      <input
                        type="checkbox"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        className="h-4 w-4 accent-[#001f3f]"
                      />
                      <span className="text-[0.98rem]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#e1ddd8] pt-5">
                <h3 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#686f78]">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setSelectedLanguage(language)}
                      className={
                        selectedLanguage === language
                          ? "rounded-full bg-[#001f3f] px-4 py-1.5 text-[0.72rem] font-medium text-white"
                          : "rounded-full border border-[#d9d4cf] bg-white px-4 py-1.5 text-[0.72rem] font-medium text-[#2a2f35]"
                      }
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#e1ddd8] pt-5">
                <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#686f78]">Price Range (Per Day)</h3>
                <div className="relative h-1 rounded-full bg-[#eae7e4]">
                  <div className="absolute left-1/4 right-1/4 h-full rounded-full bg-[#fcd400]" />
                  <div className="absolute left-1/4 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fcd400] bg-white shadow-sm" />
                  <div className="absolute right-1/4 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fcd400] bg-white shadow-sm" />
                </div>
                <div className="mt-4 flex items-center justify-between text-[0.72rem] text-[#6c7077]">
                  <span>฿1,500</span>
                  <span>฿5,000+</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="w-full md:flex-1">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-[1.08rem] text-[#43474e]">
                Showing <span className="font-semibold text-[#1b1c1c]">{filteredGuides.length}</span> available guides in Thailand
              </p>

              <div className="flex items-center gap-2 text-[0.72rem] text-[#43474e]">
                <span>Sort by:</span>
                <button type="button" className="flex items-center gap-1 rounded-full border border-[#d8d2ce] bg-white px-3 py-1.5 text-[#1b1c1c]">
                  Recommended
                  <span className="text-sm">⌄</span>
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {visibleGuides.map((guide) => (
                <article key={guide.id} className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e9e3df] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <div className="relative h-64 overflow-hidden">
                    <img src={guide.image} alt={guide.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[0.72rem] font-semibold text-[#1b1c1c] shadow-sm">
                      <span className="text-[#f2b429]">★</span>
                      <span>{guide.rating}</span>
                      <span className="text-[#6c7077]">({guide.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="font-display text-[2rem] leading-none text-[#1b1c1c]">{guide.name}</h3>
                      <div className="text-right">
                        <span className="font-display text-[1.4rem] font-bold text-[#705d00]">฿{guide.price.toLocaleString()}</span>
                        <span className="text-[0.7rem] text-[#6c7077]"> / day</span>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center text-[#6c7077]">
                      <span className="mr-1 text-base">📍</span>
                      <span className="text-[0.92rem]">{guide.location}</span>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="rounded-md bg-[#f5f3f3] px-3 py-1.5 text-[0.7rem] text-[#43474e]">{guide.specialty}</span>
                      <span className="rounded-md bg-[#f5f3f3] px-3 py-1.5 text-[0.7rem] text-[#43474e]">{guide.language}</span>
                    </div>

                    <button
                      type="button"
                      className="mt-auto w-full rounded-lg border border-[#001f3f] bg-white px-3 py-3 text-[0.75rem] font-semibold text-[#001f3f] transition hover:bg-[#001f3f] hover:text-white"
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMoreGuides}
                className="rounded-lg border-2 border-[#001f3f] bg-white px-8 py-3 text-[0.76rem] font-semibold text-[#001f3f] transition hover:bg-[#001f3f] hover:text-white"
              >
                Load More Guides
              </button>
            </div>
          </div>
        </div>
      </main>

      <section className="border-t border-[#e8e0d9] bg-[#f2efe9] py-14">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <h2 className="mb-10 text-center font-display text-[2.8rem] font-bold text-[#1b1c1c]">
            Why Travel with a Local Guide?
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-[18px] bg-white p-7 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3f3] text-[2rem] text-[#f2b429]">
                  ✦
                </div>
                <h3 className="font-display text-[1.6rem] font-bold leading-tight text-[#1b1c1c]">{feature.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-6 text-[#5f6470]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#001f3f] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <div>
            <div className="font-display text-[1.8rem] font-bold text-white">GoThailand</div>
            <div className="mt-1 text-[0.82rem] text-white/80">© 2024 GoThailand. All rights reserved.</div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-[0.72rem] text-white/80">
            <a href="#" className="transition hover:text-[#f2b429]">About Us</a>
            <a href="#" className="transition hover:text-[#f2b429]">Terms of Service</a>
            <a href="#" className="transition hover:text-[#f2b429]">Privacy Policy</a>
            <a href="#" className="transition hover:text-[#f2b429]">Contact Us</a>
            <a href="#" className="transition hover:text-[#f2b429]">Partner Program</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
