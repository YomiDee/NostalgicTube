# YouTube Antes · Brave / Chromium Manifest V3

Extensión independiente inspirada en las funciones públicas de ChronoLock. No es una versión oficial ni utiliza su código. Interfaz en español; sin bibliotecas, cuentas, telemetría ni peticiones de red propias.

## Instalación en Brave para escritorio

1. Extrae **todo** el ZIP en una carpeta permanente, por ejemplo Documentos\YouTube-Antes.
2. Abre `brave://extensions` en Brave.
3. Activa **Modo desarrollador** (arriba a la derecha).
4. Pulsa **Cargar descomprimida** o **Cargar extensión sin empaquetar**.
5. Selecciona la carpeta **YouTube-Antes** que contiene `manifest.json`. No selecciones el ZIP ni la carpeta superior.
6. Recarga las pestañas de YouTube que ya estuvieran abiertas. Abre https://www.youtube.com/.
7. Desde el menú de extensiones de Brave, fija **YouTube Antes** para acceder a sus ajustes.

Conserva la carpeta extraída: Brave carga los archivos desde ella. No se necesita empaquetar un CRX, publicar en una tienda ni disponer de una clave de API. Para actualizar los archivos, sustitúyelos y pulsa Recargar en la ficha de la extensión; después recarga YouTube.

## Ajustes

- **Activar filtro:** permite restaurar las tarjetas sin recargar.
- **Mostrar vídeos anteriores al:** límite exclusivo, con precisión de día. Predeterminado: **01/01/2022**, por lo que solo se aceptan fechas anteriores a 2022. Para incluir todo 2020, utiliza 01/01/2021.
- **Ocultar / Oscurecer / Desvanecer:** tres formas de tratar las tarjetas descartadas. En los dos últimos modos siguen siendo accesibles y se pueden reproducir.
- **Fecha desconocida o imprecisa:** aplicar el mismo filtro (predeterminado estricto) o mostrar. Incluye tarjetas sin fecha, algunos Shorts, directos y etiquetas en idiomas no reconocidos.
- **Solo en la página principal:** activado por defecto. Desmárcalo para aplicar el filtro también a las tarjetas compatibles de búsquedas, canales, suscripciones y recomendaciones.
- **Guardar cambios:** los aplica en las pestañas de YouTube abiertas y los conserva en el almacenamiento local de la extensión.

Detecta tarjetas añadidas al hacer scroll, cambios en metadatos y navegación interna de YouTube. Reconoce varios contenedores clásicos y modernos del sitio de escritorio, con fechas en español e inglés. No está diseñada para YouTube móvil, la aplicación de escritorio instalada como app independiente ni reproductores incrustados.

## Límites que conviene conocer

YouTube suele mostrar edades relativas, no la fecha exacta. «Hace 4 años» representa un intervalo aproximado entre hace 4 y 5 años: si ese intervalo cruza el límite elegido, se considera desconocido. Los meses y años se calculan por calendario. Las etiquetas son una estimación basada en el reloj del equipo y en cómo YouTube redondea su texto; no garantizan la fecha real. Un formato desconocido nunca se convierte en una fecha inventada.

El modo estricto puede dejar la página casi vacía, especialmente con límites próximos al intervalo mostrado. Prueba primero **Desvanecer** y **Mostrar** las fechas desconocidas para ver qué ocurre. Puedes desactivar el filtro desde el icono. Las fechas solo se toman de elementos de metadatos, no de títulos que mencionen años.

La extensión filtra las recomendaciones que YouTube ya envía. No obliga a YouTube a recomendar vídeos antiguos, no garantiza una selección aleatoria y no detecta contenido generado por IA. No resuelve fechas consultando cada vídeo ni usa la API de YouTube. Puede quedar algún hueco de una sección, y YouTube puede dejar de cargar resultados si se ocultan muchas tarjetas; en ese caso desactiva temporalmente el filtro o utiliza Desvanecer. Las listas de reproducción completas y la página de reproducción de un vídeo no se bloquean.

YouTube modifica su interfaz con frecuencia. Si cambia sus contenedores o metadatos, puede ser necesario actualizar los selectores. Las tarjetas sin metadatos reconocibles siguen la opción de fecha desconocida.

## Privacidad y permisos

Solo requiere `storage` para guardar preferencias y un script de contenido limitado a `https://www.youtube.com/*`. Lee metadatos de tarjetas y modifica su presentación. No lee el historial del navegador, no guarda listas de vídeos, no realiza consultas externas y no incorpora código remoto.

## Verificación realizada

Pruebas automatizadas en Brave en modo sin interfaz, con una página de YouTube simulada y los scripts reales de esta extensión: 12 casos de fechas (incluido el límite exclusivo, etiquetas relativas, inglés/español y una fecha inválida); tarjetas antiguas, recientes y sin fecha; los tres modos; inserción al cargar más tarjetas; cambio de fecha de una tarjeta reciclada; navegación interna; alcance solo inicio; activación/desactivación; cambios de límite; guardado y restablecimiento de la interfaz.

Esto verifica la lógica y la manipulación de tarjetas representativas. No se ha validado la extensión instalada contra una sesión real de YouTube ni todas sus variantes de interfaz. Para comprobarla en tu cuenta, selecciona Desvanecer, recarga el inicio, haz scroll, cambia el límite y confirma que las tarjetas cambian; desactiva el filtro para comprobar que reaparecen.

## Referencias

- Funciones originales: https://addons.mozilla.org/en-US/firefox/addon/chronolock/ (ocultar, oscurecer y desvanecer; metadatos visibles; actualización dinámica; funcionamiento local).
- Scripts de contenido MV3: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
- Compatibilidad de extensiones en Brave: https://support.brave.app/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave

Código independiente distribuido bajo licencia MIT; consulta LICENSE.txt.
