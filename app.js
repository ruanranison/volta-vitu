const DEFAULTS = { start: "2026-10-16T00:00", end: "2026-10-26T08:00" };

function loadDates() {
  try {
    const saved = JSON.parse(localStorage.getItem("volta-vitu-dates") || "null");
    const end = saved && String(saved.end || "");
    const stale = end.startsWith("2026-11-09") || end.startsWith("2026-10-19");
    if (saved && saved.start && saved.end && !stale) return saved;
  } catch (_) {}
  return { ...DEFAULTS };
}

let dates = loadDates();

function instant(local) {
  const value = local.length === 16 ? `${local}:00` : local;
  return Date.parse(`${value}-03:00`);
}

function startAt() { return instant(dates.start); }
function returnAt() { return instant(dates.end); }
function endDay() { return dates.end.slice(0, 10); }

const PHRASES_BY_DAYS_LEFT = [
  "É hoje, Vitu. Às 8h a porta abre. A casa inteira já está na ponta do pé.",
  "Amanhã, 8h. Ninguém finge calma. A ansiedade já chegou antes de você.",
  "Faltam dois dias. A Solar conta as horas em voz alta. Volta, Vitu.",
  "Segunda está logo ali. A espera já aperta. A casa não sossega sem você.",
  "Quatro dias. Cada hora pesa mais. A portaria olha a rua o tempo todo.",
  "A outra segunda se aproximou. O relógio incomoda. A Solar quer você de volta.",
  "Menos de uma semana. A saudade cresce por dia e o seu lugar continua vazio.",
  "A ansiedade sobe um pouco a cada manhã. A casa já pergunta quando você chega.",
  "A semana da volta começou a aparecer. A espera deixou de ser leve.",
  "Mais um dia se foi, Vitu. A contagem encolhe e a saudade não.",
  "É na outra segunda, às 8h. Ainda falta um pouco, mas a casa já está inquieta.",
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

function formatReturn(ms) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
  }).formatToParts(new Date(ms));
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  const day = get("weekday");
  const hour = String(Number(get("hour")));
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${get("day")} de ${get("month")} de ${get("year")}, às ${hour}h`;
}

function remaining(now) {
  const total = Math.max(0, Math.floor((returnAt() - now) / 1000));
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

  const span = Math.max(1, returnAt() - startAt());
  const ratio = time.done ? 1 : Math.min(1, Math.max(0, (now.getTime() - startAt()) / span));
  document.getElementById("bar").style.width = `${Math.round(ratio * 100)}%`;
  document.getElementById("progress").setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  document.getElementById("returnDate").textContent = formatReturn(returnAt());
  document.getElementById("progressLbl").textContent = time.done
    ? "As férias acabaram. Que bom te ver."
    : `Só ${Math.round(ratio * 100)}% passou. O resto é ansiedade pura.`;

  const daysLeft = Math.max(0, daysBetween(saoPauloDate(now), endDay()));
  const index = Math.min(PHRASES_BY_DAYS_LEFT.length - 1, daysLeft);
  document.getElementById("phrase").textContent = time.done
    ? "Vitor Wallaf chegou. Bem-vindo de volta, Vitu. A casa estava te esperando."
    : PHRASES_BY_DAYS_LEFT[index];

  if (!announced || time.seconds === 0 || time.done) {
    document.getElementById("live").textContent = sentence(time);
    announced = true;
  }
}

const bubbles = document.getElementById("bubbles");
for (let i = 0; i < 22; i += 1) {
  const bubble = document.createElement("span");
  const size = 6 + Math.random() * 18;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${7 + Math.random() * 11}s`;
  bubble.style.animationDelay = `${-Math.random() * 12}s`;
  bubbles.appendChild(bubble);
}

const settings = document.getElementById("settings");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");

document.getElementById("gear").addEventListener("click", () => {
  startInput.value = dates.start.slice(0, 16);
  endInput.value = dates.end.slice(0, 16);
  endInput.setCustomValidity("");
  settings.showModal();
});

document.getElementById("cancelBtn").addEventListener("click", () => settings.close());

endInput.addEventListener("input", () => endInput.setCustomValidity(""));

document.getElementById("settingsForm").addEventListener("submit", (event) => {
  const start = startInput.value;
  const end = endInput.value;
  if (instant(end) <= instant(start)) {
    event.preventDefault();
    endInput.setCustomValidity("O retorno precisa ser depois do início.");
    endInput.reportValidity();
    return;
  }
  dates = { start, end };
  localStorage.setItem("volta-vitu-dates", JSON.stringify(dates));
  announced = false;
  render();
});

render();
setInterval(render, 250);
