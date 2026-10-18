# NostalgicTube

**Disfruta de lo que solía ser.**

Extensión para Brave y navegadores Chromium de escritorio. Versión **4.8.13 beta**, Manifest V3. Crea un inicio de YouTube con vídeos anteriores a una fecha, aprende intereses localmente y mezcla vídeos relacionados con descubrimientos independientes.

[English](../README.md) · [Historial](../CHANGELOG.md) · [Privacidad](../PRIVACY.md) · [Donar con Ko-fi!](https://ko-fi.com/yomidee)

## Una nota del creador

¡Hola! Soy el creador de NostalgicTube.

Me cansé de las tendencias virales, la música generada por IA y el flujo interminable de contenido nuevo, así que decidí darle a la IA una cucharada de su propia medicina. ¡La utilicé para crear una extensión que recupera los buenos tiempos de YouTube!

Con NostalgicTube puedes elegir una fecha límite y explorar vídeos publicados antes de ella. También hay un deslizador que mezcla tus intereses con descubrimientos aleatorios. Al 100%, Random ignora tus intereses aprendidos. La extensión no exige un mínimo de visitas ni ordena los vídeos por popularidad, así que pueden aparecer tanto vídeos poco conocidos como grandes clásicos. Los resultados de YouTube aún pueden favorecer ciertos vídeos o idiomas: no es una muestra completamente imparcial de todo su catálogo.

¡Espero que la disfrutes! Un consejo: prueba con enero de 2022 o antes como punto de partida si buscas una experiencia de YouTube más antigua. Es la fecha predeterminada que elegí para NostalgicTube, no una frontera comprobada para el contenido generado por IA. La fecha por sí sola no garantiza que un vídeo esté libre de IA.

¡Disfruta de los vídeos!

## Funciones

- Variedad de 0 a 100 %: tus temas en 0 %, Random independiente en 100 %.
- Sin mínimos de visitas ni orden por popularidad: también admite vídeos con 0 visitas.
- Aprendizaje por búsquedas y palabras del título después de 12 segundos de reproducción visible.
- Hasta 10.000 intereses locales, sin lista ni edición manual; reinicio con **Clear all interests**.
- Tarjetas nativas, carga al bajar, control de duplicados y reintentos automáticos con pausas.
- Añade `before:AAAA-MM-DD` al buscar en YouTube, incluidas URLs abiertas desde marcadores o búsquedas personalizadas del navegador.
- Inglés predeterminado, español disponible, ventana compacta y ajustes que se guardan automáticamente.

## Instalar en Brave, Chrome o Edge

1. Descarga el [ZIP 4.8.13](https://github.com/yomidee/NostalgicTube/releases/download/v4.8.13/NostalgicTube-4.8.13-Brave.zip) y extrae todo en una carpeta permanente.
2. Abre la página de extensiones de tu navegador de escritorio y activa **Modo desarrollador**:

   | Navegador | Dirección que debes escribir en la barra |
   | --- | --- |
   | Brave | `brave://extensions` |
   | Google Chrome | `chrome://extensions` |
   | Microsoft Edge | `edge://extensions` |

3. Pulsa **Cargar descomprimida** y elige la carpeta **NostalgicTube** que contiene `manifest.json`.
4. Recarga YouTube y desactiva copias anteriores para evitar interferencias.

El mismo ZIP está pensado para los tres navegadores de escritorio, aunque su nombre incluya «Brave». No necesitas convertirlo ni descargar otro paquete. Mantén activado el modo desarrollador y conserva la carpeta extraída. En Edge no hace falta activar **Permitir extensiones de otras tiendas** para esta instalación desde una carpeta local. Los pasos de Chrome y Edge siguen su documentación oficial; no se ha probado de forma independiente todo el funcionamiento en ambos navegadores.

Guías oficiales de instalación: [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked), [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading).

Si descargas el repositorio completo, carga la carpeta **extension/**. No necesita compilación, clave de API ni una cuenta adicional.

Para actualizar conservando el aprendizaje, sustituye los archivos de la carpeta instalada, recarga la extensión y recarga YouTube. Desinstalar antes elimina sus datos.

## Límites

Random selecciona entre resultados del buscador, no de todo el catálogo de YouTube con igual probabilidad. Las fechas relativas son aproximadas. Los cambios internos de YouTube, el consentimiento o los bloqueos pueden impedir cargar vídeos aunque haya reintentos.

**Autoplay / A continuación sigue bajo control de YouTube y puede elegir vídeos recientes.** Tampoco se bloquea abrir un vídeo reciente por URL. El filtro de búsqueda se aplica a YouTube, no a Google o Brave Search. No se garantiza que un vídeo antiguo esté libre de contenido de IA.

## Desarrollo e historial

Ejecuta `node --test tests/*.test.cjs` y `python scripts/package.py`. Las pruebas no requieren paquetes externos; el empaquetado utiliza Python estándar.

El [historial](HISTORY.md) distingue las versiones con código recuperado de las que solo están documentadas en la conversación de desarrollo. No se inventaron versiones ni fechas de commits antiguas. El código mantiene su licencia MIT original. La procedencia del logo se explica en [ASSETS.md](ASSETS.md).

## Comprobar actualizaciones

Pulsa **Buscar actualizaciones** junto a la versión. Tras permitir el acceso opcional a GitHub, se compara con los releases publicados, incluidas las betas. Muestra **¡Al día!** o **¡Ve a GitHub para actualizar!**, que abre el release. Solo comprueba al pulsar; la descarga e instalación son manuales. Si falla la consulta permite reintentar sin afirmar que está actualizada.

## Tiempos de carga

Las búsquedas se ejecutan de dos en dos, con un límite de 8 segundos por petición y 18 por tanda. La tanda termina antes si hay suficientes vídeos para la variedad elegida. Las búsquedas vacías reintentan tras 1,5–20 segundos; los fallos de conexión mantienen pausas de hasta 60 segundos. Las pruebas usan respuestas simuladas y no garantizan la velocidad real.
