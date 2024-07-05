import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const AnimatedButton = ({ onClick, title, className }) => {
  const [isPressed, setPressed] = useState(false);

  const springProps = useSpring({
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={springProps}
      className={`font-bold ${className}`}
    >
      {title}
    </animated.button>
  );
};

export default AnimatedButton;