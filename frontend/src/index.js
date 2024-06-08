import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalContextProvider } from './GlobalContext';
import { ThemeProvider, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    white: {
      main: '#fafafa',
      light: '#f5f5f5',
      dark: '#eeeeee',
      contrastText: '#424242',
    },
  },
});

root.render(
  <React.StrictMode>
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </GlobalContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
