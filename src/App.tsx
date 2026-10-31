import { useEffect, useRef, useState } from 'react';

const telegram = 'https://t.me/lisa_13_lisa';
const map = 'https://2gis.ru/novosibirsk/search/%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%9A%D0%B0%D1%80%D0%BB%D0%B0%20%D0%9C%D0%B0%D1%80%D0%BA%D1%81%D0%B0%2C%2030';
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const works = Array.from({ length: 12 }, (_, index) => ({
  src: asset(`images/works/work-${String(index + 1).padStart(2, '0')}.webp`),
  number: String(index + 1).padStart(2, '0'),
}));

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

function Photo({ src, alt, className = '', eager = false }: PhotoProps) {
  return (
    <span className={`photo ${className}`}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </span>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);

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
          <img src={asset('logo-lisa.png')} alt="Логотип тату-студии ЛИСА" width="68" height="68" />
          <span className="brand__caption">ТАТУ-СТУДИЯ</span>
        </a>
        <nav id="site-nav" className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Основная навигация">
          <a href="#works" onClick={close}>Работы</a>
          <a href="#booking" onClick={close}>Запись</a>
          <a href="#about" onClick={close}>О студии</a>
          <a href="#contacts" onClick={close}>Контакты</a>
          <a className="main-nav__mobile-cta" href={telegram} target="_blank" rel="noopener noreferrer" onClick={close}>Записаться <Arrow diagonal /></a>
        </nav>
        <a className="header-cta" href={telegram} target="_blank" rel="noopener noreferrer">Записаться</a>
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
        <p className="eyebrow"><span className="eyebrow__dash" /> НОВОСИБИРСК · КАРЛА МАРКСА, 30</p>
        <h1 id="hero-title">ЛИСА<span className="hero__dot">.</span></h1>
        <p className="hero__lead">Татуировки<br />с характером.</p>
        <p className="hero__description">Поможем выбрать эскиз, обсудим идею и подберём удобное время для записи.</p>
        <div className="hero__actions">
          <a className="button button--dark" href={telegram} target="_blank" rel="noopener noreferrer">Записаться</a>
          <a className="button hero__secondary" href="#works">Смотреть работы</a>
        </div>
      </div>
      <div className="hero__visual" aria-label="Фотографии работ студии">
        <Photo className="hero__photo hero__photo--first" src={asset('images/hero/hero-tattoo-01.webp')} alt="Татуировка студии ЛИСА" eager />
        <Photo className="hero__photo hero__photo--second" src={asset('images/hero/hero-tattoo-02.webp')} alt="Татуировка студии ЛИСА" eager />
      </div>
      <div className="hero__foot"><span>ТАТУИРОВКИ · ЭСКИЗЫ · СТИЛЬ</span><a href="#works">СМОТРЕТЬ РАБОТЫ <span aria-hidden="true">↓</span></a></div>
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
        </div>
        <div className="portfolio__grid">
          {works.map((work, index) => (
            <button className="work" type="button" key={work.src} onClick={event => open(index, event.currentTarget)} aria-label={`Открыть фотографию работы ${work.number}`}>
              <Photo src={work.src} alt={`Работа студии ЛИСА, фото ${work.number}`} />
              <span className="work__meta"><span>ТАТУИРОВКА {work.number}</span><Arrow diagonal /></span>
            </button>
          ))}
        </div>
      </div>
      <dialog className="lightbox" ref={dialog} aria-label="Просмотр работ" onClose={() => { setActive(null); opener.current?.focus(); }} onClick={event => { if (event.target === dialog.current) close(); }}>
        {active !== null && <div className="lightbox__inner" onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={event => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1); touchStart.current = null; }}>
          <div className="lightbox__top"><span>ЛИСА / РАБОТЫ <span className="lightbox__count">{works[active].number} / 12</span></span><button type="button" onClick={close} aria-label="Закрыть галерею">Закрыть ×</button></div>
          <div className="lightbox__stage"><button className="lightbox__arrow lightbox__arrow--prev" type="button" onClick={() => move(-1)} aria-label="Предыдущая фотография">←<span>Назад</span></button><Photo key={works[active].src} src={works[active].src} alt={`Работа студии ЛИСА, фото ${works[active].number}`} eager /><button className="lightbox__arrow lightbox__arrow--next" type="button" onClick={() => move(1)} aria-label="Следующая фотография"><span>Далее</span>→</button></div>
          <p className="lightbox__hint"><span className="lightbox__hint--desktop">Листай стрелками на клавиатуре или свайпом</span><span className="lightbox__hint--mobile">Листайте кнопками или смахните фото в сторону</span></p>
        </div>}
      </dialog>
    </section>
  );
}

function About() {
  return (
    <section className="about section-pad" id="about" aria-labelledby="about-title"><div className="shell about__grid"><div className="about__copy"><p className="eyebrow">03 / О СТУДИИ</p><h2 id="about-title">ЛИСА — студия<br />на Маркса, 30<span className="hero__dot">.</span></h2><p>Здесь можно обсудить будущую татуировку, выбрать эскиз и познакомиться с работами мастеров.</p><p>Мы находимся недалеко от метро «Студенческая». Работаем по предварительной записи.</p><a className="inline-link" href="#contacts">Как нас найти <Arrow diagonal /></a></div><div className="about__visual"><Photo src={asset('images/studio/studio-interior-01.webp')} alt="Интерьер тату-студии ЛИСА" /><div className="about__address"><span>НОВОСИБИРСК</span><strong>КАРЛА МАРКСА, 30<br />ОФИС 405</strong><span>ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ</span></div></div></div></section>
  );
}

function Booking() {
  const [answers, setAnswers] = useState({ preparation: '', style: '', age: '' });
  const ready = Object.values(answers).every(Boolean);
  const message = [
    'Здравствуйте! Хочу записаться на сеанс.',
    answers.preparation,
    answers.style,
    answers.age,
  ].filter(Boolean).join(' ');
  const bookingUrl = `${telegram}?text=${encodeURIComponent(message)}`;

  return (
    <section className="booking section-pad" id="booking" aria-labelledby="booking-title"><div className="shell booking__grid"><div><p className="eyebrow">04 / ЗАПИСЬ</p><h2 id="booking-title">Запись<br /><span>на сеанс</span><span className="hero__dot">.</span></h2><p className="booking__intro">Ответь на несколько вопросов — мы соберём сообщение и откроем Telegram.</p></div><div className="booking-config"><fieldset><legend>01 · Что уже есть?</legend><div className="booking-config__options"><button className={answers.preparation === 'У меня уже есть эскиз.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, preparation: 'У меня уже есть эскиз.' })}>Эскиз</button><button className={answers.preparation === 'У меня есть референсы.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, preparation: 'У меня есть референсы.' })}>Референсы</button><button className={answers.preparation === 'Мне нужна помощь с идеей.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, preparation: 'Мне нужна помощь с идеей.' })}>Нужна помощь</button></div></fieldset><fieldset><legend>02 · Стиль татуировки</legend><div className="booking-config__options"><button className={answers.style === 'Хочу цветную татуировку.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, style: 'Хочу цветную татуировку.' })}>Цветная</button><button className={answers.style === 'Хочу чёрно-белую татуировку.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, style: 'Хочу чёрно-белую татуировку.' })}>Чёрно-белая</button></div></fieldset><fieldset><legend>03 · Возраст</legend><div className="booking-config__options"><button className={answers.age === 'Мне меньше 18 лет.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, age: 'Мне меньше 18 лет.' })}>До 18</button><button className={answers.age === 'Мне 18 лет или больше.' ? 'is-active' : ''} onClick={() => setAnswers({ ...answers, age: 'Мне 18 лет или больше.' })}>18+</button></div></fieldset><a className={`button button--light booking-config__submit ${ready ? '' : 'is-disabled'}`} href={ready ? bookingUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!ready}>Открыть Telegram</a></div></div></section>
  );
}

const questions = [
  ['Где находится студия?', 'Новосибирск, проспект Карла Маркса, 30, офис 405. Примерно пять минут пешком от метро «Студенческая».'],
  ['Можно ли получить консультацию перед татуировкой?', 'Да. В студии можно бесплатно проконсультироваться по выбору эскиза, места и размера татуировки.'],
  ['Как записаться?', 'Напиши нам в Telegram или позвони. Студия работает по предварительной записи.'],
  ['Как узнать стоимость?', 'Стоимость зависит от услуги и деталей работы. Уточнить цену можно при обращении в студию.'],
];

function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  return <section className="faq section-pad" id="faq" aria-labelledby="faq-title"><div className="shell faq__grid"><div><p className="eyebrow">05 / ВОПРОСЫ</p><h2 id="faq-title">Коротко<br />о главном<span className="hero__dot">.</span></h2></div><div className="faq__list">{questions.map(([question, answer], index) => { const open = openIndexes.includes(index); return <div className={`faq__item ${open ? 'is-open' : ''}`} key={question}><button className="faq__summary" type="button" aria-expanded={open} onClick={() => setOpenIndexes((current) => open ? current.filter((item) => item !== index) : [...current, index])}><span className="faq__number">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><span className="faq__symbol" aria-hidden="true">+</span></button><div className="faq__answer"><p>{answer}</p></div></div>; })}</div></div></section>;
}

function Contacts() {
  return <section className="contacts section-pad" id="contacts" aria-labelledby="contacts-title"><div className="shell contacts__grid"><div><p className="eyebrow">06 / КОНТАКТЫ</p><h2 id="contacts-title">Обсудим<br />твою идею?</h2><p>Расскажи, что хочешь сделать, или задай вопрос студии.</p><a className="button button--dark" href={telegram} target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow diagonal /></a></div><div className="contacts__details"><div><span className="detail-label">ТЕЛЕФОН</span><a href="tel:+79537961133">+7 (953) 796-11-33</a></div><div><span className="detail-label">АДРЕС</span><p>Новосибирск, проспект Карла Маркса, 30, офис 405</p><a className="inline-link" href={map} target="_blank" rel="noopener noreferrer">Открыть на карте <Arrow diagonal /></a></div><div><span className="detail-label">ОРИЕНТИР И ГРАФИК</span><p>Метро «Студенческая»<br />Работа по предварительной записи</p></div></div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="shell footer__top"><a className="footer__brand" href="#top"><img src={asset('logo-lisa.png')} alt="Логотип тату-студии ЛИСА" width="90" height="90" /><span>Тату-студия<br />в Новосибирске</span></a><nav aria-label="Навигация внизу страницы"><a href="#works">Работы</a><a href="#booking">Запись</a><a href="#about">О студии</a><a href="#contacts">Контакты</a></nav><div><a href="tel:+79537961133">+7 (953) 796-11-33</a><a href={telegram} target="_blank" rel="noopener noreferrer">Telegram ↗</a></div></div><div className="shell footer__bottom"><span>© {new Date().getFullYear()} ЛИСА</span><span>Новосибирск · Карла Маркса, 30</span><a href="#top">Наверх ↑</a></div></footer>;
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

  return <><a className="skip-link" href="#main">Перейти к содержимому</a><div id="top" /><Header /><main id="main"><Hero /><Portfolio /><Booking /><About /><FAQ /><Contacts /></main><Footer /></>;
}

export default App;
