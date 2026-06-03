<h1 align="center">
  🔬 Simulador de Física — Cinemática
</h1>

<p align="center">
  <strong>Laboratorio virtual interactivo para el estudio de movimientos cinemáticos</strong><br>
  Física precisa • Gráficas en tiempo real • Análisis vectorial • IA integrada
</p>

<p align="center">
  <img src="https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white" alt="p5.js"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js"/>
  <img src="https://img.shields.io/badge/Web%20Audio%20API-0066cc?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web Audio"/>
  <img src="https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/Vanilla%20CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
</p>

<p align="center">
  <a href="http://camilo-pg7.github.io/simulador-fisica-cinematica">🚀 Ver demo en vivo</a> •
  <a href="#simuladores">📋 Simuladores</a> •
  <a href="#instalacion">⚙️ Instalación</a> •
  <a href="#estructura">📂 Estructura</a>
</p>

---

## ✨ Características principales

| Característica | Descripción |
|---|---|
| 🎯 **9 Simuladores** | MRU, MUA, Fricción, Proyectil, Péndulo, Atwood, Plano inclinado y más |
| 📊 **Gráficas en tiempo real** | Chart.js con zoom interactivo y exportación CSV |
| 🤖 **Chatbot IA** | Asistente educativo con Gemini API integrado |
| 🔊 **SFX Procedural** | Motor de sonido sintetizado con Web Audio API |
| 🎨 **Diseño Premium** | Glassmorphism, animaciones fluidas, tema oscuro neon |
| 📱 **Responsive** | Adaptado para desktop, tablet y móvil |
| 🔗 **URLs compartibles** | Parámetros guardados en la URL para compartir configuraciones |
| 📐 **Análisis vectorial** | Vectores de fuerza, velocidad y aceleración en tiempo real |

---

## 🖥️ Capturas de pantalla

<table>
  <tr>
    <td align="center" width="50%">
      <strong>🏠 Menú Principal</strong><br>
      <em>Tarjetas animadas con micro-interacciones por hover</em>
    </td>
    <td align="center" width="50%">
      <strong>🎯 Tiro Parabólico</strong><br>
      <em>Trayectoria, vectores Vx/Vy y sonido de viento dinámico</em>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>⚖️ Máquina de Atwood</strong><br>
      <em>Física de tensión y aceleración, gráficas v(t) y x(t)</em>
    </td>
    <td align="center" width="50%">
      <strong>🚀 MUA con vectores</strong><br>
      <em>Aceleración constante con análisis de fuerzas</em>
    </td>
  </tr>
</table>

---

## 📋 Simuladores

### 🔵 Simuladores Clásicos
| # | Simulador | Descripción |
|---|---|---|
| 1 | **MRU + MCU** | Transición de movimiento rectilíneo a circular uniforme |
| 2 | **MUA** | Movimiento uniformemente acelerado con vectores de fuerza |
| 3 | **MUA + Fricción** | Masa con coeficiente de rozamiento cinético |
| 4 | **Movimiento Variado** | Aceleración dependiente del tiempo con cálculo simbólico |

### 🟢 Nuevos Simuladores
| # | Simulador | Descripción |
|---|---|---|
| 5 | **Tiro Parabólico** | Proyectil con v₀ y ángulo ajustables, trayectoria y vectores |
| 6 | **Plano Inclinado** | Caja sobre rampa con vectores Peso, Normal, Fricción y F. neta |
| 7 | **Péndulo Simple** | Oscilación con longitud y ángulo ajustable, periodo calculado |
| 8 | **Máquina de Atwood** | Sistema de masas conectadas por polea, tensión y aceleración |
| 9 | **Caja en Vehículo** | Deslizamiento por inercia con fricción estática y cinética |

---

## ⚙️ Instalación

### Opción 1 — Servidor local (Python)
```bash
# Clonar el repositorio
git clone https://github.com/Camilo-PG7/simulador-fisica-cinematica.git
cd simulador-fisica-cinematica

# Iniciar servidor local
python -m http.server 8080

# Abrir en el navegador
# http://localhost:8080
```

### Opción 2 — Live Server (VS Code)
1. Instala la extensión **Live Server** en VS Code
2. Abre el proyecto y haz clic en `Go Live`

### Configurar el Chatbot IA (Opcional)
1. Obtén tu API Key gratuita en [Google AI Studio](https://aistudio.google.com/apikey)
2. Edita el archivo `assets/js/env.js` (ya está en `.gitignore`, es seguro):
```js
const GEMINI_API_KEY = 'tu-api-key-aqui';
```

---

## 📂 Estructura del Proyecto

```
simulador-fisica-cinematica/
│
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── 🎨 chatbot.css        # Estilos del chatbot IA
│   │   └── 🎨 sim-shared.css     # Sistema de diseño compartido
│   └── 📁 js/
│       ├── 📄 audio.js           # Motor SFX (Web Audio API)
│       ├── 📄 chatbot.js         # Integración Gemini AI
│       ├── 📄 chatbot_offline.js # Modo sin conexión
│       ├── 📄 cursor.js          # Cursor personalizado
│       ├── 📄 env.js             # API Keys (⚠️ no subir a Git)
│       ├── 📄 main.js            # Lógica principal del índice
│       └── 📄 state.js           # Gestión de estado global
│
├── 📁 simulators/
│   ├── 🌐 mru+mcu_simulacion.html
│   ├── 🌐 mua_simulacion.html
│   ├── 🌐 mua_friccion.html
│   ├── 🌐 movimiento_variado.html
│   ├── 🌐 tiro_parabolico.html
│   ├── 🌐 plano_inclinado.html
│   ├── 🌐 pendulo_simple.html
│   ├── 🌐 atwood.html
│   └── 🌐 caja_vehiculo.html
│
├── 🌐 index.html                 # Punto de entrada principal
├── 🖼️ favicon.svg               # Ícono de la pestaña del navegador
├── 📝 README.md
└── ⚙️ .gitignore
```

---

## 🛠️ Tecnologías

- **[p5.js](https://p5js.org/)** — Motor de animación y canvas para la física
- **[Chart.js](https://www.chartjs.org/)** — Gráficas en tiempo real con zoom interactivo
- **[Google Gemini API](https://aistudio.google.com/)** — Chatbot educativo con IA
- **[MathJax](https://www.mathjax.org/)** — Renderizado de ecuaciones matemáticas
- **Web Audio API** — Motor de sonido procedural (SFX)
- **[Google Fonts](https://fonts.google.com/)** — Tipografías *Syne* y *Space Mono*

---

## 👨‍💻 Autor

**Camilo PG7**  
Proyecto académico — Simulador Interactivo de Física Cinemática  
*Semestre VI — Artículo Científico*

---

<p align="center">
  Hecho con ❤️ para la enseñanza de la física
</p>
