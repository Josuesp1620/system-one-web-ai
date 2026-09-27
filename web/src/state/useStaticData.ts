/** Carga una vez los datos que no cambian: ficha del modelo, mensajes y caso de estudio. */
import { useEffect, useState } from 'react';
import { dataClient } from '../data/client';
import type { StaticData } from './AppState';

export function useStaticData(): { data: StaticData | null; error: string | null } {
  const [data, setData] = useState<StaticData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([dataClient.modelCard(), dataClient.showcase(), dataClient.study()])
      .then(([modelCard, showcase, study]) => setData({ modelCard, showcase, study }))
      .catch((failure: unknown) => setError(String(failure)));
  }, []);
  return { data, error };
}
