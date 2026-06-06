export const ASSISTANT_GREETINGS = [
  '¡Hola! Soy el asistente MoviliX. ¿En qué puedo ayudarte hoy?',
];

export const ASSISTANT_RESPONSES: Record<string, string> = {
  congestion: `⚠️ *Zona de alta congestión detectada*\n\nSe registran 3 incidencias activas en la Av. Busch durante la última hora.\n\nSe recomienda usar Teleférico Línea Roja como alternativa. Tiempo estimado de retraso: 25-40 min.`,
  trameaje: `🚌 *Alerta de trameaje activa*\n\nEl Minibus 273 registra 2 reportes confirmados en La Ceja. Los pasajeros reportan esperas de más de 20 minutos.\n\nAlternativa sugerida: Trufi 2 con conexión en Av. 16 de Julio.`,
  ruta: `🗺️ *Análisis de tu ruta habitual*\n\nEstado actual: Moderado\n✅ Teleférico Línea Amarilla → Sin incidencias\n⚠️ Minibus 273 → 1 reporte de trameaje\n\n¿Deseas ver el mapa en tiempo real?`,
  default: `📊 *Resumen del día*\n\n• 23 reportes registrados hoy\n• 5 zonas con alta incidencia\n• 16 reportes confirmados por la comunidad\n\nLas horas pico con mayor actividad son 7:00-9:00 AM y 6:00-8:00 PM.`,
};
