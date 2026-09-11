# StitchDesigner — Product Definition v1.1

## 1. Visión

Crear una aplicación moderna para diseño de patrones de punto de cruz, accesible desde web, tablet y móvil, destinada tanto a aficionados como a diseñadores profesionales.

La aplicación permitirá crear patrones manualmente y, especialmente, transformar fotografías e imágenes en patrones de punto de cruz de forma sencilla y con resultados de alta calidad.

El producto se desarrollará desde cero, sin reutilizar código, interfaces, activos o formatos internos de PCStitch.

---

## 2. Usuarios objetivo

### Usuario aficionado

Quiere:

- crear patrones propios;
- transformar fotografías personales en patrones;
- saber qué hilos necesita;
- conocer el tamaño final del bordado;
- imprimir o visualizar el patrón;
- seguir el patrón mientras borda.

No necesita conocimientos técnicos.

### Diseñador profesional

Quiere:

- crear patrones complejos;
- trabajar con muchos colores;
- editar los patrones generados automáticamente;
- disponer de símbolos y leyendas profesionales;
- calcular materiales;
- exportar patrones preparados para entregar o vender;
- gestionar una biblioteca de diseños.

---

## 3. Funcionalidad principal

La funcionalidad diferenciadora de StitchDesigner será:

# Imagen → Patrón de punto de cruz

El usuario podrá cargar una fotografía o imagen y convertirla automáticamente en un patrón.

Flujo:

Imagen
→ eliminación opcional de fondo simple
→ selección de tamaño
→ selección de número de colores
→ análisis de la imagen
→ reducción inteligente de colores
→ asociación a hilos reales
→ generación del patrón
→ edición manual
→ cálculo de materiales
→ exportación

El usuario no tendrá que entender los algoritmos utilizados.

---

## 4. Creación de patrones

La aplicación permitirá dos formas de crear un patrón.

### A. Desde cero

El usuario define:

- ancho;
- alto;
- tipo de tela;
- densidad de tela;
- paleta de colores.

Se abre posteriormente el editor de patrones.

### B. Desde una imagen

El usuario carga:

- JPG;
- PNG;
- HEIC u otros formatos que posteriormente decidamos soportar.

La aplicación transforma la imagen en un patrón editable.

---

## 5. Editor de patrones

El editor será el núcleo de la aplicación.

Debe permitir como mínimo:

- cuadrícula;
- zoom;
- desplazamiento;
- seleccionar color;
- colocar puntadas;
- borrar puntadas;
- rellenar áreas;
- seleccionar áreas;
- copiar;
- pegar;
- mover;
- deshacer;
- rehacer;
- símbolos por color.

En versiones posteriores se incorporarán:

- media cruz;
- cuarto de cruz;
- tres cuartos;
- backstitch;
- nudos franceses;
- otras puntadas especiales.

---

## 6. Conversión de imágenes

El usuario podrá definir inicialmente:

### Tamaño

Por ejemplo:

- 50 × 50;
- 100 × 100;
- 150 × 200;
- tamaño personalizado.

### Número máximo de colores

Por ejemplo:

- 10;
- 20;
- 30;
- 50;
- personalizado.

### Paleta

Inicialmente se utilizará una paleta de trabajo propia.

Posteriormente se incorporarán catálogos de fabricantes cuando se haya comprobado que pueden utilizarse legalmente.

### Fondo simple opcional

En el MVP 0.1 se permitirá, de forma opcional, eliminar fondos simples antes de convertir la imagen a patrón.

Esta función estará limitada a:

- fondos lisos o casi lisos;
- detección del fondo a partir de los bordes de la imagen;
- eliminación únicamente de regiones conectadas al borde;
- procesamiento local en el navegador;
- comportamiento determinista y reproducible;
- previsualización antes de crear el patrón.

No incluirá segmentación semántica, IA, eliminación avanzada de fondo ni soporte específico para retratos, paisajes, pelo, animales u otras escenas complejas.

### Procesamiento

El motor deberá:

- reducir el tamaño de la imagen;
- simplificar colores;
- identificar colores dominantes;
- aproximarlos a colores de hilo;
- reducir ruido;
- evitar puntadas aisladas innecesarias;
- conservar detalles importantes.

El resultado siempre podrá modificarse manualmente.

---

## 7. Mejora inteligente de fotografías

Esta funcionalidad se desarrollará progresivamente.

Ejemplos futuros:

- eliminar fondo de forma avanzada o inteligente en retratos, paisajes y escenas complejas;
- identificar automáticamente el sujeto;
- conservar caras;
- conservar ojos;
- simplificar fondos;
- detectar contornos;
- eliminar pequeños grupos de puntadas;
- mejorar la conversión de fotografías de personas o animales.

La IA será un complemento del motor de conversión, no un sustituto completo.

---

## 8. Paleta de hilos

Cada color tendrá como mínimo:

- identificador;
- nombre;
- representación RGB;
- símbolo;
- fabricante, cuando corresponda.

Posteriormente se podrán incorporar:

- DMC;
- Anchor;
- Madeira;
- otros fabricantes.

---

## 9. Cálculo de materiales

A partir del patrón, StitchDesigner calculará:

- número total de puntadas;
- puntadas por color;
- longitud estimada de hilo;
- número aproximado de madejas;
- dimensiones finales del bordado;
- dimensiones recomendadas de tela.

El cálculo tendrá en cuenta:

- tipo de tela;
- count de la tela;
- número de hebras;
- margen alrededor del diseño.

---

## 10. Exportación

El usuario podrá generar un documento de patrón.

Como mínimo deberá contener:

- imagen del diseño;
- información del patrón;
- dimensiones;
- cuadrícula;
- símbolos;
- leyenda;
- lista de colores;
- cantidad estimada de hilo.

Formatos inicialmente previstos:

- PDF;
- PNG.

---

## 11. Biblioteca de patrones

Cada usuario podrá disponer de:

My Patterns

con:

- nombre;
- miniatura;
- dimensiones;
- fecha de creación;
- última modificación.

Permitirá:

- crear;
- abrir;
- duplicar;
- renombrar;
- eliminar.

---

## 12. Multidispositivo

La aplicación deberá diseñarse desde el principio para funcionar en:

- ordenador;
- tablet;
- móvil.

El objetivo inicial será una aplicación web responsive.

Posteriormente podrá convertirse en:

- PWA;
- aplicación Android;
- aplicación iOS.

---

## 13. Seguimiento del bordado

Se deja prevista una futura modalidad distinta del editor:

"Stitch Mode"

permitirá utilizar móvil o tablet mientras se borda.

El usuario podrá:

- ampliar el patrón;
- marcar puntadas realizadas;
- seleccionar un color;
- visualizar únicamente un color;
- conocer el porcentaje completado.

Esta funcionalidad no pertenece al primer MVP.

---

## 14. Marketplace

La arquitectura deberá permitir que en el futuro puedan existir:

- patrones públicos;
- patrones gratuitos;
- patrones de pago;
- diseñadores;
- perfiles;
- marketplace.

No se desarrollará en las primeras versiones.

---

# 15. MVP — Versión 0.1

La primera versión funcional tendrá exclusivamente:

### Proyecto

- crear patrón;
- definir ancho;
- definir alto;
- abrir patrón;
- guardar patrón.

### Editor

- cuadrícula;
- zoom;
- desplazamiento;
- colocar puntada;
- borrar puntada;
- seleccionar color;
- undo;
- redo.

### Paleta

- paleta básica interna.

### Imagen

- cargar JPG/PNG;
- eliminar opcionalmente fondo simple en imágenes con fondo liso o casi liso, detectado desde los bordes, con previsualización y sin IA;
- elegir dimensiones;
- elegir número de colores;
- convertir imagen a patrón;
- editar posteriormente el resultado.

### Información

- número total de puntadas;
- número de colores.

### Salida

- exportar imagen PNG.

---

# 16. No incluido en el MVP 0.1

Quedan expresamente fuera:

- login;
- usuarios;
- pagos;
- marketplace;
- PDF profesional;
- app iOS;
- app Android;
- IA generativa;
- eliminación automática de fondo avanzada o inteligente para paisajes, retratos, pelo, animales, objetos complejos o escenas complejas;
- catálogos completos DMC/Anchor;
- backstitch;
- puntadas especiales;
- compartir proyectos;
- colaboración;
- seguimiento de bordado;
- venta de patrones.

No se añadirán estas funcionalidades durante el desarrollo del MVP salvo decisión explícita del Product Owner.

---

# 17. Criterio de éxito del MVP

El MVP será considerado válido cuando una persona pueda:

1. abrir StitchDesigner;
2. crear una cuadrícula;
3. dibujar manualmente un pequeño patrón;
4. guardar el patrón;
5. volver a abrirlo;
6. importar una fotografía;
7. transformarla en un patrón;
8. modificar manualmente el resultado;
9. exportarlo como imagen.

Si estas nueve operaciones funcionan correctamente, el MVP 0.1 estará terminado.

---

# 18. Principio fundamental

La aplicación no pretende ser una copia moderna de PCStitch.

PCStitch sirve únicamente como referencia para comprender el tipo de problema.

StitchDesigner tendrá:

- arquitectura propia;
- interfaz propia;
- código propio;
- modelo de datos propio;
- experiencia de usuario propia;
- motor de conversión propio.

El objetivo es construir una nueva generación de herramientas para creación de patrones de punto de cruz.
