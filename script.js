"use strict";

/* ==========================================================================
   DATOS OFICIALES DE LAS 15 ENCUESTAS (BARRIO PUERTO, VALPARAÍSO)
   ========================================================================== */
const TOTAL_ENCUESTAS = 15;

const datosSectores = {
  serrano: {
    nombre: 'Calle Serrano',
    tipo: 'CALLE DE VALPARAÍSO',
    tipoGeom: 'calle',
    color: '#F17149',
    contencion: 15,
    cruce: 0,
    apertura: 0,
    enfoque: { x: 722, y: 528, zoom: 1.8 },
    descripcion: '15 de 15 personas perciben contención absoluta. La marcada verticalidad de los edificios de 4 a 5 pisos y el perfil angosto de la calzada producen una fuerte sensación de resguardo, densidad y cobijo urbano continuo.'
  },
  cochrane: {
    nombre: 'Calle Cochrane',
    tipo: 'CALLE DE VALPARAÍSO',
    tipoGeom: 'calle',
    color: '#DA7C5F',
    contencion: 7,
    cruce: 7,
    apertura: 1,
    enfoque: { x: 814, y: 488, zoom: 2.2 },
    descripcion: '47% percibe contención y 47% cruce perceptivo. Es un corredor continuo de fachadas patrimoniales que canalizan el flujo peatonal conectando Plaza Echaurren con Plaza Sotomayor bajo un enmarque espacial constante.'
  },
  blanco: {
    nombre: 'Calle Blanco',
    tipo: 'CALLE DE VALPARAÍSO',
    tipoGeom: 'calle',
    color: '#F17149',
    contencion: 11,
    cruce: 3,
    apertura: 1,
    enfoque: { x: 902, y: 386, zoom: 2.2 },
    descripcion: '11 de 15 personas perciben contención. Vía comercial histórica de alta densidad, definida por bloques de gran masa construida y una línea de cornisa continua y homogénea a ambos lados.'
  },
  errazuriz: {
    nombre: 'Avenida Errázuriz',
    tipo: 'AVENIDA COSTERA',
    tipoGeom: 'calle',
    color: '#AA918A',
    contencion: 5,
    cruce: 6,
    apertura: 4,
    enfoque: { x: 1166, y: 511, zoom: 1.85 },
    descripcion: 'Avenida ancha junto a la faja ferroviaria y el mar; ofrece horizontes abiertos que equilibran la contención de los edificios comerciales con el desahogo visual hacia el puerto.'
  },
  sotomayor: {
    nombre: 'Plaza Sotomayor',
    tipo: 'GRAN EXPLANADA CÍVICA',
    tipoGeom: 'area',
    color: '#63B1C9',
    contencion: 1,
    cruce: 2,
    apertura: 12,
    enfoque: { x: 929, y: 776, zoom: 2.2 },
    guias: [
      [[988, 684], [1042, 772]],
      [[1042, 772], [869, 895]],
      [[869, 895], [817, 755]],
      [[817, 755], [988, 684]]
    ],
    descripcion: '12 de 15 personas perciben apertura. Gran plaza cívica abierta en dirección al mar; la amplia distancia entre edificios y la ausencia de techumbre generan una visión despejada del cielo y del puerto.'
  },
  monumento: {
    nombre: 'Monumento a los Héroes',
    tipo: 'EXPLANADA CONMEMORATIVA',
    tipoGeom: 'area',
    color: '#86A1A9',
    contencion: 2,
    cruce: 4,
    apertura: 9,
    enfoque: { x: 1066, y: 696, zoom: 2.6 },
    guias: [
      [[1085, 633], [1131, 706]],
      [[1131, 706], [1048, 759]],
      [[1048, 759], [1001, 686]],
      [[1001, 686], [1085, 633]]
    ],
    descripcion: '9 de 15 personas perciben apertura. Plataforma conmemorativa central de Plaza Sotomayor que articula el cruce hacia los muelles y la estación, funcionando como bisagra entre la tierra y el mar.'
  },
  muelle: {
    nombre: 'Muelle Prat',
    tipo: 'BORDE COSTERO Y EMBARCADERO',
    tipoGeom: 'area',
    color: '#3FC2E9',
    contencion: 0,
    cruce: 0,
    apertura: 15,
    enfoque: { x: 1230, y: 530, zoom: 2.2 },
    guias: [
      [[1195, 550], [1215, 610]]
    ],
    descripcion: '15 de 15 personas perciben apertura absoluta. Ausencia total de obstáculos construidos hacia la bahía; máxima amplitud espacial con horizonte marítimo despejado y brisa marina directa.'
  },
  echaurren: {
    nombre: 'Plaza Echaurren',
    tipo: 'PLAZA HISTÓRICA',
    tipoGeom: 'area',
    color: '#7BA7B4',
    contencion: 2,
    cruce: 3,
    apertura: 10,
    enfoque: { x: 637, y: 263, zoom: 2.6 },
    guias: [
      [[535, 263], [566, 330]],
      [[566, 330], [735, 269]],
      [[735, 269], [714, 190]],
      [[714, 190], [535, 263]]
    ],
    descripcion: '10 de 15 personas perciben apertura. Espacio público fundacional del puerto; su centro arbolado interrumpe la compacidad del tejido urbano inmediato, aportando una pausa de ventilación y luz.'
  }
};

/* ==========================================================================
   LEVANTAMIENTOS DE PALABRAS: ONDA / MONTAÑA TIPOGRÁFICA
   "ahora ya no son edificios, ahora el levantamiento tienen que ser palabras,
    bajo el mismo parámetro que antes, es decir la misma disposición que los
    levantamientos de edificios pero con palabras, siguen apareciendo de a poco
    y están bien optimizadas las animaciones para que carguen bien de forma fluida.
    y para que las palabras se lean bien tienen que ser blancas (tipografía montserrat),
    con fondo blur un poco transparente del color de cada calle haciendo una especie
    de onda, montaña que tenga la forma que dan las diferentes alturas de las palabras.
    las palabras van en bold las más repetidas, en light las menos repetidas y regular
    las que están en medio."
   ========================================================================== */
const SVG_NS = 'http://www.w3.org/2000/svg';
const mapaSvg = document.getElementById('mapa-svg');
const mapaContenido = document.getElementById('mapa-contenido');
const capaEdificios = document.getElementById('capa-edificios');
const mapaSectoresEdificios = new Map();

function crearSVG(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

// Datos oficiales de palabras clave y cantidad de respuestas por sector
// Datos oficiales de palabras clave y cantidad exacta de respuestas por sector (separadas, sin slash)
const DATOS_ENCUESTA_PALABRAS = {
  muelle: [
    { palabras: ['Amplio', 'Amplitud'], valor: 7, peso: 'bold' },
    { palabras: ['Mar'], valor: 7, peso: 'bold' },
    { palabras: ['Vista'], valor: 7, peso: 'bold' },
    { palabras: ['Abierto'], valor: 2, peso: 'light' },
    { palabras: ['Libre'], valor: 2, peso: 'light' },
    { palabras: ['Cielo'], valor: 2, peso: 'light' },
    { palabras: ['Construcciones'], valor: 2, peso: 'light' }
  ],
  errazuriz: [
    { palabras: ['Edificios'], valor: 10, peso: 'bold' },
    { palabras: ['Ancho'], valor: 3, peso: 'regular' },
    { palabras: ['Autos', 'Vehículos'], valor: 3, peso: 'regular' },
    { palabras: ['Amplio'], valor: 2, peso: 'regular' },
    { palabras: ['Cerrado'], valor: 2, peso: 'regular' },
    { palabras: ['Vista'], valor: 2, peso: 'regular' },
    { palabras: ['Angosto'], valor: 1, peso: 'light' }
  ],
  sotomayor: [
    { palabras: ['Edificios'], valor: 6, peso: 'bold' },
    { palabras: ['Despejado'], valor: 3, peso: 'regular' },
    { palabras: ['Caminar'], valor: 3, peso: 'regular' },
    { palabras: ['Amplio'], valor: 2, peso: 'regular' },
    { palabras: ['Extenso'], valor: 2, peso: 'regular' },
    { palabras: ['Espacioso'], valor: 2, peso: 'regular' },
    { palabras: ['Feria'], valor: 1, peso: 'light' }
  ],
  monumento: [
    { palabras: ['Edificios'], valor: 5, peso: 'bold' },
    { palabras: ['Rodeado'], valor: 4, peso: 'regular' },
    { palabras: ['Amplio'], valor: 3, peso: 'regular' },
    { palabras: ['Abierto'], valor: 2, peso: 'regular' },
    { palabras: ['Extenso'], valor: 1, peso: 'light' },
    { palabras: ['Encerrado'], valor: 1, peso: 'light' }
  ],
  blanco: [
    { palabras: ['Edificios'], valor: 14, peso: 'bold' },
    { palabras: ['Cerca', 'Cercanos', 'Cercanía'], valor: 6, peso: 'bold' },
    { palabras: ['Altos', 'Altas'], valor: 5, peso: 'regular' },
    { palabras: ['Pasillo'], valor: 2, peso: 'regular' },
    { palabras: ['Cerrado', 'Encerrado'], valor: 2, peso: 'regular' },
    { palabras: ['Fachadas'], valor: 1, peso: 'light' },
    { palabras: ['Oscura'], valor: 1, peso: 'light' }
  ],
  cochrane: [
    { palabras: ['Estrecho', 'Angosto'], valor: 8, peso: 'bold' },
    { palabras: ['Edificios'], valor: 7, peso: 'bold' },
    { palabras: ['Cerca', 'Cercanos', 'Próximos'], valor: 6, peso: 'bold' },
    { palabras: ['Pasillo'], valor: 1, peso: 'light' },
    { palabras: ['Caminar'], valor: 1, peso: 'light' },
    { palabras: ['Vehículos'], valor: 1, peso: 'light' }
  ],
  serrano: [
    { palabras: ['Edificios'], valor: 6, peso: 'bold' },
    { palabras: ['Fachadas'], valor: 3, peso: 'regular' },
    { palabras: ['Angosto'], valor: 3, peso: 'regular' },
    { palabras: ['Cerrado', 'Encerrado'], valor: 3, peso: 'regular' },
    { palabras: ['Pasillo', 'Corredor'], valor: 2, peso: 'light' },
    { palabras: ['Continuidad', 'Continua'], valor: 2, peso: 'light' },
    { palabras: ['Altos', 'Altas'], valor: 2, peso: 'light' }
  ],
  echaurren: [
    { palabras: ['Edificios'], valor: 8, peso: 'bold' },
    { palabras: ['Amplio'], valor: 6, peso: 'bold' },
    { palabras: ['Rodeado', 'Rodean'], valor: 5, peso: 'regular' },
    { palabras: ['Abierto'], valor: 3, peso: 'regular' },
    { palabras: ['Locales'], valor: 2, peso: 'regular' },
    { palabras: ['Árboles'], valor: 2, peso: 'regular' },
    { palabras: ['Espaciosa'], valor: 1, peso: 'light' },
    { palabras: ['Extenso'], valor: 1, peso: 'light' }
  ]
};

// ==========================================================================
// LEVANTAMIENTO TIPOGRÁFICO: MONTAÑA CURVA ADAPTATIVA Y PALABRAS EN VERTICAL
// "que el fondo de las palabras sea una montaña curva que se adapta a la forma
//  de las palabras, las palabras deben ir paradas en vertical mezcladas utilizando
//  los parámetros: en bold las más repetidas, en light las menos repetidas y regular
//  las que están en medio... escritas hacia arriba de diferentes tamaños, más grandes
//  las más repetidas y más pequeñas las menos repetidas, y no pueden salir de las
//  montañas ya hechas, deben estar dentro."
// ==========================================================================

// Función para intercalar armónicamente las palabras según encuesta
// Creando el patrón rítmico de onda: Cima (bold) -> Bajada (regular) -> Valle (light) -> Subida (regular)
function generarSecuenciaPalabrasOnda(id, ladoIdx, numPuntos) {
  const def = DATOS_ENCUESTA_PALABRAS[id];
  if (!def) return [];

  const boldWords = [];
  const regularWords = [];
  const lightWords = [];

  def.forEach(item => {
    item.palabras.forEach(w => {
      const obj = { texto: w, valor: item.valor, peso: item.peso };
      if (item.peso === 'bold') boldWords.push(obj);
      else if (item.peso === 'regular') regularWords.push(obj);
      else lightWords.push(obj);
    });
  });

  // Ordenar por cantidad de votos de mayor a menor
  boldWords.sort((a, b) => b.valor - a.valor);
  regularWords.sort((a, b) => b.valor - a.valor);
  lightWords.sort((a, b) => b.valor - a.valor);

  // Fallbacks seguros si alguna categoría está vacía en algún sector
  const poolBold = boldWords.length > 0 ? boldWords : (regularWords.length > 0 ? regularWords : lightWords);
  const poolRegular = regularWords.length > 0 ? regularWords : (lightWords.length > 0 ? lightWords : poolBold);
  const poolLight = lightWords.length > 0 ? lightWords : (regularWords.length > 0 ? regularWords : poolBold);

  const resultado = [];
  // Desfase de fase en el lado opuesto de la calle para crear un contrapunto visual orgánico
  const offsetFase = ladoIdx === 1 ? 2 : 0;

  for (let k = 0; k < numPuntos; k++) {
    const paso = (k + offsetFase) % 4;
    let palabra;
    if (paso === 0) {
      // Cima de la montaña: palabra en bold más repetida
      palabra = poolBold[(Math.floor(k / 4) + ladoIdx) % poolBold.length];
    } else if (paso === 2) {
      // Valle de la montaña: palabra en light menos repetida
      palabra = poolLight[(Math.floor(k / 4) + ladoIdx) % poolLight.length];
    } else {
      // Pendiente intermedia: palabra regular
      palabra = poolRegular[(k + ladoIdx) % poolRegular.length];
    }
    resultado.push(palabra);
  }

  return resultado;
}

// Muestreo preciso de puntos sobre la acera de una calle en distancia d
function getSidewalkPointCalle(hit, totalL, d, ladoSign, offsetLateral) {
  const dClamped = Math.max(0, Math.min(totalL, d));
  const p = hit.getPointAtLength(dClamped);
  const pAnt = hit.getPointAtLength(Math.max(0, dClamped - 4));
  const pSig = hit.getPointAtLength(Math.min(totalL, dClamped + 4));
  const ang = Math.atan2(pSig.y - pAnt.y, pSig.x - pAnt.x);
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  return {
    x: p.x + ladoSign * nx * offsetLateral,
    y: p.y + ladoSign * ny * offsetLateral,
    ang: ang
  };
}

// Guías base de plazas y áreas
function getAreaGuidePoints(id, ladoSign) {
  let p1, p2;
  if (id === 'sotomayor') {
    if (ladoSign === -1) {
      p1 = { x: 790, y: 760 }; p2 = { x: 1010, y: 670 };
    } else {
      p1 = { x: 840, y: 910 }; p2 = { x: 1060, y: 775 };
    }
  } else if (id === 'monumento') {
    if (ladoSign === -1) {
      p1 = { x: 990, y: 685 }; p2 = { x: 1065, y: 775 };
    } else {
      p1 = { x: 1070, y: 620 }; p2 = { x: 1145, y: 715 };
    }
  } else if (id === 'muelle') {
    if (ladoSign === -1) {
      p1 = { x: 1160, y: 610 }; p2 = { x: 1270, y: 360 };
    } else {
      p1 = { x: 1220, y: 645 }; p2 = { x: 1330, y: 410 };
    }
  } else if (id === 'echaurren') {
    if (ladoSign === -1) {
      p1 = { x: 520, y: 280 }; p2 = { x: 740, y: 180 };
    } else {
      p1 = { x: 540, y: 350 }; p2 = { x: 760, y: 250 };
    }
  } else {
    p1 = { x: 700, y: 500 }; p2 = { x: 800, y: 500 };
  }
  return { p1, p2 };
}

// Muestreo lineal en plazas o áreas
function getSidewalkPointArea(p1, p2, t) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return {
    x: p1.x + dx * t,
    y: p1.y + dy * t,
    ang: Math.atan2(dy, dx)
  };
}

// Curva Bézier cúbica suave continua que modela la silueta curva de la montaña
function splineCurvaMontaña(pts) {
  if (pts.length < 2) return '';
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

    const dx = p2.x - p1.x;

    // Tangentes cúbicas amortiguadas para que la curva no cree caídas bruscas entre cumbres
    const cp1x = p1.x + dx * 0.36;
    const cp1y = p1.y + (p2.y - p0.y) * 0.22;
    const cp2x = p2.x - dx * 0.36;
    const cp2y = p2.y - (p3.y - p1.y) * 0.22;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// Crear gradientes en <defs> para el fondo transparente con color de cada calle
const defsSvg = mapaSvg.querySelector('defs') || mapaSvg.insertBefore(crearSVG('defs'), mapaSvg.firstChild);

Object.keys(datosSectores).forEach(id => {
  const sec = datosSectores[id];
  const ratioCont = sec.contencion / TOTAL_ENCUESTAS;
  const gradId = `grad-montana-${id}`;
  if (!document.getElementById(gradId)) {
    const grad = crearSVG('linearGradient', {
      id: gradId,
      x1: '0%', y1: '0%', x2: '0%', y2: '100%'
    });
    const opTop = (0.78 + 0.18 * ratioCont).toFixed(2);
    const opMid = (0.48 + 0.32 * ratioCont).toFixed(2);
    const opBot = (0.16 + 0.20 * ratioCont).toFixed(2);

    grad.appendChild(crearSVG('stop', { offset: '0%', 'stop-color': sec.color, 'stop-opacity': opTop }));
    grad.appendChild(crearSVG('stop', { offset: '65%', 'stop-color': sec.color, 'stop-opacity': opMid }));
    grad.appendChild(crearSVG('stop', { offset: '100%', 'stop-color': sec.color, 'stop-opacity': opBot }));
    defsSvg.appendChild(grad);
  }
});

// Construir la montaña curva y las palabras paradas en vertical
function crearLevantamientoLado(gOndas, gPalabras, sec, id, ladoIdx, ladoSign, ratioContencion) {
  let hit = null;
  let totalL = 0;
  let dStart = 0;
  let dEnd = 0;
  let usableL = 0;
  let offsetLateral = 24;
  let p1Area = null, p2Area = null;

  if (sec.tipoGeom === 'calle') {
    hit = document.querySelector(`.hit-interactivo[data-sector="${id}"]`);
    if (!hit || !hit.getTotalLength) return;
    totalL = hit.getTotalLength();
    const startRatio = id === 'errazuriz' ? 0.08 : 0.03;
    const endRatio = id === 'errazuriz' ? 0.88 : 0.97;
    dStart = totalL * startRatio;
    dEnd = totalL * endRatio;
    usableL = dEnd - dStart;
    offsetLateral = id === 'errazuriz' ? 46 : (id === 'serrano' ? 26 : 24);
  } else {
    const guides = getAreaGuidePoints(id, ladoSign);
    p1Area = guides.p1;
    p2Area = guides.p2;
    usableL = Math.hypot(p2Area.x - p1Area.x, p2Area.y - p1Area.y);
  }

  if (usableL < 40) return;

  // Cantidad óptima de puntos para que las palabras tengan espacio horizontal cómodo
  // y nunca choquen entre sí
  let numPuntos;
  if (id === 'errazuriz') {
    numPuntos = 16;
  } else if (id === 'blanco') {
    numPuntos = 14;
  } else if (id === 'serrano' || id === 'cochrane') {
    numPuntos = 12;
  } else if (id === 'monumento') {
    numPuntos = 5;
  } else {
    numPuntos = Math.max(4, Math.min(10, Math.round(usableL / 28)));
  }

  const palabrasLado = generarSecuenciaPalabrasOnda(id, ladoIdx, numPuntos);
  if (!palabrasLado || palabrasLado.length === 0) return;

  const minVal = Math.min(...palabrasLado.map(p => p.valor));
  const maxVal = Math.max(...palabrasLado.map(p => p.valor));
  const spanVal = (maxVal - minVal) || 1;

  // Muestreo equidistante de puntos base en la acera
  const basePts = [];
  for (let i = 0; i < numPuntos; i++) {
    const t = numPuntos === 1 ? 0.5 : i / (numPuntos - 1);
    let pt;
    if (sec.tipoGeom === 'calle') {
      pt = getSidewalkPointCalle(hit, totalL, dStart + t * usableL, ladoSign, offsetLateral);
    } else {
      pt = getSidewalkPointArea(p1Area, p2Area, t);
    }
    basePts.push(pt);
  }

  const topPts = [];
  const datosPalabras = [];

  for (let i = 0; i < numPuntos; i++) {
    const p = palabrasLado[i];
    const valNorm = (p.valor - minVal) / spanVal;

    // Jerarquía visual tipográfica: bold más grandes, regular medianas, light más pequeñas
    let fontSize;
    if (p.peso === 'bold') {
      fontSize = Math.round(11.5 + 3.0 * ratioContencion + 1.5 * valNorm);
    } else if (p.peso === 'regular') {
      fontSize = Math.round(9.2 + 2.0 * ratioContencion + 0.8 * valNorm);
    } else {
      fontSize = Math.round(7.6 + 1.2 * ratioContencion);
    }
    fontSize = Math.max(fontSize, 7.2);

    // Longitud física del texto vertical hacia arriba
    const charW = fontSize * 0.70;
    const largoTexto = Math.round(p.texto.length * charW);

    // Márgenes superior e inferior dentro de la montaña
    const margenBase = Math.round(5 + 4 * ratioContencion);
    // Margen superior holgado garantizado para que el texto NUNCA toque la cresta de la montaña
    const margenCresta = Math.round(18 + 18 * ratioContencion);

    const hMinWord = largoTexto + margenBase + margenCresta;
    const hContencion = Math.round(28 + 65 * Math.pow(ratioContencion, 0.85) + (14 + 18 * ratioContencion) * valNorm);
    const h = Math.max(hContencion, hMinWord);

    const B = basePts[i];
    const T = { x: B.x, y: B.y - h };
    topPts.push(T);

    // Ángulo e inclinación isométrica exacta según la calzada en el punto B (estilo afiche "UPON GRACE")
    const streetAng = B.ang !== undefined ? B.ang : Math.PI / 3;
    let crossAng = (sec.tipoGeom === 'calle') ? (streetAng - Math.PI / 2) : streetAng;
    while (crossAng > Math.PI / 2) crossAng -= Math.PI;
    while (crossAng < -Math.PI / 2) crossAng += Math.PI;

    // Coseno y seno acotados para garantizar legibilidad óptima y proporción condensada del afiche "GRACE"
    let cosA = Math.max(0.74, Math.abs(Math.cos(crossAng)));
    let sinA = Math.sin(crossAng);
    sinA = Math.max(-0.46, Math.min(0.46, sinA));

    // Proporción condensada estilizada estilo afiche "UPON GRACE" (scaleW = 0.84)
    const scaleW = 0.84;
    const cMat = (cosA * scaleW).toFixed(5);
    const dMat = (sinA * scaleW).toFixed(5);

    datosPalabras.push({
      p,
      fontSize,
      largoTexto,
      margenBase,
      B,
      T,
      h,
      cMat,
      dMat
    });
  }

  // Puntos suaves en los extremos para anclar la montaña curva a la calzada
  const vStart = { x: basePts[0].x - basePts[1].x, y: basePts[0].y - basePts[1].y };
  const distS = Math.hypot(vStart.x, vStart.y) || 1;
  const TStart = { x: basePts[0].x + (vStart.x / distS) * 20, y: basePts[0].y + (vStart.y / distS) * 20 };

  const vEnd = { x: basePts[numPuntos - 1].x - basePts[numPuntos - 2].x, y: basePts[numPuntos - 1].y - basePts[numPuntos - 2].y };
  const distE = Math.hypot(vEnd.x, vEnd.y) || 1;
  const TEnd = { x: basePts[numPuntos - 1].x + (vEnd.x / distE) * 20, y: basePts[numPuntos - 1].y + (vEnd.y / distE) * 20 };

  // Silueta de la montaña curva que se adapta a la forma dada por las diferentes alturas de las palabras
  const dCresta = `M ${TStart.x.toFixed(1)} ${TStart.y.toFixed(1)}` + splineCurvaMontaña([TStart, ...topPts, TEnd]);
  const baseRev = [TEnd, ...basePts.slice().reverse(), TStart];
  const dMontana = dCresta + splineCurvaMontaña(baseRev) + ' Z';

  // ID único de clip-path para asegurar que las palabras queden 100% dentro de la montaña curva
  const clipId = `clip-montana-${id}-${ladoIdx}`;
  let clipEl = document.getElementById(clipId);
  if (!clipEl) {
    clipEl = crearSVG('clipPath', { id: clipId });
    defsSvg.appendChild(clipEl);
  }
  while (clipEl.firstChild) clipEl.removeChild(clipEl.firstChild);
  clipEl.appendChild(crearSVG('path', { d: dMontana }));

  // Capa 1: Fondo blur translúcido del color del sector
  const pathBlur = crearSVG('path', {
    class: 'montana-onda-blur',
    d: dMontana,
    fill: `url(#grad-montana-${id})`,
    filter: 'url(#blur-montana)',
    stroke: 'none'
  });
  gOndas.appendChild(pathBlur);

  // Capa 2: Frente nítido translúcido del color del sector
  const pathFrente = crearSVG('path', {
    class: 'montana-onda-frente',
    d: dMontana,
    fill: `url(#grad-montana-${id})`,
    stroke: 'none'
  });
  gOndas.appendChild(pathFrente);

  // Contenedor de palabras de este lado, vinculado estrictamente al clipPath de la montaña curva
  const gPalabrasLado = crearSVG('g', {
    class: 'contenedor-palabras-lado',
    'clip-path': `url(#${clipId})`
  });

  // Palabras PARADAS EN VERTICAL dentro de la montaña curva, escritas hacia arriba
  for (let i = 0; i < numPuntos; i++) {
    const item = datosPalabras[i];
    const p = item.p;

    // Base del texto parado en vertical: empieza en B.y - margenBase y sube verticalmente hacia la cresta
    const yBase = item.B.y - item.margenBase;

    // Matriz de proyección isométrica: dirección 100% vertical hacia arriba (0, -1)
    // y trazos transversales/línea base acompañando la pendiente exacta de la calzada (cMat, dMat)
    const gWordPos = crearSVG('g', {
      class: 'posicion-palabra',
      transform: `matrix(0, -1, ${item.cMat}, ${item.dMat}, ${item.B.x.toFixed(1)}, ${yBase.toFixed(1)})`
    });

    // Elemento animado individual (escalonado con GPU)
    const gWordAnim = crearSVG('g', {
      class: `palabra-levantada peso-${p.peso}`
    });
    gWordAnim.style.transitionDelay = `${(ladoIdx * 2 + (i % 8)) * 35 + 40}ms`;

    // Texto en Montserrat blanco puro (#ffffff) parado en vertical (SIN NÚMERO Y CON CONTRASTE VECTORIAL)
    const txt = crearSVG('text', {
      class: 'palabra-texto',
      x: '0',
      y: '0',
      fill: '#ffffff',
      'text-anchor': 'start',
      'dominant-baseline': 'central',
      'font-family': "'Montserrat', sans-serif",
      'font-size': `${item.fontSize}px`,
      'font-weight': p.peso === 'bold' ? '900' : (p.peso === 'regular' ? '600' : '400'),
      'letter-spacing': '0.08em'
    });
    txt.textContent = p.texto.toUpperCase();

    gWordAnim.appendChild(txt);
    gWordPos.appendChild(gWordAnim);
    gPalabrasLado.appendChild(gWordPos);
  }

  gPalabras.appendChild(gPalabrasLado);
}

// Construir el levantamiento tipográfico bilateral para cada sector
// Según las respuestas de las encuestas: mientras más contención más alto y más lleno, mientras más apertura más bajo
Object.keys(datosSectores).forEach(id => {
  const sec = datosSectores[id];
  const gSector = crearSVG('g', { class: 'grupo-levantamiento-sector', 'data-sector': id });

  // Contenedor de las ondas montañosas (capa de fondo)
  const gOndas = crearSVG('g', { class: 'contenedor-ondas' });
  // Contenedor de las palabras (capa superior)
  const gPalabras = crearSVG('g', { class: 'contenedor-palabras' });

  gSector.appendChild(gOndas);
  gSector.appendChild(gPalabras);

  // Ratio oficial de contención (0.0 en Muelle Prat hasta 1.0 en Serrano)
  const ratioContencion = sec.contencion / TOTAL_ENCUESTAS;

  // Más lleno: mayor opacidad y densidad visual mientras mayor sea la contención
  const opacidadFrente = (0.35 + 0.50 * ratioContencion).toFixed(2);
  const opacidadBlur = (0.25 + 0.45 * ratioContencion).toFixed(2);
  gSector.style.setProperty('--opacidad-frente', opacidadFrente);
  gSector.style.setProperty('--opacidad-blur', opacidadBlur);

  const lados = [
    { ladoIdx: 0, ladoSign: -1 },
    { ladoIdx: 1, ladoSign: 1 }
  ];

  // Calcular Y promedio para ordenar en profundidad (fondo primero, frente después)
  lados.forEach(ld => {
    let pMid;
    if (sec.tipoGeom === 'calle') {
      const hit = document.querySelector(`.hit-interactivo[data-sector="${id}"]`);
      if (hit && hit.getTotalLength) {
        const totalL = hit.getTotalLength();
        const offsetLat = id === 'errazuriz' ? 46 : (id === 'serrano' ? 26 : 24);
        pMid = getSidewalkPointCalle(hit, totalL, totalL * 0.5, ld.ladoSign, offsetLat);
      }
    } else {
      const guides = getAreaGuidePoints(id, ld.ladoSign);
      pMid = { x: (guides.p1.x + guides.p2.x) / 2, y: (guides.p1.y + guides.p2.y) / 2 };
    }
    ld.avgY = pMid ? pMid.y : 0;
  });

  lados.sort((a, b) => a.avgY - b.avgY);

  // Generar la montaña curva y palabras paradas en vertical en ambos lados
  lados.forEach(ld => {
    crearLevantamientoLado(gOndas, gPalabras, sec, id, ld.ladoIdx, ld.ladoSign, ratioContencion);
  });

  capaEdificios.appendChild(gSector);
  mapaSectoresEdificios.set(id, gSector);
});

/* ==========================================================================
   SISTEMA DE CÁMARA (ZOOM Y PAN FLUIDO CON INTERPOLACIÓN SUAVE)
   ========================================================================== */
const PIVOT_BASE = 960;
const PIVOT_ZOOM = 690; // Centra el mapa en el espacio despejado a la izquierda del panel de información

const VISTA_BASE = { x: 960, y: 540, zoom: 1.0, pivotX: PIVOT_BASE };
let camActual = { x: 960, y: 540, zoom: 1.0, pivotX: PIVOT_BASE };
let camDestino = { x: 960, y: 540, zoom: 1.0, pivotX: PIVOT_BASE };
let animandoCamara = false;

const ZOOM_MIN = 0.75;
const ZOOM_MAX = 5.0;

function aplicarTransformCamara() {
  const cx = camActual.x;
  const cy = camActual.y;
  const z = camActual.zoom;
  const px = camActual.pivotX !== undefined ? camActual.pivotX : PIVOT_BASE;
  mapaContenido.setAttribute('transform', `translate(${px.toFixed(2)}, 540) scale(${z.toFixed(4)}) translate(${-cx.toFixed(2)}, ${-cy.toFixed(2)})`);
}

function loopCamara() {
  const f = 0.16;
  const dx = camDestino.x - camActual.x;
  const dy = camDestino.y - camActual.y;
  const dz = camDestino.zoom - camActual.zoom;
  const dp = (camDestino.pivotX !== undefined ? camDestino.pivotX : PIVOT_BASE) - (camActual.pivotX !== undefined ? camActual.pivotX : PIVOT_BASE);

  if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05 || Math.abs(dz) > 0.001 || Math.abs(dp) > 0.05) {
    camActual.x += dx * f;
    camActual.y += dy * f;
    camActual.zoom += dz * f;
    camActual.pivotX += dp * f;
    aplicarTransformCamara();
    requestAnimationFrame(loopCamara);
  } else {
    camActual.x = camDestino.x;
    camActual.y = camDestino.y;
    camActual.zoom = camDestino.zoom;
    camActual.pivotX = camDestino.pivotX;
    aplicarTransformCamara();
    animandoCamara = false;
  }
}

function animarHacia(x, y, zoom, pivotX = PIVOT_ZOOM) {
  camDestino.x = x;
  camDestino.y = y;
  camDestino.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
  camDestino.pivotX = pivotX;
  if (!animandoCamara) {
    animandoCamara = true;
    requestAnimationFrame(loopCamara);
  }
}

aplicarTransformCamara();

/* ==========================================================================
   PANTALLA FIJA (SIN ZOOM MANUAL NI ARRASTRE LIBRE)
   El mapa permanece fijo en su vista base y solo realiza zoom automático
   al presionar/hacer clic en un sector.
   ========================================================================== */
// Prevenir zoom manual con la rueda del ratón
mapaSvg.addEventListener('wheel', (e) => {
  e.preventDefault();
}, { passive: false });

/* ==========================================================================
   INTERACCIONES HOVER Y CLICK
   ========================================================================== */
const tooltip = document.getElementById('tooltip-resumen');
const ttNombre = document.getElementById('tt-nombre');
const ttBarContencion = document.getElementById('tt-bar-contencion');
const ttBarCruce = document.getElementById('tt-bar-cruce');
const ttBarApertura = document.getElementById('tt-bar-apertura');
const ttTxtPrincipal = document.getElementById('tt-txt-principal');
const ttTxtSecundario = document.getElementById('tt-txt-secundario');

const panelInfo = document.getElementById('panel-info');
const btnCerrarInfo = document.getElementById('btn-cerrar-info');
const piTipo = document.getElementById('pi-tipo');
const piNombre = document.getElementById('pi-nombre');
const piSegContencion = document.getElementById('pi-seg-contencion');
const piSegCruce = document.getElementById('pi-seg-cruce');
const piSegApertura = document.getElementById('pi-seg-apertura');
const piValContencion = document.getElementById('pi-val-contencion');
const piValApertura = document.getElementById('pi-val-apertura');
const piVotosContencion = document.getElementById('pi-votos-contencion');
const piVotosApertura = document.getElementById('pi-votos-apertura');
const piDescripcion = document.getElementById('pi-descripcion');
const visor = document.getElementById('visor-mapa');

let sectorSeleccionado = null;
let sectorHover = null;

function mostrarTooltip(secId, e) {
  const sec = datosSectores[secId];
  if (!sec) return;

  // Nombre limpio como en el PDF (ej. SERRANO, MUELLE PRAT)
  const nombreLimpio = sec.nombre.replace(/^(?:Calle|Avenida)\s+/i, '').toUpperCase();
  ttNombre.textContent = nombreLimpio;

  const pctContVal = (sec.contencion / TOTAL_ENCUESTAS) * 100;
  const pctCrucVal = (sec.cruce / TOTAL_ENCUESTAS) * 100;
  const pctAperVal = (sec.apertura / TOTAL_ENCUESTAS) * 100;

  ttBarContencion.style.width = `${pctContVal}%`;
  ttBarCruce.style.width = `${pctCrucVal}%`;
  ttBarApertura.style.width = `${pctAperVal}%`;

  if (pctAperVal > 0 && pctContVal === 0 && pctCrucVal === 0) {
    ttTxtPrincipal.textContent = `${pctAperVal.toFixed(1)}% Apertura 0.0% Contención`;
    ttTxtSecundario.textContent = '';
  } else if (pctContVal === 100) {
    ttTxtPrincipal.textContent = `${pctContVal.toFixed(1)}% Contención`;
    ttTxtSecundario.textContent = '';
  } else if (pctContVal >= pctAperVal) {
    ttTxtPrincipal.textContent = `${pctContVal.toFixed(1)}% Contención`;
    ttTxtSecundario.textContent = pctCrucVal > 0 ? `${pctCrucVal.toFixed(1)}% Cruce` : `${pctAperVal.toFixed(1)}% Apertura`;
  } else {
    ttTxtPrincipal.textContent = `${pctAperVal.toFixed(1)}% Apertura`;
    ttTxtSecundario.textContent = pctCrucVal > 0 ? `${pctCrucVal.toFixed(1)}% Cruce` : `${pctContVal.toFixed(1)}% Contención`;
  }

  posicionarTooltip(e);
  tooltip.classList.add('visible');
}

function posicionarTooltip(e) {
  if (!e) return;
  const x = e.clientX;
  const y = e.clientY;
  tooltip.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) translateY(-14px)`;
}

function ocultarTooltip() {
  tooltip.classList.remove('visible');
}

function activarHover(secId, e) {
  if (sectorSeleccionado) return; // En modo enfoque no elevar calles de fondo
  sectorHover = secId;

  // Levantar sutilmente la calle o espacio de color en hover
  const elElevado = document.getElementById(`hover-${secId}`);
  if (elElevado) elElevado.classList.add('activo');

  mostrarTooltip(secId, e);
}

function desactivarHover(secId) {
  if (sectorHover === secId) sectorHover = null;
  const elElevado = document.getElementById(`hover-${secId}`);
  if (elElevado) elElevado.classList.remove('activo');
  ocultarTooltip();
}

function seleccionarSector(secId) {
  if (sectorSeleccionado === secId) return;

  if (sectorSeleccionado) {
    const antElevado = document.getElementById(`hover-${sectorSeleccionado}`);
    if (antElevado) antElevado.classList.remove('activo');
    const antGEd = mapaSectoresEdificios.get(sectorSeleccionado);
    if (antGEd) antGEd.classList.remove('activo');
  }

  sectorSeleccionado = secId;
  ocultarTooltip();

  const sec = datosSectores[secId];
  if (!sec) return;

  // 1. Desactivar elevación de la calle para que se mantenga en su posición base del plano (0,0),
  // garantizando cero desfase entre la calzada y las bases de los edificios 3D
  const elElevado = document.getElementById(`hover-${secId}`);
  if (elElevado) elElevado.classList.remove('activo');

  // 2. Activar modo desenfoque en el resto del mapa
  visor.classList.add('modo-enfoque');

  // 3. Zoom automático hacia esa zona
  animarHacia(sec.enfoque.x, sec.enfoque.y, sec.enfoque.zoom);

  // 4. Mostrar levantamiento de palabras y onda/montaña fluidamente
  const gEd = mapaSectoresEdificios.get(secId);
  if (gEd) {
    setTimeout(() => {
      gEd.classList.add('activo');
    }, 120);
  }

  // 5. Mostrar rectángulo de información a la derecha
  piTipo.textContent = sec.tipo;
  piNombre.textContent = sec.nombre;

  const pctCont = Math.round((sec.contencion / TOTAL_ENCUESTAS) * 100);
  const pctCruc = Math.round((sec.cruce / TOTAL_ENCUESTAS) * 100);
  const pctAper = Math.round((sec.apertura / TOTAL_ENCUESTAS) * 100);

  piSegContencion.style.width = `${pctCont}%`;
  piSegCruce.style.width = `${pctCruc}%`;
  piSegApertura.style.width = `${pctAper}%`;

  piValContencion.textContent = `${pctCont}%`;
  piValApertura.textContent = `${pctAper}%`;
  piVotosContencion.textContent = `${sec.contencion} de 15 votos`;
  piVotosApertura.textContent = `${sec.apertura} de 15 votos`;
  piDescripcion.textContent = sec.descripcion;

  panelInfo.classList.add('abierto');
}

function deseleccionarSector() {
  if (!sectorSeleccionado) return;

  const elElevado = document.getElementById(`hover-${sectorSeleccionado}`);
  if (elElevado) elElevado.classList.remove('activo');

  const gEd = mapaSectoresEdificios.get(sectorSeleccionado);
  if (gEd) gEd.classList.remove('activo');

  sectorSeleccionado = null;
  visor.classList.remove('modo-enfoque');
  panelInfo.classList.remove('abierto');
}

// Asignar eventos a las zonas interactivas (inmediatos, nativos sin retardo)
document.querySelectorAll('.hit-interactivo').forEach(hit => {
  const secId = hit.getAttribute('data-sector');

  hit.addEventListener('mouseenter', (e) => activarHover(secId, e));
  hit.addEventListener('mousemove', (e) => posicionarTooltip(e));
  hit.addEventListener('mouseleave', () => desactivarHover(secId));

  hit.addEventListener('pointerenter', (e) => activarHover(secId, e));
  hit.addEventListener('pointerleave', () => desactivarHover(secId));

  hit.addEventListener('click', (e) => {
    e.stopPropagation();
    seleccionarSector(secId);
  });

  hit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      seleccionarSector(secId);
    }
  });
});

// Cerrar panel al hacer clic en ✕ o fuera
btnCerrarInfo.addEventListener('click', (e) => {
  e.stopPropagation();
  deseleccionarSector();
  animarHacia(VISTA_BASE.x, VISTA_BASE.y, VISTA_BASE.zoom, PIVOT_BASE);
});

mapaSvg.addEventListener('click', (e) => {
  if (e.target.closest('.hit-interactivo') || e.target.closest('#panel-info')) return;
  if (sectorSeleccionado) {
    deseleccionarSector();
    animarHacia(VISTA_BASE.x, VISTA_BASE.y, VISTA_BASE.zoom, PIVOT_BASE);
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    deseleccionarSector();
    animarHacia(VISTA_BASE.x, VISTA_BASE.y, VISTA_BASE.zoom, PIVOT_BASE);
  }
});

/* ==========================================================================
   SECUENCIA DE INTRODUCCIÓN Y CONTROL DE PÁGINAS (Páginas 1, 2 y 3)
   - Página 1: Título ("Pasos por la Amplitud")
   - Página 2: Pregunta y Subtítulo juntos (con animación coordinada)
   - Página 3: Mapa interactivo (pantalla principal)
   - Menú fijo kebab interactivo (una bolita por página) con tiempos extendidos
   ========================================================================== */
const pantallaIntro = document.getElementById('pantalla-intro');
const vistaP2 = document.getElementById('vista-p2');
const vistaP3P4 = document.getElementById('vista-p3-p4');
const introPregunta = document.getElementById('intro-pregunta');
const introSubtitulo = document.getElementById('intro-subtitulo');
const svgHuellas = document.getElementById('svg-huellas');
const menuKebab = document.getElementById('menu-kebab');
const puntosKebab = menuKebab ? menuKebab.querySelectorAll('.kebab-punto') : [];

let introActiva = true;
let paginaActual = 1;
let timerAutoAvance = null;
let timerPasosP1 = null;
let timerPasosP2 = null;

// Crear huellas a lo largo de una trayectoria diagonal de esquina a esquina
function crearRutaHuellas(numPasos, inicioX, inicioY, finX, finY) {
  const elems = [];
  const dx = (finX - inicioX) / numPasos;
  const dy = (finY - inicioY) / numPasos;
  const angTrayectoria = Math.atan2(dy, dx) * 180 / Math.PI;
  const angRad = angTrayectoria * Math.PI / 180;
  const nx = -Math.sin(angRad); // Vector normal perpendicular a la trayectoria
  const ny = Math.cos(angRad);

  for (let i = 0; i < numPasos; i++) {
    const esPieIzquierdo = (i % 2 === 0);
    const colorPaso = esPieIzquierdo ? '#3FC2E9' : '#F17149'; // Celeste (Apertura) y Naranja (Contención)
    const colorOnda = esPieIzquierdo ? 'rgba(63, 194, 233, 0.5)' : 'rgba(241, 113, 73, 0.5)';
    const despNormal = esPieIzquierdo ? -22 : 22;
    const angPie = angTrayectoria + 90 + (esPieIzquierdo ? -6 : 6);

    const x = inicioX + (i + 0.5) * dx + nx * despNormal;
    const y = inicioY + (i + 0.5) * dy + ny * despNormal;

    const gH = crearSVG('g', {
      class: 'huella-zapato',
      transform: `translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${angPie.toFixed(1)})`
    });

    const gPisada = crearSVG('g', {
      class: 'huella-pisada',
      transform: esPieIzquierdo ? 'scale(-0.84, 0.84)' : 'scale(0.84, 0.84)'
    });

    // Onda de impacto que se expande al pisar
    const onda = crearSVG('ellipse', {
      cx: 0,
      cy: -10,
      rx: 16,
      ry: 26,
      class: 'onda-pisada',
      fill: 'none',
      stroke: colorOnda,
      'stroke-width': 1.5
    });

    // Suela anatómica con arco interior y puntera (exacta del PDF Página 2)
    const suela = crearSVG('path', {
      d: 'M -3 -4 C -4 -13 -13 -22 -8 -34 C -4 -39 4 -39 8 -34 C 13 -24 11 -12 7 -4 C 6 0 -2 0 -3 -4 Z',
      fill: colorPaso
    });

    // Tacón trasero ovalado proporcional
    const tacon = crearSVG('path', {
      d: 'M -7 7 C -8 3 -6 2 0 2 C 6 2 8 3 7 7 C 6 15 -6 15 -7 7 Z',
      fill: colorPaso
    });

    gPisada.appendChild(onda);
    gPisada.appendChild(suela);
    gPisada.appendChild(tacon);
    gH.appendChild(gPisada);
    svgHuellas.appendChild(gH);
    elems.push(gH);
  }
  return elems;
}

// 1. Huellas de la Página 1 (recorrido diagonal de esquina a esquina)
const huellasP1 = crearRutaHuellas(16, 70, 50, 1850, 1030);

// 2. Huellas de la Página 2 (recorrido diagonal hacia la salida al mapa)
const huellasP2 = crearRutaHuellas(16, 70, 50, 1870, 1050);

function actualizarKebab(numPagina) {
  paginaActual = numPagina;
  puntosKebab.forEach(p => {
    const pag = parseInt(p.dataset.pagina, 10);
    if (pag === numPagina) {
      p.classList.add('activo');
      p.setAttribute('aria-current', 'page');
    } else {
      p.classList.remove('activo');
      p.removeAttribute('aria-current');
    }
  });
}

function limpiarTimersIntro() {
  if (timerAutoAvance) { clearTimeout(timerAutoAvance); timerAutoAvance = null; }
  if (timerPasosP1) { clearTimeout(timerPasosP1); timerPasosP1 = null; }
  if (timerPasosP2) { clearTimeout(timerPasosP2); timerPasosP2 = null; }
}

let pasoP1 = 0;
function animarPasosP1() {
  if (!introActiva || paginaActual !== 1) return;
  if (pasoP1 < huellasP1.length) {
    const h = huellasP1[pasoP1];
    h.classList.add('visible', 'pisando');

    setTimeout(() => {
      if (h) h.classList.add('desvanecida');
    }, 600);

    pasoP1++;
    timerPasosP1 = setTimeout(animarPasosP1, 190);
  } else {
    // Los pasos llegaron a la esquina inferior derecha.
    // Pausa prolongada para leer y contemplar el título con tranquilidad:
    timerAutoAvance = setTimeout(() => {
      if (paginaActual === 1) {
        irAPagina(2);
      }
    }, 2400);
  }
}

let pasoP2 = 0;
function animarPasosP2() {
  if (!introActiva || paginaActual !== 2) return;
  if (pasoP2 < huellasP2.length) {
    const h = huellasP2[pasoP2];
    h.classList.add('visible', 'pisando');

    setTimeout(() => {
      if (h) h.classList.add('desvanecida');
    }, 650);

    pasoP2++;
    timerPasosP2 = setTimeout(animarPasosP2, 200);
  } else {
    // Los pasos llegaron al final del recorrido.
    // Pausa prolongada para leer con toda calma la pregunta y el texto juntos:
    timerAutoAvance = setTimeout(() => {
      if (paginaActual === 2) {
        irAPagina(3);
      }
    }, 3600);
  }
}

function irAPagina(numPagina, esManual = false) {
  limpiarTimersIntro();
  actualizarKebab(numPagina);

  if (numPagina === 1) {
    introActiva = true;
    pantallaIntro.classList.remove('oculta');
    pantallaIntro.style.display = 'flex';
    pantallaIntro.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      pantallaIntro.style.opacity = '1';
    });

    vistaP3P4.classList.remove('activa');
    vistaP2.classList.add('activa');

    // Resetear huellas de ambas páginas
    huellasP1.forEach(h => h.classList.remove('visible', 'pisando', 'desvanecida'));
    huellasP2.forEach(h => h.classList.add('desvanecida'));

    pasoP1 = 0;
    timerPasosP1 = setTimeout(animarPasosP1, 350);

  } else if (numPagina === 2) {
    introActiva = true;
    pantallaIntro.classList.remove('oculta');
    pantallaIntro.style.display = 'flex';
    pantallaIntro.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      pantallaIntro.style.opacity = '1';
    });

    huellasP1.forEach(h => h.classList.add('desvanecida'));

    vistaP2.classList.remove('activa');
    vistaP3P4.classList.add('activa');

    huellasP2.forEach(h => h.classList.remove('visible', 'pisando', 'desvanecida'));

    pasoP2 = 0;
    timerPasosP2 = setTimeout(animarPasosP2, 350);

  } else if (numPagina === 3) {
    cerrarIntro();
  }
}

function cerrarIntro() {
  introActiva = false;
  limpiarTimersIntro();
  actualizarKebab(3);
  pantallaIntro.style.pointerEvents = 'none';
  pantallaIntro.style.opacity = '0';
  setTimeout(() => {
    pantallaIntro.classList.add('oculta');
  }, 700);
}

// Iniciar secuencia en Página 1 tras 300ms
setTimeout(() => irAPagina(1), 300);

// Navegación interactiva mediante los botones del menú kebab
puntosKebab.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pag = parseInt(btn.dataset.pagina, 10);
    irAPagina(pag, true);
  });
});

// Clic en el fondo de la pantalla de introducción: avanza a la siguiente página
pantallaIntro.addEventListener('click', (e) => {
  if (e.target.closest('#menu-kebab')) return;
  if (paginaActual === 1) {
    irAPagina(2, true);
  } else if (paginaActual === 2) {
    irAPagina(3, true);
  }
});
