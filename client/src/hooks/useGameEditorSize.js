import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
let interval 

export default function useGameEditorSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    gameEditorWidth: undefined,
    gameEditorHeight: undefined,
  });

  const isLobbyDashboardOpen = useSelector((state) => state.lobby.isLobbyDashboardOpen)

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      const elem = document.getElementById('GameEditor')
      if(!elem) {
        interval = setTimeout(() => {
          handleResize()
        }, 100)
        return 
      }
      const size = elem.getBoundingClientRect()
      console.log('setting', size.width, size.height)
      setWindowSize({
        gameEditorWidth: size.width,
        gameEditorHeight: size.height,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      clearTimeout(interval)
      window.removeEventListener("resize", handleResize);
    }
  }, [isLobbyDashboardOpen, setWindowSize]); // Empty array ensures that effect is only run on mount

  return windowSize;
}