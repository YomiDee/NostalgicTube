# YouTube Antes · Inicio nativo (3.0.0)

Genera una selección de vídeos antiguos relacionados y los presenta con los componentes de la página de inicio de YouTube: cuadrícula adaptable, tarjetas, miniaturas, avatares, duración, metadatos y menús originales.

No dibuja una imitación del inicio con tarjetas propias: proporciona los resultados a `ytd-rich-grid-renderer`, el componente nativo que carga YouTube. Conserva la cabecera, el buscador y la navegación lateral. Añade una barra pequeña para indicar la fecha, mezclar y cambiar el tema. La distribución concreta depende de la versión de YouTube, la cuenta, el tema y la anchura de ventana; no es una promesa de identidad píxel a píxel entre todas las cuentas. Los menús dependen de YouTube y del estado de sesión, igual que en sus otras tarjetas.

## Instalar o sustituir la versión anterior en Brave

1. Desactiva las versiones anteriores de **YouTube Antes** en `brave://extensions`.
2. Extrae el ZIP completo en una carpeta permanente.
3. Abre `brave://extensions`, activa **Modo desarrollador** y pulsa **Cargar descomprimida**.
4. Selecciona **YouTube-Antes-Nativo**, la carpeta que contiene `manifest.json`.
5. Recarga YouTube. Abre un vídeo para tomar su título como tema y vuelve al inicio.

Puedes utilizar **Cambiar tema** para escribir otra búsqueda. **Mezclar** reordena los resultados disponibles. **Ver más** abre la búsqueda completa en YouTube. Desde el icono de la extensión puedes cambiar la fecha (por defecto 01/01/2022), desactivar el sistema o conservar también las recomendaciones originales del inicio.

Si aún no has abierto un vídeo, se usa el último tema guardado o el título de una tarjeta original del inicio. En un inicio vacío tendrás que escribir un tema. El reproductor mantiene su funcionamiento habitual; también aparece una cuadrícula de una columna en el lateral de los vídeos.

## Búsqueda y límites

Se realizan como máximo dos búsquedas de YouTube por generación, utilizando el título y una variante abreviada con `before:AAAA-MM-DD`. Se muestran hasta 24 vídeos existentes, sin inventarlos. La relación se basa en palabras del título; no utiliza un modelo de IA ni el historial completo de tu cuenta. Puedes editar títulos demasiado específicos para mejorar los resultados.

Se comprueba la edad visible en español o inglés, incluidas abreviaturas como «hace 5 a». Las edades son aproximadas: se descartan las fechas desconocidas y los intervalos que cruzan el límite. También se excluyen el vídeo actual, los bloques de publicidad reconocidos y los carruseles de Shorts identificados. No se garantiza la ausencia de contenido generado por IA.

YouTube debe proporcionar sus componentes y resultados. Cambios en su código, consentimiento pendiente, límites de consultas o bloqueos pueden impedir la generación. En ese caso aparece un mensaje con acceso a la búsqueda completa. No se incluyen resultados ficticios ni un diseño alternativo cuando faltan los componentes nativos. No es una lista infinita: al hacer scroll se ven los resultados ya obtenidos.

## Privacidad y permisos

Requiere únicamente `storage` y scripts en `https://www.youtube.com/*`. Guarda preferencias y el último tema, sin una lista de historial. Envía consultas a YouTube con las credenciales de esa sesión y carga sus miniaturas y componentes. No hay servidor propio, clave de API, telemetría ni código remoto incluido por la extensión. Los componentes originales de YouTube mantienen sus propias peticiones e interacciones.

Un script aislado maneja la configuración y las búsquedas; un puente en el contexto de la página pasa los datos al componente nativo. Ese puente solo acepta una lista acotada de tarjetas con identificadores de vídeo válidos, sin acceso a almacenamiento, órdenes de red ni ejecución de texto como código. Utiliza las API internas de presentación de YouTube, que pueden cambiar.

## Verificación de esta versión

Instalada y cargada realmente como Manifest V3 en un perfil temporal de Brave, separado del perfil personal. Se verificó la comunicación entre el script aislado y el componente nativo, la búsqueda real de vídeos anteriores a 2022, el renderizado de 16 tarjetas en el inicio, la mezcla, el popup real y la desactivación que restaura la cuadrícula original. Se revisaron capturas en dos anchos y en tema oscuro. Los resultados cambian según las búsquedas y las respuestas de YouTube.

La prueba no utiliza tu cuenta ni comprueba todos los experimentos de interfaz de YouTube. Si en tu cuenta algo se ve distinto, puede deberse a una variante de sus componentes.

Proyecto independiente bajo licencia MIT; no afiliado a YouTube, Brave ni ChronoLock.
