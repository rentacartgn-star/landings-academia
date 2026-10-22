// [A1] robots.txt. El SEO no es objetivo (tráfico de bio), pero la home se deja rastrear para que los previews de OG
// (Facebook, X, Telegram, WhatsApp...) funcionen. Se cierran /go (no disparar clics), /api, /panel y la ruta interna.
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/go/', '/api/', '/panel', '/_s/'] }],
  };
}
