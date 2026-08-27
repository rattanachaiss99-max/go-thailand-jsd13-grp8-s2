/* ============================================================
   src/App.jsx
   Central routing file of the GoThailand website.

   Every path is connected to one page component:
     /                  -> HomePage      (GoThailand home page)
     /tourist-guide     -> TouristGuide  (Select Your Tourist Guide)
     /about             -> About         (original placeholder page)
     /contact           -> Contact       (original placeholder page)
     /products          -> Products      (original placeholder page)
     /product/:productId-> ProductDetail (original placeholder page)

   All pages are wrapped inside <Layout>, which adds the shared
   Navbar at the top and the Footer at the bottom.
   ============================================================ */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import TouristGuide from "../pages/TouristGuide";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";

// Router configuration: maps URLs to page components
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // shared frame (Navbar + page + Footer)
    errorElement: (
      // shown when the user opens a URL that does not exist
      <div className="flex min-h-screen items-center justify-center bg-thai-cream">
        <h1 className="font-display text-4xl font-bold text-thai-navy">404 - Page not found.</h1>
      </div>
    ),
    children: [
      { path: "/", element: <HomePage /> },            // GoThailand home page
      { path: "tourist-guide", element: <TouristGuide /> }, // tourist guide selection
      { path: "about", element: <About /> },           // original pages are kept
      { path: "contact", element: <Contact /> },
      { path: "products", element: <Products /> },
      { path: "product/:productId", element: <ProductDetail /> },
    ],
  },
]);

export default function App() {
  // Hand the router configuration to react-router
  return <RouterProvider router={router} />;
}
