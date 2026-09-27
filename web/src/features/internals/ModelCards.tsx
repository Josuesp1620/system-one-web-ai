/** Jev, Kev y Laya: quién los hace, cómo leen y datos clave, con la fuente de cada uno. */
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';

const MODELS = [
  { name: 'Jev', author: 'TypeSafe AI', kind: 'Cerrado · se usa por API', reads: 'No se sabe: su arquitectura no es pública.',
    facts: ['70 a 500 ms por solicitud, según TypeSafe', 'US$ 0,042 por millón de tokens de entrada; la salida no se cobra', 'Los mensajes pasan por sus servidores'],
    link: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev', source: 'typesafe.ai' },
  { name: 'Kev', author: 'Jared Palmer', kind: 'Abierto · Apache 2.0', reads: 'Como un LLM, de izquierda a derecha (usa Qwen). No escribe: compara el vector de un token final «decidir» con el de cada opción.',
    facts: ['De 0.8B a 27B parámetros', 'Misma API que Jev', 'En CPU funciona, pero es lento'],
    link: 'https://github.com/jaredpalmer/kev', source: 'github.com/jaredpalmer/kev' },
  { name: 'Laya', author: 'Nandakishor M · Convai Innovations', kind: 'Abierto · Apache 2.0', reads: 'En ambos sentidos a la vez (un encoder, como BERT): cada alternativa ve todo el mensaje y el mensaje ve las alternativas.',
    facts: ['322 M parámetros en su versión multilingüe (100+ idiomas)', 'Corre bien en CPU', 'Es el que se abre por dentro en esta web'],
    link: 'https://github.com/NandhaKishorM/laya', source: 'github.com/NandhaKishorM/laya' },
];

export function ModelCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {MODELS.map((model) => (
        <Card key={model.name} className={model.name === 'Laya' ? '!border-accent/40' : ''}>
          <p className="font-display text-3xl font-extrabold">{model.name}</p>
          <p className="text-sm">{model.author}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{model.kind}</p>
          <Eyebrow className="mt-4">CÓMO LEE</Eyebrow>
          <p className="mt-1 text-sm leading-relaxed text-ink/85">{model.reads}</p>
          <ul className="mt-3 space-y-1 text-[13px] text-ink/70">{model.facts.map((fact) => <li key={fact}>· {fact}</li>)}</ul>
          <a href={model.link} target="_blank" rel="noreferrer" className="mt-3 inline-block font-mono text-xs text-message hover:underline">{model.source} ↗</a>
        </Card>
      ))}
    </div>
  );
}
