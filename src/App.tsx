import { useEffect, useRef, useState } from 'react';

const telegram = 'https://t.me/lisa_13_lisa';
const map = 'https://2gis.ru/novosibirsk/search/%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%9A%D0%B0%D1%80%D0%BB%D0%B0%20%D0%9C%D0%B0%D1%80%D0%BA%D1%81%D0%B0%2C%2030';

const works = Array.from({ length: 12 }, (_, index) => ({
  src: `/images/works/work-${String(index + 1).padStart(2, '0')}.webp`,
  file: `work-${String(index + 1).padStart(2, '0')}.webp`,
  number: String(index + 1).padStart(2, '0'),
}));

type PhotoProps = {
  src: string;
  file: string;
  kind: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

function Photo({ src, file, kind, alt, className = '', eager = false }: PhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const [missing, setMissing] = useState(false);

  return (
    <span className={`photo ${className} ${loaded ? 'photo--loaded' : ''}`}>
      {!loaded && (
        <span className="photo__placeholder" aria-hidden="true">
          <span className="photo__kind">{kind}</span>
          <span className="photo__mark">ЛИСА / СТУДИЯ</span>
          <span className="photo__file">{file}</span>
        </span>
      )}
      {!missing && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setMissing(true)}
        />
      )}
    </span>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#top" aria-label="ЛИСА — в начало страницы" onClick={close}>
          <img src="/logo-lisa.png" alt="Логотип тату-студии ЛИСА" width="68" height="68" />
          <span className="brand__caption">ТАТУ-СТУДИЯ<br />НОВОСИБИРСК</span>
        </a>
        <nav id="site-nav" ref={menuRef} className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Основная навигация">
          <a href="#works" onClick={close}>Работы</a>
          <a href="#services" onClick={close}>Услуги</a>
          <a href="#about" onClick={close}>О студии</a>
          <a href="#contacts" onClick={close}>Контакты</a>
          <a className="main-nav__mobile-cta" href={telegram} target="_blank" rel="noopener noreferrer" onClick={close}>Записаться <Arrow diagonal /></a>
        </nav>
        <a className="header-cta" href={telegram} target="_blank" rel="noopener noreferrer">Записаться <Arrow diagonal /></a>
        <button
          className={`menu-toggle ${open ? 'menu-toggle--open' : ''}`}
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        ><span /><span /></button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow"><span className="eyebrow__dash" /> ТАТУ-СТУДИЯ · НОВОСИБИРСК</p>
        <h1 id="hero-title">ЛИСА<span className="hero__dot">.</span></h1>
        <p className="hero__lead">Татуировки, пирсинг<br />и не только.</p>
        <p className="hero__description">Студия на Маркса, 30. Поможем выбрать эскиз, обсудим идею и подберём удобное время для записи.</p>
        <div className="hero__actions">
          <a className="button button--dark" href="#works">Смотреть работы <Arrow diagonal /></a>
          <a className="text-link" href={telegram} target="_blank" rel="noopener noreferrer">Записаться <Arrow diagonal /></a>
        </div>
      </div>
      <div className="hero__visual" aria-label="Места для двух фотографий работ студии">
        <Photo className="hero__photo hero__photo--first" src="/images/hero/hero-tattoo-01.webp" file="hero-tattoo-01.webp" kind="ФОТО РАБОТЫ / 01" alt="Татуировка студии ЛИСА" eager />
        <Photo className="hero__photo hero__photo--second" src="/images/hero/hero-tattoo-02.webp" file="hero-tattoo-02.webp" kind="ФОТО РАБОТЫ / 02" alt="Татуировка студии ЛИСА" eager />
        <span className="hero__photo-note">РАБОТЫ СТУДИИ</span>
      </div>
      <div className="hero__foot"><span>01 / 08</span><span>ПРОКРУТИТЬ ВНИЗ ↓</span></div>
    </section>
  );
}

function Portfolio() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

  const open = (index: number, trigger: HTMLButtonElement) => {
    opener.current = trigger;
    setActive(index);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const move = (step: number) => setActive(current => current === null ? 0 : (current + step + works.length) % works.length);

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);

  return (
    <section className="portfolio section-pad" id="works" aria-labelledby="works-title">
      <div className="shell">
        <div className="section-head portfolio__head">
          <div><p className="eyebrow">01 / РАБОТЫ</p><h2 id="works-title">Сделано в «ЛИСЕ»</h2></div>
          <p>Здесь будут работы студии. Нажми на любое фото, чтобы рассмотреть его целиком.</p>
        </div>
        <div className="portfolio__grid">
          {works.map((work, index) => (
            <button className="work" type="button" key={work.file} onClick={event => open(index, event.currentTarget)} aria-label={`Открыть фотографию работы ${work.number}`}>
              <Photo src={work.src} file={work.file} kind={`РАБОТА / ${work.number}`} alt={`Работа студии ЛИСА, фото ${work.number}`} />
              <span className="work__meta"><span>ЛИСА / РАБОТА {work.number}</span><Arrow diagonal /></span>
            </button>
          ))}
        </div>
        <p className="portfolio__note">Фотографии появятся здесь после добавления оригинальных работ студии.</p>
      </div>
      <dialog className="lightbox" ref={dialog} aria-label="Просмотр работ" onClose={() => { setActive(null); opener.current?.focus(); }} onClick={event => { if (event.target === dialog.current) close(); }}>
        {active !== null && <div className="lightbox__inner" onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={event => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1); touchStart.current = null; }}>
          <div className="lightbox__top"><span>ЛИСА / РАБОТЫ <span className="lightbox__count">{works[active].number} / 12</span></span><button type="button" onClick={close} aria-label="Закрыть галерею">Закрыть ×</button></div>
          <div className="lightbox__stage"><button className="lightbox__arrow lightbox__arrow--prev" type="button" onClick={() => move(-1)} aria-label="Предыдущая фотография">←</button><Photo key={works[active].file} src={works[active].src} file={works[active].file} kind={`РАБОТА / ${works[active].number}`} alt={`Работа студии ЛИСА, фото ${works[active].number}`} /><button className="lightbox__arrow lightbox__arrow--next" type="button" onClick={() => move(1)} aria-label="Следующая фотография">→</button></div>
          <p className="lightbox__hint">Листай стрелками на клавиатуре или свайпом</p>
        </div>}
      </dialog>
    </section>
  );
}

function Services() {
  return (
    <section className="services section-pad" id="services" aria-labelledby="services-title">
      <div className="shell">
        <div className="section-head"><div><p className="eyebrow">02 / НАПРАВЛЕНИЯ</p><h2 id="services-title">Чем занимаемся</h2></div><p>Выбери направление и напиши нам — расскажем об условиях и ответим на вопросы.</p></div>
        <div className="services__layout">
          <article className="service-feature">
            <Photo src="/images/works/work-01.webp" file="work-01.webp" kind="ТАТУИРОВКИ / ФОТО РАБОТЫ" alt="Пример татуировки студии ЛИСА" />
            <div className="service-feature__body"><span className="service-number">01</span><div><h3>Татуировки</h3><p>От небольшой идеи до авторской композиции. Поможем определиться с эскизом, размером и местом размещения.</p><a className="inline-link" href={telegram} target="_blank" rel="noopener noreferrer">Обсудить татуировку <Arrow diagonal /></a></div></div>
          </article>
          <div className="services__list">
            <article className="service-row"><span className="service-number">02</span><div className="service-row__copy"><h3>Пирсинг</h3><p>Обсудим процедуру и ответим на вопросы перед записью.</p><a className="inline-link" href={telegram} target="_blank" rel="noopener noreferrer">Узнать подробнее <Arrow diagonal /></a></div><Photo src="/images/services/piercing-01.webp" file="piercing-01.webp" kind="ПИРСИНГ / ФОТО" alt="Фото услуги пирсинга в студии ЛИСА" /></article>
            <article className="service-row"><span className="service-number">03</span><div className="service-row__copy"><h3>Перманентный макияж</h3><p>Посмотри примеры работ и уточни детали у студии.</p><a className="inline-link" href={telegram} target="_blank" rel="noopener noreferrer">Задать вопрос <Arrow diagonal /></a></div><Photo src="/images/services/permanent-01.webp" file="permanent-01.webp" kind="ПЕРМАНЕНТ / ФОТО" alt="Пример перманентного макияжа студии ЛИСА" /></article>
            <article className="service-row service-row--text"><span className="service-number">04</span><div className="service-row__copy"><h3>Обучение</h3><p>В студии есть обучение татуировке и перманентному макияжу. Актуальные условия и даты уточни напрямую.</p><a className="inline-link" href={telegram} target="_blank" rel="noopener noreferrer">Уточнить условия <Arrow diagonal /></a></div></article>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-pad" id="about" aria-labelledby="about-title"><div className="shell about__grid"><div className="about__copy"><p className="eyebrow">03 / О СТУДИИ</p><h2 id="about-title">ЛИСА — студия<br />на Маркса, 30.</h2><p>Здесь можно обсудить будущую татуировку, выбрать эскиз и познакомиться с работами мастеров.</p><p>Мы находимся недалеко от метро «Студенческая». Работаем по предварительной записи.</p><a className="inline-link" href="#contacts">Как нас найти <Arrow diagonal /></a></div><div className="about__visual"><Photo src="/images/studio/studio-interior-01.webp" file="studio-interior-01.webp" kind="ИНТЕРЬЕР / ФОТО СТУДИИ" alt="Интерьер тату-студии ЛИСА" /><div className="about__address"><span>НОВОСИБИРСК</span><strong>КАРЛА МАРКСА, 30<br />ОФИС 405</strong><span>ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ</span></div></div></div></section>
  );
}

function Booking() {
  return (
    <section className="booking section-pad" id="booking" aria-labelledby="booking-title"><div className="shell booking__grid"><div><p className="eyebrow">04 / ЗАПИСЬ</p><h2 id="booking-title">Начнём с<br />разговора.</h2><p className="booking__intro">Можно прийти с готовым эскизом или только с идеей. Напиши нам — обсудим детали и договоримся о следующем шаге.</p><a className="button button--light" href={telegram} target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow diagonal /></a></div><ol className="booking__steps"><li><span>01</span><div><h3>Напиши нам</h3><p>Расскажи об идее или услуге, которая интересует.</p></div></li><li><span>02</span><div><h3>Обсудим детали</h3><p>Уточним пожелания, ответим на вопросы и согласуем условия.</p></div></li><li><span>03</span><div><h3>Договоримся о времени</h3><p>После обсуждения студия предложит запись.</p></div></li></ol></div></section>
  );
}

const questions = [
  ['Где находится студия?', 'Новосибирск, проспект Карла Маркса, 30, офис 405. Примерно пять минут пешком от метро «Студенческая».'],
  ['Можно ли получить консультацию перед татуировкой?', 'Да. В студии можно бесплатно проконсультироваться по выбору эскиза, места и размера татуировки.'],
  ['Как записаться?', 'Напиши нам в Telegram или позвони. Студия работает по предварительной записи.'],
  ['Как узнать стоимость?', 'Стоимость зависит от услуги и деталей работы. Уточнить цену можно при обращении в студию.'],
  ['Можно ли узнать об обучении?', 'Да, студия занимается обучением. Актуальные программы, условия и даты можно уточнить напрямую.'],
];

function FAQ() {
  return <section className="faq section-pad" id="faq" aria-labelledby="faq-title"><div className="shell faq__grid"><div><p className="eyebrow">05 / ВОПРОСЫ</p><h2 id="faq-title">Коротко<br />о главном.</h2></div><div className="faq__list">{questions.map(([question, answer], index) => <details key={question}><summary><span className="faq__number">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><span className="faq__symbol" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>;
}

function Contacts() {
  return <section className="contacts section-pad" id="contacts" aria-labelledby="contacts-title"><div className="shell contacts__grid"><div><p className="eyebrow">06 / КОНТАКТЫ</p><h2 id="contacts-title">Обсудим<br />твою идею?</h2><p>Расскажи, что хочешь сделать, или задай вопрос студии.</p><a className="button button--dark" href={telegram} target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow diagonal /></a></div><div className="contacts__details"><div><span className="detail-label">ТЕЛЕФОН</span><a href="tel:+79537961133">+7 (953) 796-11-33</a></div><div><span className="detail-label">АДРЕС</span><p>Новосибирск, проспект Карла Маркса, 30, офис 405</p><a className="inline-link" href={map} target="_blank" rel="noopener noreferrer">Открыть на карте <Arrow diagonal /></a></div><div><span className="detail-label">ОРИЕНТИР И ГРАФИК</span><p>Метро «Студенческая»<br />Работа по предварительной записи</p></div></div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="shell footer__top"><a className="footer__brand" href="#top"><img src="/logo-lisa.png" alt="Логотип тату-студии ЛИСА" width="90" height="90" /><span>Тату-студия<br />в Новосибирске</span></a><nav aria-label="Навигация внизу страницы"><a href="#works">Работы</a><a href="#services">Услуги</a><a href="#about">О студии</a><a href="#contacts">Контакты</a></nav><div><a href="tel:+79537961133">+7 (953) 796-11-33</a><a href={telegram} target="_blank" rel="noopener noreferrer">Telegram ↗</a></div></div><div className="shell footer__bottom"><span>© {new Date().getFullYear()} ЛИСА</span><span>Новосибирск · Карла Маркса, 30</span><a href="#top">Наверх ↑</a></div></footer>;
}

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll<HTMLElement>('.section-head, .about__copy, .booking__grid, .faq__grid, .contacts__grid');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    elements.forEach(element => { element.classList.add('can-reveal'); observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  return <><a className="skip-link" href="#main">Перейти к содержимому</a><div id="top" /><Header /><main id="main"><Hero /><Portfolio /><Services /><About /><Booking /><FAQ /><Contacts /></main><Footer /></>;
}

export default App;
