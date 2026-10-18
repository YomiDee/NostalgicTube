# NostalgicTube 4.1

La interfaz se inicia en **inglés**. En el icono de la extensión, cambia **Language → Español** para usar español, o **Idioma → English** para volver a inglés. La elección se guarda automáticamente y se aplica también a las pestañas abiertas, sin regenerar los vídeos. Traduce los controles, mensajes y etiquetas de accesibilidad de NostalgicTube; los títulos de vídeos y la interfaz original de YouTube siguen su idioma propio.

Un inicio de YouTube con vídeos antiguos que mezcla tus intereses acumulados con descubrimientos de aquella época. Mantiene las tarjetas, avatares, miniaturas, duraciones y menús nativos de YouTube y sus temas claro/oscuro.

## Instalar en Brave

1. Desactiva las extensiones anteriores de YouTube Antes en `brave://extensions`.
2. Extrae el ZIP completo en una carpeta permanente.
3. Abre `brave://extensions`, activa **Modo desarrollador** y pulsa **Cargar descomprimida**.
4. Selecciona la carpeta **NostalgicTube** que contiene `manifest.json`.
5. Recarga las pestañas de YouTube. Haz varias búsquedas de tus temas favoritos y vuelve al inicio.

También puedes añadir intereses desde el icono de NostalgicTube o desde **Añadir interés** en el inicio, sin tener que buscarlos primero. No se importan automáticamente las preferencias de las extensiones anteriores.

## Cómo compone tu inicio

- Guarda hasta **40 consultas distintas** que realices en el buscador de YouTube a partir de la instalación. No lee el historial previo de tu cuenta ni del navegador. Guarda la consulta, no una lista de vídeos vistos ni marcas horarias. Las búsquedas hechas antes de instalarla puedes añadirlas manualmente.
- Los intereses tienen **el mismo peso**: buscar repetidamente un tema no lo hace dominar y la última búsqueda no sustituye las anteriores. Deduplica mayúsculas y acentos. Al superar 40 temas elimina el que se añadió primero.
- Para cada mezcla elige al azar hasta **cuatro intereses** y reparte sus resultados por turnos. **Otra mezcla** cambia la selección y el orden; con pocos intereses puede haber vídeos repetidos entre mezclas. Dentro de una mezcla elimina duplicados.
- Por defecto intenta mostrar **75 % de tus intereses y 25 % de descubrimientos** en una lista de hasta 24 vídeos. Puedes elegir 0 %, 25 % o 50 % de descubrimientos desde el icono. Si una fuente tiene pocos resultados, la otra puede completar la lista y la proporción final variar; el estado indica el número real de descubrimientos.
- Los descubrimientos proceden de categorías generales independientes de tus consultas: música, humor, virales, baile, videojuegos y animales, con años de la época elegida. Pueden coincidir casualmente con alguno de tus intereses.
- Para descubrir clásicos se usan los cinco años anteriores al año del límite, hasta la fecha elegida. Por defecto, con límite 01/01/2022, el intervalo explorado es 2017–2021. Prioriza resultados con más visitas y exige al menos **100.000 visitas actuales**. Es una aproximación a vídeos conocidos de aquella época, no un ranking certificado de lo que era popular entonces: YouTube devuelve las visitas acumuladas hoy.
- Con intereses vacíos y descubrimientos activados empieza mostrando clásicos. Si seleccionas 0 % y no tienes intereses, tendrás que añadir alguno.
- La fecha límite es exclusiva: 01/01/2022 busca vídeos anteriores a 2022. Puedes cambiarla desde el icono. Las edades relativas de los resultados son aproximadas y se descartan las que no permiten situar el vídeo antes del límite con suficiente confianza.

## Control de tus intereses

En el icono de la extensión, **Mis intereses** permite añadir temas, eliminar uno o **Borrar todos mis intereses**. Desmarcar **Aprender de mis búsquedas en YouTube** detiene nuevas incorporaciones automáticas y conserva los temas ya guardados. Puedes seguir añadiendo temas manualmente. Desactivar NostalgicTube detiene el aprendizaje y restaura el inicio original; no borra los intereses. Desinstalar la extensión elimina sus datos locales.

El inicio ya no cambia de tema por abrir un vídeo: conserva la mezcla acumulada. En el lateral de un vídeo también puede mostrar la mezcla. **Sustituir el listado del inicio** permite mostrar solo el inicio nostálgico o acompañarlo del listado original. No altera la reproducción ni el buscador normal.

## Privacidad y funcionamiento

Solo utiliza el permiso `storage` y scripts limitados a `https://www.youtube.com/*`. No solicita acceso al historial del navegador ni a otras webs. Los intereses y ajustes se guardan localmente en este perfil de Brave; no se sincronizan por la extensión ni se envían a un servidor propio.

Para obtener resultados envía consultas a YouTube con las credenciales de esa sesión. Las miniaturas, los componentes y sus interacciones proceden de YouTube. Mantiene una caché de resultados en la memoria de la pestaña durante diez minutos, que se limpia al modificar los intereses o recargar. Un proceso de fondo serializa los cambios para evitar perder temas cuando buscas desde varias pestañas.

Se realizan hasta seis búsquedas por mezcla, con un máximo de dos simultáneas. La caché puede evitar repetir peticiones. Un fallo parcial no impide mostrar resultados de las demás fuentes. No hace consultas periódicas en segundo plano: solo al mostrar o regenerar el listado.

## Límites

La selección depende de las respuestas y del formato interno de YouTube, que puede cambiar. Consentimiento pendiente, bloqueos o limitaciones de consultas pueden impedir algunas fuentes. El panel comunica los fallos y permite **Explorar época** en el buscador. No inventa vídeos ni resultados.

Las tarjetas y la cuadrícula son componentes reales de YouTube; la distribución exacta depende de su variante de interfaz, del ancho y de la cuenta. Se conserva una barra propia pequeña para los controles. Hay hasta 24 resultados por mezcla, sin scroll infinito. No garantiza que los vídeos antiguos estén libres de contenido de IA.

## Verificación

Pruebas de la mezcla: reparto entre cuatro intereses, objetivo 18 resultados de intereses y 6 de descubrimientos con suficiente material, exclusión de duplicados, modo 0 % y lectura de visitas.

Instalada como Manifest V3 en un perfil de prueba de Brave, con YouTube real: registro automático de una búsqueda, acumulación y deduplicación de intereses con escrituras simultáneas, generación de una mezcla de 24 vídeos con 6 descubrimientos, tarjetas nativas, edición del popup, eliminación de un interés, pausa del aprendizaje, límite de 40 temas y borrado completo. No utiliza tu cuenta personal para esas pruebas.

Proyecto independiente bajo licencia MIT, sin afiliación con YouTube ni Brave.
