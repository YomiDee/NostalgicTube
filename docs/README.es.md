# NostalgicTube

**Disfruta de lo que solía ser.**

Extensión para Brave y navegadores Chromium de escritorio. Versión **4.8.3 beta**, Manifest V3. Crea un inicio de YouTube con vídeos anteriores a una fecha, aprende intereses localmente y mezcla vídeos relacionados con descubrimientos independientes.

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

## Instalar

1. Descarga el [ZIP 4.8.3](https://github.com/yomidee/NostalgicTube/releases/download/v4.8.3/NostalgicTube-4.8.3-Brave.zip) y extrae todo en una carpeta permanente.
2. Abre `brave://extensions` y activa **Modo desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta **NostalgicTube** que contiene `manifest.json`.
4. Recarga YouTube y desactiva copias anteriores para evitar interferencias.

Si descargas el repositorio completo, carga la carpeta **extension/**. No necesita compilación, clave de API ni una cuenta adicional.

Para actualizar conservando el aprendizaje, sustituye los archivos de la carpeta instalada, recarga la extensión y recarga YouTube. Desinstalar antes elimina sus datos.

## Límites

Random selecciona entre resultados del buscador, no de todo el catálogo de YouTube con igual probabilidad. Las fechas relativas son aproximadas. Los cambios internos de YouTube, el consentimiento o los bloqueos pueden impedir cargar vídeos aunque haya reintentos.

**Autoplay / A continuación sigue bajo control de YouTube y puede elegir vídeos recientes.** Tampoco se bloquea abrir un vídeo reciente por URL. El filtro de búsqueda se aplica a YouTube, no a Google o Brave Search. No se garantiza que un vídeo antiguo esté libre de contenido de IA.

## Desarrollo e historial

Ejecuta `node --test tests/*.test.cjs` y `python scripts/package.py`. Las pruebas no requieren paquetes externos; el empaquetado utiliza Python estándar.

El [historial](HISTORY.md) distingue las versiones con código recuperado de las que solo están documentadas en la conversación de desarrollo. No se inventaron versiones ni fechas de commits antiguas. El código mantiene su licencia MIT original. La procedencia del logo se explica en [ASSETS.md](ASSETS.md).
