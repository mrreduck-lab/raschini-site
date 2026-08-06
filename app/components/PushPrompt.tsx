'use client';

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(value: string): Uint8Array {
  const padding = '='.repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) output[index] = raw.charCodeAt(index);
  return output;
}

export default function PushPrompt() {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    if (!supported || Notification.permission === 'denied') return;
    navigator.serviceWorker.register('/sw.js').then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      setAvailable(!subscription);
    }).catch(console.error);
  }, []);

  async function subscribe() {
    setStatus('loading');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Permission denied');
      const registration = await navigator.serviceWorker.ready;
      const keyResponse = await fetch('/api/push/public-key', { cache: 'no-store' });
      if (!keyResponse.ok) throw new Error('Push is not configured');
      const { publicKey } = await keyResponse.json() as { publicKey: string };
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!response.ok) throw new Error('Unable to save subscription');
      setStatus('done');
      setTimeout(() => { setOpen(false); setAvailable(false); }, 1400);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  if (!available) return null;

  return (
    <>
      <button className="pushTeaser" onClick={() => setOpen(true)}>
        <span>Новости Raschini</span>
        <small>Подписаться на уведомления</small>
      </button>

      {open && (
        <div className="pushOverlay" role="dialog" aria-modal="true" aria-labelledby="push-title" onClick={() => setOpen(false)}>
          <section className="pushModal" onClick={(event) => event.stopPropagation()}>
            <button className="pushClose" onClick={() => setOpen(false)} aria-label="Закрыть">×</button>
            <p className="pushKicker">Raschini private updates</p>
            <h2 id="push-title">Будьте ближе к новым коллекциям</h2>
            <p className="pushText">Редкие уведомления о новых поступлениях, закрытых презентациях, событиях в бутиках и персональных предложениях.</p>
            <div className="pushBenefits">
              <span>Новые коллекции</span><span>События бутика</span><span>Персональные предложения</span>
            </div>
            <button className="pushAction" onClick={subscribe} disabled={status === 'loading' || status === 'done'}>
              {status === 'loading' ? 'Подключаем…' : status === 'done' ? 'Уведомления включены' : status === 'error' ? 'Попробовать снова' : 'Включить уведомления'}
            </button>
            <button className="pushLater" onClick={() => setOpen(false)}>Не сейчас</button>
          </section>
        </div>
      )}

      <style jsx>{`
        .pushTeaser{position:fixed;z-index:65;right:18px;bottom:max(18px,env(safe-area-inset-bottom));padding:14px 16px;border:1px solid rgba(155,120,68,.4);background:rgba(244,239,232,.96);color:#17130f;text-align:left;box-shadow:0 12px 38px rgba(0,0,0,.14);cursor:pointer}
        .pushTeaser span,.pushTeaser small{display:block}.pushTeaser span{font-family:var(--font-display),serif;font-size:18px}.pushTeaser small{margin-top:4px;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:#8d7452}
        .pushOverlay{position:fixed;z-index:120;inset:0;display:grid;place-items:center;padding:max(20px,env(safe-area-inset-top)) max(20px,env(safe-area-inset-right)) max(20px,env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));background:rgba(8,7,5,.58);backdrop-filter:blur(12px)}
        .pushModal{position:relative;width:min(720px,100%);max-height:calc(100svh - 40px);overflow:auto;padding:clamp(34px,6vw,72px);background:#f3efe7;color:#17130f;border:1px solid rgba(255,255,255,.34);box-shadow:0 30px 90px rgba(0,0,0,.28)}
        .pushClose{position:absolute;top:18px;right:20px;border:0;background:transparent;font-size:30px;line-height:1;cursor:pointer}.pushKicker{margin:0;text-transform:uppercase;letter-spacing:.22em;font-size:9px;color:#8d7452}.pushModal h2{margin:18px 0 18px;font-family:var(--font-display),serif;font-size:clamp(42px,7vw,76px);line-height:.92;font-weight:400;letter-spacing:-.035em}.pushText{max-width:560px;margin:0;font-size:14px;line-height:1.7;color:rgba(23,19,15,.66)}
        .pushBenefits{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:30px 0}.pushBenefits span{padding:14px;border:1px solid rgba(23,19,15,.14);font-size:9px;text-transform:uppercase;letter-spacing:.1em;text-align:center}
        .pushAction,.pushLater{width:100%;min-height:54px;cursor:pointer}.pushAction{border:0;background:#17130f;color:#fff;text-transform:uppercase;letter-spacing:.14em;font-size:9px}.pushLater{margin-top:8px;border:0;background:transparent;text-transform:uppercase;letter-spacing:.12em;font-size:8px;opacity:.55}
        @media(max-width:600px){.pushTeaser{left:14px;right:14px;bottom:max(14px,env(safe-area-inset-bottom))}.pushOverlay{padding:max(16px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}.pushModal{max-height:calc(100svh - 32px);padding:52px 24px 28px}.pushBenefits{grid-template-columns:1fr}.pushModal h2{font-size:48px}}
      `}</style>
    </>
  );
}
