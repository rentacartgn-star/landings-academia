// [A5] Textos legales por mercado (es-ES / es-419). Plantillas revisadas por A5 el 22-oct-2026;
// NO sustituyen la revisión del asesor de Sergi (P9). Datos del titular: TODO(sergi) en lib/compliance/legal-entity.ts.
import type { ReactNode } from 'react';
import type { Locale, SiteConfig } from '@la/contracts';
import { COUNTRY_NAMES } from '@la/config';
import { marketFor, type LegalDoc } from '@/lib/compliance';
import type { LegalEntity } from '@/lib/compliance/legal-entity';

export interface DocCtx {
  site: SiteConfig;
  entity: LegalEntity;
  country: string;
  locale: Locale;
}

export const DOC_TITLES: Record<LegalDoc, string> = {
  'aviso-legal': 'Aviso legal',
  privacidad: 'Política de privacidad',
  cookies: 'Política de cookies',
  'juego-responsable': 'Juego responsable',
};

const Todo = ({ children }: { children: ReactNode }) => <span className="lg-todo">{children}</span>;
const v = (s: string | undefined) => (s && s.startsWith('TODO') ? <Todo>{s}</Todo> : s);
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function EntityCard({ e, site }: { e: LegalEntity; site: SiteConfig }) {
  return (
    <dl className="lg-dl">
      <dt>Sitio</dt>
      <dd>{site.brandName}</dd>
      <dt>Titular</dt>
      <dd>{v(e.razonSocial)}</dd>
      <dt>NIF</dt>
      <dd>{v(e.nif)}</dd>
      <dt>Domicilio</dt>
      <dd>{v(e.domicilio)}</dd>
      <dt>Email</dt>
      <dd>{v(e.email)}</dd>
      {e.registro && (
        <>
          <dt>Registro</dt>
          <dd>{v(e.registro)}</dd>
        </>
      )}
    </dl>
  );
}

// ───────────── Aviso legal ─────────────
function AvisoLegal({ site, entity, country, locale }: DocCtx) {
  const es = locale === 'es-ES';
  const m = marketFor(country);
  return (
    <>
      <h2>1. Titular del sitio</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI), se informa de los datos del titular de este sitio web:
      </p>
      <EntityCard e={entity} site={site} />

      <h2>2. Qué es este sitio</h2>
      <p>
        {site.brandName} es la página personal de {site.memberName}, creador de contenido sobre deporte. Este sitio{' '}
        <strong>no es un operador de juego</strong>: no acepta apuestas, no gestiona cuentas de juego ni recibe depósitos.
        Contiene <strong>comunicaciones comerciales (publicidad)</strong> de operadores de juego con los que el titular
        mantiene acuerdos de afiliación, por los que puede recibir una comisión si te registras a través de sus enlaces.
        Esto no cambia las condiciones que te ofrece el operador.
      </p>
      <p>
        Solo se muestran operadores que, según la información de que dispone el titular, cuentan con título habilitante
        en el país desde el que nos visitas
        {es ? ' (en España, licencia de la Dirección General de Ordenación del Juego, DGOJ)' : ''}. Cada oferta indica su
        licencia y enlaza a sus condiciones. Las condiciones vinculantes de cualquier promoción son siempre las publicadas
        por el operador en su web.
      </p>

      <h2>3. Mayoría de edad</h2>
      <p>
        El contenido comercial de este sitio está dirigido exclusivamente a personas mayores de {m.minAge} años
        {m.known ? ` (edad legal para jugar en ${COUNTRY_NAMES[country] ?? country})` : ' o de la edad legal de su país, si es mayor'}.
        Si eres menor, no sigas navegando por las ofertas.
      </p>

      <h2>4. Responsabilidad</h2>
      <p>
        Los análisis y opiniones de {site.memberName} son contenido editorial y de entretenimiento. No son asesoramiento
        financiero ni garantizan ningún resultado: <strong>en las apuestas se puede perder dinero</strong>. El titular no
        responde de los servicios, decisiones o condiciones de los operadores, que son terceros independientes, ni del
        contenido de webs externas enlazadas.
      </p>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>
        Los textos, diseño y marca {site.brandName} pertenecen a su titular. Las marcas y logotipos de los operadores son
        propiedad de sus titulares y se usan con su autorización en el marco de los programas de afiliación.
      </p>

      <h2>6. Legislación y jurisdicción</h2>
      <p>
        {es
          ? 'Este aviso se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.'
          : 'Este aviso se rige por la legislación del domicilio del titular, sin perjuicio de los derechos que te reconozca la normativa de protección al consumidor de tu país.'}{' '}
        <Todo>TODO(sergi): confirmar legislación aplicable con el asesor si el titular no está en España.</Todo>
      </p>
    </>
  );
}

// ───────────── Privacidad ─────────────
function Privacidad({ site, entity, locale }: DocCtx) {
  const es = locale === 'es-ES';
  return (
    <>
      <h2>1. Responsable del tratamiento</h2>
      <EntityCard e={entity} site={site} />
      <p>{entity.dpo ? <>Delegado de protección de datos: {v(entity.dpo)}</> : null}</p>

      <h2>2. Qué datos tratamos y para qué</h2>
      <p>No te pedimos que te registres ni que nos des tu nombre, email o teléfono. Tratamos lo mínimo para funcionar y medir:</p>
      <ul>
        <li>
          <strong>Estadística de uso sin cookies.</strong> Al visitar la página registramos datos técnicos (sitio, país
          aproximado derivado de la IP, idioma, tipo de dispositivo, página de procedencia, etiquetas de campaña como{' '}
          <code>utm</code> o <code>src</code>, y eventos como vistas de oferta, profundidad de scroll y clics). Para
          contar visitantes únicos calculamos un identificador seudónimo con una función resumen (hash) de la IP y del
          navegador combinados con una clave aleatoria que <strong>se destruye cada día</strong>.{' '}
          <strong>La dirección IP completa nunca se guarda.</strong> Pasado el día, el identificador no permite volver a
          reconocerte.
        </li>
        <li>
          <strong>Clics hacia operadores.</strong> Cuando pulsas una oferta, generamos un identificador de clic
          aleatorio (<code>click_id</code>) que viaja en el enlace al operador. Si te registras o depositas, el operador
          puede comunicarnos ese evento (tipo, importe y moneda) asociado al <code>click_id</code>, para calcular la
          comisión de afiliación. <strong>El operador no nos facilita tu nombre, email ni datos de tu cuenta.</strong>
        </li>
        <li>
          <strong>Seguridad.</strong> Registros técnicos del proveedor de alojamiento para prevenir abusos y filtrar
          tráfico automatizado (bots).
        </li>
      </ul>

      <h2>3. Base jurídica</h2>
      <p>
        Interés legítimo (art. 6.1.f del Reglamento (UE) 2016/679, RGPD) en medir de forma agregada el funcionamiento
        del sitio, atribuir las comisiones de afiliación y proteger el servicio. Hemos ponderado ese interés con tu
        privacidad: no usamos cookies de terceros ni píxeles publicitarios, no elaboramos perfiles y el identificador
        caduca cada día. Puedes oponerte en cualquier momento (apartado 6).
      </p>

      <h2>4. Conservación</h2>
      <ul>
        <li>Eventos de uso en bruto: 90 días. Después solo se conservan totales agregados por día, que no identifican a nadie.</li>
        <li>Clics y conversiones asociadas: el tiempo necesario para liquidar comisiones y atender obligaciones contables y fiscales. <Todo>TODO(sergi): fijar plazo con el asesor.</Todo></li>
      </ul>

      <h2>5. Destinatarios y transferencias</h2>
      <p>
        No vendemos datos. Usamos proveedores que tratan datos por cuenta del titular: alojamiento y red de entrega
        (Vercel Inc.) y base de datos (Supabase). Algunos pueden tratar datos fuera del Espacio Económico Europeo, con
        las garantías del RGPD (decisiones de adecuación, como el Marco de Privacidad de Datos UE-EE. UU., o cláusulas
        contractuales tipo). <Todo>TODO(sergi): confirmar región de Supabase y contratos de encargo (DPA) firmados.</Todo>{' '}
        El operador al que llegas desde un enlace es un responsable independiente: su política de privacidad rige
        desde que entras en su web.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo
        a {v(entity.email)}. Como no guardamos datos que te identifiquen directamente, es posible que no podamos asociarte
        a ningún registro; te lo diremos.{' '}
        {es ? (
          <>
            Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la{' '}
            <a href="https://www.aepd.es" {...ext}>
              Agencia Española de Protección de Datos
            </a>
            .
          </>
        ) : (
          <>
            También puedes acudir a la autoridad de protección de datos de tu país. Si te encuentras en México, por
            ejemplo, tienes además los derechos ARCO que reconoce su normativa de datos personales.{' '}
            <Todo>TODO(sergi): revisar con el asesor la autoridad competente en cada país LATAM activo.</Todo>
          </>
        )}
      </p>
      <p>
        Para oponerte a la estadística, activa la señal <em>Global Privacy Control</em> de tu navegador: la respetamos y
        no contamos tus visitas. <Todo>TODO(A4): respetar la cabecera Sec-GPC en el registro de eventos.</Todo>
      </p>

      <h2>7. Menores</h2>
      <p>Este sitio no está dirigido a menores de edad y no tratamos conscientemente sus datos.</p>
    </>
  );
}

// ───────────── Cookies ─────────────
function Cookies({ site }: DocCtx) {
  return (
    <>
      <p>
        {site.brandName} <strong>no usa cookies de terceros, ni de publicidad, ni píxeles de redes sociales</strong>. La
        estadística de visitas funciona sin cookies (ver la <a href="/legal/privacidad">política de privacidad</a>).
        Solo usamos estas cookies propias:
      </p>
      <div className="lg-table" role="region" aria-label="Cookies" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Para qué</th>
              <th>Duración</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>lp_country</code>
              </td>
              <td>Recordar el país que eliges en el selector, para enseñarte las ofertas de ese país.</td>
              <td>1 año</td>
              <td>Técnica de personalización elegida por ti (exenta de consentimiento).</td>
            </tr>
            <tr>
              <td>
                <code>lp_v</code>
              </td>
              <td>Mostrarte siempre la misma versión del diseño mientras comparamos versiones (test A/B).</td>
              <td>90 días</td>
              <td>
                Propia, de análisis. <Todo>TODO(sergi): ver compliance/cookies-aepd.md; en España se recomienda no
                usarla sin consentimiento (o asignar la variante sin cookie).</Todo>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueas <code>lp_country</code>,
        verás las ofertas del país detectado por tu conexión. Al pulsar una oferta saldrás a la web del operador, que
        tiene su propia política de cookies.
      </p>
      <p>Si en el futuro añadimos cookies que necesiten tu consentimiento, te lo pediremos antes de usarlas.</p>
    </>
  );
}

// ───────────── Juego responsable ─────────────
function JuegoResponsable({ country, site }: DocCtx) {
  const m = marketFor(country);
  const name = COUNTRY_NAMES[country];
  const isES = country === 'ES';
  return (
    <>
      <p className="lg-lead">
        Apostar debe ser un entretenimiento, nunca una forma de ganar dinero, recuperar pérdidas o resolver problemas.
        Solo para mayores de {m.minAge} años.
      </p>

      <h2>Pide ayuda{name && m.known ? ` en ${name}` : ''}</h2>
      <ul className="lg-help">
        {m.helpline.url.startsWith('http') && (
          <li>
            <a href={m.helpline.url} {...ext}>
              {m.helpline.name}
            </a>
            {m.helpline.phone && !isES && (
              <>
                {' '}
                · <a href={`tel:${m.helpline.phone.replace(/\s/g, '')}`}>{m.helpline.phone}</a>
              </>
            )}
          </li>
        )}
        {isES && (
          <>
            <li>
              FEJAR (Federación Española de Jugadores de Azar Rehabilitados): <a href="tel:900200225">900 200 225</a> ·{' '}
              <a href="https://www.fejar.org" {...ext}>
                fejar.org
              </a>
            </li>
            <li>
              Autoprohibición en todo el juego online con licencia en España: Registro General de Interdicciones de
              Acceso al Juego (RGIAJ), en la{' '}
              <a href="https://www.ordenacionjuego.es" {...ext}>
                sede de la DGOJ
              </a>
              .
            </li>
          </>
        )}
        {m.regulator && (
          <li>
            Regulador:{' '}
            <a href={m.regulator.url} {...ext}>
              {m.regulator.name}
            </a>
          </li>
        )}
        {!m.helpline.url.startsWith('http') && (
          <li>
            <Todo>TODO(sergi): línea de ayuda oficial para {name ?? 'este país'}.</Todo> Mientras tanto, pide ayuda a un
            profesional sanitario o a una asociación de ayuda al jugador de tu país.
          </li>
        )}
      </ul>

      <h2>Señales de alerta</h2>
      <ul>
        <li>Juegas más dinero o más tiempo del que habías decidido.</li>
        <li>Intentas recuperar lo perdido apostando de nuevo.</li>
        <li>Pides dinero prestado o dejas de pagar cosas para jugar.</li>
        <li>Mientes sobre cuánto juegas o te pones nervioso si no puedes hacerlo.</li>
        <li>El juego te quita tiempo de estudios, trabajo, familia o amigos.</li>
      </ul>

      <h2>Hábitos que ayudan</h2>
      <ul>
        <li>Fija un presupuesto y un tiempo antes de empezar, con las herramientas de límites del operador.</li>
        <li>Juega solo con dinero que te sobre: no es una inversión ni un ingreso.</li>
        <li>No juegues bajo los efectos del alcohol, cansado o para olvidar un mal día.</li>
        <li>Usa la autoexclusión del operador si necesitas parar.</li>
      </ul>

      <h2>Lo que {site.brandName} se compromete a hacer</h2>
      <ul>
        <li>Mostrar solo operadores con licencia en tu país y las condiciones de cada promoción junto a la oferta.</li>
        <li>No prometer ganancias ni presentar los pronósticos como una forma segura de ganar.</li>
        <li>No dirigir la publicidad a menores.</li>
      </ul>
    </>
  );
}

export const DOCS: Record<LegalDoc, (c: DocCtx) => ReactNode> = {
  'aviso-legal': AvisoLegal,
  privacidad: Privacidad,
  cookies: Cookies,
  'juego-responsable': JuegoResponsable,
};
