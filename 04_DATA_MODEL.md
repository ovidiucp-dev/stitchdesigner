# StitchDesigner — Modelo de Datos v1.0

## 1. Estado

**Versión:** 1.0  
**Aplicable a:** MVP 0.1  
**Estado:** Aprobado por el Product Owner

Este documento define el modelo de datos base de StitchDesigner para el MVP 0.1.

El modelo `Pattern` será el lenguaje común entre:

- Editor
- Converter
- Exporter

No se cambiará durante el desarrollo salvo que aparezca una limitación técnica demostrable y aprobada por el Product Owner.

---

# 2. Entidad raíz: Pattern

`Pattern` será el objeto raíz del patrón y el único punto de intercambio entre los módulos principales.

Estructura conceptual:

```text
Pattern
├── version
├── id
├── name
├── width
├── height
├── fabric
├── palette
├── stitches
└── metadata
```

Campos:

- `version`: versión del formato `.stitch`.
- `id`: identificador único del patrón.
- `name`: nombre visible del proyecto.
- `width`: ancho del patrón en puntadas.
- `height`: alto del patrón en puntadas.
- `fabric`: información de la tela.
- `palette`: colores/hilos disponibles en el patrón.
- `stitches`: puntadas colocadas.
- `metadata`: información auxiliar del patrón.

Ejemplo:

```json
{
  "version": "1.0",
  "id": "pattern-001",
  "name": "Mi primer patrón",
  "width": 100,
  "height": 80,
  "fabric": {},
  "palette": [],
  "stitches": [],
  "metadata": {}
}
```

---

# 3. Entidad Stitch

Estructura conceptual:

```text
Stitch
├── x
├── y
├── colorId
└── type
```

Ejemplo:

```json
{
  "x": 12,
  "y": 7,
  "colorId": "thread-004",
  "type": "full"
}
```

Campos:

- `x`: columna dentro de la cuadrícula.
- `y`: fila dentro de la cuadrícula.
- `colorId`: referencia al color de la paleta.
- `type`: tipo de puntada.

En el MVP 0.1 solo existirá:

```text
type = "full"
```

El campo `type` se mantiene desde el principio para permitir futuras ampliaciones como:

- `half`
- `quarter`
- `three-quarter`

Reglas:

```text
x >= 0
y >= 0
x < pattern.width
y < pattern.height
```

En el MVP, una celda solo podrá contener una puntada completa.

Si se coloca otra puntada completa en la misma celda, sustituirá a la anterior.

`Stitch` no duplicará nombre, RGB, símbolo ni otros datos del color. Solo almacenará `colorId`.

---

# 4. Entidad Thread

Estructura conceptual:

```text
Thread
├── id
├── name
├── rgb
├── symbol
└── brand
```

Ejemplo:

```json
{
  "id": "thread-004",
  "name": "Dark Red",
  "rgb": "#A92332",
  "symbol": "X",
  "brand": "internal"
}
```

Campos:

- `id`: identificador único dentro de la paleta.
- `name`: nombre legible del color.
- `rgb`: representación visual del color.
- `symbol`: símbolo asociado al color.
- `brand`: origen o marca del color.

Durante el MVP se utilizará:

```text
brand = "internal"
```

No se incorporarán todavía catálogos comerciales completos como DMC, Anchor u otros fabricantes.

En el futuro podrán añadirse campos como:

- código comercial;
- fabricante;
- equivalencias;

sin romper el modelo actual.

---

# 5. Entidad Fabric

Estructura conceptual:

```text
Fabric
├── type
├── count
└── color
```

Ejemplo:

```json
{
  "type": "aida",
  "count": 14,
  "color": "#FFFFFF"
}
```

Campos:

- `type`: tipo de tela.
- `count`: densidad de la tela.
- `color`: color visual de la tela.

Reglas:

```text
count > 0
```

`count` no queda limitado a 14, 16 o 18.

El modelo debe aceptar cualquier valor positivo válido, incluyendo por ejemplo:

- 11
- 14
- 16
- 18
- 20
- 22
- 25
- 28
- 32
- otros valores personalizados

La interfaz podrá ofrecer valores habituales como accesos rápidos, pero el modelo no impondrá una lista cerrada.

Ejemplos válidos:

```json
{
  "type": "aida",
  "count": 11,
  "color": "#FFFFFF"
}
```

```json
{
  "type": "evenweave",
  "count": 28,
  "color": "#F5F1E8"
}
```

---

# 6. Formato de archivo `.stitch`

StitchDesigner tendrá un formato propio con extensión:

```text
.stitch
```

Internamente será JSON estructurado.

Ejemplo completo:

```json
{
  "version": "1.0",
  "id": "pattern-001",
  "name": "Mi primer patrón",
  "width": 100,
  "height": 80,
  "fabric": {
    "type": "aida",
    "count": 14,
    "color": "#FFFFFF"
  },
  "palette": [
    {
      "id": "thread-001",
      "name": "Black",
      "rgb": "#000000",
      "symbol": "X",
      "brand": "internal"
    }
  ],
  "stitches": [
    {
      "x": 12,
      "y": 7,
      "colorId": "thread-001",
      "type": "full"
    }
  ],
  "metadata": {
    "createdAt": "2026-09-11T10:00:00Z",
    "updatedAt": "2026-09-11T10:00:00Z"
  }
}
```

---

# 7. Versionado del formato

El campo `version` será obligatorio.

La primera versión será `1.0`.

Regla de compatibilidad:

- añadir campos nuevos no debe romper archivos antiguos;
- los campos nuevos deberán diseñarse para ser compatibles hacia atrás cuando sea posible;
- si en el futuro aparece un cambio incompatible, se incrementará la versión mayor.

Ejemplo:

```text
1.0 → 2.0
```

---

# 8. Metadata

En el MVP, `metadata` podrá contener:

- `createdAt`
- `updatedAt`

Ambos valores utilizarán formato ISO 8601.

---

# 9. Reglas de integridad

Cada archivo `.stitch` deberá cumplir al menos:

- `version` existe y es compatible.
- `id` existe.
- `name` existe.
- `width` es un entero mayor que 0.
- `height` es un entero mayor que 0.
- `fabric.count` es mayor que 0.
- `fabric.color` tiene formato de color válido.
- cada elemento de `palette` tiene `id`, `name`, `rgb`, `symbol` y `brand`.
- no existen dos elementos de `palette` con el mismo `id`.
- cada `stitch.x` y `stitch.y` es entero.
- cada puntada está dentro de los límites del patrón.
- cada `stitch.colorId` existe en `palette`.
- en el MVP, cada `stitch.type` debe ser `full`.
- no puede haber dos puntadas completas diferentes ocupando la misma celda.
- `createdAt` y `updatedAt`, si existen, deben ser fechas válidas.

---

# 10. Gestión de archivos inválidos

StitchDesigner no corregirá silenciosamente un archivo `.stitch` inválido.

Si un archivo no cumple las reglas del modelo:

- se rechazará su carga; o
- se mostrará un mensaje de error claro.

No se modificarán datos del usuario sin informar.

---

# 11. Separación entre módulos

Los tres módulos principales trabajarán con el mismo modelo:

```text
EDITOR
   │
   ├── lee Pattern
   └── modifica Pattern

CONVERTER
   │
   └── genera Pattern

EXPORTER
   │
   └── consume Pattern
```

Ningún módulo principal tendrá un formato de patrón independiente.

---

# 12. Principios técnicos fijados

El modelo deberá permanecer:

- simple;
- extensible;
- independiente de la interfaz;
- independiente del Canvas;
- independiente del algoritmo de conversión;
- independiente del formato de exportación.

Las coordenadas del patrón no dependerán de:

- resolución de pantalla;
- nivel de zoom;
- tamaño físico del monitor;
- tamaño visual de una celda.

---

# 13. Decisiones aprobadas

## DEC-DATA-001 — Pattern como raíz
`Pattern` será el objeto raíz y lenguaje común entre Editor, Converter y Exporter.

## DEC-DATA-002 — Coordenadas enteras
Las puntadas del MVP utilizarán coordenadas enteras `x` e `y`.

## DEC-DATA-003 — Referencia de color
`Stitch` guardará `colorId` y no duplicará la información completa de `Thread`.

## DEC-DATA-004 — Tipo de puntada preparado para ampliación
El MVP solo admite `full`, pero el modelo incluirá `type`.

## DEC-DATA-005 — Paleta interna
El MVP utilizará una paleta propia con `brand = "internal"`.

## DEC-DATA-006 — Count abierto
`Fabric.count` será un número positivo y no una lista cerrada de valores.

## DEC-DATA-007 — Formato propio
El patrón se almacenará en un formato propio `.stitch` basado en JSON.

## DEC-DATA-008 — Versionado desde el inicio
Todo `.stitch` incluirá `version`, comenzando por `1.0`.

## DEC-DATA-009 — Validación estricta
Los archivos inválidos no se corregirán silenciosamente.

---

# 14. Criterio de cierre del Paso 5

El Paso 5 — Modelo de datos se considera cerrado con este documento aprobado.

El siguiente paso será:

# PASO 6 — Prototipo del editor

En esa fase se empezará a construir el primer prototipo visual y funcional del editor usando el modelo `Pattern` aquí definido.
