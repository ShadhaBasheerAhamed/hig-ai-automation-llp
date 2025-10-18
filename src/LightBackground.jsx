import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const LightBackground = () => {
  const styles = useSpring({
    from: { background: 'linear-gradient(135deg, #f5d0fe, #fbcfe8, #a5b4fc)' },
    to: async (next) => {
      while (1) {
        await next({ background: 'linear-gradient(135deg, #a5b4fc, #fbcfe8, #f5d0fe)' });
        await next({ background: 'linear-gradient(135deg, #fbcfe8, #f5d0fe, #a5b4fc)' });
      }
    },
    config: { duration: 10000 },
  });
  return <animated.div style={styles} className="fixed top-0 left-0 w-full h-full z-0 opacity-50" />;
};

export default LightBackground;
