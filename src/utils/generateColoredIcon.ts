/*
 * Utility for generating colored app icons from the base SVG
 */

import svgContent from "../assets/quick-img-tweakr.svg?raw";

const AVAILABLE_COLORS = [
  "#2563EB", // azul
  "#0891B2", // ciano
  "#0D9488", // teal
  "#7C3AED", // violeta
  "#9333EA", // roxo
  "#DB2777", // magenta
  "#DC2626", // vermelho
  "#16A34A", // verde
  "#65A30D", // verde oliva
  "#059669", // verde folha
  "#047857", // verde agua
  "#EAB308", // amarelo (original)
  "#EA580C", // laranja
  "#92400E", // marrom
  "#4B5563", // cinza
  "#1F2937", // cinza escuro (instead of preto)
  "#0891B2", // turquesa
];

const YELLOW_COLORS_TO_REPLACE = [
  "#F0D666",
  "#FABF50",
  "#CEBE66",
  "#EFD465",
  "#F0D568",
  "#BBAA64",
  "#B9AD6D",
  "#B2A463",
  "#A19462",
  "#B0A163",
  "#A59F77",
  "#BCBE7F",
  "#A4AA75",
  "#9D944D",
];

/**
 * Generate a consistent colored icon for a given window ID
 * This ensures the same window always gets the same color
 */
export function generateConsistentColoredIcon(windowId: string): string {
  // Create a simple hash from the window ID to ensure consistency
  let hash = 0;
  for (let i = 0; i < windowId.length; i++) {
    const char = windowId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash to pick a consistent color
  const colorIndex = Math.abs(hash) % AVAILABLE_COLORS.length;
  const color = AVAILABLE_COLORS[colorIndex]!;

  // Start with the original SVG content
  let modifiedSvg = svgContent;

  // Replace all yellow colors with the selected color
  YELLOW_COLORS_TO_REPLACE.forEach((yellowColor) => {
    // Replace both uppercase and lowercase versions
    const upperColor = yellowColor.toUpperCase();
    const lowerColor = yellowColor.toLowerCase();

    modifiedSvg = modifiedSvg.replace(new RegExp(upperColor, "g"), color);
    modifiedSvg = modifiedSvg.replace(new RegExp(lowerColor, "g"), color);
  });

  return `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
}
