const START_AT = Date.parse("2026-10-16T00:00:00-03:00");
const RETURN_AT = Date.parse("2026-11-09T08:00:00-03:00");
const START_DAY = "2026-10-16";

const PHRASES = [
  "Vitu, o relógio não para e a gente também não. Volta logo, a portaria está inquieta.",
  "Já olhamos a porta mais vezes do que o estoque. A ansiedade tem o seu nome.",
  "Cada minuto sem você pesa. A Solar conta alto: volta, Vitu.",
  "O cafezinho esfria esperando. A xícara sua está ali, e a gente também.",
  "Não dá para fingir calma. A casa inteira pergunta quando o Vitu chega.",
  "O corredor parece mais longo sem o seu passo. A gente acelera o relógio.",
  "A saudade já não é doce, é pressa. Volta, que a equipe não aguenta mais.",
  "Seu crachá está na mesa e o olhar de todo mundo está na porta.",
  "A gente conta de novo, e de novo, e ainda parece longe. Anda, Vitu.",
  "A escala da volta está riscada de tanto a gente conferir. O primeiro nome é o seu.",
  "Até a garrafa na linha parece apressada. A pressa é te ver entrar.",
  "Vitu, o lugar esquentou de ansiedade. Falta você para a casa respirar.",
  "O turno abre a porta e fecha desapontado. Ainda não é você. Ainda.",
  "Faz falta do jeito que dói um pouco. A gente quer o Vitu de volta agora.",
  "A operação segue, mas o pedaço melhor dela está de férias e isso incomoda.",
  "A saudade virou contagem regressiva. Cada segundo é uma cobrança carinhosa.",
  "Seu canto está pronto e vazio. Esse vazio é que não deixa a gente quieta.",
  "Falta pouco e mesmo assim a ansiedade cresce. O pedaço que falta se chama Vitu.",
  "O relógio trabalha devagar de propósito. A gente empurra ele na direção da portaria.",
  "O bom dia já foi ensaiado tantas vezes que saiu rouco. Falta quem responde.",
  "Descansa se conseguir, Vitu. Aqui ninguém descansa de te esperar.",
  "Dá para ouvir a equipe contando os dias no corredor. A portaria escuta da rua.",
  "Quase dá para ver a segunda. A ansiedade já chegou antes de você.",
  "Última noite. Amanhã, 8h, a porta abre e a casa inteira solta o ar.",
];

const pad = (n) => String(n).padStart(2, "0");

function saoPauloDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);
}

function remaining(now) {
  const total = Math.max(0, Math.floor((RETURN_AT - now) / 1000));
  return {
    done: total === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

function sentence(time) {
  if (time.done) return "O Vitu voltou.";
  const bit = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  return `Faltam ${bit(time.days, "dia", "dias")}, ${bit(time.hours, "hora", "horas")}, ${bit(time.minutes, "minuto", "minutos")} e ${bit(time.seconds, "segundo", "segundos")} para o Vitu voltar.`;
}

let announced = false;

function render() {
  const now = new Date();
  const time = remaining(now.getTime());
  document.getElementById("days").textContent = pad(time.days);
  document.getElementById("hours").textContent = pad(time.hours);
  document.getElementById("minutes").textContent = pad(time.minutes);
  document.getElementById("seconds").textContent = pad(time.seconds);
  document.body.classList.toggle("is-back", time.done);
  document.getElementById("calHead").textContent = time.done ? "Ele chegou" : "A espera aperta";
  document.getElementById("calFoot").textContent = time.done ? "a ansiedade virou festa" : "e a Solar não sossega sem o Vitu";

  const span = RETURN_AT - START_AT;
  const ratio = time.done ? 1 : Math.min(1, Math.max(0, (now.getTime() - START_AT) / span));
  document.getElementById("bar").style.width = `${Math.round(ratio * 100)}%`;
  document.getElementById("progress").setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  document.getElementById("progressLbl").textContent = time.done
    ? "As férias acabaram. Que bom te ver."
    : `Só ${Math.round(ratio * 100)}% passou. O resto é ansiedade pura.`;

  const index = Math.min(PHRASES.length - 1, Math.max(0, daysBetween(START_DAY, saoPauloDate(now))));
  document.getElementById("phrase").textContent = time.done
    ? "Vitor Wallaf chegou. Bem-vindo de volta, Vitu. A casa estava te esperando."
    : PHRASES[index];

  if (!announced || time.seconds === 0 || time.done) {
    document.getElementById("live").textContent = sentence(time);
    announced = true;
  }
}

render();
setInterval(render, 250);
