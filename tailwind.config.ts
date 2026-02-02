import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.blur-4px': {
          backdropFilter: 'blur(4px)',
        },
        '.blur-8px': {
          backdropFilter: 'blur(8px)',
        },
        '.blur-30px': {
          backdropFilter: 'blur(30px)',
        },
        '.blur-60px': {
          backdropFilter: 'blur(60px)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
export default config;
