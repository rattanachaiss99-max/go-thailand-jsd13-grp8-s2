import { useMemo, useState } from "react";
import { guides } from "../moc-data/guides";

const filterOptions = [
  "Cultural Expert",
  "Food & Culinary",
  "Adventure & Nature",
  "Photography",
];

const languages = ["English", "Mandarin", "French", "German"];

const featureCards = [
  {
    title: "Authentic Experiences",
    description: "Go beyond the tourist trails and experience the real Thailand through local stories and hidden gems.",
  },
  {
    title: "Verified Experts",
    description: "Every guide is thoroughly vetted to ensure professionalism, local knowledge, and trusted service.",
  },
  {
    title: "Personalized",
    description: "Tailor your itinerary around the things you care about, from food to culture to family adventures.",
  },
  {
    title: "Seamless Translation",
    description: "Bridge the language gap effortlessly with smooth, supportive communication during every interaction.",
  },
];

export default function GuideSelectionFlow() {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedType, setSelectedType] = useState("Cultural Expert");
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredGuides = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return guides.filter((guide) => {
      const bySearch =
        keyword.length === 0 ||
        guide.name.toLowerCase().includes(keyword) ||
        guide.description.toLowerCase().includes(keyword);

      const byType =
        selectedType === "Cultural Expert" ||
        selectedType === "All" ||
        selectedType === "Food & Culinary";

      const byLanguage =
        selectedLanguage === "English" || selectedLanguage === "Mandarin" || selectedLanguage === "French" || selectedLanguage === "German";

      return bySearch && byType && byLanguage;
    });
  }, [search, selectedLanguage, selectedType]);

  const visibleGuides = filteredGuides.slice(0, visibleCount);

  const loadMoreGuides = () => {
    setVisibleCount((count) => (count >= filteredGuides.length ? 4 : Math.min(count + 2, filteredGuides.length)));
  };

  const heroBackground = "/images/hero-beach.jpg";

  return (
    <div className="bg-[#f6f3ee] text-[#1b1c1c]">
      <header className="border-b border-[#e6e1dc] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <div className="font-display text-[2.1rem] font-bold tracking-tight text-[#10264a]">GoThailand</div>

          <nav className="hidden items-center gap-8 text-[0.76rem] font-medium text-[#1b1c1c] md:flex">
            <a href="#" className="transition hover:text-[#d7a73a]">Accommodation</a>
            <a href="#" className="transition hover:text-[#d7a73a]">Car Rental</a>
            <a href="#" className="transition hover:text-[#d7a73a]">Local Guide</a>
          </nav>

          <button
            type="button"
            className="rounded-[10px] bg-[#10264a] px-4 py-2 text-[0.78rem] font-semibold text-white shadow-sm transition hover:bg-[#1d3970]"
          >
            Book Now
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={heroBackground} alt="Thai temple and beach path" className="h-[470px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1d2d]/70 via-[#0c1d2d]/35 to-[#0c1d2d]/20" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-[1100px] text-center text-white">
            <h1 className="font-display text-[3rem] font-bold leading-[1.05] tracking-[-0.04em] md:text-[5rem]">
              Explore Thailand with a Local Guide
            </h1>
            <p className="mx-auto mt-3 max-w-[700px] text-base text-white/80 md:text-[1.12rem]">
              Discover authentic experiences with trusted local experts.
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[-36px] flex justify-center px-4">
          <div className="flex w-full max-w-[1000px] items-center gap-3 rounded-[18px] bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] bg-white px-3 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#dddddd]">
              <span className="text-base text-[#2d456f]">📍</span>
              <span className="text-[#10264a]">Destination</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] bg-white px-3 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#dddddd]">
              <span className="text-base text-[#2d456f]">📅</span>
              <span className="text-[#10264a]">Dates</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] bg-white px-3 py-3 text-sm text-[#1b1c1c] ring-1 ring-[#dddddd]">
              <span className="text-base text-[#2d456f]">👥</span>
              <span className="text-[#10264a]">2 Guests</span>
            </div>

            <button
              type="button"
              className="rounded-[12px] bg-[#f2b429] px-5 py-[0.9rem] text-sm font-semibold text-[#10264a] shadow-sm transition hover:bg-[#e0a521]"
            >
              Find a Guide
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-4 pb-10 pt-16 md:px-6">
        <div className="rounded-[18px] border border-[#e7e4df] bg-[#f9f7f5] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#e5e0db] pb-3">
            <div className="flex items-center gap-3 text-sm text-[#1b1c1c]">
              <span className="font-bold text-[#1b1c1c]">Filters</span>
              <button type="button" className="text-[#676f7d] underline-offset-2 hover:underline">Clear All</button>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#1b1c1c]">
              <span>Showing <span className="font-semibold">124</span> available guides in Thailand</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1b1c1c]">
              <span className="font-medium">Sort by:</span>
              <button type="button" className="rounded-full border border-[#d7d2cd] bg-white px-3 py-1 text-[#1b1c1c]">
                Recommended
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-6 pt-2">
              <div>
                <h3 className="mb-3 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6e7077]">Guide Type</h3>
                <div className="space-y-2 text-sm">
                  {filterOptions.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-[#2a2f35]">
                      <input
                        type="checkbox"
                        checked={selectedType === option || option === "Cultural Expert"}
                        onChange={() => setSelectedType(option)}
                        className="h-3.5 w-3.5 accent-[#10264a]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6e7077]">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setSelectedLanguage(language)}
                      className={
                        selectedLanguage === language
                          ? "rounded-full bg-[#10264a] px-3 py-1.5 text-[0.7rem] font-medium text-white"
                          : "rounded-full border border-[#d9d4cf] bg-white px-3 py-1.5 text-[0.7rem] font-medium text-[#2a2f35]"
                      }
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6e7077]">Price Range (per day)</h3>
                <div className="space-y-3">
                  <input type="range" min="0" max="100" defaultValue="35" className="w-full accent-[#10264a]" />
                  <div className="flex justify-between text-xs text-[#6e7077]">
                    <span>฿1,500</span>
                    <span>฿5,000+</span>
                  </div>
                </div>
              </div>
            </aside>

            <section className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                {visibleGuides.map((guide) => (
                  <article key={guide.id} className="overflow-hidden rounded-[18px] border border-[#e9e4df] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                    <div className="flex h-[200px] overflow-hidden">
                      <img
                        src={`/images/Guide${String(((guide.id - 1) % 9) + 1).padStart(2, "0")}.jpg`}
                        alt={guide.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="px-4 pb-4 pt-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 text-[#10264a]">
                          <span className="text-[0.7rem] font-medium text-[#d7a73a]">★</span>
                          <span className="text-[0.7rem] font-semibold">{guide.rating}.0</span>
                          <span className="text-[0.7rem] text-[#6c7076]">({guide.rating} reviews)</span>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-[1.05rem] font-bold text-[#10264a]">฿{guide.price.toLocaleString()}</div>
                          <div className="text-[0.6rem] text-[#6c7076]">/ day</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-[1.55rem] font-bold text-[#10264a]">{guide.name}</h3>
                          <div className="mt-1 text-[0.8rem] text-[#5f6470]">{guide.location}</div>
                        </div>
                      </div>

                      <div className="mt-2 text-[0.72rem] text-[#5f6470]">
                        {guide.specialty} • {guide.language}
                      </div>

                      <button
                        type="button"
                        className="mt-4 w-full rounded-[10px] border border-[#10264a] bg-white px-3 py-2 text-[0.72rem] font-semibold text-[#10264a] transition hover:bg-[#10264a] hover:text-white"
                      >
                        View Profile
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  onClick={loadMoreGuides}
                  className="rounded-[10px] border border-[#10264a] bg-white px-5 py-2.5 text-[0.72rem] font-semibold text-[#10264a] shadow-sm transition hover:bg-[#10264a] hover:text-white"
                >
                  Load More Guides
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <section className="bg-[#f6f3ee] py-12">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <h2 className="mb-8 text-center font-display text-[2.5rem] font-bold text-[#10264a]">
            Why Travel with a Local Guide?
          </h2>

          <div className="grid gap-5 md:grid-cols-4">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-[16px] border border-[#e8e0d9] bg-white p-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4efe7] text-xl text-[#d7a73a]">
                  ✦
                </div>
                <h3 className="font-display text-[1.6rem] font-bold leading-snug text-[#10264a]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f6470]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0f1d55] text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-6 text-[0.76rem] text-white/80">
          <div>
            <div className="font-display text-[1.8rem] font-bold text-white">GoThailand</div>
            <div className="mt-1">© 2024 GoThailand. All rights reserved.</div>
          </div>

          <div className="hidden items-center gap-5 text-[0.72rem] md:flex">
            <a href="#" className="hover:text-[#f2b429]">About Us</a>
            <a href="#" className="hover:text-[#f2b429]">Terms of Service</a>
            <a href="#" className="hover:text-[#f2b429]">Privacy Policy</a>
            <a href="#" className="hover:text-[#f2b429]">Contact Us</a>
            <a href="#" className="hover:text-[#f2b429]">Partner Program</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
