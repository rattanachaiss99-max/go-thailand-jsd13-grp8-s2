import { useEffect, useCallback } from 'react';

/***************************  HOOKS - ARIA HIDDEN  ***************************/

export default function useAriaHidden() {
  const updateAriaHidden = useCallback(() => {
    const slides = document.querySelectorAll('.slick-slide');

    slides.forEach((slide) => {
      const isAriaHidden = slide.getAttribute('aria-hidden') === 'true';
      const anchorTags = slide.querySelectorAll('a');

      anchorTags.forEach((anchor) => {
        if (isAriaHidden) {
          anchor.setAttribute('inert', 'true');
        } else {
          anchor.removeAttribute('inert');
        }
      });
    });
  }, []);

  useEffect(() => {
    updateAriaHidden(); // Initial update

    // Optionally, set up a MutationObserver if slides are added dynamically
    const observer = new MutationObserver(updateAriaHidden);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [updateAriaHidden]);

  return updateAriaHidden; // Return the function to call on slide change
}
