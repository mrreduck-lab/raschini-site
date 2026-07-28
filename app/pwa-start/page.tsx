'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export default function PwaStartPage() {
  const params = useSearchParams();
  const handoff = params.get('handoff');
  const [state, setState] = useState<'instructions' | 'connecting' | 'error'>('instructions');
  const isIos = useMemo(() => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent), []);

  useEffect(() => {
    if (!handoff || !isStandaloneMode()) return;

    let active = true;
    setState('connecting');
    fetch('/api/pwa/handoff/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handoff }),
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to connect');
        if (active) window.location.replace('/club');
      })
      .catch(() => {
        if (active) setState('error');
      });

    return () => { active = false; };
  }, [handoff]);

  if (!handoff) {
    return (
      <main className="screen">
        <section className="card">
          <p className="eyebrow">Raschini Club</p>
          <h1>Сначала войдите на сайте</h1>
          <p>Авторизуйтесь в личном кабинете Raschini, затем нажмите «Добавить Raschini» ещё раз.</p>
          <a className="primary" href="https://raschini.com/my-account/">Войти</a>
        </section>
        <Styles />
      </main>
    );
  }

  if (state === 'connecting') {
    return (
      <main className="screen"><section className="card centered"><p className="eyebrow">Raschini Club</p><h1>Открываем ваш Raschini</h1><div className="loader" /></section><Styles /></main>
    );
  }

  if (state === 'error') {
    return (
      <main className="screen"><section className="card"><p className="eyebrow">Raschini Club</p><h1>Ссылка устарела</h1><p>Одноразовая ссылка действует пять минут. Вернитесь на сайт и начните добавление ещё раз.</p><a className="primary" href="https://raschini.com/?raschini_pwa_connect=1">Повторить</a></section><Styles /></main>
    );
  }

  return (
    <main className="screen">
      <section className="card">
        <p className="eyebrow">Raschini Club</p>
        <img src="/IMG_4803.png" alt="Raschini" className="logo" />
        <h1>Добавьте Raschini<br />на экран «Домой»</h1>
        <p className="lead">После первого открытия приложение безопасно восстановит ваш вход. Повторно вводить телефон и пароль не потребуется.</p>

        <div className="steps">
          <article><span>1</span><div><strong>Нажмите «Поделиться»</strong><p>Кнопка находится в нижней панели Safari.</p></div></article>
          <article><span>2</span><div><strong>Выберите «На экран Домой»</strong><p>Не меняйте адрес этой страницы.</p></div></article>
          <article><span>3</span><div><strong>Откройте иконку Raschini</strong><p>Вход будет перенесён автоматически.</p></div></article>
        </div>

        {!isIos && <p className="note">На Android используйте системную команду браузера «Установить приложение».</p>}
        <a className="secondary" href="/">Вернуться на сайт</a>
      </section>
      <Styles />
    </main>
  );
}

function Styles() {
  return <style jsx>{`
    .screen{min-height:100svh;background:#eee8df;color:#17130f;padding:max(42px,env(safe-area-inset-top)) 20px max(36px,env(safe-area-inset-bottom));display:grid;place-items:center}
    .card{width:min(680px,100%)}.centered{text-align:center}.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-size:10px;color:#9b7844;margin:0 0 28px}.logo{width:118px;height:auto;mix-blend-mode:multiply;margin-bottom:26px}
    h1{font-family:var(--font-display),serif;font-size:clamp(48px,9vw,86px);line-height:.9;font-weight:400;letter-spacing:-.035em;margin:0 0 28px}.lead,.card>p:not(.eyebrow){font-size:16px;line-height:1.65;color:rgba(23,19,15,.68);max-width:590px}
    .steps{margin:42px 0 34px;border-top:1px solid rgba(23,19,15,.2)}.steps article{display:grid;grid-template-columns:36px 1fr;gap:16px;padding:22px 0;border-bottom:1px solid rgba(23,19,15,.2)}.steps span{font-size:11px;color:#9b7844}.steps strong{display:block;font-family:var(--font-display),serif;font-size:27px;font-weight:400}.steps p{margin:5px 0 0;font-size:13px;line-height:1.5;color:rgba(23,19,15,.58)}
    .primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:54px;text-decoration:none;text-transform:uppercase;letter-spacing:.16em;font-size:10px}.primary{background:#17130f;color:#fff;margin-top:30px}.secondary{color:#17130f;border:1px solid rgba(23,19,15,.35)}.note{margin:0 0 22px!important;font-size:13px!important}.loader{width:32px;height:32px;border:1px solid rgba(23,19,15,.22);border-top-color:#17130f;border-radius:50%;margin:36px auto;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  `}</style>;
}
