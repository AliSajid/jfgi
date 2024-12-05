// SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami
//
// SPDX-License-Identifier: CC0-1.0

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/aspect-ratio'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/container-queries'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('daisyui')
  ],

  daisyui: {
    themes: ['cupcake', 'retro'],
    darkTheme: 'retro',
    logs: false
  }
};
