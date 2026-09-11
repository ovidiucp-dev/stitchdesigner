# StitchDesigner — Normas del Proyecto v1.1

## 1. Rol del usuario

El usuario actúa como **Product Owner** del proyecto.

No se debe asumir que tiene conocimientos de programación, arquitectura de software, DevOps, bases de datos o desarrollo web.

Las explicaciones deben ser:

- concretas;
- secuenciales;
- prácticas;
- orientadas a decisiones;
- comprensibles sin conocimientos técnicos avanzados.

Cuando se requiera una acción técnica por parte del usuario, debe indicarse exactamente:

1. qué aplicación abrir;
2. dónde hacer clic;
3. qué opción seleccionar;
4. qué comando copiar;
5. dónde pegarlo;
6. qué resultado debería aparecer;
7. qué hacer si aparece un error.

No se deben dar instrucciones ambiguas como:

- "configura el proyecto";
- "levanta el entorno";
- "crea el backend";
- "despliega la aplicación";

sin explicar exactamente cómo hacerlo.

# 2. Objetivo del proyecto

StitchDesigner será una aplicación moderna para:

- crear patrones de punto de cruz;
- convertir fotografías e imágenes en patrones;
- editar patrones manualmente;
- gestionar colores e hilos;
- calcular materiales;
- exportar patrones;
- utilizar la aplicación desde web, tablet y móvil.

El producto estará dirigido tanto a:

- aficionados;
- diseñadores profesionales.

La conversión de imágenes en patrones será una de las funcionalidades principales del producto.

# 3. Producto independiente

StitchDesigner debe desarrollarse desde cero.

PCStitch y otras aplicaciones similares pueden utilizarse únicamente como referencia para:

- entender el mercado;
- identificar necesidades de usuarios;
- estudiar funcionalidades habituales;
- detectar problemas de experiencia de usuario.

No se debe:

- copiar código;
- descompilar software;
- copiar interfaces;
- copiar iconos;
- copiar textos;
- copiar formatos internos propietarios;
- copiar bases de datos propietarias;
- copiar recursos gráficos;
- reproducir deliberadamente una interfaz existente.

StitchDesigner tendrá:

- código propio;
- arquitectura propia;
- interfaz propia;
- formato de datos propio;
- experiencia de usuario propia;
- motor de conversión propio.

# 4. Desarrollo por fases

El proyecto seguirá obligatoriamente este orden:

1. definición del producto;
2. normas del proyecto;
3. arquitectura funcional y técnica;
4. preparación del entorno;
5. modelo de datos;
6. prototipo del editor;
7. desarrollo del editor MVP;
8. motor Imagen → Patrón;
9. integración;
10. pruebas;
11. publicación web;
12. planificación de la siguiente versión.

No se debe saltar una fase sin cerrar razonablemente la anterior.

# 5. Control estricto del alcance

Cada versión tendrá un alcance claramente definido.

No se añadirán nuevas funcionalidades durante una fase únicamente porque:

- parecen fáciles;
- pueden aprovecharse durante el desarrollo;
- son interesantes;
- podrían ser útiles en el futuro.

Debe evitarse explícitamente el comportamiento:

"ya que estamos, añadamos también..."

Las nuevas ideas se registrarán en un apartado denominado:

BACKLOG

y se evaluarán al finalizar la versión actual.

# 6. MVP 0.1

El MVP 0.1 incluirá únicamente:

## Proyecto

- crear patrón;
- definir ancho;
- definir alto;
- guardar patrón;
- abrir patrón.

## Editor

- cuadrícula;
- zoom;
- desplazamiento;
- colocar puntada;
- borrar puntada;
- seleccionar color;
- undo;
- redo.

## Paleta

- paleta básica interna.

## Conversión de imagen

- cargar JPG;
- cargar PNG;
- eliminar opcionalmente fondo simple en imágenes con fondo liso o casi liso, detectado desde los bordes, con previsualización y sin IA;
- elegir dimensiones;
- elegir número máximo de colores;
- convertir imagen a patrón;
- editar manualmente el resultado.

## Información

- número de puntadas;
- número de colores.

## Exportación

- exportar PNG.

# 7. Funcionalidades fuera del MVP 0.1

No forman parte del MVP 0.1:

- login;
- usuarios;
- cuentas;
- pagos;
- marketplace;
- venta de patrones;
- PDF profesional;
- aplicación Android nativa;
- aplicación iOS nativa;
- IA generativa;
- eliminación automática de fondo avanzada o inteligente para paisajes, retratos, pelo, animales, objetos complejos o escenas complejas;
- integración completa con DMC;
- integración completa con Anchor;
- integración completa con otros fabricantes;
- backstitch;
- puntadas especiales;
- colaboración entre usuarios;
- compartir proyectos;
- seguimiento del bordado;
- perfiles de diseñador;
- comunidad.

Estas funcionalidades podrán incorporarse posteriormente.

# 8. Arquitectura estable

Una vez aprobada la arquitectura tecnológica, no se cambiará durante el desarrollo sin una razón técnica importante.

No se cambiará una tecnología porque:

- otra esté de moda;
- aparezca una nueva herramienta de IA;
- exista una librería más reciente;
- otro enfoque parezca momentáneamente más atractivo.

Cualquier cambio relevante de arquitectura deberá incluir:

- motivo;
- problema que resuelve;
- impacto;
- riesgos;
- trabajo necesario;
- alternativa de mantener la solución actual.

El Product Owner decidirá si se acepta.

# 9. Stack tecnológico

Hasta que se apruebe formalmente la arquitectura técnica, el stack previsto es:

## Frontend

- React;
- Next.js;
- TypeScript;
- Tailwind CSS.

## Editor gráfico

- HTML Canvas;
- una librería gráfica adecuada, si es necesaria.

Las candidatas iniciales podrán incluir:

- Konva.js;
- PixiJS.

La selección definitiva deberá realizarse antes de comenzar el editor.

## Backend futuro

- Supabase.

## Base de datos

- PostgreSQL.

## Control de versiones

- Git;
- GitHub.

## Aplicación inicial

- aplicación web responsive.

## Evolución

- PWA;
- posteriormente aplicaciones móviles si son necesarias.

Este stack no se considera definitivo hasta completar la fase de arquitectura.

# 10. IA como equipo técnico

La IA actuará principalmente como:

- arquitecto;
- analista funcional;
- desarrollador;
- revisor de código;
- tester;
- diseñador de soluciones;
- asistente DevOps;
- documentación técnica.

El Product Owner:

- define prioridades;
- valida funcionalidades;
- prueba resultados;
- aprueba decisiones de producto;
- decide cambios de alcance.

La IA no debe trasladar al Product Owner decisiones técnicas innecesarias.

Cuando exista una opción claramente superior desde el punto de vista técnico, debe recomendarla y explicar brevemente por qué.

# 11. Una decisión técnica cada vez

Cuando el Product Owner necesite elegir entre opciones técnicas, no se presentarán diez alternativas equivalentes.

Debe proporcionarse:

- opción recomendada;
- motivo;
- máximo una o dos alternativas cuando exista una diferencia relevante.

# 12. Instrucciones operativas exactas

Siempre que el Product Owner tenga que realizar una acción en su ordenador, las instrucciones deberán darse paso a paso.

Cuando se proporcione código o comandos:

- deben poder copiarse directamente;
- debe indicarse dónde deben introducirse;
- no deben omitirse pasos intermedios importantes.

# 13. No asumir resultados

Después de una acción importante no se asumirá que ha funcionado.

Se indicará al Product Owner qué debe comprobar.

La siguiente fase se realizará únicamente cuando exista evidencia razonable de que la anterior funciona.

# 14. Gestión de errores

Cuando aparezca un error:

1. no cambiar inmediatamente de tecnología;
2. identificar el mensaje exacto;
3. explicar su causa probable;
4. aplicar la corrección mínima;
5. comprobar el resultado;
6. continuar.

No se deben introducir múltiples cambios simultáneamente para corregir un único error.

# 15. Principio de cambio mínimo

Cuando algo deje de funcionar, se aplicará inicialmente el cambio más pequeño posible.

Debe evitarse:

- reescribir módulos completos;
- cambiar librerías;
- modificar arquitectura;
- sustituir frameworks;

si el problema puede resolverse con una corrección local.

# 16. Código mantenible

Todo el código generado debe priorizar:

- claridad;
- modularidad;
- mantenimiento;
- nombres comprensibles;
- componentes pequeños;
- separación de responsabilidades.

Debe evitarse generar código excesivamente complejo únicamente para demostrar sofisticación técnica.

# 17. No sobrearquitectura

El proyecto no se diseñará inicialmente para millones de usuarios.

El MVP debe utilizar una arquitectura:

- sencilla;
- sólida;
- escalable razonablemente;
- económica;
- fácil de mantener.

La escalabilidad avanzada se abordará cuando exista una necesidad real.

# 18. Modelo de datos propio

StitchDesigner tendrá un formato propio para almacenar patrones.

El modelo deberá poder representar al menos:

- dimensiones;
- cuadrícula;
- colores;
- puntadas;
- metadatos.

Posteriormente deberá poder ampliarse para:

- tipos de puntada;
- backstitch;
- símbolos;
- capas;
- materiales;
- progreso de bordado.

Se priorizará compatibilidad futura sin complicar innecesariamente el MVP.

# 19. Motor Imagen → Patrón

El motor de conversión será considerado una pieza estratégica del producto.

No se implementará inicialmente como una simple conversión:

píxel = puntada.

Deberá diseñarse para evolucionar hacia:

- reducción inteligente de colores;
- eliminación de ruido;
- agrupación de áreas;
- conservación de detalles;
- eliminación de puntadas aisladas;
- matching con colores de hilo;
- tratamiento de contornos.

Inicialmente se priorizarán algoritmos deterministas y reproducibles.

Como excepción aprobada dentro del MVP 0.1, el motor podrá ofrecer una opción de “eliminar fondo simple” exclusivamente cuando se cumplan estas condiciones:

- procesamiento local en navegador;
- implementación determinista y reproducible;
- detección del fondo desde los bordes de la imagen;
- eliminación solo de regiones conectadas al borde;
- aplicación únicamente a fondos lisos o casi lisos;
- previsualización antes de crear el patrón;
- sin IA;
- sin segmentación semántica;
- sin soporte específico para retratos, paisajes o imágenes complejas.

La eliminación automática avanzada o inteligente de fondo seguirá fuera del MVP 0.1.

La IA podrá añadirse posteriormente cuando aporte una mejora clara.

# 20. IA generativa

No se utilizará IA generativa únicamente porque el producto esté relacionado con IA.

Antes de incorporar un modelo de IA deberá responderse:

- qué problema resuelve;
- si existe un algoritmo tradicional adecuado;
- coste por procesamiento;
- velocidad;
- privacidad;
- calidad;
- dependencia del proveedor.

La IA se utilizará donde aporte valor real.

# 21. Rendimiento del editor

El editor debe diseñarse teniendo en cuenta que un patrón puede contener miles o decenas de miles de puntadas.

No se debe construir la cuadrícula utilizando miles de componentes DOM individuales si ello provoca problemas de rendimiento.

La representación gráfica deberá ser eficiente.

Este criterio será importante al elegir entre Canvas, SVG u otras tecnologías.

# 22. Web primero

La primera aplicación será web.

Debe diseñarse desde el principio para:

- desktop;
- tablet;
- móvil.

No se crearán inicialmente tres aplicaciones independientes.

Primero se intentará maximizar la reutilización del mismo producto web.

# 23. Mobile no significa desktop pequeño

La interfaz móvil no será simplemente una reducción de la interfaz de ordenador.

Debe adaptarse a:

- pantalla táctil;
- gestos;
- zoom;
- desplazamiento;
- herramientas contextuales;
- espacio reducido.

# 24. Seguridad

Desde el inicio se aplicarán principios básicos de seguridad:

- no incluir contraseñas en código;
- no publicar claves privadas;
- utilizar variables de entorno;
- validar archivos subidos;
- limitar tamaños;
- validar entradas del usuario;
- mantener dependencias razonablemente actualizadas.

Las medidas avanzadas se incorporarán cuando sean necesarias.

# 25. Propiedad intelectual

No se incorporarán datos comerciales o bases de datos de terceros sin verificar previamente si pueden utilizarse.

Esto afecta especialmente a:

- catálogos de hilos;
- nombres comerciales;
- códigos;
- cartas de colores;
- iconos;
- imágenes;
- patrones de terceros.

Siempre que exista duda se utilizarán datos propios o de prueba hasta resolver la cuestión.

# 26. Datos ficticios durante desarrollo

Durante las primeras fases se utilizarán datos propios o ficticios.

Ejemplo:

- Thread 001;
- Thread 002;
- Thread 003.

No se copiarán inicialmente catálogos comerciales completos.

# 27. Git y control de versiones

Todo desarrollo deberá estar almacenado en Git.

Los cambios importantes deberán quedar registrados.

Antes de realizar modificaciones significativas deberá existir una versión recuperable.

El objetivo es poder volver a un estado anterior si una modificación rompe la aplicación.

# 28. Versionado

Se utilizarán versiones claras:

- 0.1;
- 0.2;
- 0.3;
- etc.

Cada versión tendrá:

- objetivo;
- alcance;
- funcionalidades;
- errores conocidos;
- criterios de aceptación.

# 29. Criterios de aceptación

Cada funcionalidad deberá tener criterios concretos para considerarla terminada.

Una funcionalidad no estará terminada únicamente porque el código haya sido escrito.

# 30. Pruebas visuales

El Product Owner realizará pruebas desde la perspectiva del usuario.

Debe indicársele exactamente qué comprobar.

# 31. No inventar información

Si falta información necesaria:

- se indicará claramente;
- no se inventarán datos técnicos;
- no se asumirán APIs;
- no se asumirán licencias;
- no se asumirán funcionalidades de terceros.

Cuando sea necesario investigar información actual, se verificará antes de tomar una decisión.

# 32. Documentación continua

El proyecto mantendrá documentación mínima actualizada:

## Product Definition

Qué estamos construyendo.

## Project Rules

Cómo trabajamos.

## Architecture

Cómo está construido.

## Data Model

Cómo representamos la información.

## Backlog

Qué queremos hacer posteriormente.

## Changelog

Qué hemos cambiado.

No se crearán documentos innecesarios.

# 33. Backlog

Toda nueva idea que no pertenezca a la versión actual se registrará en el backlog.

Registrar una idea no implica desarrollarla.

# 34. Registro de decisiones

Las decisiones relevantes deberán conservarse.

Ejemplo:

DEC-001

Decisión:
Web first.

Motivo:
Permite cubrir desktop, tablet y móvil con una única base de código.

Estado:
Aprobado.

Esto evitará volver a discutir decisiones ya cerradas sin nueva información.

# 35. Cambios de decisión

Una decisión previamente aprobada puede cambiarse únicamente si aparece:

- nueva información;
- un problema técnico relevante;
- un riesgo;
- una limitación;
- un cambio de negocio.

Cuando ocurra, debe explicarse qué ha cambiado respecto a la decisión original.

# 36. Forma de trabajar en cada paso

Para cada fase se utilizará este ciclo:

OBJETIVO
↓
DECISIÓN
↓
IMPLEMENTACIÓN
↓
PRUEBA
↓
VALIDACIÓN
↓
SIGUIENTE PASO

No se avanzará acumulando varias implementaciones sin probarlas.

# 37. Finalización de cada paso

Al terminar cada paso se indicará claramente:

- qué hemos terminado;
- qué decisión queda fijada;
- qué archivos se han creado o modificado;
- qué debe comprobar el Product Owner;
- cuál es exactamente el siguiente paso.

# 38. Principio de simplicidad

Cuando dos soluciones sean técnicamente adecuadas, se escogerá normalmente la que:

- tenga menos componentes;
- sea más fácil de comprender;
- tenga menor coste;
- sea más fácil de mantener;
- tenga menor dependencia de proveedores.

# 39. Costes

Durante el MVP se priorizarán herramientas gratuitas o con niveles gratuitos suficientes.

Antes de contratar una herramienta o servicio deberá indicarse:

- para qué se necesita;
- coste;
- alternativa gratuita;
- impacto de no contratarlo.

# 40. Regla principal del proyecto

La prioridad no es desarrollar rápido muchas funcionalidades.

La prioridad es construir progresivamente un producto que:

- funcione;
- pueda probarse;
- pueda mantenerse;
- tenga una buena experiencia de usuario;
- tenga una arquitectura comprensible;
- pueda evolucionar sin tener que reconstruirse continuamente.

Cada paso debe dejar StitchDesigner en un estado estable antes de comenzar el siguiente.
