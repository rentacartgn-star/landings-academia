'use client';
import { useRef, useState, type ReactNode } from 'react';
import type { Country } from '@la/contracts';
import { countryName } from '@la/config/countries';
import { track, flush } from '@/lib/tracking/client';

export const COUNTRY_COOKIE = 'lp_country';

type ClassNames = Partial<Record<'trigger' | 'dialog' | 'title' | 'search' | 'list' | 'item' | 'close', string>>;

type Props = {
  current: Country;
  /** Países a ofrecer (con oferta); siempre se añade "Otro país" (XX). */
  countries: Country[];
  labels: { change: string; modalTitle: string; searchPlaceholder: string; close: string };
  classNames?: ClassNames;
  /** Contenido del botón; por defecto `labels.change`. */
  trigger?: ReactNode;
};

export function CountrySwitcher({ current, countries, labels, classNames = {}, trigger }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');
  const all = [...new Set([...countries, 'XX'])];
  const list = all.filter((c) => countryName(c).toLowerCase().includes(q.toLowerCase()));
  const pick = (to: Country) => {
    document.cookie = `${COUNTRY_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
    track({ name: 'country_switch', from: current, to });
    flush();
    location.reload();
  };
  return (
    <>
      <button type="button" className={classNames.trigger} data-country-switch onClick={() => ref.current?.showModal()}>
        {trigger ?? labels.change}
      </button>
      <dialog ref={ref} className={classNames.dialog} aria-label={labels.modalTitle}>
        <p className={classNames.title}>{labels.modalTitle}</p>
        <input className={classNames.search} type="search" placeholder={labels.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
        <ul className={classNames.list}>
          {list.map((c) => (
            <li key={c}>
              <button type="button" className={classNames.item} aria-current={c === current} data-country={c} onClick={() => pick(c)}>
                {countryName(c)}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={classNames.close} onClick={() => ref.current?.close()}>
          {labels.close}
        </button>
      </dialog>
    </>
  );
}
