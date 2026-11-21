# Para Lisssss — Detalle de tesis

Página estática (solo frontend) para felicitar a Lisbeth por su tesis aprobada.

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub / GitLab / Bitbucket (o despliegue manual)
- Node.js no es obligatorio para el sitio; Vercel sirve los archivos estáticos tal cual

## Estructura

```
detalle-daysi/
├── index.html
├── styles.css
├── app.js
├── photos/
└── music/
```

## Desplegar en Vercel (recomendado: desde Git)

### 1. Subir el proyecto a GitHub

Si aún no está en un remoto:

```bash
git init
git add .
git commit -m "Detalle para Lisssss"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 2. Importar en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión.
2. Clic en **Add New… → Project**.
3. Elegí **Import** del repositorio donde está este proyecto.
4. Configuración del proyecto:
   - **Framework Preset:** `Other` (o dejar que lo detecte como sitio estático)
   - **Root Directory:** `.` (raíz del repo)
   - **Build Command:** dejar vacío
   - **Output Directory:** dejar vacío (o `.`)
5. Clic en **Deploy**.

### 3. Listo

Cuando termine el deploy, Vercel te da una URL tipo:

`https://tu-proyecto.vercel.app`

Cada `git push` a `main` vuelve a desplegar automáticamente.

## Desplegar con Vercel CLI (alternativa)

```bash
npm i -g vercel
cd detalle-daysi
vercel
```

Para producción:

```bash
vercel --prod
```

## Notas importantes

- Los archivos de `photos/` y `music/` deben ir en el repo (o en el deploy). Sin ellos, faltan imágenes y audio.
- El audio solo se reproduce **después de un clic** (elección de canción), como exigen los navegadores.
- Para probar en local:

```bash
npx serve .
```

Luego abrí `http://localhost:3000` (o el puerto que indique la terminal).

## Personalización rápida

| Qué | Dónde |
|-----|--------|
| Textos | `index.html` |
| Estilos / colores | `styles.css` |
| Canciones | carpeta `music/` + lista en `app.js` |
| Fotos | carpeta `photos/` + rutas en `index.html` |
