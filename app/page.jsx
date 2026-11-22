/* eslint-disable @next/next/no-img-element */
import NovaRuntime from '../components/NovaRuntime';
import { CH, SERVICES, TEAM, STORIES, PLACES, REASONS } from '../lib/content';

function OptInner({ label }) {
  return (
    <>
      <span className="opt-ring" aria-hidden="true"><span className="opt-dot" data-dot=""></span></span>
      <span>{label}</span>
    </>
  );
}

export default function Home() {
  return (
    <>
      <div className="loader" data-loader="" aria-hidden="true"></div>
      <div className="loader-logo" data-loader-logo="" aria-hidden="true">
        <img className="loader-ghost" data-loader-ghost="" src="/assets/nova-logo.png" alt="" />
        <img className="loader-fill" data-loader-fill="" src="/assets/nova-logo.png" alt="" />
        <img className="loader-word" data-loader-word="" src="/assets/nova-logo.png" alt="" />
      </div>

      <a className="skip" href="#hoofd" data-nav-link="">Naar de inhoud</a>

      <header id="top" className="site-header">
        <nav className="nav" data-nav="" aria-label="Hoofdnavigatie">
          <div className="nav-bar">
            <a className="nav-logo-link" href="#top" data-nav-link="" aria-label="NOVA, naar de homepage">
              <img className="nav-logo" data-nav-logo="" src="/assets/nova-logo.png" alt="NOVA" />
            </a>
            <div className="nav-links">
              <a data-nav-fade="" data-nav-link="" href="#zorg">Onze zorg</a>
              <a data-nav-fade="" data-nav-link="" href="#werkwijze">Werkwijze</a>
              <a data-nav-fade="" data-nav-link="" href="#specialisten">Specialisten</a>
              <a data-nav-fade="" data-nav-link="" href="#locaties">Locaties</a>
              <a data-nav-fade="" data-nav-link="" href="#werkwijze">Over NOVA</a>
            </div>
            <div className="nav-cta">
              <button className="btn btn--light" data-nav-fade="" data-book="" type="button">Plan een afspraak</button>
            </div>
            <button className="menu-btn" data-nav-fade="" data-menu-toggle="" type="button" aria-expanded="false" aria-controls="mobiel-menu">
              <span data-menu-label="">Menu</span>
              <span className="bars" aria-hidden="true"><span></span><span></span></span>
            </button>
          </div>
          <div id="mobiel-menu" className="mobile-menu" data-mobile-menu="" hidden>
            <div className="mobile-menu-inner">
              <a data-menu-item="" data-nav-link="" href="#zorg">Onze zorg</a>
              <a data-menu-item="" data-nav-link="" href="#werkwijze">Werkwijze</a>
              <a data-menu-item="" data-nav-link="" href="#specialisten">Specialisten</a>
              <a data-menu-item="" data-nav-link="" href="#locaties">Locaties</a>
              <button className="btn btn--light" data-menu-item="" data-book="" type="button">Plan een afspraak</button>
            </div>
          </div>
        </nav>
      </header>

      <main id="hoofd" tabIndex={-1}>
        {/* 01 Hero */}
        <section className="hero" data-hero="" aria-labelledby="hero-titel">
          <div className="hero-copy">
            <p className="eyebrow" data-hero-in="">Made to Move</p>
            <h1 id="hero-titel">
              <span className="line-mask"><span className="line" data-hero-line="">Beweeg weer</span></span>
              <span className="line-mask"><span className="line" data-hero-line="">zoals jij wilt.</span></span>
            </h1>
            <p className="hero-intro" data-hero-in="">Fysiotherapie en revalidatie voor wat jij weer wilt kunnen. Van dat rondje buiten tot je eerste training weer.</p>
            <div className="hero-actions" data-hero-in="">
              <button className="btn btn--dark" type="button" data-book="">Plan een afspraak</button>
              <a className="link-line" href="#zorg" data-nav-link="">Ontdek onze zorg →</a>
            </div>
          </div>
          <figure className="hero-figure" data-hero-figure="">
            <div className="hero-photo" data-hero-photo="">
              <div className="hero-shift" data-hero-shift="">
                <img data-hero-img="" src="/assets/hero.webp" alt="Twee vrouwen wandelen samen over een pad langs het water" fetchPriority="high" />
              </div>
              <div className="lens" data-lens="" aria-hidden="true">
                <div className="lens-inner" data-lens-inner="">
                  <div className="lens-glass arc"></div>
                  <div className="lens-sheen arc"></div>
                  <div className="lens-prism arc"></div>
                </div>
              </div>
            </div>
          </figure>
        </section>

        {/* 02 Keuzehulp */}
        <section id="keuzehulp" className="finder-wrap" aria-labelledby="keuze-titel">
          <div className="finder" data-finder="">
            <div className="finder-head">
              <h2 id="keuze-titel">Waar kunnen we je mee helpen?</h2>
              <p>Vertel ons wat je zoekt. Wij helpen je de juiste richting te vinden.</p>
            </div>
            <div className="finder-options" role="radiogroup" aria-labelledby="keuze-titel" data-radiogroup="" data-finder-options="">
              {CH.map((c, i) => (
                <button key={c.q} type="button" role="radio" className="opt" data-opt={i} aria-checked="false" tabIndex={i === 0 ? 0 : -1}>
                  <OptInner label={c.q} />
                </button>
              ))}
            </div>
            <div aria-live="polite">
              <div className="rec" data-rec="" hidden>
                <div className="rec-inner">
                  <h3 data-rec-title=""></h3>
                  <p className="rec-text" data-rec-text=""></p>
                  <div className="rec-actions">
                    <button className="btn btn--dark" type="button" data-rec-book="">Plan een afspraak</button>
                    <a className="rec-more" href="#zorg" data-rec-more=""></a>
                  </div>
                  <p className="rec-note">Deze keuzehulp wijst je de weg. Het is geen medische diagnose.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 Zorgaanbod */}
        <section id="zorg" className="care" tabIndex={-1} aria-labelledby="zorg-titel">
          <div className="container">
            <div className="section-head" data-reveal="">
              <h2 id="zorg-titel" className="h-section">De juiste zorg voor jouw beweging.</h2>
              <p className="lead">Kies de begeleiding die past bij wat jij weer wilt kunnen.</p>
            </div>
            <div className="care-grid" data-stagger="" data-services="">
              {SERVICES.map((s, i) => (
                <article key={s.title} className="card service" data-zoom-host="">
                  <div className="service-media"><img data-zoom="" src={s.img} alt="" loading="lazy" /></div>
                  <div className="service-body">
                    <h3>{s.title}</h3>
                    <p className="card-text">{s.desc}</p>
                    <button className="service-toggle" type="button" aria-expanded="false" aria-controls={`zorg-meer-${i}`}>
                      <span data-toggle-label="">Meer informatie</span>
                      <span className="arrow" aria-hidden="true">→</span>
                    </button>
                    <div className="service-more" id={`zorg-meer-${i}`} data-card-more="" hidden>
                      <div className="service-more-inner">
                        <p>{s.explain}</p>
                        <button className="btn btn--dark" type="button" data-book={s.title}>Plan een afspraak</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Verhaal */}
        <section id="werkwijze" className="story" tabIndex={-1} aria-labelledby="verhaal-titel">
          <div className="split-head" data-reveal="">
            <h2 id="verhaal-titel" className="h-section">Herstel gaat over<br />meer dan behandelen.</h2>
            <div className="story-aside">
              <p className="body-muted">Weer zelf op pad, of een middag in de tuin werken. Bij NOVA begint herstel bij wat voor jou belangrijk is.</p>
              <div className="segmented" role="group" aria-label="Bekijk een hersteldoel" data-stories="">
                {STORIES.map((s, i) => (
                  <button key={s.label} type="button" aria-pressed={i === 0 ? 'true' : 'false'}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="spread" data-spread="">
            <svg className="route" aria-hidden="true" width="150" height="270">
              <path data-route="" d="M0 268 C62 268 92 248 98 200 C104 150 92 100 96 64 C100 22 118 1 150 1"></path>
            </svg>
            <figure className="spread-main">
              <div className="story-frame" data-story-frame="">
                <img data-parallax="" data-story-img="" src={STORIES[0].img} alt={STORIES[0].alt} loading="lazy" />
              </div>
              <figcaption>Wat jij weer wilt kunnen.</figcaption>
            </figure>
            <figure className="spread-side">
              <div className="zoom-frame" data-zoom-host="">
                <img data-zoom="" src="/assets/rehab.webp" alt="Een behandelaar begeleidt een opstapoefening" loading="lazy" />
              </div>
              <figcaption>Met iemand die naast je staat.</figcaption>
            </figure>
          </div>
        </section>

        {/* 05 Specialisten */}
        <section id="specialisten" className="team" tabIndex={-1} aria-labelledby="team-titel">
          <div className="container">
            <div className="section-head" data-reveal="">
              <h2 id="team-titel" className="h-section">De mensen achter jouw herstel.</h2>
              <p className="lead">Maak kennis met de specialisten die met je meedenken.</p>
            </div>
            <div className="team-grid" data-stagger="" data-team="">
              {TEAM.map((p) => (
                <article key={p.name} className="card" data-zoom-host="">
                  <div className="person-media">
                    <img data-zoom="" src={p.img} alt={`Portret van ${p.name}, ${p.role.toLowerCase()}`} loading="lazy" />
                  </div>
                  <div className="person-body">
                    <h3>{p.name}</h3>
                    <p className="card-text">{p.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 06 Locaties */}
        <section id="locaties" className="places" tabIndex={-1} aria-labelledby="loc-titel">
          <div className="container">
            <div className="split-head" data-reveal="">
              <h2 id="loc-titel" className="h-section">Zorg dichtbij.<br />Ook dat helpt je vooruit.</h2>
              <p className="body-muted">Je vindt NOVA in Arnhem, Zutphen en Apeldoorn. Kies de locatie die past bij jouw dagelijks leven.</p>
            </div>
            <div className="place-grid" data-stagger="" data-places="">
              {PLACES.map((city) => (
                <button key={city} type="button" className="place-card" data-book-city={city} aria-label={`Plan een afspraak in ${city}`}>
                  <span className="place-city">{city}</span>
                  <span className="place-text">Ontdek NOVA in {city} en bekijk de mogelijkheden.</span>
                  <span className="place-cta">Plan hier je afspraak →</span>
                </button>
              ))}
            </div>
            <p className="places-note">Je kiest je locatie tijdens het maken van een afspraak.</p>
          </div>
        </section>

        {/* 07 Volgende stap */}
        <section id="contact" className="closing" data-closing="" aria-labelledby="slot-titel">
          <div className="closing-arc arc" data-closing-arc="" aria-hidden="true"></div>
          <div className="container">
            <div className="signature arc" data-signature="" aria-hidden="true"></div>
            <h2 id="slot-titel" data-reveal="">Jouw volgende stap<br />begint hier.</h2>
            <p data-reveal="">Vertel ons wat je weer wilt kunnen. We denken met je mee.</p>
            <div className="closing-actions" data-reveal="">
              <button className="btn btn--light" type="button" data-book="">Plan een afspraak</button>
              <button className="link-line link-line--light" type="button" data-book="Kennismaking">Bespreek je vraag met ons →</button>
            </div>
          </div>
        </section>
      </main>

      {/* 08 Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-rule"></div>
          <div className="footer-cols">
            <div className="footer-col footer-brand">
              <img src="/assets/nova-logo.png" alt="NOVA" />
              <p className="name">Centrum voor Herstel</p>
              <p className="tag">Made to Move</p>
            </div>
            <div className="footer-col footer-nav">
              <p className="title">Snel naar</p>
              <a href="#zorg" data-nav-link="">Onze zorg</a>
              <a href="#werkwijze" data-nav-link="">Werkwijze</a>
              <a href="#specialisten" data-nav-link="">Specialisten</a>
              <a href="#werkwijze" data-nav-link="">Over NOVA</a>
            </div>
            <div className="footer-col footer-places">
              <p className="title">Onze locaties</p>
              {PLACES.map((city) => (
                <button key={city} type="button" className="text-btn" data-book-city={city}>{city}</button>
              ))}
            </div>
            <div className="footer-col footer-contact">
              <p className="title">Samen vooruit</p>
              <p>Bespreek je vraag met ons.</p>
              <button className="text-btn" type="button" data-book="Kennismaking">Neem contact op →</button>
            </div>
          </div>
          <div className="footer-legal">
            <span>© NOVA — Centrum voor Herstel · Fictieve praktijk voor het District 35-assessment</span>
            <a href="#top" data-nav-link="">Privacyverklaring</a>
            <a href="#top" data-nav-link="">Toegankelijkheid</a>
          </div>
        </div>
      </footer>

      {/* Afspraakdemo */}
      <div className="modal" data-modal="" hidden>
        <div className="modal-backdrop" data-modal-backdrop="" data-close=""></div>
        <div className="modal-panel" data-modal-panel="" role="dialog" aria-modal="true" aria-labelledby="boek-titel">
          <div className="modal-top">
            <p className="eyebrow">NOVA · Kennismaken</p>
            <button className="modal-close" type="button" data-close="" aria-label="Venster sluiten">×</button>
          </div>

          <form className="modal-step modal-step--form" data-modal-step="" data-step="form" noValidate>
            <h2 id="boek-titel">Plan een afspraak.</h2>
            <div className="demo-note">
              <span className="demo-badge">DEMO</span>
              <p>Dit is een demonstratie. Je kunt de aanvraag uitproberen zonder persoonsgegevens in te vullen. Er wordt niets verstuurd.</p>
            </div>
            <fieldset className="place-group" data-place-group="">
              <legend>Voorkeurslocatie</legend>
              <div className="place-opts" role="radiogroup" aria-label="Voorkeurslocatie" aria-describedby="plaats-fout" data-radiogroup="" data-b-places="">
                {PLACES.map((p) => (
                  <button key={p} type="button" role="radio" className="opt" data-place-opt={p} aria-checked="false">
                    <OptInner label={p} />
                  </button>
                ))}
              </div>
              <p id="plaats-fout" className="place-error" role="alert" data-place-error="" hidden>Kies eerst een locatie om de demo af te ronden.</p>
            </fieldset>
            <fieldset>
              <legend>Waarvoor wil je langskomen?</legend>
              <div className="reason-opts" role="radiogroup" aria-label="Waarvoor wil je langskomen?" data-radiogroup="" data-b-reasons="">
                {REASONS.map((r) => (
                  <button key={r} type="button" role="radio" className="opt" data-reason-opt={r} aria-checked="false">{r}</button>
                ))}
              </div>
            </fieldset>
            <div className="submit-row">
              <button className="btn btn--dark" type="submit">Demo-aanvraag afronden</button>
              <span data-summary="">Nog geen locatie gekozen</span>
            </div>
          </form>

          <div className="modal-step modal-step--done" data-modal-step="" data-step="done" hidden>
            <div className="done-mark arc" data-done-mark="" aria-hidden="true"></div>
            <h2 id="boek-titel-done">Demo-aanvraag afgerond.</h2>
            <div className="receipt-grid">
              <span className="k">Locatie</span><span className="v" data-b-place=""></span>
              <span className="k">Waarvoor</span><span className="v" data-b-reason=""></span>
            </div>
            <p className="receipt" data-receipt=""></p>
            <p className="done-note">In de praktijk zou het team contact opnemen. Er is geen afspraak geboekt en er zijn geen gegevens verstuurd.</p>
            <div className="done-actions">
              <button className="btn btn--dark" type="button" data-done-btn="" data-close="">Terug naar NOVA</button>
              <button className="link-line" type="button" data-restart="">Opnieuw proberen</button>
            </div>
          </div>
        </div>
      </div>

      <NovaRuntime />
    </>
  );
}
