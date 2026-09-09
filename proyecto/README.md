# Entregas diarias — Imágenes & HTML

## Por qué se borraba tu avance

`window.storage` (lo que usaba la primera versión) solo existe dentro del entorno
de Claude.ai. Al subirlo a Netlify ese objeto no existe, así que cada recarga
partía de cero. Esta versión usa una base de datos real:
**Netlify Blobs**, incluida gratis en cualquier sitio de Netlify — no necesitas
crear cuenta en otro servicio.

## Estructura del proyecto

```
proyecto/
├── netlify.toml              → configuración de Netlify (carpetas de build)
├── package.json              → dependencia de la base de datos (@netlify/blobs)
├── public/
│   └── index.html            → tu tracker (frontend, sin cambios de diseño)
└── netlify/
    └── functions/
        └── entries.js        → la "base de datos": guarda y lee tu registro
```

El frontend (`public/index.html`) ya no guarda nada en el navegador. Cada vez
que agregas o editas una entrega llama a `/api/entries`, que lee/escribe en
Netlify Blobs. Así el registro vive en el servidor, no en tu navegador, y
sobrevive a recargas, otros dispositivos, etc.

## Cómo desplegarlo

**Importante:** para que la función (`entries.js`) funcione, el sitio necesita
desplegarse con el proceso normal de Netlify (Git o CLI) — un simple
arrastrar-y-soltar de la carpeta `public` a Netlify Drop **no** instala la
dependencia `@netlify/blobs` ni activa la función.

### Opción A — Netlify CLI (la más rápida, sin usar Git)

1. Instala la CLI una sola vez: `npm install -g netlify-cli`
2. Dentro de la carpeta `proyecto/`, corre: `npm install`
3. Inicia sesión: `netlify login`
4. Despliega a producción: `netlify deploy --prod`
   - Cuando te pregunte "Publish directory", pon `public`
   - Cuando te pregunte "Functions directory", pon `netlify/functions`

### Opción B — Conectar un repositorio de Git (recomendado si vas a seguir editando)

1. Sube la carpeta `proyecto/` completa a un repositorio (GitHub, GitLab, etc.)
2. En Netlify: **Add new site → Import an existing project** y elige el repo
3. Netlify detecta automáticamente `netlify.toml` — no necesitas tocar nada
   en la configuración de build
4. Deploy. Listo.

## Probarlo en tu computadora antes de subirlo

```
npm install
netlify dev
```

Esto levanta el sitio completo (frontend + función) en `http://localhost:8888`
con la base de datos funcionando igual que en producción.

## Notas

- Los datos de `netlify/functions/entries.js` se guardan en un "store" llamado
  `gantt-tec`. Si algún día quieres reiniciar todo el registro desde cero,
  puedes borrarlo desde el panel de Netlify: **Site → Blobs**.
- Si ves el mensaje "No se pudo conectar con la base de datos" en la parte de
  arriba del sitio, casi siempre significa que el sitio se desplegó sin correr
  `npm install` (revisa que `@netlify/blobs` esté en las dependencias del
  deploy) o que se subió sin usar Netlify Functions.
