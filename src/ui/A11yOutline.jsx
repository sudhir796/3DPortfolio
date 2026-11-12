import React from 'react';
import { profile, quests, abilities, journey, contact, isTODO } from '../data/content';

/**
 * A11yOutline: Visually hidden semantic HTML document containing the full portfolio.
 * Ensures 100% accessibility for screen readers and SEO web crawlers.
 */
export default function A11yOutline() {
  return (
    <main id="main-content" className="sr-only">
      <header>
        <h1>{profile.name} - Adventurers' Guild Portfolio</h1>
        <p>{profile.guildTitle}</p>
        <p>{profile.tagline}</p>
        <p>Education: {profile.education}</p>
        <p>Classes: {profile.classes.join(', ')}</p>
        {!isTODO(profile.rank) && <p>Rank: {profile.rank}</p>}
      </header>

      {/* Quests Section */}
      <section aria-labelledby="a11y-quests-heading">
        <h2 id="a11y-quests-heading">Quests & Projects</h2>
        <ul>
          {quests.map((q) => (
            <li key={q.id}>
              <h3>
                {q.title} (Rank {q.rank}) - {q.status}
              </h3>
              <p>Track: {q.track.join(', ')}</p>
              <p>{q.summary}</p>
              <p>Technologies: {q.tech.join(', ')}</p>
              {q.highlights && q.highlights.length > 0 && (
                <ul>
                  {q.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {!isTODO(q.links.github) && (
                <p>
                  <a href={q.links.github}>GitHub Repository for {q.title}</a>
                </p>
              )}
              {!isTODO(q.links.demo) && (
                <p>
                  <a href={q.links.demo}>Live Demo for {q.title}</a>
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Abilities Section */}
      <section aria-labelledby="a11y-abilities-heading">
        <h2 id="a11y-abilities-heading">Abilities & Skills</h2>
        {abilities.groups.map((group) => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <h3>Guild Medals & Honors</h3>
        <ul>
          {abilities.medals.map((m, i) => (
            <li key={i}>
              {m.title} ({m.year})
            </li>
          ))}
        </ul>

        <h3>Certifications</h3>
        <ul>
          {abilities.certifications.map((c, i) => (
            <li key={i}>
              {c.name} - {c.issuer} ({c.year})
            </li>
          ))}
        </ul>
      </section>

      {/* Journey Section */}
      <section aria-labelledby="a11y-journey-heading">
        <h2 id="a11y-journey-heading">Journey & Experience Timeline</h2>
        <ul>
          {journey.map((item) => (
            <li key={item.id}>
              <h3>
                {item.date}: {item.title}
              </h3>
              {item.role && <p>Role: {item.role}</p>}
              {item.organization && <p>Organization: {item.organization}</p>}
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Section */}
      <section aria-labelledby="a11y-contact-heading">
        <h2 id="a11y-contact-heading">Contact & Guild Commissions</h2>
        <ul>
          {!isTODO(contact.github) && (
            <li>
              <a href={contact.github}>GitHub: {contact.github}</a>
            </li>
          )}
          {!isTODO(contact.linkedin) && (
            <li>
              <a href={contact.linkedin}>LinkedIn Profile</a>
            </li>
          )}
          {!isTODO(contact.email) && (
            <li>
              <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
            </li>
          )}
          {!isTODO(contact.resume) && (
            <li>
              <a href={contact.resume}>Resume Download</a>
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}

