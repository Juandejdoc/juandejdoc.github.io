# Documentación Técnica - Planeta SAS ESP

## Sitio Web Corporativo

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Desarrollado para:** Planeta SAS ESP

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Funcionalidades por Página](#funcionalidades-por-página)
5. [Sistema de Animaciones](#sistema-de-animaciones)
6. [Formulario de Contacto](#formulario-de-contacto)
7. [SEO y Accesibilidad](#seo-y-accesibilidad)
8. [Mantenimiento y Actualizaciones](#mantenimiento-y-actualizaciones)
9. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 1. Introducción

### 1.1 Descripción General

El sitio web de Planeta SAS ESP es una plataforma corporativa moderna diseñada para presentar los servicios ambientales de la empresa, facilitar el contacto con clientes potenciales y proporcionar información detallada sobre sus soluciones de saneamiento y gestión de residuos.

### 1.2 Características Principales

- **Diseño Responsive:** Adaptado para dispositivos móviles, tablets y escritorio
- **Animaciones Fluidas:** Implementadas con GSAP y ScrollTrigger
- **Modelos 3D Interactivos:** Visualización de equipos usando Three.js
- **Formulario de Contacto:** Integrado con EmailJS para envío automático de correos
- **SEO Optimizado:** Meta tags, structured data (Schema.org) y sitemap
- **Accesibilidad:** Cumple con estándares WCAG 2.1

---

## 2. Estructura del Proyecto

### 2.1 Organización de Archivos

```
Planeta_page/
├── Contactanos/              # Página de contacto
│   ├── Contactanos.html      # Página principal de contacto
│   ├── Contactanos.css       # Estilos específicos
│   ├── Contactanos.js        # Lógica del formulario
│   └── TratamientoDatos.html  # Política de privacidad
│
├── Inicio/                   # Página principal
│   ├── Index.html            # Homepage
│   ├── Inicio.Css            # Estilos del inicio
│   ├── inicio.js             # Animaciones y efectos
│   ├── Hojas/                # Animación 3D de hojas
│   │   ├── Hojas.js          # Lógica de animación 3D
│   │   └── Modelo/           # Modelos 3D (GLTF)
│   └── Recursos_Inicio/      # Imágenes, videos, SVG
│
├── QuienesSomos/             # Página "Acerca de"
│   ├── QuienesSomos.html
│   ├── QuienesSomos.css
│   └── Recursos/             # Imágenes y certificaciones
│
├── Servicios/                # Sección de servicios
│   ├── Servicios.html        # Página índice de servicios
│   ├── Servicios.css
│   ├── Servicios.js          # Lógica de navegación móvil
│   ├── Especificos/          # Páginas individuales de servicios
│   │   ├── AguasResiduales.html
│   │   ├── Compostaje.html
│   │   ├── Tanques.html
│   │   ├── PozosYTrampas.html
│   │   ├── Lodos.html
│   │   ├── Redes.html
│   │   ├── ResiduosPeligrosos.html
│   │   ├── ServiciosComplementarios.html
│   │   ├── Transporte.html
│   │   ├── Transporte.js      # Visualizador 3D de vehículos
│   │   └── Especificos.css
│   └── Recursos/             # Imágenes de servicios
│
├── Preguntas_Frecuentes/     # FAQ
│   ├── PreguntasFrecuentes.html
│   ├── PreguntasFrecuentes.css
│   └── PreguntasFrecuentes.js # Sistema de tabs deslizantes
│
├── Partials/                 # Componentes reutilizables
│   ├── header.html           # Navegación principal
│   ├── footer.html           # Pie de página
│   └── partials.js           # Inyección dinámica de componentes
│
├── Styles/                   # Estilos globales
│   ├── Layout.css            # Layout base, header, footer
│   ├── Componenetes.css      # Componentes reutilizables
│   └── Maridajes.css         # Utilidades y helpers
│
├── Java_scripts/             # Scripts globales
│   └── Main.js               # Sistema de animaciones con GSAP
│
├── draco/                    # Compresor 3D para modelos GLTF
│
├── sitemap.xml               # Mapa del sitio para SEO
├── robots.txt                # Directivas para buscadores
├── vite.config.js            # Configuración del build tool
└── package.json              # Dependencias del proyecto
```

### 2.2 Páginas Principales

| Página                   | Ruta                                             | Descripción                                               |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------- |
| **Inicio**               | `/Inicio/Index.html`                             | Página principal con hero, servicios destacados y proceso |
| **Quiénes Somos**        | `/QuienesSomos/QuienesSomos.html`                | Información corporativa y certificaciones                 |
| **Servicios**            | `/Servicios/Servicios.html`                      | Índice de todos los servicios                             |
| **Contacto**             | `/Contactanos/Contactanos.html`                  | Formulario de contacto y ubicación                        |
| **FAQ**                  | `/Preguntas_Frecuentes/PreguntasFrecuentes.html` | Preguntas frecuentes organizadas por categorías           |
| **Tratamiento de Datos** | `/Contactanos/TratamientoDatos.html`             | Política de privacidad                                    |

### 2.3 Páginas de Servicios Específicos

Cada servicio tiene su propia página con información detallada:

1. **Aguas Residuales** - Tratamiento de aguas residuales
2. **Compostaje** - Gestión de residuos orgánicos
3. **Tanques** - Lavado y desinfección de tanques
4. **Pozos y Trampas** - Mantenimiento de pozos sépticos
5. **Lodos** - Deshidratación de lodos
6. **Redes** - Sondeo e inspección de redes
7. **Residuos Peligrosos** - Manejo de residuos peligrosos
8. **Servicios Complementarios** - Servicios adicionales
9. **Transporte** - Transporte especializado (con visualizador 3D)

---

## 3. Tecnologías Utilizadas

### 3.1 Frontend

#### HTML5

- Estructura semántica con elementos `<main>`, `<section>`, `<nav>`, `<article>`
- Atributos de accesibilidad (ARIA labels, roles)
- Meta tags para SEO y Open Graph

#### CSS3

- **Variables CSS** para colores y espaciado
- **Grid Layout** para estructuras complejas
- **Flexbox** para alineación
- **Media Queries** para diseño responsive
- **Animaciones CSS** para transiciones suaves

#### JavaScript (ES6+)

- **Vanilla JavaScript** (sin frameworks)
- **Módulos ES6** para organización del código
- **Async/Await** para operaciones asíncronas

### 3.2 Librerías y Frameworks

#### GSAP (GreenSock Animation Platform)

- **Versión:** 3.x
- **Uso:** Animaciones de scroll, textos y elementos
- **Plugins:**
  - `ScrollTrigger` - Animaciones basadas en scroll
  - Animaciones de entrada/salida de elementos

#### Three.js

- **Versión:** 0.160.0 / 0.174.0
- **Uso:** Visualización 3D de modelos GLTF
- **Características:**
  - Modelos de vehículos en página de Transporte
  - Animación de hojas en la página de inicio
  - Carga con DRACO para compresión

#### EmailJS

- **Versión:** 4.x
- **Uso:** Envío de formularios sin backend
- **Configuración:**
  - Service ID: `default_service`
  - Template ID: `template_0oigv73`
  - Public Key: `KK0TiUAMfr7fRo_Jy`

#### Vite

- **Versión:** 6.2.2
- **Uso:** Build tool y servidor de desarrollo
- **Características:**
  - Hot Module Replacement (HMR)
  - Optimización de assets
  - Source maps para debugging

### 3.3 Fuentes e Iconos

#### Google Fonts

- **Montserrat** (600, 700) - Títulos
- **Work Sans** (400, 500) - Texto general

#### RemixIcon

- **Versión:** 4.3.0
- Iconos SVG para interfaz

---

## 4. Funcionalidades por Página

### 4.1 Página de Inicio (`/Inicio/Index.html`)

#### Secciones Principales

**1. Hero Section**

- Imagen de fondo con overlay
- Título animado con texto rotativo
- Botón CTA "Contáctanos ahora"
- Animación 3D de hojas (Three.js)

**2. Nuestro Proceso**

- Video explicativo del proceso
- Descripción paso a paso

**3. Servicios Destacados**

- Grid de tarjetas con servicios principales
- Enlaces a páginas específicas de cada servicio
- Animaciones al hacer scroll

**4. Características**

- Iconos con descripciones
- Grid responsive

**5. Clientes**

- Carrusel de logos de clientes
- Animación horizontal continua

**6. ¿Quiénes Somos?**

- Video de fondo
- Texto descriptivo con animación SplitText
- Botón a página completa

**7. Servicios en el Inicio**

- Cards con servicios principales
- Scroll horizontal en móvil

**8. Contacto Final**

- CTA final para contacto

#### Funcionalidades JavaScript

**Archivo:** `Inicio/inicio.js`

- **Scroll Stack:** Sistema de scroll horizontal para servicios en móvil
- **Rotating Text:** Texto que cambia dinámicamente en el hero
- **Animación 3D:** Carga y animación de modelo GLTF de hojas
- **ScrollTrigger:** Animaciones basadas en posición de scroll

### 4.2 Página de Servicios (`/Servicios/Servicios.html`)

#### Funcionalidad Principal

**Navegación Móvil Inteligente**

- En móvil: Sistema que marca el servicio activo según posición de scroll
- En desktop: Navegación estándar
- Breakpoint: 1024px

**Archivo:** `Servicios/Servicios.js`

```javascript
// Detecta qué servicio está en el 40% de la pantalla
// Marca ese servicio como activo
// Solo funciona en pantallas menores a 1024px
```

#### Estructura

- Lista de servicios con descripciones
- Enlaces a páginas específicas
- Imágenes representativas

### 4.3 Páginas de Servicios Específicos

#### Estructura Común

1. **Hero Section**

   - Imagen grande del servicio
   - Título y descripción breve
   - Animaciones de entrada

2. **Sección de Detalles**

   - Cards con información específica
   - Imágenes ilustrativas
   - Texto descriptivo

3. **Schema.org Service**
   - Datos estructurados para SEO
   - Información del proveedor
   - Área de servicio

#### Página Especial: Transporte

**Archivo:** `Servicios/Especificos/Transporte.js`

**Características:**

- **Visualizador 3D Interactivo**
  - Modelos GLTF de vehículos
  - Cámara orbitable (OrbitControls)
  - Sistema de tabs para cambiar modelos
  - Barra de progreso de carga
  - Captions descriptivos

**Modelos Disponibles:**

1. Camión de vacío
2. Roll On
3. Vactor
4. Redes

**Tecnologías:**

- Three.js para renderizado 3D
- DRACO para compresión de modelos
- Post-processing para efectos visuales

### 4.4 Página de Contacto (`/Contactanos/Contactanos.html`)

#### Funcionalidades

**1. Formulario de Contacto**

- Validación en tiempo real
- Envío mediante EmailJS
- Feedback visual al usuario
- Modal de éxito

**2. Información de Contacto**

- Direcciones físicas
- Teléfonos
- Email

**3. Mapa/Ubicación**

- Información de ubicación de planta y oficina

#### Sistema de Formulario

**Archivo:** `Contactanos/Contactanos.js`

**Características:**

- Validación de campos (nombre, email, teléfono, mensaje)
- Mensajes de error en tiempo real
- Estados del botón (Enviar → Enviando... → Enviado)
- Manejo de errores de conexión
- Reset automático después de envío exitoso

**Validaciones:**

- Email: Formato válido
- Teléfono: 10 dígitos
- Nombre: Obligatorio
- Mensaje: Obligatorio
- Consentimiento: Requerido

### 4.5 Página de Preguntas Frecuentes (`/Preguntas_Frecuentes/PreguntasFrecuentes.html`)

#### Sistema de Navegación

**Archivo:** `Preguntas_Frecuentes/PreguntasFrecuentes.js`

**Características:**

- **Sistema de Tabs Deslizantes**
  - 3 categorías: Servicios y Cobertura, Procesos y Contratación, Normativas y Respaldo
  - Transición suave entre categorías
  - Ajuste automático de altura
  - Cierre automático de detalles al cambiar de tab

**Funcionamiento:**

1. Botones superiores cambian la vista
2. Cada categoría es un "slide" que se desliza horizontalmente
3. La altura del contenedor se ajusta automáticamente
4. Los `<details>` abiertos se cierran al cambiar de categoría

**Accesibilidad:**

- `aria-controls` en botones
- `aria-pressed` para estado activo
- `role="group"` en slides

### 4.6 Página Quiénes Somos (`/QuienesSomos/QuienesSomos.html`)

#### Contenido

- Historia y misión de la empresa
- Certificaciones ISO (14001, 45001, 9001)
- Licencias y permisos
- Valores corporativos
- Imágenes de la planta

---

## 5. Sistema de Animaciones

### 5.1 GSAP y ScrollTrigger

**Archivo Principal:** `Java_scripts/Main.js`

#### Sistema de Animaciones de Texto

**Atributos HTML para Animación:**

```html
<div
  data-anim
  data-anim-from="down"
  data-anim-distance="100"
  data-anim-delay="400ms"
>
  Contenido a animar
</div>
```

**Atributos Disponibles:**

- `data-anim` - Activa la animación
- `data-anim-from` - Dirección: `"down"`, `"up"`, `"left"`, `"right"`
- `data-anim-distance` - Distancia en píxeles
- `data-anim-delay` - Retraso: `"400ms"`, `"0.5s"`, `"800"` (ms)

**Funcionamiento:**

1. Detecta elementos con `data-anim`
2. Crea un IntersectionObserver
3. Anima cuando el elemento entra en viewport
4. Usa GSAP para animaciones suaves

#### Sistema de Scroll Stack

**Uso:** Scroll horizontal en sección de servicios (móvil)

**Archivo:** `Inicio/inicio.js`

**Características:**

- Detecta cuando el usuario entra en la sección
- Cambia el comportamiento de scroll a horizontal
- Permite navegar entre cards con scroll horizontal
- Restaura scroll vertical al salir

### 5.2 Animación 3D de Hojas

**Archivo:** `Inicio/Hojas/Hojas.js`

**Tecnologías:**

- Three.js
- Post-processing (efectos visuales)
- GLTF Loader
- DRACO Loader

**Características:**

- Modelo 3D de hojas que reacciona al movimiento del mouse
- Efectos de blur radial
- Vignette effect
- Desactivado automáticamente en dispositivos táctiles

### 5.3 Header Dinámico

**Archivo:** `Partials/partials.js`

**Funcionalidades:**

1. **Inyección Dinámica**

   - Carga header y footer desde archivos HTML
   - Inyección asíncrona al cargar la página

2. **Variantes de Header**

   - `on-dark`: Header claro sobre fondo oscuro
   - `on-light`: Header oscuro sobre fondo claro
   - Cambio automático según sección visible

3. **Swap de Logo**

   - Cambio suave (fade) entre logo claro y oscuro
   - Basado en la sección visible

4. **Marcado de Enlace Activo**

   - Resalta el enlace de la página actual
   - Basado en la URL

5. **Scroll Detection**
   - Agrega clase `is-scrolled` cuando hay scroll
   - Para estilos condicionales

---

## 6. Formulario de Contacto

### 6.1 Estructura del Formulario

**Archivo:** `Contactanos/Contactanos.html`

**Campos:**

1. **Nombre y Apellido** (`nombre`)

   - Tipo: `text`
   - Requerido: Sí
   - Validación: No vacío

2. **Email** (`email`)

   - Tipo: `email`
   - Requerido: Sí
   - Validación: Formato de email válido

3. **Teléfono** (`telefono`)

   - Tipo: `tel`
   - Requerido: Sí
   - Validación: 10 dígitos

4. **Mensaje** (`mensaje`)

   - Tipo: `textarea`
   - Requerido: Sí
   - Validación: No vacío

5. **Consentimiento de Datos** (`datos-consent`)
   - Tipo: `checkbox`
   - Requerido: Sí
   - Enlace a política de tratamiento

### 6.2 Sistema de Validación

**Archivo:** `Contactanos/Contactanos.js`

#### Validación en Tiempo Real

**Eventos:**

- `blur`: Valida cuando el usuario sale del campo
- `input`: Valida mientras el usuario escribe (para limpiar errores)

**Estados de Validación:**

- `aria-invalid="false"` - Campo válido
- `aria-invalid="true"` - Campo inválido
- `aria-required="true"` - Campo obligatorio

**Mensajes de Error:**

- Aparecen debajo de cada campo
- Color rojo (#ff5757)
- Fuente: Work Sans, 600 weight

### 6.3 Envío del Formulario

#### Proceso de Envío

1. **Validación Completa**

   - Verifica todos los campos
   - Muestra errores si hay campos inválidos

2. **Estado de Carga**

   - Botón cambia a "Enviando..."
   - Botón se deshabilita
   - Spinner visual (opcional)

3. **Envío a EmailJS**

   - Inicializa EmailJS con public key
   - Envía datos al template configurado
   - Espera respuesta

4. **Manejo de Respuesta**

   **Éxito:**

   - Muestra modal de éxito
   - Resetea el formulario
   - Restaura estado del botón

   **Error:**

   - Muestra mensaje de error
   - Distingue entre error de conexión y error de envío
   - Permite reintentar

#### Configuración EmailJS

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "KK0TiUAMfr7fRo_Jy",
  SERVICE_ID: "default_service",
  TEMPLATE_ID: "template_0oigv73",
};
```

**Nota:** La public key está expuesta en el código (es segura para uso público según EmailJS).

### 6.4 Modal de Éxito

**Características:**

- Aparece después de envío exitoso
- Icono de check (RemixIcon)
- Mensaje de confirmación
- Botón de cierre (X)
- Cierre con:
  - Click en X
  - Click fuera del modal
  - Tecla Escape
- Focus trap para accesibilidad
- Bloqueo de scroll del body

---

## 7. SEO y Accesibilidad

### 7.1 Optimización SEO

#### Meta Tags

**Cada página incluye:**

- `<title>` - Título único y descriptivo
- `<meta name="description">` - Descripción de 150-160 caracteres
- `<meta name="keywords">` - Palabras clave relevantes
- `<link rel="canonical">` - URL canónica única

#### Open Graph y Twitter Cards

**Meta tags para redes sociales:**

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="URL completa" />
<meta property="og:title" content="Título" />
<meta property="og:description" content="Descripción" />
<meta property="og:image" content="URL de imagen" />
```

**Implementado en:**

- Todas las páginas principales
- Todas las páginas de servicios específicos

#### Structured Data (Schema.org)

**1. Organization Schema**

- Presente en todas las páginas
- Incluye: nombre, URL, logo, redes sociales

**2. Service Schema**

- Presente en todas las páginas de servicios específicos
- Incluye:
  - Tipo de servicio
  - Proveedor (con dirección, teléfono, email)
  - Área de servicio
  - Descripción

**3. FAQPage Schema**

- Presente en página de Preguntas Frecuentes
- Incluye todas las preguntas y respuestas estructuradas

**4. LocalBusiness Schema**

- Presente en footer y página de contacto
- Incluye: email, teléfonos, dirección

#### Sitemap y Robots.txt

**sitemap.xml:**

- Lista todas las páginas del sitio
- Prioridades asignadas (1.0 para homepage, 0.9 para páginas principales)
- Frecuencia de actualización sugerida
- Última fecha de modificación

**robots.txt:**

- Permite indexación de páginas HTML
- Bloquea archivos técnicos (JS, CSS, node_modules)
- Referencia al sitemap

### 7.2 Accesibilidad (WCAG 2.1)

#### Navegación por Teclado

**Skip Link:**

- Enlace "Saltar al contenido principal" al inicio de cada página
- Visible solo al recibir foco (Tab)
- Permite saltar navegación

**Focus Management:**

- Indicadores de foco visibles
- Orden lógico de tabulación
- Focus trap en modales

#### ARIA Attributes

**Implementados:**

- `aria-label` - Etiquetas descriptivas
- `aria-required` - Campos obligatorios
- `aria-invalid` - Estado de validación
- `aria-describedby` - Referencia a mensajes de error
- `aria-live` - Regiones que anuncian cambios
- `role="dialog"` - Modales
- `aria-modal="true"` - Modales
- `aria-hidden` - Elementos decorativos

#### Semántica HTML

- Uso correcto de `<main>`, `<section>`, `<nav>`, `<article>`
- Jerarquía de encabezados (h1 → h2 → h3)
- Etiquetas `<label>` para todos los inputs
- Textos alternativos en todas las imágenes

#### Contraste de Colores

- Cumple con ratio 4.5:1 para texto normal
- Cumple con ratio 3:1 para texto grande

#### Prefers Reduced Motion

**Implementado en:** `Styles/Componenetes.css`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Respeto por la preferencia del usuario de reducir animaciones.

---

## 8. Mantenimiento y Actualizaciones

### 8.1 Actualizar Contenido

#### Textos

**Páginas HTML:**

- Editar directamente los archivos `.html`
- Buscar el texto a cambiar
- Actualizar manteniendo la estructura HTML

**Ejemplo - Cambiar título:**

```html
<!-- Antes -->
<h1>Servicio de Aguas Residuales</h1>

<!-- Después -->
<h1>Tratamiento de Aguas Residuales</h1>
```

#### Imágenes

**Reemplazar Imagen:**

1. Colocar nueva imagen en la carpeta correspondiente
2. Actualizar la ruta en el HTML:

```html
<img src="/Servicios/Recursos/AguasResiduales/nueva-imagen.jpg" alt="..." />
```

**Agregar Nueva Imagen:**

1. Subir imagen a la carpeta de recursos
2. Optimizar imagen (recomendado: WebP, comprimida)
3. Agregar al HTML con atributos:
   - `alt` - Descripción
   - `width` y `height` - Dimensiones
   - `loading="lazy"` - Carga diferida

#### Videos

**Reemplazar Video:**

1. Colocar nuevo video en `/Inicio/Recursos_Inicio/Videos/`
2. Actualizar ruta en HTML:

```html
<video src="Recursos_Inicio/Videos/nuevo-video.mp4"></video>
```

**Recomendaciones:**

- Formato: MP4 (H.264)
- Resolución: 1080p máximo
- Duración: Corta (30-60 segundos)
- Tamaño: Comprimir antes de subir

### 8.2 Actualizar Información de Contacto

#### Teléfonos y Email

**Footer:** `Partials/footer.html`

```html
<a href="mailto:info@planetaesp.com" itemprop="email">
  <p>info@planetaesp.com</p>
</a>
<p>3104415734 - 3005259767</p>
```

**Página de Contacto:** `Contactanos/Contactanos.html`

```html
<p itemscope itemtype="https://schema.org/LocalBusiness">info@planetaesp.com</p>
<p>3104415734 - 3005259767</p>
```

**Nota:** Actualizar en ambos lugares para consistencia.

#### Direcciones

**Footer:** `Partials/footer.html`

```html
<p>
  Planta: Vereda Barro blanco Vía Bojaca. Finca el Rancho. Mosquera
  Cundinamarca.
</p>
<p>Oficina Principal: Kilómetro 1 más 800 Via- Madrid - Puente Piedra.</p>
```

**Página de Contacto:** `Contactanos/Contactanos.html`

- Actualizar en la sección "Visítanos"

### 8.3 Agregar Nuevo Servicio

#### Pasos:

1. **Crear archivo HTML**

   - Copiar estructura de un servicio existente
   - Ubicación: `/Servicios/Especificos/NuevoServicio.html`

2. **Actualizar contenido**

   - Título, descripción, imágenes
   - Mantener estructura de secciones

3. **Agregar Schema.org Service**

   ```html
   <script type="application/ld+json">
     {
       "@context": "https://schema.org",
       "@type": "Service",
       "serviceType": "Nombre del Servicio",
       "provider": {
         /* ... */
       },
       "description": "..."
     }
   </script>
   ```

4. **Agregar a sitemap.xml**

   ```xml
   <url>
     <loc>https://www.planetaesp.com/Servicios/Especificos/NuevoServicio.html</loc>
     <lastmod>2025-01-27</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.8</priority>
   </url>
   ```

5. **Agregar enlace en página de Servicios**

   - Agregar card en `/Servicios/Servicios.html`

6. **Agregar Open Graph tags**
   - Meta tags para compartir en redes sociales

### 8.4 Actualizar Preguntas Frecuentes

**Archivo:** `Preguntas_Frecuentes/PreguntasFrecuentes.html`

#### Agregar Nueva Pregunta

1. **Encontrar la categoría correcta:**

   - `ServiciosYCovertura`
   - `ProcesosYContratacion`
   - `NormativasYRespaldo`

2. **Agregar estructura:**

```html
<li class="PreguntasFrecuentes__Item">
  <details>
    <summary>
      ¿Nueva pregunta?
      <span class="faq-btn" aria-hidden="true">
        <span class="faq-ico"></span>
      </span>
    </summary>
    <div class="faq-wrap">
      <div class="faq-body">
        <p class="lead">Respuesta a la pregunta...</p>
      </div>
    </div>
  </details>
</li>
```

3. **Actualizar Schema.org FAQPage**
   - Agregar pregunta y respuesta al JSON-LD

### 8.5 Actualizar Clientes

**Archivo:** `Inicio/Index.html`

**Ubicación:** Sección "Clientes" (línea ~575)

**Agregar Nuevo Cliente:**

```html
<li class="ClienteImg">
  <img
    src="Recursos_Inicio/Imagenes/Clientes/NuevoCliente.png"
    alt="Cliente Planeta: Nombre Cliente"
    width="XXX"
    height="XXX"
    loading="lazy"
    decoding="async"
  />
</li>
```

**Requisitos:**

- Imagen en formato PNG o JPG
- Tamaño recomendado: Ancho máximo 500px
- Fondo transparente (PNG) o fondo blanco
- Agregar a carpeta `/Inicio/Recursos_Inicio/Imagenes/Clientes/`

### 8.6 Actualizar Sitemap

**Archivo:** `sitemap.xml`

**Cuando actualizar:**

- Agregar nueva página
- Modificar contenido importante
- Cambiar estructura de URLs

**Actualizar fecha:**

```xml
<lastmod>2025-01-27</lastmod>
```

**Cambiar a fecha actual en formato:** `YYYY-MM-DD`

### 8.7 Mantenimiento de Código

#### Limpiar Código

**Eliminar código comentado:**

- Revisar archivos JavaScript
- Eliminar `console.log()` en producción

#### Optimizar Imágenes

**Herramientas recomendadas:**

- **Squoosh** (Google) - Compresión online
- **ImageOptim** - Para Mac
- **TinyPNG** - Compresión online

**Formatos recomendados:**

- **WebP** - Mejor compresión (con fallback JPG)
- **JPG** - Para fotografías
- **PNG** - Para logos y gráficos con transparencia

#### Actualizar Dependencias

**Comando:**

```bash
npm update
```

**Verificar cambios:**

- Probar funcionalidades después de actualizar
- Especialmente GSAP y Three.js

---

## 9. Guía de Desarrollo

### 9.1 Configuración del Entorno

#### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- Editor de código (VS Code recomendado)

#### Instalación

1. **Clonar/Descargar proyecto**

2. **Instalar dependencias:**

```bash
npm install
```

3. **Iniciar servidor de desarrollo:**

```bash
npm run dev
```

4. **Abrir en navegador:**
   - URL: `http://localhost:5173` (o la que indique Vite)

#### Build para Producción

```bash
npm run build
```

**Resultado:**

- Carpeta `dist/` con archivos optimizados
- Listo para subir al servidor

### 9.2 Estructura de Estilos

#### Layout.css

**Responsabilidades:**

- Layout base (header, footer)
- Skip link
- Grids y estructuras principales
- Media queries globales

#### Componenetes.css

**Responsabilidades:**

- Botones
- Cards
- Formularios
- Componentes reutilizables
- Prefers-reduced-motion

#### Maridajes.css

**Responsabilidades:**

- Utilidades y helpers
- Clases auxiliares

#### CSS por Página

Cada página tiene su propio CSS:

- `Inicio/Inicio.Css`
- `Contactanos/Contactanos.css`
- `QuienesSomos/QuienesSomos.css`
- `Preguntas_Frecuentes/PreguntasFrecuentes.css`
- `Servicios/Servicios.css`
- `Servicios/Especificos/Especificos.css`

### 9.3 Sistema de Partials

#### Funcionamiento

**Archivo:** `Partials/partials.js`

**Proceso:**

1. Al cargar la página, busca elementos `#header` y `#footer`
2. Carga contenido desde `header.html` y `footer.html`
3. Inyecta el HTML en los elementos
4. Inicializa funcionalidades del header

**Ventajas:**

- Un solo lugar para actualizar header/footer
- Cambios se reflejan en todas las páginas
- Mantenimiento simplificado

#### Agregar Nuevo Partial

1. Crear archivo HTML en `/Partials/`
2. Agregar función en `partials.js`:

```javascript
async function injectNewPartial() {
  await inject("#nuevo-elemento", "/Partials/nuevo.html");
}
```

3. Llamar en `DOMContentLoaded`

### 9.4 Sistema de Animaciones

#### Agregar Nueva Animación

**Opción 1: Usar atributos data-anim**

```html
<div
  data-anim
  data-anim-from="down"
  data-anim-distance="100"
  data-anim-delay="400ms"
>
  Contenido
</div>
```

**Opción 2: Animación personalizada con GSAP**

```javascript
// En el archivo JS correspondiente
gsap.from(".mi-elemento", {
  opacity: 0,
  y: 50,
  duration: 0.8,
  scrollTrigger: {
    trigger: ".mi-elemento",
    start: "top 80%",
  },
});
```

### 9.5 Debugging

#### Herramientas del Navegador

**Chrome DevTools:**

- F12 para abrir
- Console para errores JavaScript
- Network para ver carga de recursos
- Lighthouse para análisis de performance y SEO

#### Errores Comunes

**1. GSAP no cargado:**

- Verificar que los scripts GSAP estén antes de `Main.js`
- Verificar que `defer` esté presente

**2. EmailJS no funciona:**

- Verificar public key
- Verificar que EmailJS esté cargado
- Revisar console para errores

**3. Imágenes no cargan:**

- Verificar rutas (relativas vs absolutas)
- Verificar que archivos existan
- Revisar permisos de archivos

**4. Animaciones no funcionan:**

- Verificar que GSAP y ScrollTrigger estén cargados
- Verificar atributos `data-anim`
- Revisar console para errores

---

## 10. Información Técnica Adicional

### 10.1 Variables CSS

**Ubicación:** `Styles/Layout.css` y otros archivos CSS

**Variables principales:**

- Colores del tema
- Espaciado
- Breakpoints

### 10.2 Breakpoints Responsive

**Definidos en CSS:**

- Móvil: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### 10.3 Performance

#### Optimizaciones Implementadas

1. **Lazy Loading de Imágenes**

   - `loading="lazy"` en imágenes no críticas
   - `fetchpriority="high"` en imágenes críticas

2. **Defer en Scripts**

   - Todos los scripts externos usan `defer`
   - No bloquean el renderizado

3. **Preconnect a Recursos Externos**

   - Google Fonts
   - CDNs (jsdelivr, unpkg)

4. **Compresión de Modelos 3D**
   - DRACO para modelos GLTF
   - Reduce tamaño de archivos 3D

### 10.4 Seguridad

#### EmailJS

- Public key es segura para exposición pública
- Validación de datos en cliente
- Sanitización recomendada en servidor (si se implementa backend)

#### Formularios

- Validación en cliente
- Protección CSRF (EmailJS maneja esto)
- Consentimiento de datos requerido

---

## 11. Contacto y Soporte

### 11.1 Información del Proyecto

**Dominio:** https://www.planetaesp.com

**Estructura de URLs:**

- Homepage: `/` o `/Inicio/Index.html`
- Servicios: `/Servicios/Servicios.html`
- Contacto: `/Contactanos/Contactanos.html`

### 11.2 Recursos Adicionales

**Documentación Externa:**

- [GSAP Documentation](https://greensock.com/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Schema.org](https://schema.org/)

---

## 12. Changelog y Versiones

### Versión 1.0 (Enero 2025)

**Mejoras Implementadas:**

- ✅ SEO: Meta tags, Open Graph, Schema.org
- ✅ Accesibilidad: ARIA, skip links, focus management
- ✅ Performance: Lazy loading, fetchpriority
- ✅ Formulario: Validación completa, EmailJS
- ✅ Animaciones: GSAP, ScrollTrigger
- ✅ 3D: Visualizadores interactivos
- ✅ Responsive: Diseño adaptativo completo

---

## Apéndice A: Glosario de Términos

- **GSAP:** GreenSock Animation Platform - Librería de animaciones
- **ScrollTrigger:** Plugin de GSAP para animaciones basadas en scroll
- **Three.js:** Librería JavaScript para gráficos 3D
- **GLTF:** Formato de modelo 3D (GL Transmission Format)
- **DRACO:** Compresor de geometría 3D
- **EmailJS:** Servicio para envío de emails desde frontend
- **Schema.org:** Vocabulario estructurado para datos semánticos
- **ARIA:** Accessible Rich Internet Applications - Atributos de accesibilidad
- **Vite:** Build tool moderno para desarrollo frontend

---

## Apéndice B: Checklist de Mantenimiento Mensual

- [ ] Verificar que todos los enlaces funcionen
- [ ] Revisar formulario de contacto (probar envío)
- [ ] Actualizar sitemap.xml si hay cambios
- [ ] Verificar que imágenes carguen correctamente
- [ ] Revisar errores en consola del navegador
- [ ] Verificar que animaciones funcionen
- [ ] Revisar información de contacto (actualizada)
- [ ] Verificar responsive en diferentes dispositivos
- [ ] Revisar velocidad de carga (Lighthouse)
- [ ] Verificar SEO (Google Search Console)

---

**Fin de la Documentación**

_Última actualización: Enero 2025_
