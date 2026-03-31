import { useState, useEffect } from 'react';

export const useCSSColor = (variableName: string, fallback: string = '#ffffff') => {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const resolveColor = () => {
      let cleanName = variableName;
      if (variableName.startsWith('var(')) {
        cleanName = variableName.slice(4, -1).trim();
      }
      const val = getComputedStyle(document.documentElement).getPropertyValue(cleanName).trim();
      if (val) {
        setColor(val);
      }
    };

    resolveColor();
    
    const observer = new MutationObserver(resolveColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, [variableName]);

  return color;
};
