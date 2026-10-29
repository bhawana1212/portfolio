import { Fragment, type ReactNode } from 'react';
import { Button, Toolbar, Tooltip } from '@fluentui/react-components';
import { ArrowUpRightRegular, BriefcaseRegular, CodeRegular, BookOpenRegular, DocumentRegular, HatGraduationRegular, MailRegular, PrintRegular, WindowConsoleRegular } from '@fluentui/react-icons';
import { portfolio, type Detail } from '../data/portfolio';

const sections = [
  { id: 'experience', title: 'Experience', icon: BriefcaseRegular },
  { id: 'work', title: 'Projects', icon: CodeRegular },
  { id: 'publications', title: 'Publications', icon: BookOpenRegular },
  { id: 'education', title: 'Education', icon: HatGraduationRegular },
  { id: 'skills', title: 'Skills', icon: WindowConsoleRegular },
  { id: 'contact', title: 'Contact', icon: MailRegular },
];

export function Details({ items, className = '' }: { items: Detail[]; className?: string }) {
  return <dl className={`detail-list ${className}`}>{items.map(item => <Fragment key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></Fragment>)}</dl>;
}

function Section({ id, title, index, children }: { id: string; title: string; index: number; children: ReactNode }) {
  const Icon = sections[index - 1].icon;
  return <section id={id} className="section" aria-labelledby={`${id}-heading`}>
    <div className="section-inner"><header className="section-title"><span aria-hidden="true">{String(index).padStart(2, '0')}</span><Icon aria-hidden="true" /><h2 id={`${id}-heading`}>{title}</h2></header><div className="section-body">{children}</div></div>
  </section>;
}

export function Contacts({ full = false }: { full?: boolean }) {
  return <div className="contacts">
    <a href={portfolio.email}><MailRegular aria-hidden="true" /><span>{full ? portfolio.email.slice(7) : 'Email'}{!full && <span className="print-only">: {portfolio.email.slice(7)}</span>}</span></a>
    <a href={portfolio.linkedin}><ArrowUpRightRegular aria-hidden="true" /><span>LinkedIn<span className="print-only">: {portfolio.linkedin}</span></span></a>
  </div>;
}

export function PortfolioContent({ enhancement }: { enhancement?: ReactNode }) {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="masthead" id="masthead"><a className="wordmark" href="#main"><span aria-hidden="true">BS</span>{portfolio.name}</a>
      <nav aria-label="Portfolio sections"><a href="#desk">About</a>{sections.map(({ id, title, icon: Icon }) => <a key={id} href={`#${id}`}><Icon aria-hidden="true" /><span>{title}</span></a>)}</nav>
      <Tooltip content="Print resume" relationship="label"><Button className="js-action icon-action" appearance="subtle" icon={<PrintRegular />} aria-label="Print resume" onClick={() => window.print()} /></Tooltip>
    </header>
    <main id="main" tabIndex={-1}>
      <div className="hero" id="desk">
        {enhancement}
        <div className="hero-copy"><span className="hero-eyebrow">About</span><h1>{portfolio.name}</h1><p className="role">{portfolio.role}</p><p className="introduction">{portfolio.introduction}</p>
          <p className="core-tools">{portfolio.coreTools}</p>
          <Toolbar className="hero-actions" aria-label="Contact and resume" size="large"><a className="resume-link" href={`${import.meta.env.BASE_URL}resume.pdf`}><DocumentRegular aria-hidden="true" />Resume<ArrowUpRightRegular aria-hidden="true" /></a><Contacts /></Toolbar>
        </div>
        <a className="next-section" href="#experience"><BriefcaseRegular aria-hidden="true" />Experience<span aria-hidden="true">01</span></a>
      </div>
      <Section id="experience" title="Experience" index={1}>{portfolio.roles.map(entry => <article className="role-entry" id={entry.id} key={entry.id} data-station={entry.id}><p className="meta">{entry.date}</p><h3>{entry.title}</h3><p className="subtitle">{entry.role}</p><ul>{entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</Section>
      <Section id="work" title="Selected projects" index={2}>
        <nav className="project-index" aria-label="Selected projects">{portfolio.projects.map((project, index) => <a key={project.id} href={`#${project.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{project.title}<ArrowUpRightRegular aria-hidden="true" /></a>)}</nav>
        {portfolio.projects.map(project => <article className="project" id={project.id} key={project.id} data-station={project.id}><p className="status">{project.status}</p><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><Details items={project.details} /></article>)}
        {portfolio.supplements.map(supplement => <div className="supplement" key={supplement.title}><h3>{supplement.title}</h3><Details items={supplement.details} /></div>)}
      </Section>
      <div className="reading-band" id="reading-band">
        <Section id="publications" title="Publications" index={3}>{portfolio.publications.map(publication => <article className="publication" key={publication.url}><p className="meta">{publication.venue}</p><h3>{publication.title}</h3><a href={publication.url}>{publication.url}</a></article>)}</Section>
        <Section id="education" title="Education" index={4}>{portfolio.education.map(entry => <article className="education-entry" key={entry.title}><p className="meta">{entry.date}</p><h3>{entry.title}</h3><p className="subtitle">{entry.institution}</p><p>{entry.grade}</p></article>)}</Section>
        <Section id="skills" title="Skills" index={5}><Details items={portfolio.skills} className="skills" /><p className="focus">{portfolio.focus}</p></Section>
      </div>
      <Section id="contact" title="Contact" index={6}><Contacts full /></Section>
    </main>
    <footer className="footer"><span>{portfolio.name}</span><span>{portfolio.interests}</span><a className="attribution" href={`${import.meta.env.BASE_URL}licenses/THIRD-PARTY.txt`}>Third-party notices</a></footer>
  </>;
}