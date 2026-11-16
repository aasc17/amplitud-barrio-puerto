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
   CONSTRUCCIÓN DE ELEMENTOS 3D AXONOMÉTRICOS DE EDIFICIOS
   ========================================================================== */
const SVG_NS = 'http://www.w3.org/2000/svg';
const capaEdificios = document.getElementById('capa-edificios');
const mapaSectoresEdificios = new Map();

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
}

function paletaSector(hexColor) {
  const [r, g, b] = hexToRgb(hexColor);
  const rT = Math.min(255, Math.round(r + (255 - r) * 0.35));
  const gT = Math.min(255, Math.round(g + (255 - g) * 0.35));
  const bT = Math.min(255, Math.round(b + (255 - b) * 0.35));

  return {
    techo: `rgb(${rT}, ${gT}, ${bT})`,
    bordeTecho: `rgba(${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.55)}, 0.95)`,
    frente: `rgba(${r}, ${g}, ${b}, 0.78)`,
    frenteStroke: `rgba(${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.55)}, 0.88)`,
    lado: `rgba(${Math.round(r * 0.76)}, ${Math.round(g * 0.76)}, ${Math.round(b * 0.76)}, 0.84)`,
    ladoStroke: `rgba(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(b * 0.45)}, 0.92)`,
    trasera: `rgba(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)}, 0.35)`,
    huella: 'rgba(0, 0, 0, 0.14)',
    arista: `rgba(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(b * 0.45)}, 0.92)`
  };
}

function crearSVG(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function suma(p1, p2) { return { x: p1.x + p2.x, y: p1.y + p2.y }; }
function por(p, s) { return { x: p.x * s, y: p.y * s }; }
function fmt(p) { return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }
function pts(...arr) { return arr.map(fmt).join(' '); }

// ==========================================================================
// PRISMAS 3D EXACTOS DE CALLE SERRANO (Página 5 del PDF original del proyecto)
// Geometría vectorial pura idéntica a la lámina: 20 prismas ordenados N a S.
// Caras: pared izquierda (#D3542C), pared derecha (#FF5E2C), techo (#FF9776).
// ==========================================================================
const PRISMAS_SERRANO_EXACTOS = [
  { id: 160, row: 2, faces: [ { color: '#D3542C', points: '655.03,221.06 655.03,321.54 646.83,299.1 646.83,198.63' }, { color: '#FF5E2C', points: '662.42,210.78 662.42,311.25 655.03,321.54 655.03,221.06' }, { color: '#FF9776', points: '662.42,210.78 655.03,221.04 646.83,198.63 655.03,190.86' } ] },
  { id: 53, row: 1, faces: [ { color: '#D3542C', points: '616.04,251.26 616.04,351.73 607.84,329.3 607.84,228.83' }, { color: '#FF5E2C', points: '623.43,240.97 623.43,341.44 616.04,351.73 616.04,251.26' }, { color: '#FF9776', points: '623.43,240.97 616.04,251.24 607.84,228.83 616.04,221.06' } ] },
  { id: 150, row: 2, faces: [ { color: '#D3542C', points: '682.21,282.59 682.21,383.06 662.42,338.07 662.42,237.6' }, { color: '#FF5E2C', points: '689.61,272.3 689.61,372.77 682.21,383.06 682.21,282.59' }, { color: '#FF9776', points: '689.61,272.3 682.21,282.57 662.42,237.6 670.66,230.12' } ] },
  { id: 41, row: 1, faces: [ { color: '#D3542C', points: '643.23,312.79 643.23,413.26 623.43,368.26 623.43,267.79' }, { color: '#FF5E2C', points: '650.62,302.5 650.62,402.97 643.23,413.26 643.23,312.79' }, { color: '#FF9776', points: '650.62,302.5 643.23,312.76 623.43,267.79 631.68,260.32' } ] },
  { id: 155, row: 2, faces: [ { color: '#D3542C', points: '702.09,344.16 702.09,430.47 685.08,391.82 685.08,305.51' }, { color: '#FF5E2C', points: '708.44,335.32 708.44,421.63 702.09,430.47 702.09,344.16' }, { color: '#FF9776', points: '708.44,335.32 702.09,344.14 685.08,305.51 692.17,299.08' } ] },
  { id: 48, row: 1, faces: [ { color: '#D3542C', points: '663.1,374.35 663.1,460.67 646.1,422.01 646.1,335.7' }, { color: '#FF5E2C', points: '669.45,365.52 669.45,451.83 663.1,460.67 663.1,374.35' }, { color: '#FF9776', points: '669.45,365.52 663.1,374.33 646.1,335.7 653.18,329.28' } ] },
  { id: 165, row: 2, faces: [ { color: '#D3542C', points: '717.98,369.85 717.98,470.32 709.78,447.89 709.78,347.42' }, { color: '#FF5E2C', points: '725.38,359.57 725.38,460.04 717.98,470.32 717.98,369.85' }, { color: '#FF9776', points: '725.38,359.57 717.98,369.83 709.78,347.42 717.98,339.65' } ] },
  { id: 58, row: 1, faces: [ { color: '#D3542C', points: '678.99,400.05 678.99,500.52 670.79,478.09 670.79,377.62' }, { color: '#FF5E2C', points: '686.39,389.76 686.39,490.23 678.99,500.52 678.99,400.05' }, { color: '#FF9776', points: '686.39,389.76 678.99,400.03 670.79,377.62 678.99,369.85' } ] },
  { id: 195, row: 2, faces: [ { color: '#D3542C', points: '733.58,420.05 733.58,509.8 725.38,489.76 725.38,400' }, { color: '#FF5E2C', points: '740.97,410.86 740.97,500.61 733.58,509.8 733.58,420.05' }, { color: '#FF9776', points: '740.97,410.86 733.58,420.03 725.38,400 733.58,393.07' } ] },
  { id: 170, row: 2, faces: [ { color: '#D3542C', points: '749.17,443.26 749.17,543.73 740.97,521.3 740.97,420.83' }, { color: '#FF5E2C', points: '756.56,432.97 756.56,533.44 749.17,543.73 749.17,443.26' }, { color: '#FF9776', points: '756.56,432.97 749.17,443.24 740.97,420.83 749.17,413.06' } ] },
  { id: 88, row: 1, faces: [ { color: '#D3542C', points: '694.59,450.24 694.59,540 686.39,519.96 686.39,430.2' }, { color: '#FF5E2C', points: '701.98,441.05 701.98,530.81 694.59,540 694.59,450.24' }, { color: '#FF9776', points: '701.98,441.05 694.59,450.22 686.39,430.2 694.59,423.26' } ] },
  { id: 63, row: 1, faces: [ { color: '#D3542C', points: '710.18,473.46 710.18,573.93 701.98,551.49 701.98,451.02' }, { color: '#FF5E2C', points: '717.57,463.17 717.57,563.64 710.18,573.93 710.18,473.46' }, { color: '#FF9776', points: '717.57,463.17 710.18,473.43 701.98,451.02 710.18,443.26' } ] },
  { id: 175, row: 2, faces: [ { color: '#D3542C', points: '772.48,510.06 772.48,595.91 752.69,557.46 752.69,471.62' }, { color: '#FF5E2C', points: '779.88,501.27 779.88,587.12 772.48,595.91 772.48,510.06' }, { color: '#FF9776', points: '779.88,501.27 772.48,510.04 752.69,471.62 760.93,465.23' } ] },
  { id: 68, row: 1, faces: [ { color: '#D3542C', points: '733.49,540.26 733.49,626.1 713.7,587.66 713.7,501.82' }, { color: '#FF5E2C', points: '740.89,531.47 740.89,617.31 733.49,626.1 733.49,540.26' }, { color: '#FF9776', points: '740.89,531.47 733.49,540.24 713.7,501.82 721.95,495.43' } ] },
  { id: 180, row: 2, faces: [ { color: '#D3542C', points: '788.08,532.89 788.08,633.36 779.88,610.92 779.88,510.45' }, { color: '#FF5E2C', points: '795.47,522.6 795.47,623.07 788.08,633.36 788.08,532.89' }, { color: '#FF9776', points: '795.47,522.6 788.08,532.86 779.88,510.45 788.08,502.69' } ] },
  { id: 73, row: 1, faces: [ { color: '#D3542C', points: '749.09,563.09 749.09,663.56 740.89,641.12 740.89,540.65' }, { color: '#FF5E2C', points: '756.48,552.8 756.48,653.27 749.09,663.56 749.09,563.09' }, { color: '#FF9776', points: '756.48,552.8 749.09,563.06 740.89,540.65 749.09,532.88' } ] },
  { id: 185, row: 2, faces: [ { color: '#D3542C', points: '810.96,596.39 810.96,678.19 791.16,641.56 791.16,559.76' }, { color: '#FF5E2C', points: '818.35,588.02 818.35,669.81 810.96,678.19 810.96,596.39' }, { color: '#FF9776', points: '818.35,588.02 810.96,596.37 791.16,559.76 799.41,553.67' } ] },
  { id: 78, row: 1, faces: [ { color: '#D3542C', points: '771.97,626.59 771.97,708.39 752.17,671.75 752.17,589.96' }, { color: '#FF5E2C', points: '779.36,618.21 779.36,700.01 771.97,708.39 771.97,626.59' }, { color: '#FF9776', points: '779.36,618.21 771.97,626.57 752.17,589.96 760.42,583.87' } ] },
  { id: 190, row: 2, faces: [ { color: '#D3542C', points: '835.92,636.72 835.92,722.56 816.12,684.12 816.12,598.28' }, { color: '#FF5E2C', points: '843.31,627.93 843.31,713.77 835.92,722.56 835.92,636.72' }, { color: '#FF9776', points: '843.31,627.93 835.92,636.7 816.12,598.28 824.37,591.89' } ] },
  { id: 83, row: 1, faces: [ { color: '#D3542C', points: '796.93,666.92 796.93,752.76 777.13,714.32 777.13,628.47' }, { color: '#FF5E2C', points: '804.32,658.12 804.32,743.97 796.93,752.76 796.93,666.92' }, { color: '#FF9776', points: '804.32,658.12 796.93,666.89 777.13,628.47 785.38,622.08' } ] },
];

// Generar prismas para cada sector
Object.keys(datosSectores).forEach(id => {
  const sec = datosSectores[id];
  const gSector = crearSVG('g', { class: 'grupo-edificios-sector', 'data-sector': id });
  const prismas = [];

  // 1. Calle Serrano: usar los 20 prismas vectoriales exactos del PDF
  if (id === 'serrano') {
    PRISMAS_SERRANO_EXACTOS.forEach((p, idx) => {
      const gEd = crearSVG('g', { class: 'edificio-prisma', 'data-id': p.id, 'data-row': p.row });
      gEd.style.transitionDelay = `${idx * 40}ms`;

      p.faces.forEach(f => {
        gEd.appendChild(crearSVG('polygon', {
          points: f.points,
          fill: f.color,
          stroke: 'rgba(255, 255, 255, 0.25)',
          'stroke-width': '0.5',
          'stroke-linejoin': 'round'
        }));
      });

      gSector.appendChild(gEd);
      prismas.push(gEd);
    });

    gSector._prismas = prismas;
    capaEdificios.appendChild(gSector);
    mapaSectoresEdificios.set(id, gSector);
    return;
  }

  // 2. Para los demás sectores (Cochrane, Blanco, Errázuriz, Plazas):
  // Generar prismas axonométricos con la misma proyección isométrica (extrusión vertical dy = -H)
  const pal = paletaSector(sec.color);
  const ratioContencion = sec.contencion / TOTAL_ENCUESTAS;
  const altura = Math.round(24 + 70 * ratioContencion);
  const variaciones = [0.94, 1.06, 0.88, 1.12, 0.96, 1.04];
  const modelos = [];

  if (sec.tipoGeom === 'calle') {
    const hit = document.querySelector(`.hit-interactivo[data-sector="${id}"]`);
    if (hit && hit.getTotalLength) {
      const totalL = hit.getTotalLength();
      const margen = Math.min(32, totalL * 0.08);
      const tramo = totalL - 2 * margen;
      const numEdificios = Math.max(5, Math.round(5 + 6 * ratioContencion));
      const paso = tramo / numEdificios;

      // Determinación precisa del ancho de calzada según sector
      const anchoMitad = id === 'errazuriz' ? 42 : 20;

      for (let i = 0; i < numEdificios; i++) {
        const d = margen + (i + 0.5) * paso;
        const p = hit.getPointAtLength(d);
        const pAnt = hit.getPointAtLength(Math.max(0, d - 8));
        const pSig = hit.getPointAtLength(Math.min(totalL, d + 8));
        const ang = Math.atan2(pSig.y - pAnt.y, pSig.x - pAnt.x);
        const tang = { x: Math.cos(ang), y: Math.sin(ang) };
        const normal = { x: -tang.y, y: tang.x };

        const largoEd = Math.round(18 * (0.92 + (i % 3) * 0.08));
        const fondo = 14;

        [-1, 1].forEach((lado, lIdx) => {
          // Base posicionada exactamente en la fachada/borde de la vereda
          const distCentro = lado * (anchoMitad + fondo / 2);
          const centro = suma(p, por(normal, distCentro));
          const eje = por(tang, largoEd / 2);
          const lateral = por(normal, fondo / 2);
          modelos.push({
            a: suma(suma(centro, por(eje, -1)), por(lateral, -1)),
            b: suma(suma(centro, eje), por(lateral, -1)),
            c: suma(suma(centro, eje), lateral),
            d: suma(suma(centro, por(eje, -1)), lateral),
            centro,
            altura: altura * variaciones[(i + lIdx * 3) % variaciones.length]
          });
        });
      }
    }
  } else if (id === 'muelle') {
    // Muelle Prat: Exactamente dos edificios en la entrada angosta (un poco más adentro, donde marcó el usuario en la imagen)
    const p1 = { x: 1195, y: 550 };
    const p2 = { x: 1215, y: 610 };
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const tang = { x: (p2.x - p1.x) / dist, y: (p2.y - p1.y) / dist };
    const normal = { x: -tang.y, y: tang.x };
    const num = 2; // Exactamente dos edificios

    for (let i = 0; i < num; i++) {
      const t = (i + 0.5) / num;
      const p = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
      const largoEd = 15;
      const fondo = 12;
      const centro = p; // Ubicados directamente en la entrada angosta marcada
      const eje = por(tang, largoEd / 2);
      const lateral = por(normal, fondo / 2);
      modelos.push({
        a: suma(suma(centro, por(eje, -1)), por(lateral, -1)),
        b: suma(suma(centro, eje), por(lateral, -1)),
        c: suma(suma(centro, eje), lateral),
        d: suma(suma(centro, por(eje, -1)), lateral),
        centro,
        altura: 28
      });
    }
  } else if (sec.guias) {
    sec.guias.forEach((segmento, sIdx) => {
      const p1 = { x: segmento[0][0], y: segmento[0][1] };
      const p2 = { x: segmento[1][0], y: segmento[1][1] };
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const num = Math.max(2, Math.round(dist / 44));
      const tang = { x: (p2.x - p1.x) / dist, y: (p2.y - p1.y) / dist };
      const normal = { x: -tang.y, y: tang.x };

      for (let i = 0; i < num; i++) {
        const t = (i + 0.5) / num;
        const p = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
        const largoEd = 16;
        const fondo = 12;
        const centro = suma(p, por(normal, 16));
        const eje = por(tang, largoEd / 2);
        const lateral = por(normal, fondo / 2);
        modelos.push({
          a: suma(suma(centro, por(eje, -1)), por(lateral, -1)),
          b: suma(suma(centro, eje), por(lateral, -1)),
          c: suma(suma(centro, eje), lateral),
          d: suma(suma(centro, por(eje, -1)), lateral),
          centro,
          altura: altura * variaciones[(i + sIdx * 2) % variaciones.length]
        });
      }
    });
  }

  // Ordenar de norte a sur para perspectiva axonométrica correcta
  modelos.sort((m1, m2) => m1.centro.y - m2.centro.y);

  modelos.forEach((m, idx) => {
    const gEd = crearSVG('g', { class: 'edificio-prisma' });
    gEd.style.transitionDelay = `${idx * 40}ms`;

    const h = m.altura;
    const basePts = [m.a, m.b, m.c, m.d];
    const arriba = { x: 0, y: -h };
    const topPts = [suma(m.a, arriba), suma(m.b, arriba), suma(m.c, arriba), suma(m.d, arriba)];

    // Caras frontales / laterales
    for (let i = 0; i < 4; i++) {
      const sig = (i + 1) % 4;
      const pA = basePts[i], pB = basePts[sig];
      const dx = pB.x - pA.x, dy = pB.y - pA.y;
      if (dx < -0.05 || dy > 0.05) {
        const tA = topPts[i], tB = topPts[sig];
        const esLuz = dy < 0;
        gEd.appendChild(crearSVG('polygon', {
          points: pts(pA, pB, tB, tA),
          fill: esLuz ? pal.frente : pal.lado,
          stroke: 'rgba(255, 255, 255, 0.25)',
          'stroke-width': '0.5',
          'stroke-linejoin': 'round'
        }));
      }
    }

    // Techo
    gEd.appendChild(crearSVG('polygon', {
      points: pts(...topPts),
      fill: pal.techo,
      stroke: 'rgba(255, 255, 255, 0.35)',
      'stroke-width': '0.5',
      'stroke-linejoin': 'round'
    }));

    gSector.appendChild(gEd);
    prismas.push(gEd);
  });

  gSector._prismas = prismas;
  capaEdificios.appendChild(gSector);
  mapaSectoresEdificios.set(id, gSector);
});

/* ==========================================================================
   SISTEMA DE CÁMARA (ZOOM Y PAN FLUIDO CON INTERPOLACIÓN SUAVE)
   ========================================================================== */
const mapaSvg = document.getElementById('mapa-svg');
const mapaContenido = document.getElementById('mapa-contenido');

const PIVOT_BASE = 960;
const PIVOT_ZOOM = 690; // Centra el mapa en el espacio despejado a la izquierda del panel de información (right: 140px)

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

  // 4. Mostrar edificios uno por uno fluidamente
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
   SECUENCIA DE INTRODUCCIÓN CON PASOS (Páginas 2 -> 3 -> 4 -> 1)
   - Página 2: Inicia limpia con el título "Pasos por la Amplitud".
   - Aparecen los pasos y caminan hasta la esquina inferior derecha.
   - Lleva a la siguiente página (Página 3: Pregunta).
   - Unos segundos después la pregunta sube y aparece el texto (Página 4).
   - Los pasos siguen avanzando hasta la esquina inferior derecha y dan paso al mapa (Página 1).
   ========================================================================== */
const pantallaIntro = document.getElementById('pantalla-intro');
const vistaP2 = document.getElementById('vista-p2');
const vistaP3P4 = document.getElementById('vista-p3-p4');
const introPregunta = document.getElementById('intro-pregunta');
const introSubtitulo = document.getElementById('intro-subtitulo');
const svgHuellas = document.getElementById('svg-huellas');

let introActiva = true;

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

// 1. Huellas de la Pantalla 2 (recorrido desde la esquina superior izquierda bajando hacia la esquina inferior derecha)
const huellasP2 = crearRutaHuellas(16, 70, 50, 1850, 1030);

// 2. Huellas de la Pantalla 3 y 4 (segundo tramo que sale de la pantalla hacia el mapa)
const huellasP3P4 = crearRutaHuellas(16, 70, 50, 1870, 1050);

let pasoP2 = 0;
function animarPasosP2() {
  if (!introActiva) return;
  if (pasoP2 < huellasP2.length) {
    const h = huellasP2[pasoP2];
    h.classList.add('visible', 'pisando');

    // Al pasar, la huella va desapareciendo suavemente
    setTimeout(() => {
      if (h) h.classList.add('desvanecida');
    }, 360);

    pasoP2++;
    setTimeout(animarPasosP2, 105);
  } else {
    // Los pasos llegaron a la esquina inferior derecha -> llevar a la siguiente página (Página 3)
    setTimeout(irAPagina3, 200);
  }
}

function irAPagina3() {
  if (!introActiva) return;

  // Desvanecer suavemente cualquier huella restante de P2
  huellasP2.forEach(h => {
    h.classList.add('desvanecida');
  });

  // Transición visual a Página 3
  vistaP2.classList.remove('activa');
  vistaP3P4.classList.add('activa');

  // Iniciar caminata de Página 3 y 4
  setTimeout(animarPasosP3P4, 400);
}

let pasoP3 = 0;
function animarPasosP3P4() {
  if (!introActiva) return;
  if (pasoP3 < huellasP3P4.length) {
    const h = huellasP3P4[pasoP3];
    h.classList.add('visible', 'pisando');

    // Al pasar, la huella va desapareciendo suavemente
    setTimeout(() => {
      if (h) h.classList.add('desvanecida');
    }, 620);

    pasoP3++;

    // Al paso 5: la pregunta sube un poco y aparece el subtítulo (Página 4)
    if (pasoP3 === 5) {
      introPregunta.classList.add('subida');
      introSubtitulo.classList.add('visible');
    }

    setTimeout(animarPasosP3P4, 240);
  } else {
    // Los pasos llegaron a la esquina inferior derecha -> dan paso al mapa (Página 1)
    setTimeout(cerrarIntro, 800);
  }
}

function cerrarIntro() {
  if (!introActiva) return;
  introActiva = false;
  pantallaIntro.style.pointerEvents = 'none';
  pantallaIntro.style.opacity = '0';
  setTimeout(() => {
    pantallaIntro.classList.add('oculta');
  }, 650);
}

// Iniciar animación de Página 2 tras 200ms
setTimeout(animarPasosP2, 200);

// Si el usuario hace clic o toca en cualquier momento, avanza inmediatamente al mapa
pantallaIntro.addEventListener('click', cerrarIntro);
pantallaIntro.addEventListener('touchstart', cerrarIntro, { passive: true });
