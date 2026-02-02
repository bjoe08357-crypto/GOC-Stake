/** @type {import("prettier").Options} */

const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  endOfLine: "auto",
  plugins: ['prettier-plugin-tailwindcss'],
};

module.exports = config;
