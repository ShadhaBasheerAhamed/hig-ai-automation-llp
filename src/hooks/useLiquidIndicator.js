// src/hooks/useLiquidIndicator.js
import React from 'react';
import { useSpring } from 'framer-motion';

// This custom hook calculates the SVG path for the liquid indicator
export function useLiquidIndicator(activeIndex, navLinks) {
  // --- Configuration ---
  const ITEM_HEIGHT = 72;      // Same as in your sidebar component
  const SIDEBAR_WIDTH = 96;    // w-24 in Tailwind
  const CIRCLE_RADIUS = 30;    // The radius of the main circle
  const PADDING = (ITEM_HEIGHT - CIRCLE_RADIUS * 2) / 2; // Vertical padding for the circle

  // This function generates the SVG path string for a given index
  const generatePath = (index) => {
    const top = index * ITEM_HEIGHT;

    // The SVG path is a series of commands: M (move to), V (vertical line),
    // A (arc), H (horizontal line). This creates the "cutout" shape.
    return `
      M ${SIDEBAR_WIDTH}, ${top - 20}
      V ${top + PADDING - 10}
      a 10 10 0 0 0 -10 10
      h -3
      a ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 0 0 ${CIRCLE_RADIUS * 2}
      h 3
      a 10 10 0 0 0 10 10
      V ${top + ITEM_HEIGHT + 20}
    `;
  };

  // useSpring is the key! It smoothly animates the `d` attribute of the SVG path.
  // When activeIndex changes, it will "morph" the path from the old shape to the new one.
  const spring = useSpring(generatePath(activeIndex), {
    stiffness: 400,
    damping: 35,
  });

  // Update the spring value whenever the active index changes
  React.useEffect(() => {
    spring.set(generatePath(activeIndex));
  }, [activeIndex, navLinks, spring]);

  return spring;
}