export const RD1215_ANNEX = [
  {
    id: "1.1",
    section: "1. Disposiciones mínimas generales",
    title: "1. Órganos de accionamiento",
    // Original legal text from RD 1215
    legal_text: "Los órganos de accionamiento de un equipo de trabajo que tengan alguna incidencia en la seguridad deberán ser claramente visibles e identificables y, cuando corresponda, estar indicados con una señalización adecuada.",
    // Description used for the card
    description: "Visibilidad, identificación, ubicación segura y prevención de maniobras involuntarias en los mandos del equipo.",
    // Expert criteria from Foment Guide (3.1)
    expert_criteria: [
      "1. Utilizar un modo de mando específico en la máquina que anule el resto de modos de mando.",
      "2. Los elementos peligrosos solo deben funcionar si se actúa permanentemente sobre un dispositivo de validación (mando sensitivo, a dos manos).",
      "3. Autorizar únicamente al funcionamiento en condiciones de riesgo reducido (velocidad reducida, paso a paso).",
      "4. Cumplir con al menos una medida: a) Máxima restricción de acceso, b) Paro de emergencia al alcance inmediato, c) Botonera portátil como único mando activo."
    ],
    // Visualization checks for the AI/User
    check_points: [
      { id: "1.1.1", label: "¿Puesta en marcha BLANCO/VERDE?", detail: "Según código de colores recomendado." },
      { id: "1.1.2", label: "¿Paro NEGRO?", detail: "El paro normal debe ser color negro." },
      { id: "1.1.3", label: "¿Paro Emergencia ROJO sobre AMARILLO?", detail: "Debe ser visible y accesible." },
      { id: "1.1.4", label: "¿Rearme AZUL?", detail: "Si existe pulsador de rearme." },
      { id: "1.1.5", label: "¿Situados fuera de zona peligrosa?", detail: "Salvo excepciones justificadas (ver criterio 4)." },
      { id: "1.1.6", label: "¿Protección contra accionamiento involuntario?", detail: "Pulsadores enrasados, pedales cubiertos, etc." }
    ],
    details: "Los órganos de accionamiento deben estar situados fuera de las zonas peligrosas. Su manipulación no debe acarrear riesgos adicionales. El operador debe poder cerciorarse de la ausencia de personas.",
    ntp_refs: ["Guía Foment 3.1", "NTP 235"],
    machine_type: "fixed"
  },
  {
    id: "1.2",
    section: "1. Disposiciones mínimas generales",
    title: "2. Puesta en marcha",
    description: "La puesta en marcha solamente se podrá efectuar mediante una acción voluntaria sobre un órgano previsto a tal efecto.",
    legal_text: "La puesta en marcha de un equipo de trabajo solamente se podrá efectuar mediante una acción voluntaria sobre un órgano de accionamiento previsto a tal efecto.",
    details: "Aplicable también para la puesta en marcha tras una parada o modificaciones de funcionamiento.",
    expert_criteria: [
      "Impedir la puesta en marcha intempestiva tras restablecimiento de energía.",
      "El órgano de puesta en marcha no debe tener ninguna otra función."
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
      "La parada de emergencia debe bloquear el equipo y requerir rearme voluntario."
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
    details: "Protección contra roturas (muelas, cuchillas) y proyecciones de material.",
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  },
  {
    id: "1.5",
    section: "1. Disposiciones mínimas generales",
    title: "5. Emisión de Gases/Polvo",
    description: "Dispositivos de captación o extracción cerca de la fuente emisora.",
    legal_text: "Los equipos de trabajo deberán disponer de dispositivos adecuados de captación o extracción cerca de la fuente emisora.",
    details: "Obligatorio si hay riesgo higiénico para los trabajadores.",
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.6",
    section: "1. Disposiciones mínimas generales",
    title: "6. Estabilidad",
    description: "Estabilización por fijación o medios adecuados.",
    legal_text: "Los equipos de trabajo y sus elementos deberán estabilizarse por fijación o por otros medios, si es necesario para la seguridad.",
    details: "Anclaje al suelo obligatoria en equipos fijos con riesgo de vuelco o desplazamiento.",
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.7",
    section: "1. Disposiciones mínimas generales",
    title: "7. Estallidos y Roturas",
    description: "Protección contra riesgos de estallido o rotura.",
    legal_text: "Si los elementos móviles entrañan riesgos de accidente por contacto mecánico, deberán ir equipados con resguardos.",
    details: "Resguardos envolventes o distanciadores para elementos a alta velocidad/presión.",
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  },
  {
    id: "1.8",
    section: "1. Disposiciones mínimas generales",
    title: "8. Elementos Móviles",
    description: "Resguardos o dispositivos que impidan el acceso a zonas peligrosas.",
    legal_text: "Si los elementos móviles entrañan riesgos de accidente por contacto mecánico, deberán ir equipados con resguardos o dispositivos de protección.",
    details: "Resguardos fijos (preferentes) o móviles con enclavamiento. No deben ser fácilmente anulables.",
    ntp_refs: ["NTP 552", "ISO 14120"],
    machine_type: "fixed"
  },
  {
    id: "1.9",
    section: "1. Disposiciones mínimas generales",
    title: "9. Iluminación",
    description: "Iluminación adecuada en zonas de trabajo y mantenimiento.",
    legal_text: "Las zonas de trabajo y los puntos de mantenimiento de un equipo de trabajo deberán estar adecuadamente iluminados.",
    details: "Evitar deslumbramientos y sombras molestas.",
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.10",
    section: "1. Disposiciones mínimas generales",
    title: "10. Temperaturas Extremas",
    description: "Protección contra contactos térmicos.",
    legal_text: "Las partes del equipo que alcancen temperaturas elevadas o muy bajas deberán estar protegidas.",
    details: "Aislamiento térmico o alejamiento (barreras).",
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.11",
    section: "1. Disposiciones mínimas generales",
    title: "11. Alarmas",
    description: "Dispositivos de alarma perceptibles y comprensibles.",
    legal_text: "Los dispositivos de alarma del equipo deberán ser perceptibles y comprensibles sin ambigüedades.",
    details: "Señales acústicas (sirenas) o visuales (rotativos) previas a la puesta en marcha.",
    ntp_refs: ["Guía Técnica INSST"],
    machine_type: "fixed"
  },
  {
    id: "1.12",
    section: "1. Disposiciones mínimas generales",
    title: "12. Mantenimiento",
    description: "Operaciones de mantenimiento a equipo parado y consignado.",
    legal_text: "El equipo debe permitir realizar las operaciones de mantenimiento parado. Si no es posible, se deben tomar medidas de protección.",
    details: "Consignación de energías (Lockout/Tagout) obligatoria.",
    ntp_refs: ["NTP 552"],
    machine_type: "fixed"
  }
];
