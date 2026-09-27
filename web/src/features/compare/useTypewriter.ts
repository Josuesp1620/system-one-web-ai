/** Muestra un texto palabra por palabra, como un modelo que escribe. `replay` reinicia la animación. */
import { useEffect, useState } from 'react';

const MILLISECONDS_PER_WORD = 110;

export function useTypewriter(text: string, replay: number): { visible: string; written: number; done: boolean } {
  const words = text.split(' ');
  const [written, setWritten] = useState(0);

  useEffect(() => {
    setWritten(0);
    const timer = setInterval(() => setWritten((count) => Math.min(words.length, count + 1)), MILLISECONDS_PER_WORD);
    return () => clearInterval(timer);
  }, [text, replay, words.length]);

  return { visible: words.slice(0, written).join(' '), written, done: written >= words.length };
}
