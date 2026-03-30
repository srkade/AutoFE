import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const matchMediaStyle = window.matchMedia(query);
    
    // Triggered at the first client-side load and if query changes
    const handleChange = () => {
      setMatches(getMatches(query));
    };

    // Listen matchMedia
    if (matchMediaStyle.addEventListener) {
      matchMediaStyle.addEventListener("change", handleChange);
    } else {
      matchMediaStyle.addListener(handleChange); // Fallback for older browsers
    }

    return () => {
      if (matchMediaStyle.removeEventListener) {
        matchMediaStyle.removeEventListener("change", handleChange);
      } else {
        matchMediaStyle.removeListener(handleChange); // Fallback for older browsers
      }
    };
  }, [query]);

  return matches;
}
