'use client';

import { usePathname } from 'next/navigation';
import PushPrompt from './PushPrompt';
import PwaWelcome from './PwaWelcome';

export default function SiteOverlays() {
  const pathname = usePathname();

  return (
    <>
      {pathname === '/' ? <PwaWelcome /> : null}
      <PushPrompt />
    </>
  );
}
