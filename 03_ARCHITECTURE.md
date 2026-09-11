# StitchDesigner — Arquitectura funcional y técnica v1.0

## 1. Estado

**Versión:** 1.0  
**Aplicable a:** MVP 0.1  
**Estado:** Aprobado por el Product Owner

Esta arquitectura es la línea base del MVP 0.1.

No se cambiará durante el desarrollo salvo que aparezca una limitación técnica demostrable.

# 2. Principio arquitectónico

StitchDesigner comenzará como una aplicación:

**Web + local-first**

Esto significa:

- funciona en un navegador;
- funciona en Windows y Mac;
- será responsive;
- se preparará para tablet y móvil;
- los patrones se procesarán inicialmente en el dispositivo;
- las imágenes se procesarán inicialmente en el dispositivo;
- no será obligatorio enviar fotografías a ningún servidor;
- no necesitaremos cuentas de usuario durante el MVP;
- no necesitaremos pagar servidores para desarrollar el MVP.

La arquitectura se preparará para incorporar posteriormente cloud, usuarios y aplicaciones móviles.

# 3. Arquitectura general del MVP

USUARIO
→ StitchDesigner WEB
→ PROYECTOS / EDITOR / IMPORTADOR DE IMÁGENES
→ MOTOR IMAGEN → PATRÓN
→ MODELO DE PATRÓN
→ GUARDAR PROYECTO / EXPORTAR PNG

Todo esto funcionará inicialmente dentro del navegador.

# 4. Tecnología aprobada para el frontend

Utilizaremos:

- Next.js
- React
- TypeScript
- Tailwind CSS

# 5. Versión de Next.js

Utilizaremos una versión estable LTS de Next.js.

No utilizaremos:

- nightly;
- canary;
- versiones beta;
- versiones experimentales.

Las versiones exactas quedarán registradas automáticamente en `package.json`.

No se actualizarán dependencias principales durante el desarrollo del MVP sin motivo.

# 6. Editor gráfico

Utilizaremos:

# HTML Canvas

como tecnología principal del editor.

No construiremos una cuadrícula utilizando miles de elementos HTML.

Canvas permitirá dibujar eficientemente:

- cuadrícula;
- puntadas;
- símbolos;
- selección;
- zoom;
- desplazamiento.

# 7. Konva y PixiJS

Se evaluaron conceptualmente ambas opciones.

La decisión es no utilizar inicialmente ni Konva ni PixiJS para representar cada puntada.

Crearemos un pequeño motor propio utilizando:

**HTML Canvas 2D**

Esto proporciona control directo sobre:

- cuadrícula;
- celdas;
- colores;
- zoom;
- coordenadas;
- rendimiento.

Si posteriormente necesitamos elementos interactivos complejos, podremos reconsiderar Konva.

# 8. Motor Canvas

El editor tendrá conceptualmente varias capas:

- interacción;
- símbolos;
- puntadas;
- cuadrícula;
- fondo.

No significa necesariamente cinco elementos Canvas diferentes.

Es una separación lógica del motor gráfico.

# 9. Coordenadas

El patrón tendrá su propio sistema de coordenadas.

Una puntada no dependerá de:

- resolución de pantalla;
- zoom;
- tamaño del monitor.

Ejemplo:

Puntada:
- x: 25
- y: 37
- color: THREAD_007

El Canvas decidirá posteriormente dónde representarla físicamente.

Esto permitirá hacer zoom sin modificar el patrón.

# 10. Modelo conceptual principal

La entidad fundamental será:

# Pattern

Contendrá:

- id
- name
- width
- height
- fabric
- palette
- stitches
- metadata

# 11. Puntadas

Conceptualmente:

Stitch
- x
- y
- colorId
- type

En MVP solamente existirá:

`type = full`

Pero mantener `type` permitirá posteriormente incorporar:

- half
- quarter
- three-quarter
- etc.

sin rediseñar completamente el modelo.

# 12. Paleta

Cada hilo tendrá inicialmente:

Thread
- id
- name
- rgb
- symbol

Inicialmente utilizaremos colores propios de prueba.

No utilizaremos todavía catálogos comerciales completos.

# 13. Fabric

El modelo quedará preparado para incluir:

Fabric
- type
- count
- color

Aunque en el MVP 0.1 no utilizaremos todavía todos estos datos para realizar cálculos complejos.

# 14. Formato de archivo propio

Crearemos nuestro propio formato.

Nombre provisional:

`.stitch`

Internamente será información estructurada basada en JSON.

El usuario no tendrá que editar este archivo.

# 15. Guardar proyecto

En el MVP tendremos dos mecanismos.

## Guardado local

El navegador guardará temporalmente el proyecto.

Utilizaremos:

**IndexedDB**

para almacenamiento local.

## Archivo

El usuario podrá además guardar un archivo:

`mi-patron.stitch`

y posteriormente volver a abrirlo.

# 16. Por qué IndexedDB

No utilizaremos `localStorage` para guardar patrones completos.

IndexedDB está diseñada para almacenar cantidades de datos considerablemente mayores y estructuras más complejas.

# 17. Motor Imagen → Patrón

Esta será una pieza independiente del editor.

Arquitectura:

IMAGEN
→ VALIDACIÓN
→ REDIMENSIONADO
→ ANÁLISIS DE COLORES
→ REDUCCIÓN DE COLORES
→ LIMPIEZA
→ GENERACIÓN DE PATRÓN
→ Pattern

El editor no tendrá que saber cómo se creó el patrón.

La creación manual y la conversión desde imagen producirán exactamente el mismo objeto `Pattern`.

# 18. Procesamiento de fotografías

En el MVP realizaremos inicialmente el procesamiento en:

# navegador

mediante JavaScript/TypeScript.

No utilizaremos inicialmente:

- Python backend;
- OpenCV server;
- OpenAI API;
- Azure AI;
- AWS AI;
- servidores GPU.

# 19. Motivo

El navegador puede:

1. leer la imagen;
2. redimensionarla;
3. leer sus píxeles;
4. analizar colores;
5. reducir colores;
6. generar el patrón.

Todo puede ocurrir en el PC o móvil sin enviar inicialmente la fotografía a Internet.

Esto implica:

- coste prácticamente cero;
- mayor privacidad;
- menor arquitectura;
- respuesta rápida;
- desarrollo más sencillo.

# 20. Algoritmo de conversión V1

La primera implementación utilizará aproximadamente:

IMAGEN
→ resize
→ RGB → espacio de color
→ color quantization
→ reducción a N colores
→ limpieza
→ pixel → stitch

Evaluaremos principalmente:

- Median Cut;
- K-Means u otros algoritmos de cuantización adecuados.

La selección concreta se realizará durante el diseño del motor.

# 21. No usar IA inicialmente

La versión inicial del conversor no utilizará IA generativa.

Primero construiremos una referencia objetiva:

**Motor tradicional V1**

Después podremos comparar:

**Motor tradicional vs Motor inteligente**

y determinar realmente cuánto mejora la IA.

# 22. Limpieza del patrón

El motor incorporará posteriormente reglas como:

detección de pequeñas regiones
→ análisis de vecinos
→ sustitución cuando corresponda

Esto puede ser muy importante para producir patrones cómodos de bordar.

# 23. Undo / Redo

No guardaremos una copia completa del patrón cada vez que el usuario haga algo.

Implementaremos un sistema basado en operaciones:

- ADD_STITCH
- REMOVE_STITCH
- CHANGE_COLOR

Cada acción tendrá información suficiente para UNDO y REDO.

# 24. Estado de la aplicación

Utilizaremos inicialmente:

# React state + Context

No introduciremos inicialmente:

- Redux;
- MobX;
- Zustand;

salvo que aparezca una necesidad demostrable.

# 25. Backend

## MVP 0.1

No habrá backend obligatorio.

## Futuro

Cuando incorporemos:

- usuarios;
- sincronización;
- cloud;
- marketplace;

utilizaremos inicialmente:

# Supabase

# 26. Arquitectura futura cloud

Quedará prevista:

StitchDesigner
→ Supabase/Postgres
→ Storage
→ Services
→ Users / Patterns / Profiles / Marketplace

# 27. Autenticación futura

Cuando sea necesaria utilizaremos inicialmente:

**Supabase Auth**

permitiendo posteriormente:

- email;
- Google;
- posiblemente Apple.

No forma parte del MVP 0.1.

# 28. Exportación PNG

Arquitectura:

Pattern
→ Renderer
→ Canvas
→ PNG

No necesitaremos servidor para generar PNG.

# 29. PDF

No pertenece al MVP.

Posteriormente:

Pattern
→ PDF Generator
→ Cover / Pattern pages / Legend / Materials

El generador PDF será un módulo independiente.

# 30. Arquitectura de carpetas

Estructura conceptual:

stitchdesigner/
- app/
- components/
- editor/
  - canvas/
  - tools/
  - rendering/
- pattern/
  - model/
  - commands/
  - storage/
- image-converter/
  - processing/
  - quantization/
  - cleanup/
- palette/
- export/
- types/
- tests/

Los nombres exactos podrán ajustarse durante la creación inicial sin cambiar la arquitectura.

# 31. Separación fundamental

Habrá tres motores claramente separados:

EDITOR / CONVERTER / EXPORTER
→ PATTERN

`Pattern` será el lenguaje común.

Esto permitirá modificar el conversor sin romper el editor.

# 32. Responsive

Habrá una misma aplicación con diferentes interfaces para:

- desktop;
- tablet;
- móvil.

# 33. Gestos

La arquitectura del editor quedará preparada para:

## PC

- click;
- drag;
- rueda;
- teclado.

## Tablet/móvil

- tap;
- drag;
- pinch zoom;
- long press.

No implementaremos todos simultáneamente durante la primera prueba.

# 34. Desarrollo Desktop First, pero no Desktop Only

El primer prototipo será optimizado para ordenador.

El código gráfico no dependerá de la interfaz desktop.

Posteriormente adaptaremos controles para táctil.

# 35. Aplicación móvil

No desarrollaremos inicialmente aplicaciones iOS o Android nativas.

Primero convertiremos StitchDesigner en:

# PWA

Después evaluaremos:

# Capacitor

u otra alternativa para distribución en stores.

# 36. Hosting

Durante desarrollo:

`localhost`

Posteriormente utilizaremos inicialmente:

# Vercel

para publicar la aplicación web Next.js.

# 37. Repositorio

Todo el código se almacenará en:

# GitHub

Repositorio previsto:

`stitchdesigner`

Cada estado estable quedará protegido mediante Git.

# 38. Ramas

Durante el MVP evitaremos una estrategia Git compleja.

Utilizaremos:

`main`

y, cuando sea necesario:

`feature/...`

# 39. Tests

Tendremos tres niveles.

## A. Tests automáticos

Especialmente para:

- modelo;
- coordenadas;
- conversión;
- colores;
- undo/redo.

## B. Tests visuales

Ejecutados por el Product Owner.

## C. Casos patrón

Conservaremos varias imágenes conocidas para comprobar que cambios futuros no empeoran el conversor.

# 40. Imágenes de prueba

Crearemos un conjunto estable, por ejemplo:

- TEST-01 formas geométricas simples
- TEST-02 logo/ilustración
- TEST-03 flor
- TEST-04 animal
- TEST-05 retrato
- TEST-06 paisaje

Cuando modifiquemos el motor compararemos siempre estas mismas imágenes.

# 41. Arquitectura de conversión futura

El diseño permitirá posteriormente:

IMAGE
→ CLASSIC ENGINE

o

IMAGE
→ AI PREPROCESSING
→ CLASSIC ENGINE

El motor de patrones seguirá siendo nuestro.

# 42. Marketplace futuro

No se implementará ahora.

Pero `Pattern` tendrá un identificador propio y metadatos suficientes para que posteriormente pueda relacionarse con:

- user;
- designer;
- price;
- license;
- marketplace.

# 43. Coste de infraestructura MVP

Objetivo:

**0 € / mes**

durante desarrollo.

Necesitaremos principalmente:

- ordenador;
- navegador;
- VS Code;
- Node.js;
- Git;
- GitHub;
- ChatGPT.

No necesitamos inicialmente:

- servidor;
- base de datos;
- API de IA;
- almacenamiento cloud.

# 44. Herramientas de desarrollo

Herramientas base:

- Visual Studio Code
- Node.js
- Git
- GitHub
- Chrome
- ChatGPT

No añadiremos inicialmente más herramientas salvo necesidad.

# 45. Flujo de desarrollo

El Product Owner no programará.

Flujo:

PRODUCT OWNER
→ requisito
→ ChatGPT
→ código
→ StitchDesigner
→ ejecución
→ PRODUCT OWNER
→ prueba
→ aceptación / error

# 46. Criterio arquitectónico principal

Siempre que tengamos que decidir entre una solución sofisticada y una solución simple que cumple el objetivo, utilizaremos la segunda mientras no comprometa razonablemente la evolución futura.

# 47. Arquitectura aprobada resumida

## Aplicación
Next.js + React + TypeScript

## UI
Tailwind CSS

## Editor
HTML Canvas 2D propio

## Estado
React

## Modelo
TypeScript

## Formato de patrón
JSON propio `.stitch`

## Almacenamiento MVP
IndexedDB + archivos `.stitch`

## Imagen → patrón
TypeScript en navegador

## Exportación
Canvas → PNG

## Backend MVP
Ninguno

## Backend futuro
Supabase

## Base de datos futura
PostgreSQL

## Storage futuro
Supabase Storage

## Auth futura
Supabase Auth

## Hosting
Vercel

## Código
GitHub

## Primera plataforma
Web responsive

## Segunda plataforma
PWA

## App Stores
Fase posterior

# 48. Decisiones arquitectónicas

## DEC-001 — Web First
**Decisión:** StitchDesigner comienza como aplicación web responsive.

## DEC-002 — Local First
**Decisión:** el MVP funcionará sin backend obligatorio.

## DEC-003 — Canvas
**Decisión:** utilizar HTML Canvas 2D para el editor.

## DEC-004 — Modelo propio
**Decisión:** utilizar modelo y formato de patrón propios.

## DEC-005 — Conversión local
**Decisión:** procesar inicialmente imágenes en el navegador.

## DEC-006 — IA posterior
**Decisión:** construir primero un motor determinista y posteriormente evaluar IA.

## DEC-007 — Supabase posterior
**Decisión:** Supabase será la primera opción para cloud cuando se incorporen usuarios.

## DEC-008 — Desktop First Development
**Decisión:** desarrollar primero la experiencia de escritorio, manteniendo arquitectura responsive.

# 49. Criterio de cierre del Paso 3

La fase de arquitectura está cerrada y aprobada.

El siguiente paso será:

# PASO 4 — Preparación del entorno

En ese paso instalaremos, uno a uno:

1. Visual Studio Code;
2. Node.js;
3. Git;
4. cuenta/repositorio GitHub;
5. creación del proyecto StitchDesigner;
6. ejecución local;
7. primera copia de seguridad en GitHub.

Solo después comenzará el desarrollo.
