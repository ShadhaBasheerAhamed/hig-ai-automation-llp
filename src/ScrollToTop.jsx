import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Get the current pathname from the URL
  const { pathname } = useLocation();

  // This effect runs every time the pathname changes
  useEffect(() => {
    // Scroll the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array ensures this runs only on navigation

  return null; // This component doesn't render anything visible
};

export default ScrollToTop;