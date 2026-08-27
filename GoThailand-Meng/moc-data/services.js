/* ============================================================
   moc-data/services.js
   Data of the 3 big selection cards on the home page:
   Accommodation, Car Rental and Tourist Guide.
   Each service has:
     - id        : unique key used by React lists
     - title     : heading shown on the card
     - image     : illustration inside public/images/
     - link      : page opened when the card is clicked
   ============================================================ */

export const services = [
  {
    id: "accommodation",
    title: "Accommodation",
    image: "/images/service-accommodation.jpg",
    link: "/contact", // booking page is not built yet -> go to contact
  },
  {
    id: "car-rental",
    title: "Car Rental",
    image: "/images/service-car-rental.jpg",
    link: "/contact", // booking page is not built yet -> go to contact
  },
  {
    id: "tourist-guide",
    title: "Tourist Guide",
    image: "/images/service-tourist-guide.jpg",
    link: "/tourist-guide", // opens the Tourist Guide page
  },
];
