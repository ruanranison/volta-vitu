const START_AT = Date.parse("2026-10-16T00:00:00-03:00");
const RETURN_AT = Date.parse("2026-11-09T08:00:00-03:00");
const START_DAY = "2026-10-16";

const PHRASES = [
  "A portaria já sente a sua falta, Vitu. Volta logo, a casa está alegre só de imaginar.",
  "O cafezinho da manhã guarda uma xícara para você. Ainda quente de saudade.",
  "Cada garrafa que sai da linha pergunta pelo trabalhador mais assíduo.",
  "A Solar está em festa antecipada. Falta o convidado principal: você, Vitu.",
  "O seu lugar continua reservado. Ninguém ocupa a cadeira do Vitu.",
  "A equipe conta os segundos com um sorriso. Segunda de manhã vai ser boa.",
  "O corredor vermelho está mais comprido sem você passando, Vitu.",
  "Descansa bastante. A recepção já está sendo ensaiada.",
  "O ponto eletrônico vai comemorar o dia em que o seu crachá voltar.",
  "Tem gente perguntando de você o dia inteiro. A resposta é sempre a mesma: já já.",
  "A escala da semana que vem já tem o seu nome no topo, Vitu.",
  "A casa inteira brinda à sua volta, mesmo antes de você cruzar a portaria.",
  "Você deixou um vazio gostoso de preencher. E a gente mal pode esperar.",
  "O turno abre a porta devagar, só para ver se você chegou mais cedo.",
  "Vitu, a operação segue, mas o melhor turno é o que tem você.",
  "A saudade está doce, que nem o primeiro gole gelado. Volta logo.",
  "Já separamos o seu lugar, o seu copo e a melhor história para te contar.",
  "Falta pouco para a Solar ficar completa de novo. Falta você.",
  "O relógio corre a favor da gente. Cada segundo aproxima o Vitu.",
  "A portaria já ensaiou o bom dia. Agora só falta o dono dele.",
  "Vitu, o descanso é seu. A alegria da volta é nossa.",
  "A equipe está contando alto. Dá para ouvir da portaria.",
  "Quase dá para ver o seu crachá na mesa. Segunda chega sorrindo.",
  "Últimos instantes dessa espera boa. 8h da manhã, a casa te recebe.",
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

function clockNow(date) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  const day = get("weekday");
  document.getElementById("nowDate").textContent = `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${get("day")} de ${get("month")}`;
  document.getElementById("nowTime").textContent = `${get("hour")}:${get("minute")}:${get("second")}`;
}

function bubbles() {
  const field = document.getElementById("bubbles");
  field.innerHTML = Array.from({ length: 14 }, (_, i) => {
    const size = 8 + (i % 5) * 6;
    const left = (i * 7.1) % 100;
    const delay = (i % 7) * -2;
    return `<i style="width:${size}px;height:${size}px;left:${left}%;animation-delay:${delay}s"></i>`;
  }).join("");
}

let announced = false;

function render() {
  const now = new Date();
  const time = remaining(now.getTime());
  clockNow(now);
  document.getElementById("days").textContent = pad(time.days);
  document.getElementById("hours").textContent = pad(time.hours);
  document.getElementById("minutes").textContent = pad(time.minutes);
  document.getElementById("seconds").textContent = pad(time.seconds);

  const span = RETURN_AT - START_AT;
  const gone = Math.min(span, Math.max(0, now.getTime() - START_AT));
  const ratio = time.done ? 1 : gone / span;
  document.getElementById("bar").style.width = `${Math.round(ratio * 100)}%`;
  document.getElementById("progress").setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  document.getElementById("progressLbl").textContent = time.done
    ? "As férias acabaram. Que bom te ver."
    : `${Math.round(ratio * 100)}% das férias já passaram. O melhor ainda é a chegada.`;

  const index = Math.min(PHRASES.length - 1, Math.max(0, daysBetween(START_DAY, saoPauloDate(now))));
  document.getElementById("phrase").textContent = time.done
    ? "Vitor Wallaf cruzou a portaria. Bem-vindo de volta, Vitu."
    : PHRASES[index];
  document.getElementById("calHead").textContent = time.done ? "Chegou" : "Faltam";
  document.getElementById("calFoot").textContent = time.done
    ? "o Vitu está de volta"
    : "para o Vitu voltar para a gente";

  if (!announced || time.seconds === 0 || time.done) {
    document.getElementById("live").textContent = sentence(time);
    announced = true;
  }
}

bubbles();
render();
setInterval(render, 250);
