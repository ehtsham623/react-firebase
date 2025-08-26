/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        mainColor: "#88B04B", // Light Royal Green
        mainLightColor: "#A9C97E", // Soft Green
        mainDarkColor: "#6C8C37", // Deep Forest Green

        // Text Colors
        textPrimaryColor: "#2E2F27", // Deep Charcoal Olive
        textPrimaryLightColor: "#F4F7E7", // Soft Ivory Green
        textPrimaryDarkColor: "#1C1D17", // Ebony
        textMainColor: "#88B04B", // Light Royal Green
        hintTextColor: "#C7D4A0", // Muted Sage Green

        // Background Colors
        bgColor: "#F9FBEF", // Very Light Green Mist
        bgLightColor: "#FFFFFF", // White
        mainLightBgColor: "#E9F2D7", // Pale Green
        mainDarkBgColor: "#6C8C37", // Deep Forest Green

        // Other Colors
        dividerColor: "#D8E2C3", // Pale Green Divider
        shadowColor: "#C0D0B0", // Subtle Green Shadow
        borderColor: "#B4C49A", // Neutral Green Border
        focusBorderColor: "#88B04B", // Light Royal Green Focus
        ratingColor: "#FFD700", // Gold (for accents)

        // Secondary Colors
        successColor: "#62A850", // Vibrant Green
        errorColor: "#D72638", // Crimson Red
        warningColor: "#FFC107", // Amber Yellow
      },
    },
  },
  plugins: [],
};
