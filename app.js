const START = "2026-10-16";
const RETURN = "2026-11-08";
const SPAN = 23;

const PHRASES = [
  "A portaria abriu no horário. O Vitu, não. A casa inteira sentiu.",
  "O ponto eletrônico está quieto demais sem o crachá do Vitu.",
  "Três pessoas já perguntaram se o Vitu não volta hoje. Ainda não.",
  "O cafezinho da manhã ficou sem o único que nunca atrasa.",
  "A escala tem nome sobrando e um assíduo faltando: o Vitu.",
  "Até a tampa da garrafa parece mais apertada sem o Vitu no turno.",
  "A operação segue. A ansiedade pela volta do Vitu segue na frente.",
  "Alguém tentou cobrir a assiduidade do Vitu. O relógio não deixou.",
  "O corredor vermelho está comprido demais sem o Vitu passando.",
  "Estoque cheio, cadeira vazia. O Vitu continua de férias.",
  "A turma guarda o lugar do Vitu. Ninguém encosta na cadeira.",
  "Sem o Vitu, o dia começa certo e termina inquieto.",
  "O rádio da fábrica já devia tocar só a volta do Vitu.",
  "Cada dia longe pesa. O Vitu é o trabalhador que a casa não substitui.",
  "A saudade entrou no uniforme. O Vitu ainda não entrou na portaria.",
  "Falta o assíduo para a semana fechar. Falta o Vitu.",
  "O descanso do Vitu é merecido. A pressa da casa, também.",
  "A gôndola não pergunta. A equipe pergunta: cadê o Vitu?",
  "Mais um amanhecer sem o Vitu. A contagem não mente.",
  "O turno abriu a porta devagar, só para ver se o Vitu tinha voltado.",
  "Quase dá para ouvir o crachá. Ainda é cedo. O Vitu segue de férias.",
  "A ansiedade já não cabe no estoque. Falta pouco para o Vitu.",
  "Amanhã a conta muda de novo. A casa já separou o lugar do Vitu.",
];

function todayInSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function daysBetween(from, to) {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}

function render() {
  const today = todayInSaoPaulo();
  const left = Math.max(0, daysBetween(today, RETURN));
  const elapsed = left === 0
    ? SPAN
    : Math.min(SPAN, Math.max(0, daysBetween(START, today) + 1));
  const count = document.getElementById("count");
  const headline = document.getElementById("headline");
  const phrase = document.getElementById("phrase");
  const track = document.getElementById("track");

  count.textContent = String(left);

  if (left === 0) {
    headline.innerHTML = "O <em>Vitu</em> voltou";
    phrase.textContent = "Vitor Wallaf cruzou a portaria. O trabalhador mais assíduo está de volta, e a casa inteira pode soltar o ar.";
  } else if (left === 1) {
    headline.innerHTML = "Falta 1 dia para o <em>Vitu</em> voltar";
    phrase.textContent = PHRASES[SPAN - 1];
  } else {
    headline.innerHTML = `Faltam ${left} dias para o <em>Vitu</em> voltar`;
    const index = Math.min(SPAN - 1, Math.max(0, SPAN - left));
    phrase.textContent = PHRASES[index];
  }

  track.innerHTML = Array.from({ length: SPAN }, (_, i) => {
    const done = i < elapsed || left === 0;
    return `<li class="${done ? "done" : ""}"></li>`;
  }).join("");
}

render();
setInterval(render, 60 * 1000);
