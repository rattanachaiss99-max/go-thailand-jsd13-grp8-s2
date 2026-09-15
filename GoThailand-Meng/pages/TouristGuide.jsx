/* ============================================================
   pages/TouristGuide.jsx
   Production-ready tourist guide selection page.

   This file keeps the page available under the existing route
   /tourist-guide while using the mockup-based GuideSelectionFlow
   for the guide-select interaction.
   ============================================================ */

import GuideSelectionFlow from "../components/GuideSelectionFlow";

export default function TouristGuide() {
  return <GuideSelectionFlow />;
}
