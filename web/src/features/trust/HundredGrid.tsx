/** De cada 100 mensajes: cuántos se hacen solos y bien, cuántos solos y mal, y cuántos pasan a una persona. */
export type HundredSplit = { right: number; wrong: number; person: number };

const COLORS = { right: '#9ae6b4', wrong: '#f47ab8', person: '#2a2f3a' };

export function HundredGrid({ split }: { split: HundredSplit }) {
  const cells = [
    ...Array(split.right).fill('right'),
    ...Array(split.wrong).fill('wrong'),
    ...Array(split.person).fill('person'),
  ] as (keyof typeof COLORS)[];
  return (
    <div className="grid w-full max-w-[340px] grid-cols-10 gap-1" role="img" aria-label={`${split.right} bien, ${split.wrong} mal, ${split.person} a una persona`}>
      {cells.map((kind, index) => (
        <span key={index} className="aspect-square rounded-[3px] transition-colors duration-300" style={{ background: COLORS[kind] }} />
      ))}
    </div>
  );
}
