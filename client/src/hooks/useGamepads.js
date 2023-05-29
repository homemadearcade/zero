import { useEffect, useRef, useState } from 'react';

export default function useGamepads(callback) {
  const gamepads = useRef([]);
  const requestRef = useRef();
  const [buttonsPressed, setButtonsPressed] = useState([]);

  var haveEvents = 'ongamepadconnected' in window;

  useEffect(() => {
    const buttonCheckInterval = setInterval(() => {
      if(!gamepads.current[0]) return
      console.log('gamepads.current', gamepads.current)
      setButtonsPressed(gamepads.current[0].buttons.reduce((prev, button, index) => {
        console.log('button', button)
        return {
          ...prev,
          [button.value]: button.pressed
        }
      }), {});
    }, 100)

    return () => {
     clearInterval(buttonCheckInterval)
    }
  }, [gamepads]);

  const addGamepad = (gamepad) => {
    gamepads.current = {
      ...gamepads.current,
      [gamepad.index]: gamepad,
    };

    // Send data to external callback (like React state)
    // callback(gamepads.current);

    // Handle controller input before render
    // @TODO: Add API to hook callback into this
    // requestAnimationFrame(updateStatus);
  };

  /**
   * Adds game controllers during connection event listener
   * @param {object} e
   */
  const connectGamepadHandler = (e) => {
    addGamepad((e).gamepad);
  };

  /**
   * Finds all gamepads and adds them to context
   */
  const scanGamepads = () => {
    // Grab gamepads from browser API
    var detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads()
      : [];

    // Loop through all detected controllers and add if not already in state
    for (var i = 0; i < detectedGamepads.length; i++) {
      const newGamepads = detectedGamepads[i];
      if (newGamepads && newGamepads !== null) addGamepad(newGamepads);
    }
  };

  // Add event listener for gamepad connecting
  useEffect(() => {
    window.addEventListener('gamepadconnected', connectGamepadHandler);

    return window.removeEventListener(
      'gamepadconnected',
      connectGamepadHandler
    );
  });

  // Update each gamepad's status on each "tick"
  const animate = () => {
    if (!haveEvents) scanGamepads();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });

  return {
    buttonsPressed
  }
}