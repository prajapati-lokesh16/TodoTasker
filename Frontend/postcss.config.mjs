// postcss.config.js
module.exports = {
  plugins: {
    // 1. Tailwind CSS must be run first
    'tailwindcss': {},
    // 2. Autoprefixer should run after Tailwind
    'autoprefixer': {},
  },
};
