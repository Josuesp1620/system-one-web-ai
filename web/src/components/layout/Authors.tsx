/** Autoría, como en planos-web-ai: Ver código | Josuesp1620 (portafolio, GitHub, LinkedIn) | API SERVICE SAC. */
import { BrandIcon } from './BrandIcon';

const LINKS = {
  repository: 'https://github.com/Josuesp1620/system-one-web-ai',
  portfolio: 'https://joucode.apiservicesac.com',
  github: 'https://github.com/Josuesp1620',
  linkedin: 'https://www.linkedin.com/in/joucode',
  company: 'https://apiservicesac.com',
};

export function Authors() {
  return (
    <div className="flex shrink-0 items-center gap-3 py-2">
      <a href={LINKS.repository} target="_blank" rel="noreferrer" title="Ver el código en GitHub"
        className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:border-white/40 hover:bg-white/15 md:flex">
        <BrandIcon name="github" size={14} /> <span className="hidden xl:inline">Ver código</span>
      </a>
      <span className="hidden h-6 w-px bg-line md:block" aria-hidden />
      <a href={LINKS.portfolio} target="_blank" rel="noreferrer" className="group flex items-center gap-2" title="Portafolio de Josue Salazar">
        <img src="/brand/josuesp1620.jpg" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-full ring-1 ring-white/15" />
        <span className="hidden text-sm font-semibold group-hover:underline 2xl:inline">Josuesp1620</span>
      </a>
      <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub de Josue Salazar" className="rounded p-1 text-muted transition hover:text-ink"><BrandIcon name="github" /></a>
      <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn de Josue Salazar" className="rounded p-1 text-muted transition hover:text-ink"><BrandIcon name="linkedin" /></a>
      <span className="h-6 w-px bg-line" aria-hidden />
      <a href={LINKS.company} target="_blank" rel="noreferrer" className="group flex items-center gap-2" title="API SERVICE SAC">
        <img src="/brand/api-service-sac.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
        <span className="hidden text-sm font-bold text-[#4b8dff] group-hover:underline 2xl:inline">API SERVICE SAC</span>
      </a>
    </div>
  );
}
