/** La inspección del mensaje elegido. Mientras carga la nueva, se sigue mostrando la anterior (nada parpadea). */
import { useEffect, useState } from 'react';
import { dataClient } from '../data/client';
import type { Inspection } from '../data/types';

export function useInspection(messageId: string | null): { inspection: Inspection | null; loading: boolean } {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!messageId) return;
    let active = true;
    setLoading(true);
    dataClient.inspection(messageId).then((result) => {
      if (!active) return;
      setInspection(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [messageId]);

  return { inspection, loading };
}
