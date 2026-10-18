# NostalgicTube 0.3.2

Incluye un icono cuadrado rojo con esquinas biseladas y una **N blanca**, en tamaños 16, 32, 48 y 128 píxeles para la barra y el administrador de extensiones de Brave.

## Aprender de los vídeos que ves

La opción **Aprender temas de los vídeos que veo** está activada por defecto, además del aprendizaje por búsquedas. Al abrir un vídeo, espera **12 segundos de reproducción efectiva con la pestaña visible**. Pausas, saltos grandes de reproducción y anuncios detectados no cuentan. Un clic rápido seguido de salir del vídeo no añade un tema.

Un algoritmo local resume el título en una palabra o etiqueta corta: reconoce nombres y categorías conocidas (Minecraft, Fortnite, Python, Astronomía, Cocina…), elimina artículos y expresiones genéricas en español e inglés y puntúa las palabras restantes por presencia, posición y coincidencia con intereses ya guardados. Por ejemplo, «Sobreviví 100 días en Minecraft» añade **Minecraft**, y un documental sobre galaxias puede añadir **Astronomía**.

No utiliza un modelo de IA ni envía el título a un servicio de análisis. Es una heurística: puede elegir una palabra poco útil y no garantiza entender todos los títulos. Si no encuentra una candidata, no añade nada. Puedes borrar las etiquetas desde **Mis intereses** o desactivar el aprendizaje por vídeos sin desactivar el de búsquedas.

Los temas aprendidos tienen el mismo peso que los demás. Se mantiene la variedad y el porcentaje de descubrimientos. El mismo vídeo no se procesa repetidamente en una pestaña (se recuerdan hasta 200 identificadores solo en memoria), y los temas repetidos se deduplican al guardar. No se guarda una lista persistente de vídeos vistos ni los títulos completos: solo los intereses extraídos.

Las pruebas de 4.3 verificaron la extracción de temas en títulos españoles e ingleses, el descarte de un título genérico y, con la extensión instalada y reproducción simulada, que no se aprende en los primeros 5 segundos, que se aprende tras superar el umbral, que no se vuelve a añadir el mismo tema continuamente y que desactivar el aprendizaje impide nuevas altas. La reproducción de esas pruebas fue simulada, no una reproducción real de YouTube.

Al final de los ajustes, a la derecha, el icono **Donar con Ko-fi** abre https://ko-fi.com/yomidee en otra pestaña. En inglés aparece como **Donate with Ko-fi**.

La interfaz se inicia en **inglés**. En el icono de la extensión hay un **interruptor deslizante English / Español**: un clic cambia entre ambos idiomas. También funciona con la barra espaciadora o Intro cuando tiene el foco. La elección se guarda automáticamente y se aplica a las pestañas abiertas, sin regenerar los vídeos. Traduce los controles, mensajes y etiquetas de accesibilidad de NostalgicTube; los títulos de vídeos y la interfaz original de YouTube siguen su idioma propio.

Un inicio de YouTube con vídeos antiguos que mezcla tus intereses acumulados con descubrimientos de aquella época. Mantiene las tarjetas, avatares, miniaturas, duraciones y menús nativos de YouTube y sus temas claro/oscuro.

## Instalar en Brave

1. Desactiva las extensiones anteriores de YouTube Antes en `brave://extensions`.
2. Extrae el ZIP completo en una carpeta permanente.
3. Abre `brave://extensions`, activa **Modo desarrollador** y pulsa **Cargar descomprimida**.
4. Selecciona la carpeta **NostalgicTube** que contiene `manifest.json`.
5. Recarga las pestañas de YouTube. Haz varias búsquedas de tus temas favoritos y vuelve al inicio.

También puedes añadir intereses desde el icono de NostalgicTube o desde **Añadir interés** en el inicio, sin tener que buscarlos primero. No se importan automáticamente las preferencias de las extensiones anteriores.

## Cómo compone tu inicio

- Guarda hasta **40 intereses distintos** procedentes de tus búsquedas, temas extraídos de vídeos vistos y temas añadidos manualmente a partir de la instalación. No lee el historial previo de tu cuenta ni del navegador. Las búsquedas hechas antes de instalarla puedes añadirlas manualmente.
- Los intereses tienen **el mismo peso**: buscar repetidamente un tema no lo hace dominar y la última búsqueda no sustituye las anteriores. Deduplica mayúsculas y acentos. Al superar 40 temas elimina el que se añadió primero.
- Para cada mezcla elige al azar hasta **cuatro intereses** y reparte sus resultados por turnos. **Otra mezcla** cambia la selección y el orden; con pocos intereses puede haber vídeos repetidos entre mezclas. Dentro de una mezcla elimina duplicados.
- Por defecto intenta mostrar **75 % de tus intereses y 25 % de descubrimientos** en tandas de hasta 24 vídeos. Puedes elegir 0 %, 25 % o 50 % de descubrimientos desde el icono. Si una fuente tiene pocos resultados, la otra puede completar la tanda y la proporción final variar; el estado indica el número real de descubrimientos.
- **Carga al hacer scroll:** al acercarte a unos 600 píxeles del final se solicita otra tanda. Aparece un círculo animado con **Más vídeos** debajo, o **More videos** en inglés. Los nuevos vídeos se añaden al final, conservando las tarjetas anteriores y excluyendo duplicados de todo el listado.
- Las tandas siguientes rotan temas, años y búsquedas; no dependen de una API de continuación privada de YouTube. Si no llegan resultados nuevos o hay errores, la carga automática se pausa para no repetir consultas sin fin. El botón permite volver a intentarlo con otras búsquedas. No se garantiza una cantidad ilimitada de resultados.
- Los descubrimientos proceden de categorías generales independientes de tus consultas: música, humor, virales, baile, videojuegos y animales, con años de la época elegida. Pueden coincidir casualmente con alguno de tus intereses.
- Para descubrir clásicos se usan los cinco años anteriores al año del límite, hasta la fecha elegida. Por defecto, con límite 01/01/2022, el intervalo explorado es 2017–2021. Prioriza resultados con más visitas y exige al menos **100.000 visitas actuales**. Es una aproximación a vídeos conocidos de aquella época, no un ranking certificado de lo que era popular entonces: YouTube devuelve las visitas acumuladas hoy.
- Con intereses vacíos y descubrimientos activados empieza mostrando clásicos. Si seleccionas 0 % y no tienes intereses, tendrás que añadir alguno.
- La fecha límite es exclusiva: 01/01/2022 busca vídeos anteriores a 2022. Puedes cambiarla desde el icono. Las edades relativas de los resultados son aproximadas y se descartan las que no permiten situar el vídeo antes del límite con suficiente confianza.

## Control de tus intereses

En el icono de la extensión, **Mis intereses** permite añadir temas, eliminar uno o **Borrar todos mis intereses**. Desmarcar **Aprender de mis búsquedas en YouTube** detiene nuevas incorporaciones automáticas y conserva los temas ya guardados. Puedes seguir añadiendo temas manualmente. Desactivar NostalgicTube detiene el aprendizaje y restaura el inicio original; no borra los intereses. Desinstalar la extensión elimina sus datos locales.

Abrir un vídeo no sustituye todos tus intereses: si lo ves el tiempo suficiente puede añadir un tema y actualizar la mezcla acumulada. En el lateral de un vídeo también puede mostrar la mezcla. **Sustituir el listado del inicio** permite mostrar solo el inicio nostálgico o acompañarlo del listado original. No altera la reproducción ni el buscador normal.

## Privacidad y funcionamiento

Solo utiliza el permiso `storage` y scripts limitados a `https://www.youtube.com/*`. No solicita acceso al historial del navegador ni a otras webs. Los intereses y ajustes se guardan localmente en este perfil de Brave; no se sincronizan por la extensión ni se envían a un servidor propio.

Para obtener resultados envía consultas a YouTube con las credenciales de esa sesión. Las miniaturas, los componentes y sus interacciones proceden de YouTube. Mantiene una caché de resultados en la memoria de la pestaña durante diez minutos, que se limpia al modificar los intereses o recargar. Un proceso de fondo serializa los cambios para evitar perder temas cuando buscas desde varias pestañas.

Se realizan hasta seis búsquedas por tanda, con un máximo de dos simultáneas. La caché puede evitar repetir peticiones. Un fallo parcial no impide mostrar resultados de las demás fuentes. No hace consultas periódicas en segundo plano: solo al mostrar o regenerar el listado, al acercarse al final o al pulsar el botón de más vídeos.

## Límites

La selección depende de las respuestas y del formato interno de YouTube, que puede cambiar. Consentimiento pendiente, bloqueos o limitaciones de consultas pueden impedir algunas fuentes. El panel comunica los fallos y permite **Explorar época** en el buscador. No inventa vídeos ni resultados.

Las tarjetas y la cuadrícula son componentes reales de YouTube; la distribución exacta depende de su variante de interfaz, del ancho y de la cuenta. Se conserva una barra propia pequeña para los controles. La carga progresiva depende de que las búsquedas aporten vídeos nuevos. No garantiza que los vídeos antiguos estén libres de contenido de IA.

## Verificación

Versión 4.2 instalada en un perfil de prueba de Brave con YouTube real: al bajar se pasó de 24 a 48 tarjetas nativas sin duplicados, conservando el mismo primer elemento del listado. Se verificó el indicador de carga, un máximo de dos peticiones simultáneas, el interruptor EN/ES con clic y teclado, la persistencia del idioma y la desactivación del panel.

Pruebas de la mezcla: reparto entre cuatro intereses, objetivo 18 resultados de intereses y 6 de descubrimientos con suficiente material, exclusión de duplicados, modo 0 % y lectura de visitas.

Instalada como Manifest V3 en un perfil de prueba de Brave, con YouTube real: registro automático de una búsqueda, acumulación y deduplicación de intereses con escrituras simultáneas, generación de una mezcla de 24 vídeos con 6 descubrimientos, tarjetas nativas, edición del popup, eliminación de un interés, pausa del aprendizaje, límite de 40 temas y borrado completo. No utiliza tu cuenta personal para esas pruebas.

Proyecto independiente bajo licencia MIT, sin afiliación con YouTube ni Brave.
