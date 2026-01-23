export const RD1215_ANNEX = [
  {
    id: "1.1",
    section: "1. Disposiciones mínimas generales",
    title: "1. Órganos de accionamiento",
    legal_text: "Los órganos de accionamiento de un equipo de trabajo que tengan alguna incidencia en la seguridad deberán ser claramente visibles e identificables y, cuando corresponda, estar indicados con una señalización adecuada.",
    description: "Visibilidad, identificación, ubicación segura y prevención de maniobras involuntarias en los mandos del equipo.",
    expert_criteria: [
      "1. Utilizar un modo de mando específico en la máquina que anule el resto de modos de mando.",
      "2. Los elementos peligrosos solo deben funcionar si se actúa permanentemente sobre un dispositivo de validación (mando sensitivo, a dos manos).",
      "3. Autorizar únicamente al funcionamiento en condiciones de riesgo reducido (velocidad reducida, paso a paso).",
      "4. Cumplir con al menos una medida: a) Máxima restricción de acceso, b) Paro de emergencia al alcance inmediato, c) Botonera portátil como único mando activo."
    ],
    check_points: [
      { id: "1.1.1", label: "¿Están claramente visibles e identificados?", detail: "Identificar mediante pictogramas simples o texto en castellano." },
      { id: "1.1.2", label: "¿Código de Colores Correcto?", detail: "Marcha (BLANCO), Parada (NEGRO), Emergencia (ROJO sobre AMARILLO), Rearme (AZUL)." },
      { id: "1.1.3", label: "¿Situados fuera de zonas peligrosas?", detail: "Salvo excepciones justificadas (pedales protegidos, mando a dos manos, etc.)." },
      { id: "1.1.4", label: "¿Protección contra accionamiento involuntario?", detail: "Pulsadores enrasados/con anillo, pedales cubiertos, mandos bloqueables." },
      { id: "1.1.5", label: "¿Visibilidad desde puesto de mando?", detail: "El operador debe ver que no hay nadie en zona peligrosa. Si no, aviso acústico/visual previo." },
      { id: "1.1.6", label: "¿Sistemas de mando seguros (Categoría)?", detail: "Deben resistir fallos y perturbaciones previsibles (Considerar Categoría de Mando según ISO 13849)." }
    ],
    details: "Los órganos de accionamiento deben estar situados fuera de las zonas peligrosas. Su manipulación no debe acarrear riesgos adicionales. El operador debe poder cerciorarse de la ausencia de personas. Si esto no es posible, sistema de aviso acústico/visual obligatorio.",
    ntp_refs: ["Guía Foment 3.1", "NTP 235", "ISO 13849"],
    machine_type: "fixed"
  },
  {
    id: "1.2",
    section: "1. Disposiciones mínimas generales",
    title: "2. Puesta en marcha",
    description: "La puesta en marcha solamente se podrá efectuar mediante una acción voluntaria sobre un órgano previsto a tal efecto.",
    legal_text: "La puesta en marcha de un equipo de trabajo solamente se podrá efectuar mediante una acción voluntaria sobre un órgano de accionamiento previsto a tal efecto.",
    details: "Aplicable también para la puesta en marcha tras una parada o modificaciones de funcionamiento. Impedir arranques intempestivos tras cortes de energía.",
    expert_criteria: [
      "Impedir la puesta en marcha intempestiva tras restablecimiento de energía.",
      "El órgano de puesta en marcha no debe tener ninguna otra función.",
      "Cambios de modo de funcionamiento deben requerir nueva puesta en marcha voluntaria."
    ],
    check_points: [
      { id: "1.2.1", label: "¿Puesta en marcha voluntaria exclusiva?", detail: "Solo mediante acción voluntaria sobre órgano específico. No por cierre de resguardo o desbloqueo de seta." },
      { id: "1.2.2", label: "¿Protección contra rearranque tras corte?", detail: "El equipo no debe arrancar solo al volver la luz (Bovina de mínima tensión o contactor autoalimentado)." },
      { id: "1.2.3", label: "¿Puesta en marcha tras cambio de modo?", detail: "Cualquier cambio de parámetros o modo debe exigir una nueva orden de marcha." }
    ],
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.3",
    section: "1. Disposiciones mínimas generales",
    title: "3. Parada y Emergencia",
    description: "Órganos de accionamiento que permitan la parada total en condiciones de seguridad.",
    legal_text: "Todo equipo de trabajo deberá estar provisto de un órgano de accionamiento que permita su parada total en condiciones de seguridad.",
    details: "Prioridad de la parada sobre la marcha. Dispositivos de parada de emergencia requeridos según riesgos.",
    expert_criteria: [
      "Parada General (Categoría 0, 1 o 2 según IEC 60204).",
      "La parada de emergencia debe bloquear el equipo y requerir rearme voluntario.",
      "Orden de parada prioritaria sobre cualquier orden de marcha."
    ],
    check_points: [
      { id: "1.3.1", label: "¿Órgano de Parada Total accesible?", detail: "Debe permitir la parada total en condiciones os eguridad." },
      { id: "1.3.2", label: "¿Parada en cada puesto de mando?", detail: "Si hay varios puestos, cada uno debe tener control de parada." },
      { id: "1.3.3", label: "¿Prioridad de la Parada?", detail: "La orden de parada prevalece sobre la de marcha (incluso si se pulsan a la vez)." },
      { id: "1.3.4", label: "¿Corte de energía efectivo?", detail: "La parada interrumpe el suministro a los accionadores peligrosos." },
      { id: "1.3.5", label: "¿Parada de Emergencia (Seta)?", detail: "Fondo amarillo, seta roja, enclavable. Requerido si reduce el tiempo de parada o por riesgo." }
    ],
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  },
  {
    id: "1.4",
    section: "1. Disposiciones mínimas generales",
    title: "4. Caídas y Proyecciones",
    description: "Dispositivos de protección contra caídas de objetos y proyecciones.",
    legal_text: "Cualquier equipo de trabajo que entrañe riesgo de caída de objetos o proyecciones deberá estar provisto de dispositivos de protección adecuados.",
    details: "Protección contra roturas (muelas, cuchillas) y proyecciones de material. Si el resguardo está roto, sustitución inmediata.",
    expert_criteria: [
      "Resistencia suficiente de resguardos (policarbonato, rejilla...).",
      "Evitar puestos de trabajo en trayectoria de proyecciones.",
      "Sistemas de retención de carga (válvulas antirretorno en elevación)."
    ],
    check_points: [
      { id: "1.4.1", label: "¿Protección contra caída de objetos?", detail: "Resguardos, marquesinas o impedimento de acceso a zonas de caída." },
      { id: "1.4.2", label: "¿Protección contra proyecciones (partículas/fluidos)?", detail: "Pantallas resistentes. Si hay riesgo de rotura de herramienta (muela), carcasa reforzada." },
      { id: "1.4.3", label: "¿Estado de los resguardos anti-proyección?", detail: "Sin grietas ni deterioros que comprometan su resistencia." }
    ],
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  },
  {
    id: "1.5",
    section: "1. Disposiciones mínimas generales",
    title: "5. Emisión de Gases/Polvo",
    description: "Dispositivos de captación o extracción cerca de la fuente emisora.",
    legal_text: "Los equipos de trabajo deberán disponer de dispositivos adecuados de captación o extracción cerca de la fuente emisora.",
    details: "Obligatorio si hay riesgo higiénico. Consultar Fichas de Seguridad de productos químicos.",
    expert_criteria: [
      "Captación localizada (aspiración) lo más cerca posible del foco.",
      "Si no es suficiente, ventilación general o EPIS (como último recurso)."
    ],
    check_points: [
      { id: "1.5.1", label: "¿Captación localizada en la fuente?", detail: "Campanas, boquillas de aspiración en el punto de generación de polvo/humo." },
      { id: "1.5.2", label: "¿Estado del sistema de aspiración?", detail: "Verificar funcionamiento, filtros limpios y ausencia de fugas." },
      { id: "1.5.3", label: "¿EPIS necesarios señalizados?", detail: "Si la protección colectiva no es total, señalización de uso obligatorio de mascarilla/respirador." }
    ],
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.6",
    section: "1. Disposiciones mínimas generales",
    title: "6. Estabilidad y Acceso",
    description: "Estabilización del equipo y condiciones seguras de acceso / permanencia.",
    legal_text: "Los equipos de trabajo deberán estabilizarse por fijación o por otros medios. Deben contar con medios adecuados de acceso y permanencia.",
    details: "Anclaje al suelo si hay riesgo de vuelco. Pasarelas y escaleras con barandilla (altura 90cm, rodapié, listón intermedio).",
    expert_criteria: [
      "Anclaje firme al suelo o estructura.",
      "Accesos (escaleras/pasarelas) con ancho mín. 60-80cm.",
      "Barandillas rígidas en alturas > 2m (Altura 90cm, rodapié 15cm, listón intermedio)."
    ],
    check_points: [
      { id: "1.6.1", label: "¿Equipo anclado/estable?", detail: "Sin vibraciones excesivas ni riesgo de vuelco. Anclajes firmes." },
      { id: "1.6.2", label: "¿Medios de acceso (Escaleras/Plataformas) seguros?", detail: "Escalones antideslizantes, barandillas completas, buen estado." },
      { id: "1.6.3", label: "¿Protección contra caídas > 2m?", detail: "Barandilla rígida (90cm altura) con rodapié y listón intermedio." },
      { id: "1.6.4", label: "¿Limpieza y orden en zonas de tránsito?", detail: "Sin grasa/aceite en suelos. Ancho de paso libre (rec. 80cm)." }
    ],
    ntp_refs: ["Guía Técnica INSST", "RD 486/1997"],
    machine_type: "fixed"
  },
  {
    id: "1.7",
    section: "1. Disposiciones mínimas generales",
    title: "7. Estallidos y Roturas",
    description: "Protección contra riesgos de estallido o rotura.",
    legal_text: "Si los elementos móviles entrañan riesgos de accidente por contacto mecánico, deberán ir equipados con resguardos.",
    details: "Resguardos resistentes a impactos (rotura de muelas, latiguillos hidráulicos).",
    expert_criteria: [
      "Resguardos envolventes o distanciadores resistentes.",
      "Evitar sobrevelocidades o sobrepresiones que causen roturas."
    ],
    check_points: [
      { id: "1.7.1", label: "¿Resguardos resistentes a impactos?", detail: "Capaces de retener fragmentos de herramienta o pieza." },
      { id: "1.7.2", label: "¿Protección de latiguillos/tuberías presión?", detail: "Fundas textiles o pantallas si hay riesgo de latigazo o proyección de fluido a alta presión." },
      { id: "1.7.3", label: "¿Velocidades de rotación controladas?", detail: "Adecuadas a la herramienta (ej. muela abrasiva) para evitar estallido por fuerza centrífuga." }
    ],
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  },
  {
    id: "1.8",
    section: "1. Disposiciones mínimas generales",
    title: "8. Elementos Móviles (Resguardos)",
    description: "Resguardos o dispositivos que impidan el acceso a zonas peligrosas.",
    legal_text: "Si los elementos móviles entrañan riesgos de accidente por contacto mecánico, deberán ir equipados con resguardos o dispositivos de protección.",
    details: "Resguardos fijos (preferentes) o móviles con enclavamiento. No deben ser fácilmente anulables. Distancias de seguridad según ISO 13857.",
    expert_criteria: [
      "Resguardos Fijos: Solo desmontables con herramientas.",
      "Resguardos Móviles: Deben tener enclavamiento (parada si se abren).",
      "Distancias de seguridad: Impedir alcance del peligro (arriba, abajo, lateral)."
    ],
    check_points: [
      { id: "1.8.1", label: "¿Resguardos Fijos sólidos?", detail: "Requieren herramienta para retirarse. Sin huecos grandes." },
      { id: "1.8.2", label: "¿Resguardos Móviles con Enclavamiento?", detail: "Si se abre, la máquina para. No arranca al cerrar (requiere rearme)." },
      { id: "1.8.3", label: "¿Distancias de seguridad correctas?", detail: "No se llega al peligro metiendo la mano/brazo (Consultar ISO 13857)." },
      { id: "1.8.4", label: "¿Difífices de anular?", detail: "Interruptores de seguridad codificados o inaccesibles." },
      { id: "1.8.5", label: "¿Visibilidad del proceso?", detail: "El resguardo permite ver lo necesario sin necesidad de retirarlo." }
    ],
    ntp_refs: ["NTP 552", "ISO 14120", "ISO 13857"],
    machine_type: "fixed"
  },
  {
    id: "1.9",
    section: "1. Disposiciones mínimas generales",
    title: "9. Iluminación",
    description: "Iluminación adecuada en zonas de trabajo y mantenimiento.",
    legal_text: "Las zonas de trabajo y los puntos de mantenimiento de un equipo de trabajo deberán estar adecuadamente iluminados.",
    details: "Evitar deslumbramientos, sombras molestas y efectos estroboscópicos. Iluminación localizada si es necesario.",
    expert_criteria: [
      "Nivel lux suficiente para la tarea (mín 100-300 lux según precisión).",
      "Ausencia de parpadeo (efecto estroboscópico) en partes rotativas.",
      "Iluminación localizada en zonas de ajuste/mantenimiento preciso."
    ],
    check_points: [
      { id: "1.9.1", label: "¿Iluminación suficiente?", detail: "Se ve bien el detalle de la tarea sin forzar la vista." },
      { id: "1.9.2", label: "¿Sin deslumbramientos ni sombras?", detail: "Luz difusa, sin reflejos molestos." },
      { id: "1.9.3", label: "¿Iluminación localizada?", detail: "Foco específico en el punto de operación si se requiere precisión." },
      { id: "1.9.4", label: "¿Protección de lámparas?", detail: "Luminarias con carcasa protectora contra impactos." }
    ],
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.10",
    section: "1. Disposiciones mínimas generales",
    title: "10. Temperaturas Extremas",
    description: "Protección contra contactos térmicos.",
    legal_text: "Las partes del equipo que alcancen temperaturas elevadas o muy bajas deberán estar protegidas.",
    details: "Aislamiento térmico o alejamiento (barreras). Señalización de riesgo térmico.",
    expert_criteria: [
      "Calorifugado de tuberías/depósitos calientes o fríos.",
      "Pantallas de protección contra contacto accidental.",
      "Señalización 'Peligro Superficie Caliente'."
    ],
    check_points: [
      { id: "1.10.1", label: "¿Superficies calientes protegidas?", detail: "Aislamiento o rejilla que impida el contacto." },
      { id: "1.10.2", label: "¿Señalización de riesgo térmico?", detail: "Triángulo de advertencia (Llama o Temperatura)." },
      { id: "1.10.3", label: "¿Protección contra salpicaduras calientes?", detail: "Si hay líquidos calientes, resguardos estancos." }
    ],
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.11",
    section: "1. Disposiciones mínimas generales",
    title: "11. Alarmas",
    description: "Dispositivos de alarma perceptibles y comprensibles.",
    legal_text: "Los dispositivos de alarma del equipo deberán ser perceptibles y comprensibles sin ambigüedades.",
    details: "Señales acústicas (sirenas) o visuales (rotativos) previas a la puesta en marcha en equipos grandes.",
    expert_criteria: [
      "Aviso previo al arranque en líneas automáticas o zonas ciegas.",
      "Diferenciacion clara de señales (marcha, avería, emergencia)."
    ],
    check_points: [
      { id: "1.11.1", label: "¿Alarma de arranque audible/visible?", detail: "Bocina o luz giratoria antes de moverse (espera 3-5s)." },
      { id: "1.11.2", label: "¿Alarmas comprensibles?", detail: "El código de señales es conocido por los operarios." },
      { id: "1.11.3", label: "¿Pararrayos (si aplica)?", detail: "Para equipos al aire libre en zonas de tormenta." }
    ],
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.12",
    section: "1. Disposiciones mínimas generales",
    title: "12. Mantenimiento y Energías",
    description: "Operaciones de mantenimiento a equipo parado. Consignación de energías (LOTO). Señalización.",
    legal_text: "El equipo debe permitir realizar las operaciones de mantenimiento parado. Todo equipo deberá estar provisto de dispositivos claramente identificables para separarlo de cada una de sus fuentes de energía.",
    details: "Consignación de energías (Lockout/Tagout) obligatoria. Interruptores de corte bloqueables con candado. Libro de mantenimiento.",
    expert_criteria: [
      "Interruptor principal bloqueable en posición '0' (candado).",
      "Disipación de energías residuales (eléctrica, hidráulica, neumática).",
      "Señalización de riesgos residuales y EPIs obligatorios."
    ],
    check_points: [
      { id: "1.12.1", label: "¿Interruptor principal bloqueable?", detail: "Se puede poner un candado para evitar reconexión." },
      { id: "1.12.2", label: "¿Procedimiento LOTO/Consignación?", detail: "¿Es posible bloquear todas las energías (aire, luz, agua...)?." },
      { id: "1.12.3", label: "¿Eliminación de energías residuales?", detail: "Purga de aire, descarga de condensadores, bajada de elementos elevados." },
      { id: "1.12.4", label: "¿Libro de Mantenimiento al día?", detail: "Registro de revisiones periódicas." },
      { id: "1.12.5", label: "¿Señalización de Riesgos y EPIS?", detail: "Adhesivos de advertencia y obligación (gafas, guantes, etc.) en el equipo." }
    ],
    ntp_refs: ["NTP 552", "NTP 1117 (LOTO)"],
    machine_type: "fixed"
  }
];
