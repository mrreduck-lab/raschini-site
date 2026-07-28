'use client';

import { useEffect, useMemo, useState } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function ShareIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3m0 0 4 4m-4-4L8 7M5 11v8h14v-8"/></svg>;
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z"/><path d="M9.5 20v-6h5v6"/></svg>;
}

function MessageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 10 8 8.2 9.8a14.2 14.2 0 0 0 6 6l1.8-1.8 4.2 2.8-1.1 3.1c-.3.8-1.1 1.3-2 1.2A17 17 0 0 1 2.9 6.9c-.1-.9.4-1.7 1.2-2l3.1-1.1Z"/></svg>;
}

export default function PwaWelcome() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  const isIos = useMemo(() => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent), []);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);

    const hiddenUntil = Number(localStorage.getItem('raschini:pwa-welcome:hidden-until') || 0);
    if (!standalone && Date.now() > hiddenUntil) {
      const timer = window.setTimeout(() => setOpen(true), 2600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => {
    localStorage.setItem('raschini:pwa-welcome:hidden-until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setOpen(false);
  };

  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setOpen(false);
      }
      return;
    }
    document.getElementById('install-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!open || installed) return null;

  return (
    <div className="pwaWelcome" role="dialog" aria-modal="true" aria-label="Добавить Raschini на экран Домой">
      <button className="pwaClose" onClick={close} aria-label="Закрыть"><span/><span/></button>
      <div className="pwaShell">
        <section className="pwaIntro">
          <div className="pwaEyebrow">Raschini Club</div>
          <img className="pwaLogo" src="/IMG_4803.png" alt="Raschini" />
          <h1>Raschini<br/>всегда рядом</h1>
          <p className="pwaLead">Добавьте Raschini на экран «Домой» — и откройте более личный способ быть частью мира бренда.</p>

          <div className="benefits">
            <article><span>01</span><div><h2>Связь с персональным менеджером</h2><p>Написать или позвонить в один жест — без поиска контактов.</p></div></article>
            <article><span>02</span><div><h2>Карта Клуба</h2><p>Накопления, привилегии и ваша персональная скидка всегда под рукой.</p></div></article>
            <article><span>03</span><div><h2>Новые поступления</h2><p>Только важные новости, персональные предложения и приглашения.</p></div></article>
          </div>

          <button className="primaryAction" onClick={install}>Добавить приложение</button>
          <button className="laterAction" onClick={close}>Продолжить на сайте</button>
        </section>

        <section className="installPanel" id="install-steps">
          <p className="sectionLabel">Как добавить</p>
          <h2>{isIos ? 'Три простых шага на iPhone' : 'Установите приложение за минуту'}</h2>
          <div className="steps">
            <article><b>1</b><span className="stepIcon"><ShareIcon/></span><p>Нажмите кнопку<br/><strong>«Поделиться»</strong></p></article>
            <article><b>2</b><span className="stepIcon"><HomeIcon/></span><p>Выберите<br/><strong>«На экран Домой»</strong></p></article>
            <article><b>3</b><span className="stepApp"><img src="/icons/apple-touch-icon.png" alt=""/></span><p>Нажмите<br/><strong>«Добавить»</strong></p></article>
          </div>
        </section>

        <section className="clubCard">
          <div className="clubAuth">
            <p className="sectionLabel">Личный кабинет</p>
            <h2>Ваш Raschini</h2>
            <p>Войдите, чтобы видеть накопления, историю покупок и персональные предложения.</p>
            <a className="darkButton" href="https://raschini.com/my-account/">Войти</a>
            <a className="outlineButton" href="https://raschini.com/my-account/">Зарегистрироваться</a>
          </div>

          <div className="memberCard">
            <div className="memberTop"><span>Raschini Club</span><span>№ 00127</span></div>
            <h3>Михаил</h3>
            <p className="discountLabel">Ваша скидка</p>
            <div className="discount">30%</div>
            <div className="manager">
              <div><small>Ваш персональный менеджер</small><strong>Алексей Витченко</strong></div>
            </div>
            <div className="managerActions">
              <a href="https://wa.me/" aria-label="Написать менеджеру"><MessageIcon/>Написать</a>
              <a href="tel:+74950000000" aria-label="Позвонить менеджеру"><PhoneIcon/>Позвонить</a>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .pwaWelcome{position:fixed;z-index:200;inset:0;background:#eee8df;color:#17130f;overflow:auto;overscroll-behavior:contain;animation:welcomeIn .65s cubic-bezier(.16,1,.3,1)}
        .pwaShell{width:min(1180px,100%);margin:0 auto;padding:clamp(76px,9vw,118px) clamp(22px,5vw,72px) 54px}
        .pwaClose{position:fixed;z-index:4;top:max(20px,env(safe-area-inset-top));right:22px;width:44px;height:44px;border:0;background:rgba(238,232,223,.86);backdrop-filter:blur(14px);cursor:pointer}
        .pwaClose span{position:absolute;left:10px;right:10px;top:21px;height:1px;background:#17130f}.pwaClose span:first-child{transform:rotate(45deg)}.pwaClose span:last-child{transform:rotate(-45deg)}
        .pwaIntro{max-width:850px}.pwaEyebrow,.sectionLabel{text-transform:uppercase;letter-spacing:.28em;font-size:10px;color:#9b7844}.pwaLogo{width:150px;height:auto;object-fit:contain;margin:28px 0 18px;mix-blend-mode:multiply}
        h1{margin:0;font-family:var(--font-display),serif;font-size:clamp(68px,10vw,142px);font-weight:400;line-height:.78;letter-spacing:-.045em}.pwaLead{max-width:660px;margin:32px 0 50px;font-size:clamp(17px,2.1vw,26px);line-height:1.42;color:rgba(23,19,15,.72)}
        .benefits{border-top:1px solid rgba(23,19,15,.22)}.benefits article{display:grid;grid-template-columns:54px 1fr;gap:18px;padding:25px 0;border-bottom:1px solid rgba(23,19,15,.22)}.benefits article>span{font-size:11px;letter-spacing:.18em;color:#9b7844}.benefits h2{margin:0 0 7px;font-family:var(--font-display),serif;font-size:clamp(25px,3.5vw,39px);font-weight:400}.benefits p{margin:0;max-width:560px;font-size:14px;line-height:1.6;color:rgba(23,19,15,.62)}
        .primaryAction,.laterAction,.darkButton,.outlineButton{display:inline-flex;justify-content:center;align-items:center;min-height:54px;padding:0 28px;text-transform:uppercase;letter-spacing:.18em;font-size:10px;text-decoration:none;cursor:pointer}.primaryAction{margin-top:34px;border:1px solid #17130f;background:#17130f;color:#fff}.laterAction{border:0;background:transparent;color:#17130f}
        .installPanel{scroll-margin-top:30px;margin-top:100px;padding:52px 0;border-top:1px solid rgba(23,19,15,.22);border-bottom:1px solid rgba(23,19,15,.22)}.installPanel>h2{margin:14px 0 34px;font-family:var(--font-display),serif;font-size:clamp(42px,6vw,74px);font-weight:400;line-height:.95}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.steps article{min-height:210px;padding:22px;border:1px solid rgba(23,19,15,.18);display:flex;flex-direction:column;align-items:flex-start}.steps b{font-weight:400;color:#9b7844}.stepIcon,.stepApp{width:54px;height:54px;margin:auto 0 18px;display:grid;place-items:center}.stepIcon svg{width:34px;fill:none;stroke:currentColor;stroke-width:1.3}.stepApp img{width:54px;height:54px;border-radius:12px}.steps p{margin:0;font-size:14px;line-height:1.5}.steps strong{font-weight:500}
        .clubCard{display:grid;grid-template-columns:.85fr 1.15fr;gap:24px;margin-top:24px}.clubAuth,.memberCard{padding:clamp(28px,4vw,48px);border:1px solid rgba(23,19,15,.18)}.clubAuth h2{margin:14px 0 16px;font-family:var(--font-display),serif;font-size:clamp(48px,6vw,76px);font-weight:400;line-height:.9}.clubAuth>p:not(.sectionLabel){font-size:14px;line-height:1.7;color:rgba(23,19,15,.62);margin-bottom:34px}.darkButton{background:#17130f;color:#fff;width:100%}.outlineButton{border:1px solid rgba(23,19,15,.4);color:#17130f;width:100%;margin-top:12px}
        .memberCard{background:#17130f;color:#eee8df}.memberTop{display:flex;justify-content:space-between;text-transform:uppercase;letter-spacing:.2em;font-size:9px;color:#b89a6b}.memberCard h3{margin:56px 0 28px;font-family:var(--font-display),serif;font-size:clamp(50px,7vw,92px);font-weight:400;line-height:.85}.discountLabel{margin:0;text-transform:uppercase;letter-spacing:.2em;font-size:9px;color:rgba(238,232,223,.58)}.discount{font-family:var(--font-display),serif;font-size:clamp(72px,9vw,126px);line-height:.95;color:#b89a6b}.manager{margin-top:30px;padding-top:24px;border-top:1px solid rgba(238,232,223,.2)}.manager small{display:block;text-transform:uppercase;letter-spacing:.16em;font-size:8px;color:rgba(238,232,223,.55);margin-bottom:8px}.manager strong{font-family:var(--font-display),serif;font-size:27px;font-weight:400}.managerActions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:26px}.managerActions a{min-height:50px;border:1px solid rgba(238,232,223,.42);color:#eee8df;text-decoration:none;text-transform:uppercase;letter-spacing:.14em;font-size:9px;display:flex;align-items:center;justify-content:center;gap:10px}.managerActions svg{width:18px;fill:none;stroke:currentColor;stroke-width:1.4}
        @keyframes welcomeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @media(max-width:760px){.pwaShell{padding-left:20px;padding-right:20px}.pwaLogo{width:116px}.pwaLead{margin-bottom:38px}.steps{grid-template-columns:1fr}.steps article{min-height:150px}.clubCard{grid-template-columns:1fr}.managerActions{grid-template-columns:1fr 1fr}.primaryAction,.laterAction{width:100%;margin-left:0}.laterAction{margin-top:6px}.benefits article{grid-template-columns:40px 1fr}.installPanel{margin-top:72px}}
      `}</style>
    </div>
  );
}
