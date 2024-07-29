/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function App() {
  const navigate = useNavigate();
  useScrollToTop();
  useEffect(() => {
    // Check if the token exists in your preferred way (e.g., from sessionStorage, localStorage, Redux store, etc.)
    const token = sessionStorage.getItem('token');

    // Define the destination route
    const defaultRoute = '/';

    // Conditionally redirect based on the presence of the token
    if (!token) {
      navigate(defaultRoute);
    }
  }, [navigate]);

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
}
