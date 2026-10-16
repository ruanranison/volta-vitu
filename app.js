const RETURN_AT = Date.parse("2026-11-09T08:00:00-03:00");
const START = "2026-10-16";

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
  "A casa já separou o lugar do Vitu. O relógio não para.",
  "Segunda de manhã, 8h. Até lá, cada segundo conta o Vitu.",
];

const pad = (value) => String(value).padStart(2, "0");

function saoPauloDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function daysBetween(from, to) {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}

function remaining(now) {
  const ms = Math.max(0, RETURN_AT - now);
  const total = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

function sentence(time) {
  if (time.done) return "O Vitu voltou.";
  const days = time.days === 1 ? "1 dia" : `${time.days} dias`;
  const hours = time.hours === 1 ? "1 hora" : `${time.hours} horas`;
  const minutes = time.minutes === 1 ? "1 minuto" : `${time.minutes} minutos`;
  const seconds = time.seconds === 1 ? "1 segundo" : `${time.seconds} segundos`;
  return `Faltam ${days}, ${hours}, ${minutes} e ${seconds} para o Vitu voltar.`;
}

let announced = false;

function render() {
  const now = new Date();
  const time = remaining(now);
  document.getElementById("days").textContent = String(time.days);
  document.getElementById("hours").textContent = pad(time.hours);
  document.getElementById("minutes").textContent = pad(time.minutes);
  document.getElementById("seconds").textContent = pad(time.seconds);
  document.getElementById("headline").textContent = time.done ? "O Vitu voltou" : "Para o Vitu voltar";

  const index = Math.min(PHRASES.length - 1, Math.max(0, daysBetween(START, saoPauloDate(now))));
  document.getElementById("phrase").textContent = time.done
    ? "Vitor Wallaf cruzou a portaria. O trabalhador mais assíduo está de volta."
    : PHRASES[index];

  if (!announced || time.seconds === 0 || time.done) {
    document.getElementById("live").textContent = sentence(time);
    announced = true;
  }
}

render();
setInterval(render, 250);
