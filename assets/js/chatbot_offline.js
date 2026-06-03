// ═══════════════════════════════════════════════════════════
//  INTELLIGENT OFFLINE PHYSICS ENGINE — EXPANDED v2
//  Drop this block inside the PhysicsChatBot class to replace
//  the previous offline engine section.
// ═══════════════════════════════════════════════════════════

  _getOfflineResponse(userMessage) {
    const msg = userMessage.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const state = this.getState();

    // 1. Detección explícita de temas fuera de contexto o bromas ("chistositos")
    const offTopicKeywords = [
      'chiste', 'broma', 'chistoso', 'juego', 'jugar', 'poema', 'poesia', 'cancion', 'musica', 
      'receta', 'cocina', 'cocinar', 'comida', 'futbol', 'messi', 'ronaldo', 'partido', 'politica', 
      'presidente', 'amor', 'novia', 'novio', 'clima', 'chisme', 'chismosear', 'cuento', 
      'minecraft', 'fortnite', 'videojuego', 'pelicula', 'serie', 'anime', 'religion', 'dios', 
      'quimica', 'biologia', 'sociales', 'ingles', 'programacion', 'codigo', 'javascript', 'python', 
      'html', 'dinero', 'dolar', 'troll', 'burla', 'meme', 'sexo', 'groseria', 'insulto', 'tonto',
      'estupido', 'idiota', 'mierda', 'puto', 'puta', 'marica', 'huevon', 'gonorrea', 'pendejo', 'pendeja',
      'chingar', 'cabron', 'culazo', 'culito', 'joda', 'joder'
    ];

    if (this._has(msg, ...offTopicKeywords)) {
      return `### 🔬 Enfoque en la Física\nComo tu **Asistente de Física**, mi único propósito es ayudarte a explorar esta simulación interactiva y comprender las leyes del movimiento, las fuerzas y la energía.\n\nNo puedo responder a preguntas sobre temas externos, bromas o contenido fuera de contexto. \n\n**¿En qué puedo ayudarte hoy?**\n- 📐 Ecuaciones y fórmulas de la simulación\n- 📊 Gráficas e interpretación de resultados\n- 🔬 Leyes de Newton, fricción, péndulo, etc.\n- 🔢 Variables actuales en tiempo real`;
    }

    // 2. Filtro inteligente para preguntas largas completamente ajenas a la física
    const physicsAndGeneralKeywords = [
      // Conceptos/Física
      'gravedad', 'newton', 'ley', 'fuerza', 'peso', 'masa', 'energia', 'trabajo', 'friccion', 'rozamiento', 
      'mru', 'mcu', 'velocidad', 'aceleracion', 'pendulo', 'atwood', 'tension', 'polea', 'angulo', 'plano', 
      'rampa', 'trayectoria', 'tiempo', 'distancia', 'formula', 'ecuacion', 'grafica', 'desliza', 'frenada', 
      'curva', 'rk4', 'variado', 'integral', 'derivada', 'sistema', 'referencia', 'inercial', 'si', 'unidades', 
      'normal', 'critica', 'tangencial', 'centripeta', 'periodo', 'frecuencia', 'omega', 'amplitud', 'rapidez', 
      'descompo', 'componente', 'vector', 'caida', 'libre', 'lanzamiento', 'parabola', 'parabolica', 'movimiento', 
      'posicion', 'simula', 'funcion',
      // Conversación/Ayuda/Saludos
      'hola', 'buenas', 'saludos', 'hey', 'gracias', 'ayuda', 'saber', 'puedes', 'comandos', 'temas', 'que es', 
      'explic', 'dime', 'porque', 'por que', 'como', 'entien', 'si', 'no', 'mas', 'ver', 'mostrar'
    ];

    const hasPhysicsOrGeneral = physicsAndGeneralKeywords.some(kw => msg.includes(kw));
    if (msg.length > 20 && !hasPhysicsOrGeneral) {
      return `### 🔬 Asistente de Física\nNo he detectado términos relacionados con la física clásica o el funcionamiento de esta simulación en tu pregunta.\n\nComo tu **Asistente de Física**, estoy diseñado exclusivamente para ayudarte a explorar este simulador y comprender conceptos científicos.\n\n**¿De qué te gustaría hablar?**\n- 📐 Ecuaciones y fórmulas del movimiento\n- 🔬 Conceptos físicos clave (fricción, gravedad, Newton...)\n- 📊 Análisis de las gráficas en tiempo real\n- 🔢 Variables actuales de la simulación`;
    }

    // Check cross-topic general questions first
    const general = this._getOfflineCrossTopicAnswer(msg, state);
    if (general) return general;

    switch (this.topic) {
      case 'friction_vehicle':  return this._getOfflineFrictionVehicle(msg, state);
      case 'mua':               return this._getOfflineMUA(msg, state);
      case 'mua_friction':      return this._getOfflineMUAFriction(msg, state);
      case 'projectile':        return this._getOfflineProjectile(msg, state);
      case 'mru_mcu':           return this._getOfflineMRUMCU(msg, state);
      case 'pendulum':          return this._getOfflinePendulum(msg, state);
      case 'atwood':            return this._getOfflineAtwood(msg, state);
      case 'inclined_plane':    return this._getOfflineInclinedPlane(msg, state);
      case 'varied_motion':     return this._getOfflineVariedMotion(msg, state);
      default:                  return this._getOfflineGeneral(msg, state);
    }
  }

  _has(msg, ...keywords) {
    return keywords.some(k => msg.includes(k));
  }

  _getOfflineCrossTopicAnswer(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);

    if (h('hola', 'buenas', 'buenos dias', 'buenas tardes', 'saludos', 'hey'))
      return `### ¡Hola! 👋\nSoy tu **Asistente de Física** para **${this.simulationName}**.\n\nPuedo ayudarte con:\n- **Ecuaciones y fórmulas** de esta simulación\n- **Conceptos físicos:** fricción, gravedad, energía, Newton...\n- **Variables en tiempo real** del simulador\n- **Gráficas e interpretación** de resultados\n\n¡Escribe tu pregunta y te explico!`;

    if (h('gracias', 'muchas gracias', 'muy bien', 'perfecto', 'genial', 'excelente', 'chevere', 'super'))
      return `¡De nada! 😊 Estoy aquí para ayudarte con la física. Si tienes más dudas sobre conceptos, ecuaciones o los datos de la simulación, ¡pregunta cuando quieras!`;

    if (h('gravedad', 'g =', 'caida libre', 'aceleracion gravitacional', 'fuerza gravitacional', '9.8', '9.81'))
      return `### La Gravedad (g)\nLa **aceleración gravitacional** en la superficie de la Tierra es:\n*g = 9.8 m/s²* (con mayor precisión: 9.80665 m/s²)\n\nTodo objeto en caída libre (sin fricción del aire) cae con esta misma aceleración, independientemente de su masa — principio de Galileo.\n\n**En las simulaciones:**\n- Peso: *W = m · g*\n- Normal (plano horizontal): *N = m · g*\n- Fricción: *f = μ · m · g*\n- Aceleración Atwood: *a = (m₁−m₂)·g / (m₁+m₂)*`;

    if (h('primera ley', 'ley de inercia', 'inercia'))
      return `### Primera Ley de Newton — Ley de Inercia\n**"Todo cuerpo permanece en reposo o en movimiento rectilíneo uniforme a menos que una fuerza neta externa actúe sobre él."**\n\n- *F_neta = 0* → el objeto no cambia su estado de movimiento\n- Un objeto en reposo **permanece en reposo**\n- Un objeto en movimiento **sigue a velocidad constante en línea recta**\n\nLa **inercia** es la tendencia de los objetos a resistir cambios en su movimiento. A mayor masa → mayor inercia.`;

    if (h('segunda ley', 'f=ma', 'f = m', 'fuerza igual a masa'))
      return `### Segunda Ley de Newton — F = m · a\n**"La aceleración de un objeto es directamente proporcional a la fuerza neta e inversamente proporcional a su masa."**\n\n*F_neta = m · a*\n\n- *F_neta* → Newtons (N)\n- *m* → kilogramos (kg)\n- *a* → m/s²\n\nEsta es la ecuación central de toda la mecánica clásica — la base de todos los cálculos de esta simulación.`;

    if (h('tercera ley', 'accion y reaccion', 'accion-reaccion', 'par de fuerzas'))
      return `### Tercera Ley de Newton — Acción y Reacción\n**"Por cada acción existe una reacción igual en magnitud y opuesta en dirección."**\n\n*F_AB = −F_BA*\n\nEjemplos:\n- El peso de la caja actúa sobre el camión → el camión ejerce la Normal sobre la caja.\n- El cohete expulsa gases hacia abajo → el gas empuja el cohete hacia arriba.\n\nImportante: las fuerzas de acción-reacción actúan sobre **objetos diferentes**.`;

    if (h('newton', 'leyes de newton', 'leyes newton') && !h('primera', 'segunda', 'tercera', 'f=ma', 'inercia', 'accion'))
      return `### Las Tres Leyes de Newton\n1. **Inercia:** Un cuerpo en reposo o movimiento uniforme permanece así si la fuerza neta es cero.\n2. **F = m·a:** La fuerza neta es igual a masa × aceleración.\n3. **Acción-Reacción:** Toda fuerza tiene una reacción igual y opuesta en el objeto que la recibe.\n\nEstas tres leyes son la base de toda la mecánica clásica y de todos los cálculos de esta simulación.`;

    if (h('masa', 'diferencia masa peso', 'masa vs peso', 'que es la masa'))
      return `### Masa vs Peso\n- **Masa (m):** Cantidad de materia. Constante en cualquier lugar. Se mide en kg.\n- **Peso (W):** Fuerza gravitacional. Varía según la gravedad.\n  *W = m · g*\n\n| Lugar | g (m/s²) | Peso de 10 kg |\n|---|---|---|\n| Tierra | 9.8 | 98 N |\n| Luna | 1.62 | 16.2 N |\n| Marte | 3.72 | 37.2 N |\n| Júpiter | 24.8 | 248 N |\n\nEn el espacio sin gravedad: masa = 10 kg pero peso = 0 N.`;

    if (h('energia cinetica', 'ec =', 'energia cin'))
      return `### Energía Cinética (Ec)\n*Ec = ½ · m · v²*\n\nEs la energía debida al **movimiento**. Si la velocidad se duplica, la energía cinética se **cuadruplica** (relación cuadrática).\n\nUnidades: Joules (J) = kg·m²/s²\n\nEl Teorema Trabajo-Energía: *W_neto = ΔEc = ½·m·v_f² − ½·m·v_i²*`;

    if (h('energia potencial', 'ep =', 'energia pot'))
      return `### Energía Potencial Gravitatoria (Ep)\n*Ep = m · g · h*\n\nEnergía almacenada por la posición en el campo gravitacional. Se convierte en cinética al caer.\n\nConservación (sin fricción): *½·m·v₁² + m·g·h₁ = ½·m·v₂² + m·g·h₂*`;

    if (h('energia', 'trabajo', 'joule', 'conservacion energia') && !h('cinetica', 'potencial'))
      return `### Energía y Trabajo\n- **Trabajo:** *W = F·d·cos(θ)* — Fuerza × distancia en la dirección de la fuerza. (J)\n- **Energía Cinética:** *Ec = ½·m·v²* — Energía del movimiento. (J)\n- **Energía Potencial:** *Ep = m·g·h* — Energía por posición. (J)\n- **Potencia:** *P = W/t = F·v* — Tasa de realización de trabajo. (W = J/s)\n\n**Conservación:** En sistemas sin fricción, la energía mecánica total (*Ec + Ep*) se conserva.`;

    if (h('friccion', 'rozamiento', 'μ', 'mu ', 'coeficiente de fric') && !h('estatico', 'cinetico', 'kinetico', 'dinamica'))
      return `### Fricción — Concepto General\nLa fricción se opone al movimiento relativo entre superficies en contacto.\n\n**Tipos:**\n- **Fricción Estática (μₑ):** Antes del movimiento. Variable entre 0 y *f_s_max = μₑ·N*.\n- **Fricción Cinética (μc):** Durante el movimiento. Constante: *f_k = μc·N*.\n\n**Regla fundamental:** *μₑ > μc siempre*\n\nEsto explica por qué cuesta más **empezar** a mover un objeto que **mantenerlo** en movimiento.`;

    if (h('vectores', 'vector', 'componente', 'descomponer') && !h('velocidad', 'aceleracion', 'fuerza'))
      return `### Vectores y Descomposición\nUn vector tiene: **módulo** (magnitud), **dirección** y **sentido**.\n\nPara un vector *A* con ángulo *θ* respecto al eje horizontal:\n- *Ax = A·cos(θ)* — Componente horizontal\n- *Ay = A·sin(θ)* — Componente vertical\n- *|A| = √(Ax² + Ay²)* — Módulo resultante\n- *θ = arctan(Ay/Ax)* — Ángulo de la resultante`;

    if (h('derivada', 'derivar', 'derivacion', 'tasa de cambio'))
      return `### Derivadas en Física\nLa derivada es la **tasa de cambio instantánea**:\n- *v(t) = dx/dt* — Velocidad = derivada de posición\n- *a(t) = dv/dt = d²x/dt²* — Aceleración = derivada de velocidad\n\nPara el M.U.A. (*x = x₀ + v₀t + ½at²*):\n- *v = dx/dt = v₀ + at*\n- *a = dv/dt = a* (constante)`;

    if (h('integral', 'integrar', 'area bajo', 'primitiva'))
      return `### Integrales en Física\nLa integral es la operación inversa de la derivada:\n- *x(t) = ∫v(t)dt* — Posición integrando velocidad\n- *v(t) = ∫a(t)dt* — Velocidad integrando aceleración\n\nEn gráficos:\n- El **área bajo v-t** = desplazamiento (*Δx*)\n- El **área bajo a-t** = cambio de velocidad (*Δv*)`;

    if (h('momento lineal', 'impulso', 'cantidad de movimiento', 'momentum'))
      return `### Cantidad de Movimiento (Momento Lineal)\n*p = m · v* (kg·m/s)\n\n**Impulso:** *J = F·Δt = Δp = m·Δv*\n\n**Conservación:** En un sistema aislado (*F_externa = 0*), la cantidad de movimiento total se conserva.\n*p_inicial = p_final*\n\nEjemplo: Choque elástico, explosión, lanzamiento de cohetes.`;

    if (h('unidades', 'sistema internacional', 'si', 'newton', 'pascal', 'joule', 'watt') && !h('quien', 'que es', 'leyes', 'segunda'))
      return `### Unidades del Sistema Internacional (SI)\n| Magnitud | Unidad | Símbolo | Equivalencia |\n|---|---|---|---|\n| Longitud | metro | m | — |\n| Masa | kilogramo | kg | — |\n| Tiempo | segundo | s | — |\n| Fuerza | Newton | N | kg·m/s² |\n| Energía | Joule | J | N·m = kg·m²/s² |\n| Potencia | Watt | W | J/s |\n| Presión | Pascal | Pa | N/m² |\n| Frecuencia | Hertz | Hz | 1/s |`;

    if (h('sistema de referencia', 'inercial', 'no inercial', 'marco de referencia'))
      return `### Sistemas de Referencia\n- **Sistema Inercial:** En reposo o movimiento constante. Las leyes de Newton aplican directamente.\n- **Sistema No Inercial (acelerado):** Requiere introducir **fuerzas ficticias** (pseudofuerzas).\n\nEjemplo de la simulación de caja-camión:\n- **Observador en la calle (inercial):** Ve al camión acelerar y a la caja rezagarse por inercia.\n- **Observador en el camión (no inercial):** Ve a la caja acelerarse hacia atrás — fuerza ficticia de inercia.`;

    return null; // No general match
  }

  _getOfflineFrictionVehicle(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const m = state.masaCaja || 50;
    const muE = state.muEstatico || 0.4;
    const muC = state.muCinetico || 0.3;
    const aCamion = state.aceleracionCamion || 0;
    const vCamion = state.velocidadCamion || 0;
    const vCaja = state.velocidadCaja || 0;
    const posCamion = (state.posicionCamion || 0).toFixed(2);
    const posCaja = (state.posicionCaja || 0).toFixed(2);
    const deslizando = !!state.deslizando;
    const g = 9.8;
    const normal = m * g;
    const fStaticMax = muE * normal;
    const fKinetic = muC * normal;
    const aCritica = muE * g;
    const relVel = (vCamion - vCaja).toFixed(3);

    if (h('ecuacion', 'formula', 'matematica', 'expresion', 'ley fisica'))
      return `### Ecuaciones del Sistema Caja–Camión\n**Normal:** *N = m·g = ${m}·9.8 = ${normal.toFixed(1)} N*\n**Fricción estática máx.:** *f_s_max = μₑ·N = ${muE}·${normal.toFixed(1)} = ${fStaticMax.toFixed(1)} N*\n**Fricción cinética:** *f_k = μc·N = ${muC}·${normal.toFixed(1)} = ${fKinetic.toFixed(1)} N*\n**Aceleración crítica:** *a_crit = μₑ·g = ${muE}·9.8 = ${aCritica.toFixed(2)} m/s²*\n**Aceleración caja (al deslizar):** *a_caja = ±μc·g = ±${(muC*g).toFixed(2)} m/s²*`;

    if (h('desliza', 'resbala', 'desplaza', 'mover', 'adherencia', 'agarra', 'separa', 'patina'))
      return `### Análisis del Deslizamiento\nCondición de no deslizamiento: *|a_camion| ≤ a_crit = μₑ·g = ${aCritica.toFixed(2)} m/s²*\n\n**Ahora mismo:**\n- a_camion = ${Math.abs(aCamion).toFixed(2)} m/s² vs. a_crit = ${aCritica.toFixed(2)} m/s²\n- Velocidad relativa: *v_camion − v_caja = ${relVel} m/s*\n\n${Math.abs(aCamion) > aCritica ? `⚠ **DESLIZANDO** — La fricción estática se rompió. Actúa fricción cinética: ${fKinetic.toFixed(1)} N.` : `✅ **NO DESLIZA** — Fricción estática retiene la caja. Ambos van juntos.`}`;

    if (h('aceleracion critica', 'limite', 'umbral', 'maximo para no deslizar'))
      return `### Aceleración Crítica (a_crit)\n*a_crit = μₑ · g = ${muE} · 9.8 = ${aCritica.toFixed(2)} m/s²*\n\nSi el camión supera esta aceleración, la fricción estática ya no puede mantener la caja pegada.\n\n**Actual:** a_camion = ${Math.abs(aCamion).toFixed(2)} m/s² → ${Math.abs(aCamion) > aCritica ? '⚠ Superada — la caja desliza' : '✅ Bajo el límite — sin deslizamiento'}`;

    if (h('estatico', 'cinetico', 'diferencia friccion', 'tipo de friccion'))
      return `### Fricción Estática vs Cinética\n**Estática (μₑ = ${muE}):**\n- Actúa ANTES del movimiento relativo\n- Variable: *0 ≤ f_s ≤ ${fStaticMax.toFixed(1)} N*\n- Es el "pegamento" que une caja y camión\n\n**Cinética (μc = ${muC}):**\n- Actúa DURANTE el deslizamiento\n- Constante: *f_k = ${fKinetic.toFixed(1)} N*\n- Siempre menor que la estática máxima\n\n**¿Por qué μₑ > μc?** Las asperezas microscópicas se enlazan en reposo pero solo rozan en movimiento.`;

    if (h('frenada', 'frenar', 'freno', 'desacelera', 'brusco'))
      return `### Frenada Brusca\nCuando el camión frena abruptamente (supera *a_crit = ${aCritica.toFixed(2)} m/s²*):\n\n1. El camión desacelera bruscamente.\n2. La caja continúa por **inercia** (1ª Ley de Newton) a su velocidad anterior.\n3. La fricción estática se rompe (se supera *${fStaticMax.toFixed(1)} N*).\n4. La caja desliza hacia adelante con *f_k = ${fKinetic.toFixed(1)} N* desacelerándola gradualmente.\n\nEsto explica el peligro de carga mal asegurada en frenos de emergencia.`;

    if (h('velocidad', 'rapidez', 'cuanto va'))
      return `### Velocidades Actuales\n- **Camión:** ${vCamion.toFixed(2)} m/s (${(vCamion*3.6).toFixed(1)} km/h)\n- **Caja:** ${vCaja.toFixed(2)} m/s (${(vCaja*3.6).toFixed(1)} km/h)\n- **Velocidad relativa:** ${relVel} m/s\n\n${Math.abs(parseFloat(relVel)) < 0.01 ? '✅ Sin movimiento relativo — caja y camión sincronizados.' : `⚠ Diferencia de ${Math.abs(parseFloat(relVel)).toFixed(2)} m/s — hay deslizamiento activo.`}`;

    if (h('posicion', 'donde', 'distancia relativa', 'desfase'))
      return `### Posiciones y Desfase\n- **Posición camión:** ${posCamion} m\n- **Posición caja:** ${posCaja} m\n- **Desfase relativo:** ${Math.abs(parseFloat(posCamion)-parseFloat(posCaja)).toFixed(2)} m\n\n${deslizando ? '⚠ Hay movimiento relativo — las posiciones divergen.' : '✅ Posiciones sincronizadas — sin deslizamiento.'}`;

    if (h('normal', 'fuerza normal', 'perpendicular', 'reaccion'))
      return `### Fuerza Normal\n*N = m·g = ${m}·9.8 = ${normal.toFixed(1)} N*\n\nLa Normal es la fuerza perpendicular que la plataforma del camión ejerce sobre la caja (reacción al peso). Determina la fricción:\n- *f_s_max = μₑ·N = ${fStaticMax.toFixed(1)} N*\n- *f_k = μc·N = ${fKinetic.toFixed(1)} N*\n\nEn inclinación (ángulo θ): *N = m·g·cos(θ)* — menor que en horizontal.`;

    if (h('coeficiente', 'valor de mu', 'cuanto vale mu', 'tabla'))
      return `### Coeficientes de Fricción (μ)\n- **μₑ (actual):** ${muE} → *f_s_max = ${fStaticMax.toFixed(1)} N*\n- **μc (actual):** ${muC} → *f_k = ${fKinetic.toFixed(1)} N*\n\n**Valores típicos de referencia:**\n| Materiales | μₑ | μc |\n|---|---|---|\n| Madera / madera | 0.40 | 0.20 |\n| Acero / acero | 0.60 | 0.40 |\n| Goma / asfalto | 0.80 | 0.70 |\n| Hielo / hielo | 0.10 | 0.03 |`;

    if (h('como funciona', 'que simula', 'proposito', 'objetivo'))
      return `### Funcionamiento del Simulador\nAnaliza la **interacción fricción-inercia** entre una caja (${m} kg) sobre un camión en movimiento.\n\n**Reglas físicas:**\n- Si *|a_camion| ≤ ${aCritica.toFixed(2)} m/s²* → Caja y camión se mueven **juntos** (fricción estática).\n- Si *|a_camion| > ${aCritica.toFixed(2)} m/s²* → La caja **desliza** (fricción cinética = ${fKinetic.toFixed(1)} N).\n\n**Variables ajustables:** masa, μₑ, μc, perfil de aceleración del camión.`;

    return `### Estado — Caja sobre Camión\n- **Masa caja:** ${m} kg | **μₑ:** ${muE} | **μc:** ${muC}\n- **a_camion:** ${aCamion.toFixed(2)} m/s² | **a_crit:** ${aCritica.toFixed(2)} m/s²\n- **f_s_max:** ${fStaticMax.toFixed(1)} N | **f_k:** ${fKinetic.toFixed(1)} N\n- **v_camion:** ${vCamion.toFixed(2)} m/s | **v_caja:** ${vCaja.toFixed(2)} m/s\n- **Deslizando:** ${deslizando ? 'Sí ⚠' : 'No ✅'}\n\n**Temas:** ecuaciones · deslizamiento · a_crítica · fricción estática/cinética · frenada · velocidad · posición · Normal · coeficientes`;
  }

  _getOfflineMUA(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const a = state.aceleracion || 0;
    const v = state.velocidad || 0;
    const x = state.posicion || state.distancia || 0;
    const t = state.tiempo || 0;
    const F = state.fuerza || 0;
    const m = state.masa || 0;
    const v0 = state.velocidadInicial || 0;

    if (h('ecuacion', 'formula', 'matematica', 'expresion', 'cinematica', 'kinemat'))
      return `### Ecuaciones del M.U.A. (${a.toFixed(2)} m/s²)\n**1. Posición:** *x(t) = x₀ + v₀·t + ½·a·t²* → ahora **${x.toFixed(2)} m**\n**2. Velocidad:** *v(t) = v₀ + a·t* → ahora **${v.toFixed(2)} m/s**\n**3. Sin tiempo:** *v² = v₀² + 2·a·(x−x₀)*\n**4. Desplazamiento medio:** *x = ((v₀+v)/2)·t*\n**5. Newton:** *F_neta = m·a = ${m}·${a.toFixed(2)} = ${F.toFixed(1)} N*`;

    if (h('grafica', 'grafico', 'curva', 'recta', 'parabo', 'forma de la grafica'))
      return `### Gráficas del M.U.A.\n**x vs t:** Parábola (*½·a·t²* domina). La curvatura indica el signo de *a*.\n**v vs t:** Recta con **pendiente = a = ${a.toFixed(2)} m/s²**. El área bajo la recta = desplazamiento.\n**a vs t:** Línea horizontal constante en *a = ${a.toFixed(2)} m/s²* (la definición del MUA).`;

    if (h('aceleracion', 'que es la aceleracion', 'define a'))
      return `### Aceleración en el M.U.A.\n*a = Δv / Δt = ${a.toFixed(2)} m/s²*\n\nSignifica que cada segundo la velocidad cambia en **${a.toFixed(2)} m/s**.\n\n- a > 0 → el objeto gana velocidad (acelera)\n- a < 0 → el objeto pierde velocidad (desacelera)\n- a = 0 → velocidad constante (M.R.U.)\n\n**Ahora:** v = ${v.toFixed(2)} m/s, aumentando ${a > 0 ? 'positivamente' : 'negativamente'} a razón de ${Math.abs(a).toFixed(2)} m/s cada segundo.`;

    if (h('distancia', 'espacio', 'desplazamiento', 'cuanto avanza', 'recorre'))
      return `### Distancia Recorrida\n*x(t) = v₀·t + ½·a·t² = ${v0.toFixed(2)}·t + ½·${a.toFixed(2)}·t²*\n\n**Ahora (t = ${t.toFixed(2)} s):** *x = ${x.toFixed(2)} m*\n\nEl área bajo la curva *v vs t* también da el desplazamiento (trapecio entre v₀ y v_actual).`;

    if (h('velocidad inicial', 'v0', 'v₀', 'inicial'))
      return `### Velocidad Inicial (v₀ = ${v0.toFixed(2)} m/s)\nA partir de v₀, el objeto cambia velocidad a razón de *a = ${a.toFixed(2)} m/s²* por segundo.\n\n*v(t) = v₀ + a·t = ${v0.toFixed(2)} + ${a.toFixed(2)}·t*\n\n**Ahora (t = ${t.toFixed(2)} s):** *v = ${v.toFixed(2)} m/s*`;

    if (h('fuerza', 'empuje', 'f =', 'segunda ley'))
      return `### Fuerza Neta (F = m·a)\n*F_neta = m · a = ${m} kg · ${a.toFixed(2)} m/s² = ${F.toFixed(1)} N*\n\nLa fuerza neta produce la aceleración. Sin fuerza neta → sin aceleración (M.R.U.).`;

    if (h('tiempo', 'cuanto tiempo', 'cuando llega'))
      return `### Tiempo y Cinemática\n**t actual:** ${t.toFixed(2)} s | **v actual:** ${v.toFixed(2)} m/s | **x actual:** ${x.toFixed(2)} m\n\nPara calcular tiempo hasta cierta velocidad *v_f*:\n*t = (v_f − v₀) / a = (v_f − ${v0.toFixed(2)}) / ${a.toFixed(2)}*\n\nPara calcular tiempo hasta cierta posición *x_f* (raíz de cuadrática):\n*x_f = v₀·t + ½·a·t²*`;

    if (h('como funciona', 'que hace', 'que simula'))
      return `### M.U.A. — Funcionamiento\nModela un objeto con aceleración constante *a = ${a.toFixed(2)} m/s²*.\n\n**Puedes cambiar:** masa, aceleración, velocidad inicial y observar las gráficas en tiempo real de posición, velocidad y fuerza.\n\n**Aplicaciones reales:** autos en autopista, ascensores, trenes de alta velocidad, lanzamiento de objetos.`;

    return `### Estado — M.U.A.\n- **t:** ${t.toFixed(2)} s | **x:** ${x.toFixed(2)} m | **v:** ${v.toFixed(2)} m/s | **a:** ${a.toFixed(2)} m/s²\n- **m:** ${m} kg | **F_neta:** ${F.toFixed(1)} N | **v₀:** ${v0.toFixed(2)} m/s\n\n**Temas:** ecuaciones · gráficas · aceleración · distancia · v₀ · fuerza · tiempo`;
  }

  _getOfflineMUAFriction(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const a = state.aceleracion || 0;
    const v = state.velocidad || 0;
    const x = state.posicion || state.distancia || 0;
    const t = state.tiempo || 0;
    const F = state.fuerza || 0;
    const mu = state.coefFriccion || 0;
    const m = state.masa || 0;
    const g = 9.8;
    const normal = m * g;
    const fFric = mu * normal;

    if (h('ecuacion', 'formula', 'matematica', 'expresion'))
      return `### Ecuaciones — M.U.A. con Fricción\n*N = m·g = ${m}·9.8 = ${normal.toFixed(1)} N*\n*f_k = μ·N = ${mu}·${normal.toFixed(1)} = ${fFric.toFixed(1)} N*\n*F_neta = F_ap − f_k = m·a*\n*a = (F_ap − μ·m·g) / m = ${a.toFixed(2)} m/s²*\n\n**Cinemática:** igual que M.U.A.\n*v(t) = v₀ + a·t* → ahora **${v.toFixed(2)} m/s**\n*x(t) = v₀·t + ½·a·t²* → ahora **${x.toFixed(2)} m**`;

    if (h('friccion', 'rozamiento', 'resiste', 'frena', 'opone'))
      return `### Fricción Cinética (μ = ${mu})\n*f_k = μ·m·g = ${mu}·${m}·9.8 = ${fFric.toFixed(1)} N*\n\nEsta fuerza siempre se **opone al movimiento** y reduce la aceleración en *${(fFric/m).toFixed(2)} m/s²* respecto al caso sin fricción.\n\n- Si *F_ap < ${fFric.toFixed(1)} N* → el objeto no arranca (fricción supera la fuerza aplicada).\n- Si *F_ap = ${fFric.toFixed(1)} N* → a = 0 (velocidad constante).`;

    if (h('cuando para', 'detiene', 'para', 'frena hasta', 'distancia de frenado'))
      return `### Distancia de Frenado\nCon solo fricción actuando (sin fuerza aplicada):\n*a_frenado = −μ·g = −${mu}·9.8 = −${(mu*g).toFixed(2)} m/s²*\n\nDesde velocidad actual *v = ${v.toFixed(2)} m/s*:\n*t_stop = v / (μ·g) = ${v.toFixed(2)} / ${(mu*g).toFixed(2)} = ${mu > 0 ? (v/(mu*g)).toFixed(2) : '∞'} s*\n*x_stop = v² / (2·μ·g) = ${mu > 0 ? (v*v/(2*mu*g)).toFixed(2) : '∞'} m*`;

    if (h('coeficiente', 'valor mu', 'mu actual'))
      return `### Coeficiente μ = ${mu}\n*f_k = μ·N = ${mu}·${normal.toFixed(1)} = ${fFric.toFixed(1)} N*\n*Reducción de aceleración: ${(fFric/m).toFixed(2)} m/s²*\n\nAl aumentar μ → mayor fricción → menor aceleración → más difícil mover el bloque.\nAl disminuir μ → superficie más resbaladiza → bloque acelera más.`;

    if (h('diferencia', 'vs mua', 'comparar con mua'))
      return `### M.U.A. con Fricción vs M.U.A. Puro\n**Sin fricción:** *a = F_ap / m*\n**Con fricción:** *a = (F_ap − μ·m·g) / m*\n\nLa diferencia es la reducción: *Δa = μ·g = ${(mu*g).toFixed(2)} m/s²*\n\nCon μ = ${mu} y m = ${m} kg, la fricción consume **${fFric.toFixed(1)} N** de la fuerza aplicada.`;

    return `### Estado — M.U.A. con Fricción\n- **m:** ${m} kg | **μ:** ${mu} | **N:** ${normal.toFixed(1)} N | **f_k:** ${fFric.toFixed(1)} N\n- **a:** ${a.toFixed(2)} m/s² | **v:** ${v.toFixed(2)} m/s | **x:** ${x.toFixed(2)} m | **t:** ${t.toFixed(2)} s\n\n**Temas:** ecuaciones · fricción · distancia de frenado · μ · diferencia con MUA`;
  }

  _getOfflineProjectile(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const v0 = state.v0 || 0;
    const ang = state.angulo || 0;
    const xC = (state.x || 0).toFixed(2);
    const yC = (state.y || 0).toFixed(2);
    const vx = (state.vx || 0).toFixed(2);
    const vy = (state.vy || 0).toFixed(2);
    const alcance = (state.alcance || 0).toFixed(2);
    const hmax = (state.hmax || 0).toFixed(2);
    const tVuelo = (state.tVuelo || 0).toFixed(2);
    const g = 9.8;
    const rad = ang * Math.PI / 180;
    const v0x = (v0 * Math.cos(rad)).toFixed(2);
    const v0y = (v0 * Math.sin(rad)).toFixed(2);
    const vTotal = Math.sqrt(parseFloat(vx)**2 + parseFloat(vy)**2).toFixed(2);

    if (h('ecuacion', 'formula', 'matematica', 'expresion', 'cinematica'))
      return `### Ecuaciones del Tiro Parabólico (v₀=${v0} m/s, θ=${ang}°)\n**Componentes iniciales:**\n*v₀x = v₀·cos(θ) = ${v0x} m/s*\n*v₀y = v₀·sin(θ) = ${v0y} m/s*\n\n**Horizontal (M.R.U.):** *x = v₀x·t = ${v0x}·t*\n**Vertical (M.U.A.):**\n*y = v₀y·t − ½·g·t² = ${v0y}·t − 4.9·t²*\n*vy = v₀y − g·t = ${v0y} − 9.8·t*\n\n**Máximos:**\n*R = v₀²·sin(2θ)/g = ${alcance} m*\n*H = v₀²·sin²(θ)/(2g) = ${hmax} m*\n*T = 2·v₀·sin(θ)/g = ${tVuelo} s*`;

    if (h('componente', 'descomponer', 'vx', 'vy', 'horizontal', 'vertical'))
      return `### Descomposición de la Velocidad\n**v₀ = ${v0} m/s a θ = ${ang}°:**\n- *v₀x = ${v0x} m/s* (constante — no hay fuerza horizontal)\n- *v₀y = ${v0y} m/s* (disminuye a 9.8 m/s por segundo)\n\n**Velocidades actuales:**\n- *vx = ${vx} m/s* | *vy = ${vy} m/s*\n- **Velocidad total: v = √(vx²+vy²) = ${vTotal} m/s**`;

    if (h('angulo', 'optimo', '45', 'maximo alcance', 'complementario'))
      return `### Ángulo de Máximo Alcance\nEl ángulo óptimo para maximizar el alcance (en terreno plano) es **θ = 45°**.\n\n*R = v₀²·sin(2θ)/g* → máximo cuando *sin(2θ) = 1* → *θ = 45°*\n\n**Ángulos complementarios:** 30° y 60° → mismo alcance, diferente H_max y T.\n\n**Actual (θ = ${ang}°):** R = ${alcance} m\n**Máximo teórico con v₀ = ${v0} m/s (a 45°):** ${(v0*v0/g).toFixed(2)} m`;

    if (h('altura', 'altura maxima', 'apogeo', 'pico', 'mas alto', 'hmax'))
      return `### Altura Máxima\n*H_max = v₀²·sin²(θ) / (2g) = ${v0}²·sin²(${ang}°) / (2·9.8) = ${hmax} m*\n\nSe alcanza cuando *vy = 0*:\n*t_max = v₀·sin(θ) / g = ${v0y} / 9.8 = ${(parseFloat(v0y)/g).toFixed(2)} s*\n\n**Posición vertical actual:** y = ${yC} m`;

    if (h('alcance', 'distancia horizontal', 'cuanto avanza', 'hasta donde llega', 'rango'))
      return `### Alcance Horizontal\n*R = v₀²·sin(2θ) / g = ${v0}²·sin(${2*ang}°) / 9.8 = ${alcance} m*\n\nDepende de:\n- *v₀²*: cuadrático — duplicar v₀ cuadruplica R.\n- *sin(2θ)*: máximo a 45°.\n- *1/g*: en la Luna (g=1.62) el alcance sería 6x mayor.\n\n**Posición horizontal actual:** x = ${xC} m`;

    if (h('tiempo', 'vuelo', 'cuanto tarda', 'duracion'))
      return `### Tiempo de Vuelo\n*T = 2·v₀·sin(θ) / g = 2·${v0}·sin(${ang}°) / 9.8 = ${tVuelo} s*\n\nTiempo simétrico — misma duración subiendo que bajando.\n*t_max_altura = T/2 = ${(parseFloat(tVuelo)/2).toFixed(2)} s*\n\n**Velocidad vertical al aterrizar:** *vy_f = −v₀y = −${v0y} m/s*`;

    if (h('parabolica', 'por que parabolica', 'forma curva', 'trayectoria'))
      return `### ¿Por qué la Trayectoria es Parabólica?\nAl combinar:\n- *x = v₀x·t* (lineal en t)\n- *y = v₀y·t − ½·g·t²* (cuadrático en t)\n\nEliminando *t* de la ecuación horizontal y sustituyendo en la vertical:\n*y = x·tan(θ) − [g / (2·v₀²·cos²(θ))]·x²*\n\nEsta es la ecuación de una **parábola** — confirma que la trayectoria es inevitablemente parabólica bajo gravedad constante.`;

    if (h('como funciona', 'que hace', 'que simula'))
      return `### Funcionamiento — Tiro Parabólico\nSimula el lanzamiento de un proyectil con *v₀ = ${v0} m/s* a *θ = ${ang}°*.\n\n**Movimiento independiente en dos ejes:**\n- Horizontal: M.R.U. (*vx = ${v0x} m/s* constante)\n- Vertical: M.U.A. con *g = 9.8 m/s²*\n\n**Resultados:** R = ${alcance} m | H = ${hmax} m | T = ${tVuelo} s`;

    return `### Estado — Tiro Parabólico\n- **v₀:** ${v0} m/s | **θ:** ${ang}° | **g:** 9.8 m/s²\n- **Posición:** x=${xC} m, y=${yC} m\n- **Velocidad:** vx=${vx}, vy=${vy}, |v|=${vTotal} m/s\n- **R:** ${alcance} m | **H:** ${hmax} m | **T:** ${tVuelo} s\n\n**Temas:** ecuaciones · componentes · ángulo óptimo · altura · alcance · tiempo · parábola`;
  }

  _getOfflineMRUMCU(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const radio = state.radio || 0;
    const omega = state.omega || 0;
    const periodo = state.periodoMCU || 0;
    const acC = state.acCentripeta || 0;
    const vel = state.velocidad || 0;
    const fase = state.fase || 'MRU';
    const t = state.tiempo || 0;
    const vTang = (omega * radio).toFixed(2);
    const f = periodo > 0 ? (1/periodo).toFixed(3) : '—';

    if (h('ecuacion', 'formula', 'matematica', 'expresion'))
      return `### Ecuaciones MRU + MCU\n**M.R.U.:** *x(t) = x₀ + v·t* | vx = ${vel.toFixed(2)} m/s = constante\n\n**M.C.U.:**\n*ω = v/r = ${vel.toFixed(2)}/${radio.toFixed(2)} = ${omega.toFixed(3)} rad/s*\n*T = 2π·r/v = ${periodo.toFixed(2)} s*\n*f = 1/T = ${f} Hz*\n*a_c = v²/r = ω²·r = ${acC.toFixed(2)} m/s²*\n*θ(t) = θ₀ + ω·t*`;

    if (h('diferencia', 'vs', 'comparar', 'rectilineo vs circular', 'mru vs mcu'))
      return `### M.R.U. vs M.C.U.\n| Característica | M.R.U. | M.C.U. |\n|---|---|---|\n| Trayectoria | Recta | Círculo |\n| Rapidez | Constante (${vel.toFixed(2)} m/s) | Constante (${vel.toFixed(2)} m/s) |\n| Dirección v | Constante | Cambia continuamente |\n| Aceleración | a = 0 | a_c = ${acC.toFixed(2)} m/s² (centrípeta) |\n\n**Paradoja clave MCU:** La rapidez no cambia, pero la dirección sí → hay aceleración (centrípeta) aunque no haya cambio de velocidad escalar.`;

    if (h('centripeta', 'hacia el centro', 'aceleracion circular'))
      return `### Aceleración Centrípeta\n*a_c = v²/r = ω²·r*\n\nSiempre apunta hacia el **centro** del círculo. No cambia la rapidez, solo la dirección.\n\n**En esta simulación:**\n*a_c = ${vel.toFixed(2)}² / ${radio.toFixed(2)} = ${acC.toFixed(2)} m/s²*\n\n**Fuerza centrípeta:** *F_c = m·a_c* — No es una fuerza "extra", es el nombre de la fuerza resultante (tensión, Normal, gravedad, etc.) que apunta hacia el centro.`;

    if (h('velocidad angular', 'omega', 'rad/s', 'radianes por segundo'))
      return `### Velocidad Angular (ω)\nMide cuántos radianes recorre el objeto por segundo:\n*ω = Δθ/Δt = v/r = 2π/T = 2π·f*\n\n**Ahora:** *ω = ${vel.toFixed(2)}/${radio.toFixed(2)} = ${omega.toFixed(3)} rad/s*\n\nConversión: *1 vuelta = 2π rad ≈ 6.283 rad*\n*ω en rpm: ${(omega * 60 / (2*Math.PI)).toFixed(2)} rpm*`;

    if (h('periodo', 'frecuencia', 'vuelta', 'ciclo', 'rpm', 'cuanto tarda'))
      return `### Periodo y Frecuencia del MCU\n**Periodo (T):** Tiempo para dar 1 vuelta completa.\n*T = 2π·r/v = 2π/${omega.toFixed(3)} = ${periodo.toFixed(2)} s*\n\n**Frecuencia (f):** Vueltas por segundo.\n*f = 1/T = ${f} Hz*\n*f en rpm = ${f !== '—' ? (parseFloat(f)*60).toFixed(1) : '—'} rpm*`;

    if (h('transicion', 'pasa de mru', 'cuando gira', 'curva'))
      return `### Transición MRU → MCU\nCuando el objeto llega al inicio de la curva, pasa de movimiento rectilíneo a circular.\n\n**Fase actual:** ${fase}\n\nEn el MCU:\n- La velocidad lineal (${vel.toFixed(2)} m/s) se conserva.\n- Aparece *a_c = ${acC.toFixed(2)} m/s²* hacia el centro.\n- *ω = ${omega.toFixed(3)} rad/s*\n\nLas gráficas muestran una transición suave en aceleración centrípeta: 0 en MRU → ${acC.toFixed(2)} m/s² en MCU.`;

    return `### Estado — MRU + MCU\n- **Fase:** ${fase} | **t:** ${t.toFixed(2)} s\n- **v:** ${vel.toFixed(2)} m/s | **r:** ${radio.toFixed(2)} m\n- **ω:** ${omega.toFixed(3)} rad/s | **T:** ${periodo.toFixed(2)} s | **f:** ${f} Hz\n- **a_c:** ${acC.toFixed(2)} m/s²\n\n**Temas:** ecuaciones · diferencia MRU/MCU · centrípeta · ω · periodo · transición`;
  }

  _getOfflinePendulum(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const L = state.longitud || 1;
    const angIni = state.anguloInicial || 0;
    const angAct = state.angulo_actual || 0;
    const omega = state.velocidadAngular || 0;
    const T = state.periodo || 0;
    const g = 9.8;
    const omegaNat = Math.sqrt(g/L);
    const Teorico = (2 * Math.PI / omegaNat).toFixed(3);

    if (h('ecuacion', 'formula', 'matematica', 'diferencial', 'expresion'))
      return `### Ecuaciones del Péndulo Simple (L=${L.toFixed(2)} m)\n**Ecuación diferencial exacta:**\n*θ'' + (g/L)·sin(θ) = 0*\n\n**Aproximación lineal (θ < 20°):**\n*θ'' + (g/L)·θ = 0* → Movimiento Armónico Simple\n\n**Solución:** *θ(t) = θ₀·cos(ω_n·t + φ)*\n*ω_n = √(g/L) = √(9.8/${L.toFixed(2)}) = ${omegaNat.toFixed(3)} rad/s*\n\n**Periodo:** *T = 2π/ω_n = ${Teorico} s* (actual: ${T.toFixed(3)} s)\n\n**Estado:** θ = ${angAct.toFixed(2)}° | ω = ${omega.toFixed(3)} rad/s`;

    if (h('periodo', 'de que depende', 'depende', 'frecuencia', 'cuanto oscila'))
      return `### ¿De qué Depende el Periodo?\n*T = 2π·√(L/g)*\n\n**Depende de:**\n✅ Longitud L — más largo → más lento\n✅ Gravedad g — mayor g → más rápido\n\n**NO depende de:**\n❌ Masa (principio de Galileo)\n❌ Ángulo inicial (para ángulos < 20°)\n\n**Con L = ${L.toFixed(2)} m:**\n*T = 2π·√(${L.toFixed(2)}/9.8) = ${Teorico} s* | Actual: ${T.toFixed(3)} s`;

    if (h('energia', 'cinetica', 'potencial', 'conservacion', 'conversion'))
      return `### Energía del Péndulo\n*E = Ec + Ep = constante* (sin fricción)\n\n**En el extremo (θ = θ₀):** *Ec = 0* | *Ep = m·g·L·(1−cos(θ₀))* (máxima)\n**En el centro (θ = 0°):** *Ep = 0* | *Ec = ½·m·L²·ω²* (máxima, v máxima)\n\n**Ahora:** θ = ${angAct.toFixed(2)}° | ω = ${omega.toFixed(3)} rad/s\n\nContinua conversión Ep ↔ Ec en cada media oscilación.`;

    if (h('rk4', 'runge kutta', 'integracion numerica', 'numerico', 'metodo numerico'))
      return `### Método Runge-Kutta 4 (RK4)\nPara ángulos grandes, *sin(θ) ≠ θ*, entonces la ecuación no tiene solución analítica cerrada.\n\nEl simulador resuelve numéricamente con **RK4**:\n1. Evalúa 4 pendientes intermedias dentro de cada Δt.\n2. Las combina con pesos: *k₁, 2k₂, 2k₃, k₄* divididos entre 6.\n3. Error por paso proporcional a *(Δt)⁵* → extremadamente preciso.\n4. Conserva la energía mecánica sin errores acumulativos.`;

    if (h('amplitud', 'angulo inicial', 'desplazamiento inicial'))
      return `### Amplitud y Ángulo Inicial\n*θ₀ = ${angIni.toFixed(1)}°* | *θ actual = ${angAct.toFixed(2)}°*\n\n**Régimen válido de la aproximación lineal:** θ < 20°\n${angIni < 20 ? '✅ Amplitud pequeña — la fórmula T = 2π√(L/g) es precisa (error < 1%).' : `⚠ Amplitud grande (${angIni.toFixed(1)}°) — el periodo real es algo mayor que ${Teorico} s. El simulador usa RK4 para corregir esto.`}`;

    if (h('mas', 'movimiento armonico', 'oscilador', 'oscilacion simple'))
      return `### M.A.S. — Movimiento Armónico Simple\nEl péndulo para ángulos pequeños es un oscilador armónico:\n\n*ω_n = √(g/L) = ${omegaNat.toFixed(3)} rad/s*\n*f = ω_n/(2π) = ${(omegaNat/(2*Math.PI)).toFixed(3)} Hz*\n*T = ${Teorico} s*\n\n**Solución:** *θ(t) = θ₀·cos(ω_n·t)* (si empieza en reposo)\n**Velocidad angular:** *ω(t) = −θ₀·ω_n·sin(ω_n·t)*\n\nAnalogía con resorte: *k/m* del resorte equivale a *g/L* del péndulo.`;

    if (h('como funciona', 'que hace', 'que simula', 'historia'))
      return `### El Péndulo Simple — Funcionamiento\nModela un péndulo de longitud *L = ${L.toFixed(2)} m* bajo gravedad.\n\n**Datos actuales:**\n- Ángulo inicial: ${angIni.toFixed(1)}° | Ángulo actual: ${angAct.toFixed(2)}°\n- Periodo: ${T.toFixed(3)} s | Periodo teórico: ${Teorico} s\n\n**Dato histórico:** Galileo descubrió la isocronía del péndulo (~1602) observando una lámpara en la catedral de Pisa. Esta propiedad fue usada por Huygens para fabricar relojes de péndulo precisos (1656).`;

    return `### Estado — Péndulo Simple\n- **L:** ${L.toFixed(2)} m | **θ₀:** ${angIni.toFixed(1)}° | **θ:** ${angAct.toFixed(2)}°\n- **ω:** ${omega.toFixed(3)} rad/s | **T:** ${T.toFixed(3)} s | **T_teórico:** ${Teorico} s\n\n**Temas:** ecuaciones · periodo · energía · RK4 · amplitud · MAS · historia`;
  }

  _getOfflineAtwood(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const m1 = state.m1 || 0;
    const m2 = state.m2 || 0;
    const a = state.aceleracion || 0;
    const tension = state.tension || 0;
    const vel = state.velocidad || 0;
    const t = state.tiempo || 0;
    const g = 9.8;
    const mTot = m1 + m2;

    if (h('ecuacion', 'formula', 'matematica', 'derivacion', 'como se obtiene'))
      return `### Derivación de la Máquina de Atwood\n**Aplicando la 2ª Ley a cada masa:**\n(1) m₁: *m₁·g − T = m₁·a*\n(2) m₂: *T − m₂·g = m₂·a*\n\n**(1)+(2):** *(m₁−m₂)·g = (m₁+m₂)·a*\n*a = (m₁−m₂)·g / (m₁+m₂)*\n*a = (${m1}−${m2})·9.8 / (${m1}+${m2}) = ${a.toFixed(3)} m/s²*\n\n**De (2):** *T = m₂·(g+a) = 2·m₁·m₂·g / (m₁+m₂)*\n*T = 2·${m1}·${m2}·9.8 / ${mTot} = ${tension.toFixed(2)} N*`;

    if (h('tension', 'cuerda', 'hilo', 'fuerza cuerda'))
      return `### Tensión en la Cuerda\n*T = 2·m₁·m₂·g / (m₁+m₂) = ${tension.toFixed(2)} N*\n\n**Casos límite:**\n- *m₁ = m₂ = m* → *T = m·g* (cada masa cuelga en equilibrio)\n- *m₂ → 0* → *T → 0* (m₁ cae libre)\n- *m₁ = m₂* → *T = m·g* (sustiene exactamente el peso)\n\n**Siempre: T < m₁·g** — si fuera igual, m₁ no podría acelerar hacia abajo.`;

    if (h('aceleracion', 'cuanto acelera', 'velocidad'))
      return `### Aceleración del Sistema\n*a = (m₁−m₂)·g / (m₁+m₂) = ${a.toFixed(3)} m/s²*\n\n**Velocidad actual:** ${vel.toFixed(2)} m/s\n\n**Análisis:** a es siempre menor que g para masas finitas. Esto lo convierte en un excelente aparato para medir g con precisión — la aceleración reducida permite mayor resolución.`;

    if (h('equilibrio', 'balance', 'cuando no se mueve', 'iguales'))
      return `### Equilibrio — m₁ = m₂\nEl sistema está en equilibrio cuando *m₁ = m₂*.\n\n**En ese caso:**\n- *a = 0* (no hay aceleración o se mueve a velocidad constante)\n- *T = m·g* (la tensión iguala el peso de cada masa)\n\n**Estado actual:** m₁=${m1} kg, m₂=${m2} kg, diferencia=${Math.abs(m1-m2)} kg\n${m1===m2 ? '✅ Sistema en equilibrio perfecto.' : `⚠ Desequilibrio de ${Math.abs(m1-m2)} kg → a = ${a.toFixed(3)} m/s²`}`;

    if (h('polea', 'rueda', 'como funciona la polea'))
      return `### La Polea en Atwood\nLa polea actúa como **redireccionador de fuerza** (ideal: sin masa, sin fricción).\n\n**Suposiciones del modelo:**\n- Sin inercia rotacional (sin masa)\n- Sin fricción en el eje\n- Cuerda inextensible\n\n**Efecto:** T es la misma a lo largo de toda la cuerda. Si la polea tuviera masa, la aceleración efectiva del sistema sería menor (parte de la energía va a girar la polea).`;

    if (h('aplicacion', 'uso real', 'para que sirve', 'historia', 'inventor'))
      return `### Historia y Aplicaciones\n**George Atwood (1784)** diseñó esta máquina para medir experimentalmente *g* con instrumentos lentos de la época.\n\nLa genialidad: con *m₁ ≈ m₂*, la aceleración es mucho menor que *g*, permitiendo medirla con cronómetros poco precisos.\n\n**Aplicaciones modernas:**\n- Montacargas y ascensores con contrapeso\n- Polipastos industriales\n- Sistemas de amarre y ancla marítima`;

    return `### Estado — Máquina de Atwood\n- **m₁:** ${m1} kg | **m₂:** ${m2} kg | **Total:** ${mTot} kg\n- **a:** ${a.toFixed(3)} m/s² | **T:** ${tension.toFixed(2)} N\n- **v:** ${vel.toFixed(2)} m/s | **t:** ${t.toFixed(2)} s\n\n**Temas:** ecuaciones · tensión · aceleración · equilibrio · polea · historia`;
  }

  _getOfflineInclinedPlane(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const ang = state.anguloPlano || 0;
    const normal = state.normal || 0;
    const pPar = state.pesoParalelo || 0;
    const pPerp = state.pesoPerpendicular || 0;
    const friccion = state.friccion || 0;
    const mu = state.coefFriccion || 0;
    const m = state.masa || 0;
    const a = state.aceleracion || 0;
    const vel = state.velocidad || 0;
    const g = 9.8;
    const W = m * g;
    const angCrit = mu > 0 ? (Math.atan(mu) * 180 / Math.PI).toFixed(1) : '—';

    if (h('ecuacion', 'formula', 'matematica', 'expresion', 'derivacion'))
      return `### Ecuaciones del Plano Inclinado (θ=${ang}°)\n**Peso total:** *W = m·g = ${m}·9.8 = ${W.toFixed(1)} N*\n\n**Descomposición:**\n*W_∥ = m·g·sin(θ) = ${W.toFixed(1)}·sin(${ang}°) = ${pPar.toFixed(1)} N*\n*W_⊥ = m·g·cos(θ) = ${W.toFixed(1)}·cos(${ang}°) = ${pPerp.toFixed(1)} N*\n\n**Normal:** *N = W_⊥ = ${normal.toFixed(1)} N*\n**Fricción:** *f = μ·N = ${mu}·${normal.toFixed(1)} = ${friccion.toFixed(1)} N*\n\n**Aceleración (2ª Ley):**\n*a = g·(sin(θ) − μ·cos(θ)) = ${a.toFixed(3)} m/s²*`;

    if (h('angulo critico', 'cuando desliza', 'angulo minimo', 'umbral', 'cuanto angulo'))
      return `### Ángulo Crítico de Deslizamiento\nCondición de equilibrio en el plano: *W_∥ ≤ f_s_max*\n*m·g·sin(θ_c) = μₑ·m·g·cos(θ_c)*\n*tan(θ_c) = μₑ*\n*θ_c = arctan(${mu}) = ${angCrit}°*\n\n**Ángulo actual: ${ang}°**\n${parseFloat(ang) > parseFloat(angCrit) ? `⚠ **Desliza** (${ang}° > ${angCrit}°) — el peso supera la fricción estática.` : `✅ **En reposo** (${ang}° ≤ ${angCrit}°) — la fricción retiene el bloque.`}`;

    if (h('descomposicion', 'componente', 'peso paralelo', 'peso perpendicular', 'vectores'))
      return `### Descomposición del Peso en el Plano (θ=${ang}°)\n*W = ${W.toFixed(1)} N* se descompone en:\n\n**Paralela al plano** (↓ por la rampa):\n*W_∥ = W·sin(${ang}°) = ${pPar.toFixed(1)} N*\n\n**Perpendicular al plano** (⊥ hacia la superficie):\n*W_⊥ = W·cos(${ang}°) = ${pPerp.toFixed(1)} N*\n\n**Verificación Pitágoras:** *√(${pPar.toFixed(1)}² + ${pPerp.toFixed(1)}²) = ${Math.sqrt(pPar**2+pPerp**2).toFixed(1)} ≈ ${W.toFixed(1)} N* ✅`;

    if (h('normal', 'fuerza normal', 'perpendicular superficie'))
      return `### Fuerza Normal en el Plano Inclinado\n*N = m·g·cos(θ) = ${W.toFixed(1)}·cos(${ang}°) = ${normal.toFixed(1)} N*\n\nA diferencia del plano horizontal (*N = m·g*), la Normal aquí es **menor** que el peso total.\n\n**Efecto del ángulo en N:**\n- θ = 0° → N = ${W.toFixed(1)} N (plano horizontal)\n- θ = ${ang}° → N = ${normal.toFixed(1)} N\n- θ = 90° → N = 0 N (caída libre)\n\nMenor Normal → menor fricción disponible.`;

    if (h('friccion', 'rozamiento', 'resistencia al movimiento'))
      return `### Fricción en el Plano\n*f = μ·N = μ·m·g·cos(θ) = ${mu}·${W.toFixed(1)}·cos(${ang}°) = ${friccion.toFixed(1)} N*\n\n**Efecto en la aceleración:**\n*a = g·(sin(${ang}°) − ${mu}·cos(${ang}°)) = ${a.toFixed(3)} m/s²*\n\n${a > 0 ? '▼ El bloque desciende con aceleración.' : a < 0 ? '▲ La fricción supera el peso paralelo — el bloque desacelera o sube.' : '= Equilibrio dinámico (a = 0).'}`;

    if (h('aceleracion', 'cuanto acelera', 'sube o baja', 'en que direccion'))
      return `### Aceleración en el Plano\n*a = g·(sin(θ) − μ·cos(θ))*\n*a = 9.8·(sin(${ang}°) − ${mu}·cos(${ang}°)) = ${a.toFixed(3)} m/s²*\n\n**v actual:** ${vel.toFixed(2)} m/s\n\n${a > 0 ? '▼ Baja por la rampa (peso > fricción).' : a < 0 ? '▲ Desacelera o sube (fricción > peso paralelo).' : '= Equilibrio (a = 0).'}`;

    if (h('subir', 'plano hacia arriba', 'empujar por la rampa', 'fuerza para subir'))
      return `### Fuerza para Subir el Bloque\nPara que el bloque suba a velocidad constante, se necesita vencer:\n1. Componente peso paralela: *W_∥ = ${pPar.toFixed(1)} N*\n2. Fricción (hacia abajo al subir): *f = ${friccion.toFixed(1)} N*\n\n**Fuerza mínima para subir:** *F_min = W_∥ + f = ${(pPar+friccion).toFixed(1)} N*\n\nPara bajar a velocidad constante: *F_min = W_∥ − f = ${Math.max(0,pPar-friccion).toFixed(1)} N*`;

    if (h('como funciona', 'que hace', 'que simula', 'proposito'))
      return `### Funcionamiento — Plano Inclinado\nSimula un bloque (*m = ${m} kg, μ = ${mu}*) sobre una rampa de *θ = ${ang}°*.\n\n**Fuerzas actuantes:**\n- W_∥ = ${pPar.toFixed(1)} N (por la rampa)\n- N = ${normal.toFixed(1)} N (perpendicular)\n- f = ${friccion.toFixed(1)} N (fricción)\n\n**Resultado:** a = ${a.toFixed(3)} m/s²\n\nAjusta el ángulo y el coeficiente para explorar cuándo el bloque desliza.`;

    return `### Estado — Plano Inclinado\n- **θ:** ${ang}° | **m:** ${m} kg | **μ:** ${mu}\n- **N:** ${normal.toFixed(1)} N | **f:** ${friccion.toFixed(1)} N\n- **W_∥:** ${pPar.toFixed(1)} N | **W_⊥:** ${pPerp.toFixed(1)} N\n- **a:** ${a.toFixed(3)} m/s² | **v:** ${vel.toFixed(2)} m/s | **θ_c:** ${angCrit}°\n\n**Temas:** ecuaciones · ángulo crítico · descomposición · Normal · fricción · aceleración · subir/bajar`;
  }

  _getOfflineVariedMotion(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);
    const t = state.tiempo || 0;
    const a = state.aceleracion || 0;
    const v = state.velocidad || 0;
    const x = state.posicion || 0;

    if (h('ecuacion', 'formula', 'matematica', 'expresion', 'integral', 'integrar'))
      return `### Ecuaciones del Movimiento Variado\nAquí *a = a(t)* — la aceleración cambia con el tiempo.\n\n**Velocidad (integral de a):**\n*v(t) = v₀ + ∫₀ᵗ a(τ)dτ* → ahora **v = ${v.toFixed(2)} m/s**\n\n**Posición (integral de v):**\n*x(t) = x₀ + ∫₀ᵗ v(τ)dτ* → ahora **x = ${x.toFixed(2)} m**\n\n**Aceleración instantánea ahora (t=${t.toFixed(2)} s):** *a = ${a.toFixed(3)} m/s²*`;

    if (h('diferencia', 'mua', 'aceleracion constante', 'vs mua', 'comparar'))
      return `### Movimiento Variado vs M.U.A.\n| | M.U.A. | Movimiento Variado |\n|---|---|---|\n| Aceleración | Constante | Variable: *a(t)* |\n| v-t | Recta | Curva |\n| x-t | Parábola | Curva compleja |\n| Ecuaciones | Analíticas | Integración numérica |\n| a-t | Línea horizontal | Función arbitraria |\n\n**Ahora:** *a(${t.toFixed(2)} s) = ${a.toFixed(3)} m/s²*`;

    if (h('grafica', 'grafico', 'area bajo', 'curva', 'interpretacion'))
      return `### Interpretación de las Gráficas\n**Gráfica a(t):** Muestra la aceleración instantánea.\n- Área bajo la curva = *Δv* (cambio de velocidad)\n\n**Gráfica v(t):** Muestra la velocidad.\n- Pendiente en cada punto = *a(t)* instantánea\n- Área bajo la curva = desplazamiento *Δx*\n\n**Gráfica x(t):** Muestra la posición.\n- Pendiente en cada punto = *v(t)* instantánea\n\n**Ahora:** a=${a.toFixed(3)} | v=${v.toFixed(2)} | x=${x.toFixed(2)} (t=${t.toFixed(2)} s)`;

    if (h('tipos de funcion', 'seno', 'cuadratica', 'lineal', 'exponencial'))
      return `### Tipos de a(t) en Movimiento Variado\n- **Lineal:** *a = a₀ + b·t* → v cuadrática, x cúbica\n- **Sinusoidal:** *a = A·sin(ω·t)* → v oscilante, x oscilatoria\n- **Cuadrática:** *a = c·t²* → v cúbica, x de 4° grado\n- **Exponencial:** *a = a₀·e^(−bt)* → desaceleración como resistencia viscosa (air drag)\n- **Impulso:** *a(t) = F·δ(t)* → cambio brusco de velocidad (colisión)\n\nLa forma de *a(t)* determina completamente la forma de *v(t)* y *x(t)*.`;

    if (h('aceleracion instantanea', 'ahora mismo', 'en este momento', 'instante'))
      return `### Aceleración Instantánea (t = ${t.toFixed(2)} s)\n**a = ${a.toFixed(3)} m/s²**\n\nEs la derivada de la velocidad: *a(t) = dv/dt*\nO la segunda derivada de la posición: *a(t) = d²x/dt²*\n\nEn la gráfica *v vs t*, es la **pendiente de la tangente** a la curva en *t = ${t.toFixed(2)} s*.`;

    if (h('aplicacion', 'caso real', 'ejemplo real', 'para que sirve'))
      return `### Aplicaciones del Movimiento Variado\n**Ejemplos donde la aceleración NO es constante:**\n- 🚀 **Cohete:** La masa disminuye con el tiempo → la aceleración aumenta.\n- 🚗 **Auto con resistencia del aire:** *F_drag ∝ v²* → aceleración disminuye con la velocidad.\n- 🔨 **Muelle amortiguado:** *a = −kx − cv* → M.A.S. con amortiguamiento.\n- 🌊 **Pendulo con fricción:** La amplitud disminuye exponencialmente.\n\nTodos estos requieren integración numérica como la que hace este simulador.`;

    if (h('como funciona', 'que hace', 'que simula'))
      return `### Funcionamiento — Movimiento Variado\nPermite explorar cinemática cuando *a = a(t)* no es constante.\n\n**Estado actual (t = ${t.toFixed(2)} s):**\n- a = ${a.toFixed(3)} m/s² | v = ${v.toFixed(2)} m/s | x = ${x.toFixed(2)} m\n\nEl simulador integra numéricamente la ecuación diferencial *ẍ = a(t)* en cada frame usando el método de Euler o similar, actualizando v y x en tiempo real.`;

    return `### Estado — Movimiento Variado (t=${t.toFixed(2)} s)\n- **a(t):** ${a.toFixed(3)} m/s² | **v:** ${v.toFixed(2)} m/s | **x:** ${x.toFixed(2)} m\n\n**Temas:** ecuaciones e integrales · diferencia con MUA · gráficas · tipos de a(t) · aceleración instantánea · aplicaciones`;
  }

  _getOfflineGeneral(msg, state) {
    const h = (...kw) => this._has(msg, ...kw);

    if (h('ayuda', 'que puedes', 'que sabes', 'como usar', 'comandos', 'temas'))
      return `### ¿Qué puedo responder?\nEstoy especializado en **${this.simulationName}** y física clásica.\n\n**Pregúntame sobre:**\n- 📐 Ecuaciones y fórmulas\n- 🔬 Conceptos: fricción, gravedad, Newton, energía, momentum...\n- 📊 Gráficas: qué significa cada curva\n- 🔢 Variables en tiempo real del simulador\n- 🌍 Aplicaciones y ejemplos reales\n\n**Ejemplos:** "ecuaciones de esta simulación", "qué es la fricción estática", "diferencia MRU y MCU", "por qué es parabólica la trayectoria"`;

    const stateKeys = Object.keys(state);
    if (stateKeys.length > 0) {
      return `### Estado Actual de ${this.simulationName}\n${this._formatState(state)}\n\n**Pregúntame sobre las ecuaciones, los conceptos o qué significa cada variable.**`;
    }

    return `### Asistente de Física — Modo Offline\nEstoy funcionando en **modo local** (sin conexión a IA de Google).\n\n**Puedo responder preguntas de física sobre:**\n- Las Leyes de Newton\n- Cinemática (MRU, MUA, movimiento variado, tiro parabólico)\n- Dinámica (fricción, plano inclinado, Atwood)\n- Movimiento circular (MCU, velocidad angular, centrípeta)\n- Oscilaciones (péndulo simple, MAS)\n- Energía, trabajo, potencia, impulso\n- Vectores, cálculo diferencial e integral en física\n\n*(Para habilitar la IA completa: configura tu API key en \`core/env.js\`.)*`;
  }
