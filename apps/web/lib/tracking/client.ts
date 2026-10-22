'use client';
// [A4] API de tracking en cliente que usan los componentes de components/ui. Firmas fijadas por A0; cuerpo de A4.
// Cola en memoria → navigator.sendBeacon('/api/e') con un BeaconEnvelope (máx. 20 eventos por envío).
// src/utm se leen de la URL y se guardan en sessionStorage (no es una cookie y muere con la pestaña).
// Se vacía: a los 2 s del último evento, al llegar a 20, al ocultar la pestaña (pagehide/visibilitychange) y con flush().
import type { BeaconEnvelope, ClientEvent, Country, Locale, SiteId } from '@la/contracts';

export interface TrackingContext {
  site: SiteId;
  country: Country;
  locale: Locale;
  variant: 0 | 1 | 2;
}

const ENDPOINT = '/api/e';
const MAX_BATCH = 20;
const DEBOUNCE_MS = 2000;
const ATTR_KEY = 'lp_attr';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

let ctx: TrackingContext | null = null;
let attr: { src?: string; utm?: Record<string, string> } = {};
let queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let listening = false;

function readAttribution(): typeof attr {
  const q = new URLSearchParams(location.search);
  const src = (q.get('src') ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) utm[k] = v.slice(0, 128);
  }
  const fromUrl = { ...(src ? { src } : {}), ...(Object.keys(utm).length ? { utm } : {}) };
  try {
    if (fromUrl.src || fromUrl.utm) {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const saved = sessionStorage.getItem(ATTR_KEY);
    return saved ? (JSON.parse(saved) as typeof attr) : {};
  } catch {
    return fromUrl; // sessionStorage bloqueado (modo privado, in-app raros)
  }
}

function send(events: ClientEvent[]): void {
  if (!ctx || !events.length) return;
  const envelope: BeaconEnvelope = {
    site: ctx.site,
    country: ctx.country,
    locale: ctx.locale,
    variant: ctx.variant,
    path: location.pathname,
    ...(attr.src ? { src: attr.src } : {}),
    ...(attr.utm ? { utm: attr.utm } : {}),
    events,
  };
  const body = JSON.stringify(envelope);
  try {
    // text/plain: petición "simple", sin preflight; el servidor parsea el texto.
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return;
  } catch {
    /* cae a fetch */
  }
  try {
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(() => {});
  } catch {
    /* nada: el tracking nunca rompe la página */
  }
}

function schedule(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, DEBOUNCE_MS);
}

function listen(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

/** Lo llama <PageTracker> una vez al montar. */
export function initTracking(c: TrackingContext): void {
  ctx = c;
  attr = readAttribution();
  listen();
  if (queue.length) schedule();
}

/** Encola un evento. Seguro de llamar antes de initTracking (se encola hasta que haya contexto). */
export function track(event: ClientEvent): void {
  queue.push(event);
  if (!ctx) return;
  if (queue.length >= MAX_BATCH) flush();
  else schedule();
}

/** Vacía la cola ya (p. ej. justo antes de navegar en un CTA). Usa sendBeacon para sobrevivir a la navegación. */
export function flush(): void {
  if (timer) clearTimeout(timer);
  timer = undefined;
  if (!ctx || !queue.length) return;
  const pending = queue;
  queue = [];
  for (let i = 0; i < pending.length; i += MAX_BATCH) send(pending.slice(i, i + MAX_BATCH));
}
