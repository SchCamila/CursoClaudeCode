const pptxgen = require("pptxgenjs");

const GREEN = "65B32E";
const LIME = "AFCA0B";
const PURPLE = "6D5BD0";
const DARK = "1A1A1A";
const WHITE = "FFFFFF";
const FONT = "Poppins";

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "LiveMode";
pptx.title = "LiveMode — Management Overview";

function addFooter(slide, pageLabel) {
  slide.addText("LIVEMODE", {
    x: 0.5, y: 7.05, w: 4, h: 0.35,
    fontFace: FONT, fontSize: 10, color: PURPLE, bold: true, charSpacing: 2,
  });
  slide.addText(pageLabel, {
    x: 11.5, y: 7.05, w: 1.3, h: 0.35,
    fontFace: FONT, fontSize: 10, color: "999999", align: "right",
  });
}

function bullets(items) {
  return items.map((it, i) => ({
    text: it.text,
    options: {
      bullet: { code: "25A0", color: it.color || GREEN },
      breakLine: true,
      paraSpaceAfter: 10,
      bold: !!it.bold,
      color: it.headColor || DARK,
    },
  }));
}

// ---------- Slide 1: Title ----------
const s1 = pptx.addSlide();
s1.background = { color: WHITE };
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: WHITE } });
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: GREEN } });
s1.addShape(pptx.ShapeType.rect, { x: 0.35, y: 0, w: 0.15, h: 7.5, fill: { color: LIME } });
s1.addShape(pptx.ShapeType.ellipse, { x: 10.3, y: -1.5, w: 5, h: 5, fill: { color: PURPLE, transparency: 90 } });
s1.addShape(pptx.ShapeType.ellipse, { x: 11.5, y: 4.5, w: 3.5, h: 3.5, fill: { color: LIME, transparency: 85 } });

s1.addText("LiveMode", {
  x: 1.1, y: 2.55, w: 10, h: 1.3,
  fontFace: FONT, fontSize: 54, bold: true, color: GREEN,
});
s1.addText("Management Overview", {
  x: 1.15, y: 3.75, w: 10, h: 0.7,
  fontFace: FONT, fontSize: 26, color: PURPLE, bold: true,
});
s1.addText(
  "Casa de mídia esportiva brasileira — direitos, produção e distribuição, com força no digital e no gratuito.",
  {
    x: 1.15, y: 4.45, w: 9.2, h: 0.7,
    fontFace: FONT, fontSize: 15, color: "555555",
  }
);
s1.addText("Conteúdo ilustrativo, montado para os exercícios do curso.", {
  x: 1.15, y: 6.55, w: 9, h: 0.4,
  fontFace: FONT, fontSize: 11, italic: true, color: "999999",
});
addFooter(s1, "01");

// ---------- Slide 2: Quem somos / O que fazemos ----------
const s2 = pptx.addSlide();
s2.background = { color: WHITE };
s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.15, fill: { color: GREEN } });
s2.addText("Quem somos & O que fazemos", {
  x: 0.6, y: 0.2, w: 12, h: 0.75,
  fontFace: FONT, fontSize: 28, bold: true, color: WHITE,
});

s2.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.55, w: 5.9, h: 5.4, fill: { color: "F6F8F2" }, line: { color: GREEN, width: 1 }, rectRadius: 0.08 });
s2.addText("Quem somos", { x: 0.9, y: 1.8, w: 5.3, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: GREEN });
s2.addText(
  "A LiveMode é uma casa de mídia esportiva brasileira: adquire direitos de transmissão, produz o conteúdo e o distribui — com força no digital e no gratuito.\n\nÉ a companhia por trás da CazéTV, o canal do streamer Casimiro Miguel, criada em parceria com os fundadores Edgar Diniz e Sérgio Lopes (os mesmos do Esporte Interativo).",
  { x: 0.9, y: 2.35, w: 5.3, h: 4.3, fontFace: FONT, fontSize: 13, color: DARK, lineSpacing: 20 }
);

s2.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.55, w: 5.9, h: 5.4, fill: { color: "F3F1FB" }, line: { color: PURPLE, width: 1 }, rectRadius: 0.08 });
s2.addText("O que fazemos", { x: 7.1, y: 1.8, w: 5.3, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: PURPLE });
s2.addText(
  bullets([
    { text: "Direitos & aquisição — negociamos direitos de grandes competições.", color: PURPLE },
    { text: "Produção & transmissão — ao vivo, gratuita, no YouTube.", color: PURPLE },
    { text: "Comercial — vendemos cotas de patrocínio (a \"esteira\") para marcas.", color: PURPLE },
    { text: "Conteúdo — bastidores, cortes, videocasts, segunda tela.", color: PURPLE },
  ]),
  { x: 7.1, y: 2.4, w: 5.35, h: 4.2, fontFace: FONT, fontSize: 13, color: DARK, lineSpacing: 19 }
);
addFooter(s2, "02");

// ---------- Slide 3: Marcos / Como ganhamos ----------
const s3 = pptx.addSlide();
s3.background = { color: WHITE };
s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.15, fill: { color: PURPLE } });
s3.addText("Marcos & Como ganhamos", {
  x: 0.6, y: 0.2, w: 12, h: 0.75,
  fontFace: FONT, fontSize: 28, bold: true, color: WHITE,
});

s3.addText("Marcos (exemplos)", { x: 0.6, y: 1.5, w: 6, h: 0.45, fontFace: FONT, fontSize: 17, bold: true, color: GREEN });
s3.addText(
  bullets([
    { text: "Recorde mundial de audiência de futebol feminino: pico de ~1 milhão de dispositivos simultâneos em Brasil x Panamá (Copa do Mundo Feminina 2023), superando a marca anterior (~250 mil, final da UEFA Women's Champions League)." },
    { text: "Mundial de Clubes: alcance na casa das dezenas de milhões de pessoas." },
    { text: "Cobertura de Olimpíadas, Eurocopa e Brasileirão." },
  ]),
  { x: 0.6, y: 2.05, w: 6.0, h: 4.8, fontFace: FONT, fontSize: 12.5, color: DARK, lineSpacing: 18 }
);

s3.addShape(pptx.ShapeType.line, { x: 6.95, y: 1.55, w: 0, h: 5.3, line: { color: "DDDDDD", width: 1 } });

s3.addText("Como ganhamos", { x: 7.25, y: 1.5, w: 5.5, h: 0.45, fontFace: FONT, fontSize: 17, bold: true, color: LIME });
s3.addText(
  "Receita vem de patrocínio (cotas vendidas a marcas dentro do ciclo de cada evento) e de acordos de distribuição.\n\nA gratuidade funciona como alavanca de escala: quanto menor o atrito para assistir, maior a audiência — e maior o valor da cota.",
  { x: 7.25, y: 2.05, w: 5.4, h: 3.0, fontFace: FONT, fontSize: 13, color: DARK, lineSpacing: 20 }
);
s3.addShape(pptx.ShapeType.rect, { x: 7.25, y: 5.15, w: 5.4, h: 1.55, fill: { color: "F6F8F2" }, line: { color: LIME, width: 1 }, rectRadius: 0.08 });
s3.addText("Menor atrito → maior audiência → maior valor da cota", {
  x: 7.5, y: 5.35, w: 4.9, h: 1.2, fontFace: FONT, fontSize: 13, bold: true, color: GREEN, align: "center", valign: "middle",
});
addFooter(s3, "03");

// ---------- Slide 4: Marca / Prioridades ----------
const s4 = pptx.addSlide();
s4.background = { color: WHITE };
s4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.15, fill: { color: LIME } });
s4.addText("Marca & Prioridades", {
  x: 0.6, y: 0.2, w: 12, h: 0.75,
  fontFace: FONT, fontSize: 28, bold: true, color: DARK,
});

s4.addText("Marca", { x: 0.6, y: 1.5, w: 5.5, h: 0.45, fontFace: FONT, fontSize: 17, bold: true, color: PURPLE });

const swatches = [
  { name: "Verde", hex: GREEN },
  { name: "Lima", hex: LIME },
  { name: "Roxo", hex: PURPLE },
];
swatches.forEach((sw, i) => {
  const x = 0.6 + i * 1.95;
  s4.addShape(pptx.ShapeType.roundRect, { x, y: 2.1, w: 1.7, h: 1.1, fill: { color: sw.hex }, rectRadius: 0.1 });
  s4.addText(`${sw.name}\n#${sw.hex}`, {
    x, y: 3.25, w: 1.7, h: 0.6, fontFace: FONT, fontSize: 10.5, color: DARK, align: "center", lineSpacing: 13,
  });
});

s4.addText(
  [
    { text: "Tipografia: ", options: { bold: true, color: DARK } },
    { text: "Poppins (títulos e texto)\n", options: { color: DARK } },
    { text: "Tom: ", options: { bold: true, color: DARK, breakLine: false } },
    { text: "informal, próximo, \"conexão verdadeira\"", options: { color: DARK } },
  ],
  { x: 0.6, y: 4.55, w: 6.0, h: 1.2, fontFace: FONT, fontSize: 13, lineSpacing: 19 }
);

s4.addShape(pptx.ShapeType.line, { x: 6.95, y: 1.55, w: 0, h: 5.3, line: { color: "DDDDDD", width: 1 } });

s4.addText("Prioridades (exemplos)", { x: 7.25, y: 1.5, w: 5.5, h: 0.45, fontFace: FONT, fontSize: 17, bold: true, color: GREEN });
const priorities = [
  "Crescer audiência recorrente (não só picos de evento).",
  "Amadurecer a esteira comercial (priorização e previsibilidade).",
  "Escalar produção de conteúdo sem estourar custo.",
];
priorities.forEach((p, i) => {
  const y = 2.15 + i * 1.35;
  s4.addShape(pptx.ShapeType.ellipse, { x: 7.25, y, w: 0.55, h: 0.55, fill: { color: GREEN } });
  s4.addText(String(i + 1), { x: 7.25, y, w: 0.55, h: 0.55, fontFace: FONT, fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle" });
  s4.addText(p, { x: 8.0, y: y - 0.05, w: 4.7, h: 0.7, fontFace: FONT, fontSize: 13, color: DARK, valign: "middle" });
});
addFooter(s4, "04");

pptx.writeFile({ fileName: "livemode_management_overview.pptx" }).then(() => {
  console.log("done");
});
