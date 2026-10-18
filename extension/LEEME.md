# YouTube Antes · Relacionados — versión 2

Esta versión crea su propio panel de vídeos antiguos relacionados con lo que estás viendo. Busca resultados nuevos en YouTube; no se limita a ocultar recomendaciones recientes.

## Instalación en Brave

1. Desactiva la extensión anterior **YouTube Antes** en `brave://extensions`, para que ambos sistemas no interfieran.
2. Extrae completamente el ZIP y conserva la carpeta en un lugar permanente.
3. En `brave://extensions`, activa **Modo desarrollador**.
4. Pulsa **Cargar descomprimida** y selecciona la carpeta **YouTube-Antes-Relacionados**, que contiene `manifest.json`.
5. Recarga YouTube y abre un vídeo. En el lateral aparecerá **Antiguos relacionados**.
6. Al volver al inicio, tendrás el panel con ese tema. Por defecto sustituye la cuadrícula original del inicio; puedes cambiarlo desde el icono de la extensión.

En ventanas estrechas, el lateral de YouTube puede aparecer debajo del reproductor. No modifica la reproducción del vídeo ni la búsqueda normal de YouTube.

## Cómo funciona

- Lee el título del vídeo actual y busca con él y con una variante de palabras clave más corta.
- Añade `before:2022-01-01` de forma predeterminada. La fecha se cambia desde el icono de la extensión.
- Hace como máximo dos búsquedas por generación y presenta hasta 24 vídeos. No promete una lista infinita ni resultados distintos si YouTube devuelve siempre lo mismo.
- Extrae resultados de las páginas de búsqueda de YouTube, reconoce formatos clásicos y modernos y comprueba la antigüedad aproximada indicada. Descarta fechas desconocidas o que no se puedan situar antes del límite, publicidad reconocida y el vídeo actual.
- Muestra miniaturas, títulos, canales y edades de publicación. Cada tarjeta abre el vídeo en YouTube.
- **Buscar** permite editar el tema y pedir resultados de nuevo. **Mezclar** cambia el orden de los resultados obtenidos, sin nuevas peticiones.
- Al abrir otro vídeo, utiliza su título como nuevo tema. Al volver al inicio conserva el último tema visto. Si todavía no hay tema, intenta usar el título de una tarjeta del inicio; si no existe, permite escribirlo.

La relación se calcula mediante palabras del título, no mediante un modelo de IA ni acceso al historial completo. Un título muy específico puede dar pocos resultados; edita el campo para usar el nombre del juego, artista, personaje o tema principal. No genera vídeos: genera una selección de vídeos existentes.

## Límites

YouTube no ofrece a esta extensión una fecha exacta en todos los resultados. Las edades relativas (también abreviaturas españolas como «hace 5 a») son aproximadas. Los intervalos que cruzan la fecha límite se descartan: se priorizan vídeos cuya edad visible permite situarlos antes del límite. No se garantiza que un vídeo carezca de contenido de IA.

No requiere API de pago, cuenta adicional ni clave de API. La extracción de las páginas de búsqueda depende del formato de YouTube, que puede cambiar. Puede fallar ante consentimiento pendiente, bloqueos, límites de consultas o respuestas sin datos. El panel muestra un aviso y conserva un enlace **Ver búsqueda completa en YouTube**; no inventa tarjetas cuando no hay resultados.

El panel se actualiza al cambiar el vídeo, no al hacer scroll: ya dispone de su propia lista de hasta 24 resultados. Las recomendaciones originales del lateral permanecen disponibles; en el inicio puedes elegir si sustituir o acompañar el listado original. Desactiva la extensión desde su icono para restaurar el inicio.

## Privacidad

Permiso `storage` y scripts únicamente en `https://www.youtube.com/*`. Guarda preferencias y **solo el último tema** (normalmente el título del último vídeo abierto), sin lista de historial. Mantiene una caché temporal de resultados en la pestaña, que desaparece al recargar. Desinstalar la extensión elimina sus preferencias.

Para recomendar vídeos envía el tema como consulta a YouTube, mediante peticiones al mismo sitio y con las credenciales de esa sesión. Las miniaturas se solicitan a los servidores de imágenes de YouTube. No hay servidor propio, telemetría ni terceros adicionales. Esta versión sí consulta YouTube; no es un filtro que funcione únicamente con las tarjetas ya visibles.

## Pruebas realizadas

Verificado en Brave sin interfaz con una página simulada: extracción de resultados clásicos y modernos, exclusión de fechas recientes/desconocidas y publicidad, consultas por tema y fecha, panel lateral, edición, navegación al inicio, sustitución del inicio y desactivación.

También se abrió una búsqueda real de YouTube sobre Minecraft anterior a 2022: se extrajeron 16 resultados, de los cuales 14 tenían una edad reconocible suficientemente antigua. Esa comprobación permitió corregir el formato abreviado «hace 5 a». La cifra corresponde a una prueba concreta y puede variar. No se ha verificado la instalación final en una sesión personal con todas sus variantes de YouTube.

Código independiente bajo licencia MIT. No está afiliado a YouTube, Brave ni ChronoLock.
