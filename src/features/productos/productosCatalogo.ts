export type ProductoSugerido = {
  nombre: string;
  categoria: string;
  unidad: string;
  precioReferencial: number;
  stockSugerido: number;
};

const base: ProductoSugerido[] = [
  { nombre: "Abono organico", categoria: "Fertilizante", unidad: "kg", precioReferencial: 3.5, stockSugerido: 50 },
  { nombre: "Bioestimulante foliar", categoria: "Bioinsumo", unidad: "L", precioReferencial: 22, stockSugerido: 5 }
];

const porCultivo: Record<string, ProductoSugerido[]> = {
  papa: [
    { nombre: "Semilla certificada de papa", categoria: "Semilla", unidad: "kg", precioReferencial: 4.8, stockSugerido: 80 },
    { nombre: "Fungicida para tizon", categoria: "Proteccion", unidad: "L", precioReferencial: 38, stockSugerido: 4 }
  ],
  quinua: [
    { nombre: "Semilla de quinua", categoria: "Semilla", unidad: "kg", precioReferencial: 18, stockSugerido: 20 },
    { nombre: "Trampa para aves", categoria: "Proteccion", unidad: "unidad", precioReferencial: 15, stockSugerido: 6 }
  ],
  "maiz amilaceo": [
    { nombre: "Semilla de maiz amilaceo", categoria: "Semilla", unidad: "kg", precioReferencial: 9.5, stockSugerido: 40 },
    { nombre: "Fertilizante NPK", categoria: "Fertilizante", unidad: "kg", precioReferencial: 6.2, stockSugerido: 60 }
  ],
  cebada: [
    { nombre: "Semilla de cebada", categoria: "Semilla", unidad: "kg", precioReferencial: 6.8, stockSugerido: 35 },
    { nombre: "Herbicida selectivo para gramineas", categoria: "Proteccion", unidad: "L", precioReferencial: 30, stockSugerido: 2 }
  ],
  trigo: [
    { nombre: "Semilla de trigo", categoria: "Semilla", unidad: "kg", precioReferencial: 7.2, stockSugerido: 40 },
    { nombre: "Fungicida para roya", categoria: "Proteccion", unidad: "L", precioReferencial: 35, stockSugerido: 3 }
  ],
  haba: [
    { nombre: "Semilla de haba", categoria: "Semilla", unidad: "kg", precioReferencial: 11.5, stockSugerido: 25 },
    { nombre: "Inoculante para leguminosas", categoria: "Bioinsumo", unidad: "kg", precioReferencial: 18, stockSugerido: 5 }
  ],
  arveja: [
    { nombre: "Semilla de arveja", categoria: "Semilla", unidad: "kg", precioReferencial: 12.5, stockSugerido: 25 },
    { nombre: "Tutorado y rafia agricola", categoria: "Herramienta", unidad: "paquete", precioReferencial: 24, stockSugerido: 3 }
  ],
  palta: [
    { nombre: "Planton de palta", categoria: "Planton", unidad: "unidad", precioReferencial: 14, stockSugerido: 40 },
    { nombre: "Corrector de calcio y boro", categoria: "Fertilizante", unidad: "kg", precioReferencial: 19, stockSugerido: 10 }
  ],
  cafe: [
    { nombre: "Planton de cafe", categoria: "Planton", unidad: "unidad", precioReferencial: 3.2, stockSugerido: 120 },
    { nombre: "Fungicida para roya del cafe", categoria: "Proteccion", unidad: "L", precioReferencial: 42, stockSugerido: 3 }
  ],
  cacao: [
    { nombre: "Planton de cacao", categoria: "Planton", unidad: "unidad", precioReferencial: 3.5, stockSugerido: 120 },
    { nombre: "Biofungicida para moniliasis", categoria: "Bioinsumo", unidad: "L", precioReferencial: 36, stockSugerido: 3 }
  ],
  banano: [
    { nombre: "Hijuelos de banano", categoria: "Planton", unidad: "unidad", precioReferencial: 4.8, stockSugerido: 80 },
    { nombre: "Fertilizante potasico", categoria: "Fertilizante", unidad: "kg", precioReferencial: 8.3, stockSugerido: 40 }
  ],
  yuca: [
    { nombre: "Estacas de yuca", categoria: "Semilla", unidad: "paquete", precioReferencial: 22, stockSugerido: 6 },
    { nombre: "Insecticida para mosca blanca", categoria: "Proteccion", unidad: "L", precioReferencial: 27, stockSugerido: 2 }
  ],
  frijol: [
    { nombre: "Semilla de frijol", categoria: "Semilla", unidad: "kg", precioReferencial: 10.2, stockSugerido: 28 },
    { nombre: "Inoculante rizobial", categoria: "Bioinsumo", unidad: "kg", precioReferencial: 16, stockSugerido: 4 }
  ],
  tomate: [
    { nombre: "Semilla hibrida de tomate", categoria: "Semilla", unidad: "sobre", precioReferencial: 18, stockSugerido: 4 },
    { nombre: "Controlador de polilla del tomate", categoria: "Proteccion", unidad: "L", precioReferencial: 44, stockSugerido: 2 }
  ],
  cebolla: [
    { nombre: "Semilla de cebolla", categoria: "Semilla", unidad: "sobre", precioReferencial: 14, stockSugerido: 5 },
    { nombre: "Fungicida para mildiu", categoria: "Proteccion", unidad: "L", precioReferencial: 31, stockSugerido: 2 }
  ]
};

const porAlertaKeyword: Record<string, ProductoSugerido[]> = {
  helad: [
    { nombre: "Manta termica agricola", categoria: "Proteccion climatica", unidad: "rollo", precioReferencial: 75, stockSugerido: 2 },
    { nombre: "Bioestimulante anti-estres", categoria: "Bioinsumo", unidad: "L", precioReferencial: 28, stockSugerido: 4 }
  ],
  lluv: [
    { nombre: "Fungicida preventivo", categoria: "Proteccion", unidad: "L", precioReferencial: 32, stockSugerido: 3 },
    { nombre: "Bomba de achique", categoria: "Herramienta", unidad: "unidad", precioReferencial: 180, stockSugerido: 1 }
  ],
  graniz: [{ nombre: "Malla antigranizo", categoria: "Proteccion climatica", unidad: "rollo", precioReferencial: 95, stockSugerido: 1 }],
  sequ: [
    { nombre: "Cinta de riego por goteo", categoria: "Riego", unidad: "rollo", precioReferencial: 55, stockSugerido: 2 },
    { nombre: "Tanque de almacenamiento", categoria: "Riego", unidad: "unidad", precioReferencial: 240, stockSugerido: 1 }
  ]
};

function sinDuplicados(input: ProductoSugerido[]) {
  const seen = new Set<string>();
  const out: ProductoSugerido[] = [];
  for (const p of input) {
    const k = p.nombre.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

function normalizeKey(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function sugeridosPorCultivo(cultivo: string): ProductoSugerido[] {
  const key = normalizeKey(cultivo);
  const list = [...base];
  const direct = porCultivo[key];
  if (direct) {
    list.push(...direct);
  } else {
    for (const [k, v] of Object.entries(porCultivo)) {
      const nk = normalizeKey(k);
      if (key.includes(nk) || nk.includes(key)) list.push(...v);
    }
  }
  return sinDuplicados(list);
}

export function sugeridosPorAlertas(mensajes: Iterable<string>): ProductoSugerido[] {
  const out: ProductoSugerido[] = [];
  for (const raw of mensajes) {
    const m = raw.toLowerCase();
    for (const [kw, items] of Object.entries(porAlertaKeyword)) {
      if (m.includes(kw)) out.push(...items);
    }
  }
  return sinDuplicados(out);
}
