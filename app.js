const START_AT = Date.parse("2026-10-16T00:00:00-03:00");
const RETURN_AT = Date.parse("2026-11-09T08:00:00-03:00");
const START_DAY = "2026-10-16";

const PHRASES = [
  "A portaria já guarda um bom dia com o seu nome, Vitu. Pode vir com calma.",
  "O cafezinho da manhã deixou uma xícara sua. A casa está leve só de esperar.",
  "Cada garrafa na linha sai com pressa boa. A pressa é te ver de volta.",
  "A Solar separou a sua cadeira, o seu turno e a melhor história da semana.",
  "Descansa, Vitu. A recepção está sendo ensaiada sem pressa e com carinho.",
  "O corredor vermelho vai ficar curto de novo no dia em que você passar.",
  "A equipe fala de você sorrindo. Segunda de manhã vai ser o dia bom.",
  "O seu crachá tem hora marcada. A portaria abre às 8h, sem falta.",
  "Tem gente contando o seu retorno como quem espera o intervalo.",
  "A escala da volta já está escrita. O primeiro nome da manhã é o seu.",
  "A casa brinda antes. O gole gelado fica para quando você chegar.",
  "Vitu, o lugar não esfriou. Está quente de gente que gosta de você aqui.",
  "O turno da manhã abre a porta como quem recebe visita querida.",
  "Você faz falta do jeito certo: aquele que a gente quer de volta logo.",
  "A operação segue, e o melhor pedaço dela volta com você.",
  "A saudade está doce. A chegada vai ser melhor.",
  "Já deixamos o seu canto pronto. Falta só o Vitu sentar.",
  "Falta pouco para a Solar ficar inteira. O pedaço que falta tem nome.",
  "O relógio trabalha a nosso favor. Cada segundo te traz para a portaria.",
  "O bom dia já foi ensaiado. Agora só falta quem responde.",
  "O descanso é seu, Vitu. A alegria de abrir a porta é nossa.",
  "Dá para ouvir a equipe contando. A portaria escuta da rua.",
  "Quase dá para ver a segunda. O turno das 8h tem o seu nome na frente.",
  "Última noite dessa espera. Amanhã, 8h, a casa te recebe de braços abertos.",
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

let announced = false;

function render() {
  const now = new Date();
  const time = remaining(now.getTime());
  clockNow(now);
  document.getElementById("days").textContent = pad(time.days);
  document.getElementById("hours").textContent = pad(time.hours);
  document.getElementById("minutes").textContent = pad(time.minutes);
  document.getElementById("seconds").textContent = pad(time.seconds);
  document.getElementById("calHead").textContent = time.done ? "Chegou" : "Faltam";
  document.getElementById("calFoot").textContent = time.done ? "o Vitu está de volta" : "para o Vitu voltar para a gente";

  const span = RETURN_AT - START_AT;
  const ratio = time.done ? 1 : Math.min(1, Math.max(0, (now.getTime() - START_AT) / span));
  document.getElementById("bar").style.width = `${Math.round(ratio * 100)}%`;
  document.getElementById("progress").setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  document.getElementById("progressLbl").textContent = time.done
    ? "As férias acabaram. Que bom te ver."
    : `${Math.round(ratio * 100)}% das férias já passaram. O melhor ainda é a chegada.`;

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
