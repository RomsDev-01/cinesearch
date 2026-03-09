import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg: #0a0a0f;
    --bg-card: #111118;
    --bg-elevated: #16161f;
    --border: rgba(255,255,255,0.07);
    --accent: #e8c547;
    --accent-dim: rgba(232,197,71,0.15);
    --accent-glow: rgba(232,197,71,0.35);
    --text-primary: #f0eee8;
    --text-secondary: #8a8890;
    --text-muted: #4a4858;
    --red: #e85444;
    --green: #44c87a;
    --radius: 4px;
    --radius-lg: 8px;
    --font-display: 'Bebas Neue', sans-serif;
    --font-serif: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-weight: 300;
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: var(--font-body);
  }

  input {
    font-family: var(--font-body);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    border-radius: 3px;
  }

  ::selection {
    background: var(--accent-dim);
    color: var(--accent);
  }
`;
