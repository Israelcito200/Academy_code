# Academia Código — Sitio Web Empresarial

Sitio web informativo de **Academia Código**, una institución educativa online que forma profesionales en desarrollo web, backend, cloud, datos, ciberseguridad, diseño, movilidad, marketing digital y habilidades profesionales.

Desarrollado **exclusivamente con HTML5 y CSS3**, sin JavaScript, frameworks, WordPress ni constructores visuales, para desplegarse en **Azure App Service (Web App)** conectado a este repositorio de GitHub.

## Identidad de la empresa

- **Nombre:** Academia Código
- **Rubro:** Institución educativa (escuela online de tecnología)
- **Eslogan:** "Fórmate como profesional Tech, sin salir de casa"
- **Propuesta de valor:** más de 40 cursos con mentoría real, proyectos prácticos y acompañamiento hasta conseguir empleo.

## Estructura del proyecto

```
LandingPage/
├── index.html          # Página de inicio
├── nosotros.html        # Historia, misión, visión, valores y equipo
├── servicios.html        # Catálogo de 40 cursos organizados por categoría
├── contacto.html          # Dirección, teléfono, correo, horarios, formulario y mapa
├── web.config              # Configuración de IIS/Azure App Service (documento por defecto)
├── assets/
│   └── css/
│       └── style.css      # Hoja de estilos única del sitio (Flexbox, Grid, media queries)
└── README.md
```

Las imágenes de cada curso, el banner y la foto de equipo se descargaron de Internet (Openverse / Wikimedia Commons, licencias Creative Commons) y se guardaron localmente en `assets/img/servicios/`, eligiendo en cada caso una foto acorde al tema del curso. Los avatares del equipo en `nosotros.html` se cargan desde `i.pravatar.cc`. Ver `assets/img/servicios/CREDITOS.md` para la atribución de cada imagen.

## Requisitos técnicos cumplidos

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`, `details`/`summary`).
- CSS3 con selectores de etiqueta, clase e ID, Flexbox y CSS Grid, modelo de caja, márgenes/rellenos, bordes y sombras, pseudoclases (`:hover`, `:checked`).
- Menú de navegación responsivo funcional sin JavaScript (técnica de casilla oculta `#nav-toggle`).
- Diseño adaptable mediante media queries (`max-width: 980px` y `max-width: 760px`).
- Texto alternativo (`alt`) en todas las imágenes.
- Enlaces correctos entre las cuatro páginas y el pie de página.
- Formulario de contacto únicamente visual (sin backend ni JavaScript).

## Despliegue en Azure App Service

1. Sube este repositorio a GitHub (rama `main`).
2. En el [Azure Portal](https://portal.azure.com), crea un recurso **App Service (Web App)**:
   - Publicar: **Código**.
   - Pila en tiempo de ejecución: cualquiera que sirva HTML estático (por ejemplo, .NET o Node.js; no se ejecuta código de servidor).
   - Sistema operativo: Windows o Linux, según preferencia del grupo.
3. En el recurso creado, entra a **Centro de implementación (Deployment Center)** y selecciona **GitHub** como origen.
4. Autoriza el acceso, elige la organización, el repositorio y la rama `main`.
5. Azure generará automáticamente un flujo de trabajo de GitHub Actions en `.github/workflows/` que compilará y desplegará el sitio en cada `push`.
6. Verifica el sitio publicado en la URL pública que Azure asigna al Web App (`https://<nombre-app>.azurewebsites.net`).

## Empresa y contenido

El contenido (historia, equipo, cursos y datos de contacto) es ficticio y fue creado con fines académicos para esta actividad.
