# FP Ecommerce Challenge

![Angular](https://img.shields.io/badge/Angular-20-dd0031?logo=angular&logoColor=white)
![SSR](https://img.shields.io/badge/SSR-enabled-0f766e)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)

Challenge tecnico frontend de ecommerce construido con Angular 20, SSR y arquitectura escalable. 
Incluye Product Listing Page, Product Detail Page, carrito local, analytics desacoplado, SEO tecnico y responsive design.

## Demo

- Deploy: (https://challenge-frontend-fp.netlify.app/)

## Tecnologias utilizadas

| Tecnologia | Proposito |
| --- | --- |
| Angular 20 | Framework principal, routing y arquitectura moderna |
| Angular SSR | Renderizado en servidor para performance y SEO |
| Standalone Components | Componentizacion sin NgModules |
| Signals API | Estado reactivo y rendering eficiente |
| TailwindCSS | Sistema de estilos utilitario y consistente |
| TypeScript | Tipado estatico y seguridad en build |
| LocalStorage | Persistencia local del carrito |
| SwiperJS (opcional) | Carruseles para cross selling |

## Requisitos del proyecto

- Node.js: 20.x LTS
- npm: 10.x (recomendado)
- Angular CLI: 20.3.x
- TypeScript: 5.9.x

## Instalacion

```bash
git clone https://github.com/ivansho19/fp-ecommerce-challenge.git
cd fp-ecommerce-challenge
npm install
```

### Ejecutar proyecto (dev)

```bash
npm run start
```

### Ejecutar SSR (produccion local)

```bash
npm run build
npm run serve:ssr:fp-ecommerce-challenge
```

### Build de produccion

```bash
npm run build
```

## Scripts disponibles

- `npm run start`: desarrollo con dev server.
- `npm run build`: build de produccion (browser + server SSR).
- `npm run serve:ssr:fp-ecommerce-challenge`: levanta el servidor SSR sobre el build.
- `npm run test`: unit tests con Karma.

## Arquitectura del proyecto

Arquitectura feature-based con componentes standalone.

```
src/
	app/
		core/         # Servicios singleton, analytics, utils globales
		shared/       # UI reusable, pipes, directives, models
		features/     # Dominios (home, product, checkout, cart)
		layout/       # Shell, header, nav, footer
	assets/
	styles.scss
```

## Decisiones tecnicas

- **Angular SSR**: mejora LCP/TTFB, habilita HTML inicial y SEO solido.
- **Signals**: estado predecible, rendering granular y menos re-renders.
- **Feature-based**: escalabilidad por dominio, ownership claro y limites.
- **TailwindCSS**: velocidad de iteracion, consistencia visual y menor CSS runtime.
- **Analytics desacoplado**: trackeo centralizado, sin dependencias UI y con dedupe.

## Performance optimizations

- SSR con salida server para HTML inicial rapido.
- Lazy loading por rutas con `loadChildren` y `loadComponent`.
- Signals y `computed` para minimizar recomputos y rendering.
- Imagenes con `loading="lazy"` en cards y assets optimizados.
- Rendering eficiente con trackBy y estructuras simples de plantilla.

## Escalabilidad

- Soporte multi-marca mediante theming por design tokens y configuracion externa.
- Componentes UI reutilizables y desacoplados del dominio.
- Separacion de responsabilidades por feature y servicios core.
- Capas claras: datos, UI, dominio y layout.

## SEO tecnico

- SSR para HTML inicial indexable.
- HTML semantico y jerarquia de headings.
- Metadatos dinamicos en rutas (title por feature).
- Preparado para Open Graph y canonical URLs.

## Analytics

- Eventos `view_item` y `add_to_cart` con formato ecommerce.
- `dataLayer.push` centralizado en `AnalyticsService`.
- Dedupe de eventos en SPA con memoria interna.
- Safe guard SSR para evitar acceso a `window` en server.

## Responsive design

- Mobile-first y layout adaptativo.
- Grillas responsivas por breakpoints.
- Reorganizacion de contenido en header y cards.


## Core Web Vitals

| Metrica | Objetivo | Estado |
| --- | --- | --- |
| LCP | < 2.5s | TODO |
| INP | < 200ms | TODO |
| CLS | < 0.1 | TODO |

## Deploy

- Build SSR: `npm run build`
- Node server: `npm run serve:ssr:fp-ecommerce-challenge`
- Plataformas recomendadas: Vercel (SSR), Render, AWS ECS/Beanstalk.

## Convenciones de codigo

- Standalone components y routing lazy por feature.
- Tipado estricto en modelos de dominio.
- Estilos en SCSS + Tailwind utilities.
- Prettier configurado con `printWidth: 100`.

## Preguntas obligatorias del challenge

**Que decisiones tomaste para mejorar la performance en esta pagina?**

Respuesta : He decidido usar SSR para entregar HTML inicial con mejor TTFB/LCP, rutas lazy para reducir el bundle inicial y Signals para optimizar renderizado. Adicionalmente, se aplico `loading="lazy"` en imagenes y trackBy en listados para evitar re-render innecesario.

**Como estructurarias esta solucion para soportar multiples marcas con diferentes estilos?**

Respuesta : Separaría la solución en una base funcional compartida y una capa de theming por marca. Utilizaría design tokens (colores, tipografías, spacing y assets) consumidos mediante Tailwind y CSS variables, permitiendo que cada marca defina su identidad visual sin afectar la lógica del negocio.

**Si esta pagina presenta problemas de LCP en produccion, como lo abordarias?**

Respuesta : Mediria LCP por ruta espeficica he identificaria el elemento LCP (imagen o card) tambien buscaria optimizar el tamaño y formato (AVIF/WebP) agregando el preloading selectivo y revisaria SSR/streaming. 

**Como evitaria que eventos de Analytics se disparen multiples veces en una SPA?**

Respuesta : Centralizando el trackeo en un servicio por clave (evento + item_id) y disparando los eventos en puntos independientes tales como (routing/resolvers o effects controlados) evitando suscripciones duplicadas.

**Que consideraciones SEO tendrias en cuenta para esta pagina en un entorno real?**

Respuesta : Tendría en cuenta principalmente que la página sea fácilmente indexable y rápida para el usuario implementando SSR para mejorar la carga inicial y el posicionamiento en buscadores, utilizaría HTML semántico y metadata dinamica por producto (titulo, descripción e imagen), tambien utilizaria la jerarquía correcta de encabezados, URLs amigables y una buena performance general para mantener una experiencia de usuario fluida tanto en desktop como en mobile (Responsive).

