# NostalgicTube 4.6

## Vídeos relacionados sin prioridad por visitas

Los modos **0 %, 25 % y 50 %** ahora aplican la misma neutralidad respecto a las visitas que Random: no hay mínimo de visitas, orden por popularidad ni recorte por ese criterio. Conservan tus temas para buscar vídeos relacionados, varían las ventanas de fechas desde la primera tanda y mezclan las candidatas al azar. Los descubrimientos de esos modos también utilizan búsquedas variadas y dejan de usar expresiones como «hits» o «viral» que favorecían contenido masivo.

Todas las consultas internas del feed omiten las cookies de la cuenta de YouTube; en los modos relacionados se usan los temas aprendidos localmente, y en Random no se usan. El buscador de YouTube todavía puede devolver resultados sesgados hacia vídeos populares. La extensión no puede ofrecer una muestra uniforme de todos los vídeos relacionados existentes, pero no aplica su propia preferencia por visitas.

Verificado con la extensión instalada en Brave y resultados simulados: en los cuatro modos se admiten vídeos de 0, 1 y 100 millones de visitas. Con suficientes candidatas, las tandas de 24 vídeos mantienen 0, 6, 12 y 24 descubrimientos, respectivamente.

## Modo 100 % — Random

En **Descubrimientos de la época** ahora puedes elegir **100 % — Random**. Este modo no utiliza los intereses guardados ni sus cambios para elegir o regenerar el listado. Genera seis búsquedas independientes usando palabras generales de distintos idiomas, patrones de nombres de archivos de cámara y ventanas de fechas aleatorias anteriores al límite elegido. Las solicitudes Random omiten las cookies de la sesión para no enviar el historial de la cuenta de YouTube.

No exige un mínimo de visitas, no ordena por popularidad y no recorta las candidatas según sus visitas: admite desde 0 visitas hasta millones. Mantiene la fecha límite, la comprobación de antigüedad y la exclusión de duplicados. El scroll y **Otra mezcla** siguen funcionando con nuevas búsquedas aleatorias. Los temas pueden seguir aprendiéndose para los otros modos, pero no afectan a Random.

**Límite real:** no es un muestreo uniforme del catálogo completo de YouTube. La extensión no tiene acceso a ese catálogo; elige al azar entre resultados que devuelve el buscador, que puede favorecer vídeos populares, idioma o región. Por tanto, los vídeos sin visitas son elegibles, pero no se garantiza encontrarlos en cada tanda ni que todos los vídeos existentes tengan igual probabilidad.

Verificado en un perfil de Brave con la extensión instalada y resultados simulados: modo Random, intervalos de fechas, exclusión de intereses en las consultas, estabilidad ante nuevos intereses, admisión de vídeos con 0 y 1 visitas y traducción del selector. El título junto al icono usa una fuente más pequeña y alineación inferior.

Un inicio nostálgico con tarjetas nativas de YouTube, aprendizaje automático de intereses, descubrimientos de la época y carga progresiva al bajar.

## Instalación y actualización

En Brave, extrae el ZIP en una carpeta permanente. En `brave://extensions`, activa **Modo desarrollador**, pulsa **Cargar descomprimida** y selecciona la carpeta **NostalgicTube** que contiene `manifest.json`. Desactiva versiones anteriores para evitar interferencias.

Si ya la tienes instalada y quieres conservar el aprendizaje, sustituye los archivos de su carpeta actual, pulsa **Recargar** en su ficha y recarga las pestañas de YouTube. No desinstales la extensión antes de actualizar, porque eso elimina sus datos.

## Aprendizaje sin edición manual

Los intereses ya no se muestran ni se pueden añadir, editar o eliminar individualmente desde los ajustes o el panel de YouTube. Se gestionan automáticamente a partir de las búsquedas y los vídeos vistos. El botón **Clear all interests / Borrar todos mis intereses** sigue disponible para reiniciar el algoritmo. Conserva tus ajustes, idioma y fecha, pero vacía los temas y reinicia el aprendizaje en las pestañas abiertas; una operación anterior pendiente no puede restaurar los temas borrados.

El límite es **10.000 temas distintos**, no 40. Si se alcanza, se descartan los más antiguos al añadir nuevos. El aprendizaje previo se conserva al actualizar en la misma carpeta. No es almacenamiento infinito: utiliza el almacenamiento local de Brave, sin añadir permisos.

**Aprender de mis búsquedas en YouTube** incorpora las consultas nuevas, sin los operadores de fecha. **Aprender temas de los vídeos que veo** extrae una palabra o etiqueta tras 12 segundos de reproducción efectiva con la pestaña visible. Pausas, anuncios detectados y grandes saltos de reproducción no cuentan. Son opciones independientes y se pueden desactivar.

El análisis del título se calcula localmente, con palabras vacías en español e inglés, nombres conocidos y puntuación de palabras. «Sobreviví 100 días en Minecraft» puede añadir Minecraft y un documental sobre galaxias, Astronomía. Es una heurística, no un modelo de IA: puede interpretar mal un título. No procesa repetidamente el mismo vídeo en una pestaña; recuerda hasta 200 identificadores en memoria temporal. No guarda títulos completos ni una lista persistente de reproducciones.

## Búsquedas con fecha automática

Con NostalgicTube activado, las búsquedas en `https://www.youtube.com/results` incorporan automáticamente `before:AAAA-MM-DD`, usando la fecha elegida en los ajustes. Predeterminada: **before:2022-01-01**, para vídeos anteriores a 2022.

Funciona al pulsar Enter en el buscador de YouTube, en la navegación interna y al llegar a una búsqueda de YouTube desde una URL escrita en la barra de direcciones, un marcador o un buscador personalizado del navegador. Sustituye operadores `before:` anteriores para usar el límite actual, sin duplicarlos. Si cambias la fecha mientras estás en resultados, actualiza esa búsqueda. Al desactivar NostalgicTube deja de añadir el operador.

No modifica Google, Brave Search ni buscadores externos: el destino debe ser YouTube. Una URL llegada desde fuera puede cargarse brevemente antes de la redirección con fecha. El operador pide a YouTube el filtro; no certifica sus fechas ni bloquea la apertura directa de un vídeo nuevo. Otros filtros incompatibles de la búsqueda pueden dejar pocos resultados.

Las búsquedas internas que generan la mezcla conservan sus intervalos más precisos; el guardián de búsquedas no intercepta `fetch()`.

## Mezcla, descubrimientos y scroll

Los modos habituales seleccionan hasta cuatro intereses con el mismo peso y mezclan sus resultados por turnos, añadiendo por defecto un 25 % de descubrimientos de categorías generales. Puedes elegir 0 %, 25 % o 50 %, o **100 % — Random** para prescindir de los intereses. No sustituye todo el perfil por el último tema ni aumenta el peso de un interés por repetirlo. Si faltan resultados, la proporción final puede variar.

Ningún modo aplica umbrales de visitas ni ordena por popularidad. Los descubrimientos son vídeos antiguos obtenidos de búsquedas variadas, no un ranking de popularidad histórico certificado. No garantiza ausencia de contenido de IA.

**Otra mezcla** reinicia el listado con otros temas y resultados. Al acercarte al final, añade hasta 24 vídeos más, sin duplicados de todo el listado y conservando las tarjetas anteriores. Aparece un círculo animado con **Más vídeos / More videos** debajo. Si no hay resultados nuevos o falla la búsqueda, la carga automática se pausa y deja un botón para volver a intentarlo. No garantiza resultados ilimitados.

Usa los componentes visuales de YouTube para las tarjetas, miniaturas, duración y menús. Su disposición depende de la variante de YouTube y del ancho de ventana. Un cambio de YouTube puede requerir actualizar la extensión. También puede mostrar una mezcla en el lateral de un vídeo.

## Idioma, donación y privacidad

El idioma predeterminado es **inglés**. El interruptor **English / Español** cambia el idioma con un clic o con el teclado, guarda la elección y actualiza las pestañas abiertas sin regenerar sus vídeos. No traduce los títulos ni cambia el idioma de YouTube.

El icono **Donar con Ko-fi / Donate with Ko-fi** aparece arriba a la derecha en los ajustes y abre https://ko-fi.com/yomidee en otra pestaña. El logotipo con la N blanca forma la inicial del título «ostalgic Tube». El lema es «Enjoy what it used to be» en inglés y «Disfruta de lo que solía ser» en español.

Solo requiere el permiso `storage` y scripts en `https://www.youtube.com/*`. No lee el historial previo del navegador ni de tu cuenta. Los temas se guardan localmente. Para conseguir vídeos envía consultas a YouTube con esa sesión y carga sus miniaturas y componentes; no hay servidor propio ni telemetría. Los temas están ocultos en la interfaz, pero no cifrados contra las herramientas de desarrollo del propio navegador.

Hace hasta seis búsquedas por tanda y como máximo dos simultáneas, con caché temporal en la pestaña. Las fechas relativas ambiguas se descartan. Consentimiento pendiente, límites de consultas o cambios en el formato de YouTube pueden reducir los resultados.

## Verificación de 4.4

Extensión instalada en un perfil de prueba de Brave con páginas simuladas: ausencia de lista y edición manual, conservación de más de 1.000 temas, búsqueda por URL directa, Enter y navegación interna con `before:` sin duplicados, actualización del límite, desactivación y reinicio sin reaprender inmediatamente la consulta actual. Las funciones de tarjetas nativas, scroll e idiomas se habían probado contra YouTube real en versiones anteriores; esta versión no comprueba todas las variantes de su interfaz.

Proyecto independiente bajo licencia MIT, sin afiliación con YouTube ni Brave.
