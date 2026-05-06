# 🔬 Simulador de Física — Cinemática

<div align="center">

![Version](https://img.shields.io/badge/versión-2.0.0-00e5ff?style=flat-square&labelColor=0d1120)
![Stack](https://img.shields.io/badge/stack-vanilla%20JS-a3ff6b?style=flat-square&labelColor=0d1120)
![Motor](https://img.shields.io/badge/motor-p5.js%201.6-ff3c6e?style=flat-square&labelColor=0d1120)
![Gráficas](https://img.shields.io/badge/gráficas-Chart.js-ffb830?style=flat-square&labelColor=0d1120)
![Sin build](https://img.shields.io/badge/build%20step-ninguno-00e5ff?style=flat-square&labelColor=0d1120)

**Cuatro simulaciones interactivas de cinemática con física precisa, gráficas en tiempo real y visualización vectorial.**

</div>

---

## 🧪 Simuladores incluidos

| Simulador                | Descripción                                                | Fórmula principal            |
| ------------------------ | ---------------------------------------------------------- | ---------------------------- |
| ⚡ **MRU + MCU**          | Movimiento rectilíneo con transición automática a circular | `x = x₀ + v·t` · `ac = v²/r` |
| 🚀 **MUA**                | Movimiento uniformemente acelerado con gráficas dinámicas  | `x = x₀ + v₀t + ½at²`        |
| 🔩 **MUA + Fricción**     | MUA con masa, fricción cinética y vectores de fuerza       | `F_neta = F_a − μmg`         |
| 📐 **Movimiento Variado** | Aceleración dependiente del tiempo con cálculo simbólico   | `a(t) = f(t)`                |

---

## 🚀 Instalación y ejecución

> ⚠️ **Importante:** no abrir `index.html` directamente como `file://`. Los simuladores usan scripts externos que requieren un servidor HTTP por restricciones CORS del navegador.

### Opción A — Python (recomendado, sin dependencias)

```bash
cd simulador_fisica
python -m http.server 8080
# → Abrir: http://localhost:8080
```

### Opción B — Node.js

```bash
npx serve .
# o
npx http-server . -p 8080
```

### Opción C — VS Code Live Server

1. Instalar la extensión **Live Server** de Ritwick Dey
2. `File → Open Folder` → seleccionar la carpeta del proyecto
3. Click derecho en `index.html` → **"Open with Live Server"**

---

## 📁 Estructura del proyecto

```
simulador_fisica/
│
├── index.html                  ← Menú principal (Welcome + navegación)
├── main.js                     ← Controlador de pantallas
├── state.js                    ← Estado global de la aplicación
├── README.md                   ← Este archivo
│
└── simulators/
    ├── mru+mcu_simulacion.html ← Simulador MRU → MCU
    ├── mua_simulacion.html     ← Simulador MUA
    ├── mua_friccion.html       ← Simulador MUA + Fricción
    └── movimiento_variado.html ← Simulador Movimiento Variado
```

Cada simulador es una página HTML independiente con su propia lógica, controles y gráficas — no requieren módulos compartidos entre sí.

---

## 🐛 Bug corregido — MRU/MCU

### Síntoma
Al entrar al tramo circular, el objeto se **congelaba**. El loop de p5 seguía corriendo pero la posición no se actualizaba.

### Causa raíz

```js
// ❌ ORIGINAL — ROTO
distancia = velocidad * (tiempo / 60); // cálculo por frames, no por tiempo real
if (distancia >= 100) {
  modoCircular = true;
  distancia = 100;  // se fija en 100 PARA SIEMPRE → condición vuelve a entrar cada frame
}
tiempo++;
```

### Solución

```js
// ✅ CORREGIDO
const dt = p.deltaTime / 1000;              // segundos reales (nunca 0)
_state.distancia += _params.velocidad * dt;  // Δx = v·dt (incremental)

if (_state.distancia >= PISTA_LENGTH_M) {
  _state.modoCircular = true;               // se setea UNA sola vez
  _state.angulo = Math.PI;                  // ángulo de entrada correcto
}

// En modo circular:
_state.angulo += (_params.velocidad / RADIO_PX) * dt; // crece sin condiciones de corte
```

**Garantías:** `deltaTime` nunca es 0, el flag `modoCircular` se setea una sola vez y el ángulo se acumula indefinidamente.

---

## ⚙️ Correcciones físicas

### MUA — Precisión numérica

|                     | Antes                                 | Después                               |
| ------------------- | ------------------------------------- | ------------------------------------- |
| Cálculo de posición | Integración frame-a-frame `x += v·dt` | Fórmula cerrada: `x = v₀·t + ½·a·t²`  |
| Error acumulado     | Crece con el tiempo (Euler)           | Cero — la fórmula analítica es exacta |

### MUA con Fricción — Modelo de fuerzas

| Problema                       | Corrección                                           | Impacto                                                       |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| Sin cutoff estático            | Si `\|F_aplic\| ≤ F_f` y `v ≈ 0` → `F_neta = 0`      | El objeto no arranca si la fricción supera la fuerza aplicada |
| Fricción invertía la velocidad | Si `v` cruzaría cero sin fuerza suficiente → `v = 0` | Previene violación de la Segunda Ley de Newton                |

---

## 📐 Fórmulas implementadas

### MRU + MCU

```
x(t) = x₀ + v·t
ac   = v² / r      ω = v / r      θ(t) = θ₀ + ω·t
```

### MUA

```
x(t) = x₀ + v₀·t + ½·a·t²
v(t) = v₀ + a·t
```

### MUA con Fricción

```
F_f    = μ·m·g
F_neta = F_aplic − sgn(v)·F_f
a_neta = F_neta / m
```

### Movimiento Variado

```
a(t) = f(t)          (función definida por el usuario)
v(t) = ∫ a(t) dt
x(t) = ∫ v(t) dt
```

---

## 🎨 Stack tecnológico

| Tecnología            | Rol                                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| HTML5 + CSS3 + JS     | Frontend sin build step — abre con `python3 -m http.server`                |
| **p5.js 1.6**         | Motor de animación canvas con `deltaTime` real vía `requestAnimationFrame` |
| **Chart.js 4**        | Gráficas dinámicas con ventana deslizante                                  |
| **MathJax 3**         | Renderizado de fórmulas en Movimiento Variado                              |
| **Syne + Space Mono** | Tipografía técnica sin ser genérica                                        |

---

<div align="center">

Hecho con **p5.js** · **Chart.js** · **MathJax** · **Vanilla JS**

</div>
