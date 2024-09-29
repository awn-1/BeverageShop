import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --accent-color: #e74c3c;
    --background-color: #f4f4f4;
    --text-color: #333;
    --header-text-color: #ffffff;
    --border-radius: 8px;
    --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
    color: var(--secondary-color);
  }

  button {
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      opacity: 0.8;
    }
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default GlobalStyle;