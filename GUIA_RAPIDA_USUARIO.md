# Guía Rápida de Usuario - Planeta SAS ESP

## Manual de Uso y Mantenimiento del Sitio Web

---

## 📖 Índice Rápido

1. [Cómo Actualizar Contenido](#cómo-actualizar-contenido)
2. [Cómo Agregar un Nuevo Servicio](#cómo-agregar-un-nuevo-servicio)
3. [Cómo Actualizar Información de Contacto](#cómo-actualizar-información-de-contacto)
4. [Cómo Modificar el Formulario](#cómo-modificar-el-formulario)
5. [Cómo Agregar Clientes](#cómo-agregar-clientes)
6. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---

## Cómo Actualizar Contenido

### Cambiar Textos en una Página

1. **Abrir el archivo HTML** de la página que quieres modificar

   - Ejemplo: `Inicio/Index.html` para la página principal
   - Ejemplo: `Servicios/Especificos/AguasResiduales.html` para un servicio

2. **Buscar el texto** usando Ctrl+F (o Cmd+F en Mac)

3. **Reemplazar el texto** manteniendo las etiquetas HTML

**Ejemplo:**

```html
<!-- ANTES -->
<h1>Servicio de Aguas Residuales</h1>

<!-- DESPUÉS -->
<h1>Tratamiento Profesional de Aguas Residuales</h1>
```

### Cambiar Imágenes

1. **Reemplazar la imagen:**

   - Sube la nueva imagen a la carpeta correspondiente
   - Mantén el mismo nombre O actualiza la ruta en el HTML

2. **Actualizar en el HTML:**

```html
<!-- Buscar esta línea -->
<img src="/Servicios/Recursos/AguasResiduales/imagen-vieja.jpg" alt="..." />

<!-- Cambiar por -->
<img src="/Servicios/Recursos/AguasResiduales/imagen-nueva.jpg" alt="..." />
```

**Importante:**

- Mantén el atributo `alt` con una descripción
- Si cambias el tamaño, actualiza `width` y `height`

---

## Cómo Agregar un Nuevo Servicio

### Paso 1: Crear el Archivo HTML

1. **Copiar un servicio existente** como plantilla
   - Abre: `Servicios/Especificos/AguasResiduales.html`
   - Cópialo y guárdalo como: `Servicios/Especificos/NuevoServicio.html`

### Paso 2: Actualizar el Contenido

1. **Cambiar el título:**

```html
<h1 class="Grid1Inicio--Title">Nombre del Nuevo Servicio</h1>
```

2. **Actualizar la descripción:**

```html
<p class="lead">Descripción detallada del nuevo servicio...</p>
```

3. **Cambiar las imágenes:**
   - Sube imágenes a: `Servicios/Recursos/NuevoServicio/`
   - Actualiza las rutas en el HTML

### Paso 3: Actualizar Meta Tags

**Buscar y actualizar:**

```html
<title>Nuevo Servicio Planeta SAS ESP</title>
<meta name="title" content="Nuevo Servicio Planeta SAS ESP" />
<meta name="description" content="Descripción del servicio..." />
```

**Actualizar Open Graph:**

```html
<meta property="og:title" content="Nuevo Servicio - Planeta SAS ESP" />
<meta property="og:description" content="Descripción..." />
```

### Paso 4: Actualizar Schema.org

**Buscar el script JSON-LD y actualizar:**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Nombre del Nuevo Servicio",
    "description": "Descripción del servicio...",
    "url": "https://www.planetaesp.com/Servicios/Especificos/NuevoServicio.html"
  }
</script>
```

### Paso 5: Agregar al Sitemap

**Abrir:** `sitemap.xml`

**Agregar antes de `</urlset>`:**

```xml
<url>
  <loc>https://www.planetaesp.com/Servicios/Especificos/NuevoServicio.html</loc>
  <lastmod>2025-01-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Actualizar la fecha** `lastmod` a la fecha actual.

### Paso 6: Agregar Enlace en Página de Servicios

**Abrir:** `Servicios/Servicios.html`

**Buscar la sección de servicios y agregar:**

```html
<li class="Servicios__Item">
  <a href="/Servicios/Especificos/NuevoServicio.html">
    <h3>Nuevo Servicio</h3>
    <p>Descripción breve...</p>
  </a>
</li>
```

---

## Cómo Actualizar Información de Contacto

### Teléfonos y Email

**Hay 2 lugares donde actualizar:**

#### 1. Footer (aparece en todas las páginas)

**Archivo:** `Partials/footer.html`

**Buscar:**

```html
<a href="mailto:info@planetaesp.com" itemprop="email">
  <p>info@planetaesp.com</p>
</a>
<p>3104415734 - 3005259767</p>
```

**Actualizar:**

- Cambiar el email en `href` y en el texto
- Cambiar los números de teléfono

#### 2. Página de Contacto

**Archivo:** `Contactanos/Contactanos.html`

**Buscar la sección "Informacion de contacto" y actualizar:**

```html
<p>nuevo-email@planetaesp.com</p>
<p>NuevoTeléfono1 - NuevoTeléfono2</p>
```

### Direcciones

**Actualizar en 2 lugares:**

#### 1. Footer

**Archivo:** `Partials/footer.html`

**Buscar:**

```html
<p>
  Planta: Vereda Barro blanco Vía Bojaca. Finca el Rancho. Mosquera
  Cundinamarca.
</p>
<p>Oficina Principal: Kilómetro 1 más 800 Via- Madrid - Puente Piedra.</p>
```

#### 2. Página de Contacto

**Archivo:** `Contactanos/Contactanos.html`

**Buscar sección "Visitanos" y actualizar**

---

## Cómo Modificar el Formulario

### Cambiar Campos del Formulario

**Archivo:** `Contactanos/Contactanos.html`

**Estructura de un campo:**

```html
<label for="nombre" class="form-label">
  <p>Nombre y apellido*</p>
</label>
<input
  id="nombre"
  class="formulario__input"
  type="text"
  name="Nombre"
  required
  aria-required="true"
  placeholder="Nombre y apellido"
/>
<span id="nombre-error" class="error-message"></span>
```

**Para agregar un nuevo campo:**

1. **Agregar el HTML** después de un campo existente
2. **Actualizar JavaScript** en `Contactanos/Contactanos.js`:
   - Agregar validación en la función `validateForm`
   - Agregar validación individual si es necesario

**Ejemplo - Agregar campo "Empresa":**

```html
<label for="empresa" class="form-label">
  <p>Empresa</p>
</label>
<input
  id="empresa"
  class="formulario__input"
  type="text"
  name="Empresa"
  placeholder="Nombre de la empresa"
/>
```

### Cambiar Mensajes de Error

**Archivo:** `Contactanos/Contactanos.js`

**Buscar:**

```javascript
const FORM_MESSAGES = {
  REQUIRED_FIELD: "Este campo es obligatorio",
  INVALID_EMAIL: "Por favor, ingresa un email válido",
  // ...
};
```

**Modificar los mensajes según necesites**

### Cambiar Configuración de EmailJS

**Archivo:** `Contactanos/Contactanos.js`

**Buscar:**

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "KK0TiUAMfr7fRo_Jy",
  SERVICE_ID: "default_service",
  TEMPLATE_ID: "template_0oigv73",
};
```

**Actualizar con tus nuevos valores** (si cambias de cuenta EmailJS)

---

## Cómo Agregar Clientes

**Archivo:** `Inicio/Index.html`

**Buscar la sección "Clientes"** (alrededor de la línea 575)

**Agregar nuevo cliente:**

```html
<li class="ClienteImg">
  <img
    src="Recursos_Inicio/Imagenes/Clientes/NombreCliente.png"
    alt="Cliente Planeta: Nombre Cliente"
    width="500"
    height="200"
    loading="lazy"
    decoding="async"
  />
</li>
```

**Pasos:**

1. Subir logo del cliente a: `Inicio/Recursos_Inicio/Imagenes/Clientes/`
2. Nombre del archivo: Sin espacios, preferiblemente PNG
3. Agregar el código HTML antes de `</ul>` de la lista de clientes
4. Ajustar `width` y `height` según el tamaño real de la imagen

**Recomendaciones:**

- Formato: PNG con fondo transparente
- Tamaño: Ancho máximo 500px
- Altura: Proporcional al logo original

---

## Cómo Agregar Preguntas Frecuentes

**Archivo:** `Preguntas_Frecuentes/PreguntasFrecuentes.html`

### Paso 1: Elegir la Categoría

Hay 3 categorías:

- **ServiciosYCovertura** - Sobre servicios y zonas
- **ProcesosYContratacion** - Sobre cómo contratar
- **NormativasYRespaldo** - Sobre certificaciones

### Paso 2: Agregar la Pregunta

**Buscar la categoría** (ej: `ul.ServiciosYCovertura`)

**Agregar antes del `</ul>` de cierre:**

```html
<li class="PreguntasFrecuentes__Item">
  <details>
    <summary>
      ¿Tu nueva pregunta aquí?
      <span class="faq-btn" aria-hidden="true">
        <span class="faq-ico"></span>
      </span>
    </summary>
    <div class="faq-wrap">
      <div class="faq-body">
        <p class="lead">Tu respuesta detallada aquí...</p>
      </div>
    </div>
  </details>
</li>
```

### Paso 3: Actualizar Schema.org

**Buscar el script `FAQPage`** y agregar:

```json
{
  "@type": "Question",
  "name": "¿Tu nueva pregunta aquí?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Tu respuesta detallada aquí..."
  }
}
```

---

## Solución de Problemas Comunes

### El Formulario No Envía Emails

**Verificar:**

1. ✅ EmailJS está cargado (revisar consola del navegador)
2. ✅ Public Key es correcta
3. ✅ Service ID y Template ID son correctos
4. ✅ El template en EmailJS tiene los campos correctos

**Cómo verificar EmailJS:**

- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica que EmailJS se haya cargado

### Las Animaciones No Funcionan

**Verificar:**

1. ✅ GSAP está cargado (revisar consola)
2. ✅ ScrollTrigger está cargado
3. ✅ Los elementos tienen atributos `data-anim`
4. ✅ No hay errores JavaScript en consola

**Solución:**

- Verificar que los scripts GSAP estén antes de `Main.js`
- Verificar que tengan `defer` en el atributo

### Las Imágenes No Aparecen

**Verificar:**

1. ✅ La ruta del archivo es correcta
2. ✅ El archivo existe en esa ubicación
3. ✅ El nombre del archivo coincide exactamente (mayúsculas/minúsculas)

**Tip:** Usar rutas absolutas desde la raíz:

```html
<!-- Correcto -->
<img src="/Servicios/Recursos/imagen.jpg" />

<!-- Incorrecto (relativa) -->
<img src="../Recursos/imagen.jpg" />
```

### El Header/Footer No Aparece

**Verificar:**

1. ✅ El archivo `Partials/partials.js` está cargado
2. ✅ Existen los elementos `#header` y `#footer` en el HTML
3. ✅ Los archivos `header.html` y `footer.html` existen

**Solución:**

- Verificar que `partials.js` esté en el HTML:

```html
<script defer src="/Partials/partials.js"></script>
```

### El Modelo 3D No Carga (Página Transporte)

**Verificar:**

1. ✅ El archivo `.glb` existe en la ruta especificada
2. ✅ DRACO está configurado correctamente
3. ✅ No hay errores en la consola

**Solución:**

- Verificar rutas en `Transporte.js`
- Verificar que los archivos DRACO estén en `/draco/gltf/`

---

## Consejos Importantes

### Antes de Hacer Cambios

1. **Hacer backup** de los archivos que vas a modificar
2. **Probar en desarrollo** antes de subir a producción
3. **Verificar en diferentes navegadores** (Chrome, Firefox, Safari)

### Al Actualizar Contenido

1. **Mantener la estructura HTML** - No eliminar etiquetas importantes
2. **Preservar atributos** - `class`, `id`, `data-*` son importantes
3. **Actualizar ambos lugares** - Si hay información duplicada (ej: contacto)

### Al Agregar Imágenes

1. **Optimizar antes de subir** - Reducir tamaño de archivo
2. **Usar nombres descriptivos** - Sin espacios, sin caracteres especiales
3. **Mantener proporciones** - No distorsionar imágenes

### Al Modificar JavaScript

1. **Revisar la consola** después de cambios
2. **Probar funcionalidades** relacionadas
3. **No eliminar código** sin entender qué hace

---

## Recursos Útiles

### Herramientas Online

- **Validar HTML:** https://validator.w3.org/
- **Validar Schema.org:** https://validator.schema.org/
- **Comprimir Imágenes:** https://squoosh.app/
- **Probar Responsive:** Herramientas de desarrollador del navegador (F12)

### Documentación

- **Documentación Completa:** Ver `DOCUMENTACION_TECNICA.md`
- **GSAP:** https://greensock.com/docs/
- **EmailJS:** https://www.emailjs.com/docs/

---

## Contacto para Soporte Técnico

Si necesitas ayuda con cambios técnicos complejos o encuentras problemas que no puedes resolver, contacta al equipo de desarrollo.

---

**Última actualización: Enero 2025**
