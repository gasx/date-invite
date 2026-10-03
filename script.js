const CONFIG = {
  question: "Пойдёшь со мной на свидание?",
  shareIntro: "Да 💗 Я согласна на свидание!",
};

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const questionStep = document.getElementById("questionStep");
const plannerStep = document.getElementById("plannerStep");
const card = document.getElementById("inviteCard");
const confettiLayer = document.getElementById("confettiLayer");

const calendarDays = document.getElementById("calendarDays");
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const timePresets = document.getElementById("timePresets");
const customTime = document.getElementById("customTime");
const selectionText = document.getElementById("selectionText");
const shareBtn = document.getElementById("shareBtn");
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

const monthNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const monthNamesGenitive = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const today = startOfDay(new Date());

let viewDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
);

let selectedDate = null;
let selectedTime = "";


/* =========================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ========================================================= */

function startOfDay(date) {
  return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
  );
}

function sameDate(a, b) {
  return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
  );
}


/* =========================================================
   КНОПКА "НЕТ"
   ========================================================= */

let noButtonRunning = false;
let lastRunAt = 0;


/*
  Переводим кнопку в body,
  чтобы card с overflow:hidden
  больше не могла её обрезать.
*/
function activateRunningButton() {
  if (noButtonRunning) return;

  const rect = noBtn.getBoundingClientRect();

  /*
    Переносим кнопку непосредственно в body.
  */
  document.body.appendChild(noBtn);

  noBtn.classList.add("is-running");

  noBtn.style.position = "fixed";

  noBtn.style.left =
      `${rect.left}px`;

  noBtn.style.top =
      `${rect.top}px`;

  noBtn.style.width =
      `${rect.width}px`;

  noBtn.style.height =
      `${rect.height}px`;

  noBtn.style.margin = "0";

  noBtn.style.zIndex = "999999";

  noBtn.style.visibility = "visible";

  noBtn.style.opacity = "1";

  noButtonRunning = true;
}


/*
  Возвращает безопасные границы,
  внутри которых кнопка должна оставаться.
*/
function getSafeBounds(rect) {
  const padding = 18;

  return {
    minX: padding,

    maxX: Math.max(
        padding,
        window.innerWidth -
        rect.width -
        padding
    ),

    minY: padding,

    maxY: Math.max(
        padding,
        window.innerHeight -
        rect.height -
        padding
    ),
  };
}


/*
  Проверяет, не находится ли новая точка
  слишком близко к курсору.
*/
function distanceFromPointer(
    x,
    y,
    rect,
    pointerX,
    pointerY
) {
  const centerX =
      x + rect.width / 2;

  const centerY =
      y + rect.height / 2;

  return Math.hypot(
      centerX - pointerX,
      centerY - pointerY
  );
}


/*
  Основная логика убегания.
*/
function moveNoButton(
    pointerX = null,
    pointerY = null
) {
  const now = performance.now();

  /*
    Не разрешаем функции срабатывать
    сотни раз в секунду.
  */
  if (
      now - lastRunAt < 85
  ) {
    return;
  }

  lastRunAt = now;

  activateRunningButton();

  const rect =
      noBtn.getBoundingClientRect();

  const bounds =
      getSafeBounds(rect);

  const centerX =
      rect.left +
      rect.width / 2;

  const centerY =
      rect.top +
      rect.height / 2;


  let dx;
  let dy;


  /*
    Если координаты курсора известны —
    двигаемся от курсора.
  */
  if (
      pointerX !== null &&
      pointerY !== null
  ) {
    dx =
        centerX -
        pointerX;

    dy =
        centerY -
        pointerY;
  } else {
    /*
      Запасной вариант:
      случайное направление.
    */
    const angle =
        Math.random() *
        Math.PI *
        2;

    dx =
        Math.cos(angle);

    dy =
        Math.sin(angle);
  }


  let vectorLength =
      Math.hypot(
          dx,
          dy
      );


  /*
    Если курсор оказался
    точно в центре кнопки.
  */
  if (
      vectorLength < 0.001
  ) {
    const angle =
        Math.random() *
        Math.PI *
        2;

    dx =
        Math.cos(angle);

    dy =
        Math.sin(angle);

    vectorLength = 1;
  }


  dx /= vectorLength;
  dy /= vectorLength;


  /*
    Расстояние одного "прыжка".
    Не слишком большое, чтобы
    кнопка именно убегала,
    а не телепортировалась.
  */
  const jumpDistance = 115;


  let newX =
      rect.left +
      dx *
      jumpDistance;

  let newY =
      rect.top +
      dy *
      jumpDistance;


  /*
    Немного случайности.
  */
  newX +=
      (Math.random() - 0.5) *
      35;

  newY +=
      (Math.random() - 0.5) *
      35;


  /*
    Ограничиваем экраном.
  */
  newX =
      Math.max(
          bounds.minX,
          Math.min(
              newX,
              bounds.maxX
          )
      );

  newY =
      Math.max(
          bounds.minY,
          Math.min(
              newY,
              bounds.maxY
          )
      );


  /*
    Если кнопка зажата у края,
    она иногда может не иметь возможности
    двигаться дальше строго "от курсора".

    Поэтому ищем несколько безопасных
    альтернативных позиций.
  */
  if (
      pointerX !== null &&
      pointerY !== null
  ) {
    const currentDistance =
        distanceFromPointer(
            newX,
            newY,
            rect,
            pointerX,
            pointerY
        );


    /*
      Хотим, чтобы после прыжка
      кнопка была хотя бы примерно
      в 140px от курсора.
    */
    if (
        currentDistance < 140
    ) {
      let bestX = newX;
      let bestY = newY;
      let bestDistance =
          currentDistance;


      for (
          let i = 0;
          i < 20;
          i++
      ) {
        const candidateX =
            bounds.minX +
            Math.random() *
            (
                bounds.maxX -
                bounds.minX
            );

        const candidateY =
            bounds.minY +
            Math.random() *
            (
                bounds.maxY -
                bounds.minY
            );


        const candidateDistance =
            distanceFromPointer(
                candidateX,
                candidateY,
                rect,
                pointerX,
                pointerY
            );


        if (
            candidateDistance >
            bestDistance
        ) {
          bestDistance =
              candidateDistance;

          bestX =
              candidateX;

          bestY =
              candidateY;
        }
      }


      newX = bestX;
      newY = bestY;
    }
  }


  /*
    Последняя страховка:
    никаких отрицательных координат
    и никаких координат за экраном.
  */
  newX =
      Math.max(
          bounds.minX,
          Math.min(
              newX,
              bounds.maxX
          )
      );

  newY =
      Math.max(
          bounds.minY,
          Math.min(
              newY,
              bounds.maxY
          )
      );


  noBtn.style.left =
      `${Math.round(newX)}px`;

  noBtn.style.top =
      `${Math.round(newY)}px`;
}


/* =========================================================
   КУРСОР ПРИБЛИЖАЕТСЯ
   ========================================================= */

document.addEventListener(
    "pointermove",
    (e) => {
      /*
        После нажатия "Да"
        больше ничего не делаем.
      */
      if (
          plannerStep.classList.contains(
              "step-visible"
          )
      ) {
        return;
      }


      /*
        Если кнопка скрыта,
        тоже выходим.
      */
      if (
          noBtn.style.display ===
          "none"
      ) {
        return;
      }


      const rect =
          noBtn.getBoundingClientRect();


      const centerX =
          rect.left +
          rect.width / 2;

      const centerY =
          rect.top +
          rect.height / 2;


      const distance =
          Math.hypot(
              e.clientX -
              centerX,

              e.clientY -
              centerY
          );


      /*
        Радиус реакции кнопки.
      */
      const dangerDistance = 125;


      if (
          distance <
          dangerDistance
      ) {
        moveNoButton(
            e.clientX,
            e.clientY
        );
      }
    },
    {
      passive: true,
    }
);


/* =========================================================
   ЕСЛИ МЫШЬ ПОПАЛА ПРЯМО НА КНОПКУ
   ========================================================= */

noBtn.addEventListener(
    "pointerenter",
    (e) => {
      moveNoButton(
          e.clientX,
          e.clientY
      );
    }
);


/* =========================================================
   МОБИЛЬНЫЙ ТЕЛЕФОН
   ========================================================= */

noBtn.addEventListener(
    "pointerdown",
    (e) => {
      e.preventDefault();

      e.stopPropagation();


      moveNoButton(
          e.clientX,
          e.clientY
      );
    }
);


/* =========================================================
   НЕ ДАЁМ "НЕТ" НАЖАТЬСЯ
   ========================================================= */

noBtn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();

      e.stopPropagation();


      /*
        Если click всё-таки возник,
        снова убегаем.
      */
      moveNoButton(
          e.clientX,
          e.clientY
      );
    }
);


/*
  Убираем стандартное контекстное меню
  при долгом нажатии на телефоне.
*/
noBtn.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
    }
);


/* =========================================================
   ИЗМЕНЕНИЕ РАЗМЕРА ЭКРАНА
   ========================================================= */

window.addEventListener(
    "resize",
    () => {
      if (
          !noButtonRunning
      ) {
        return;
      }


      const rect =
          noBtn.getBoundingClientRect();


      const bounds =
          getSafeBounds(rect);


      const newX =
          Math.max(
              bounds.minX,

              Math.min(
                  rect.left,
                  bounds.maxX
              )
          );


      const newY =
          Math.max(
              bounds.minY,

              Math.min(
                  rect.top,
                  bounds.maxY
              )
          );


      noBtn.style.left =
          `${newX}px`;

      noBtn.style.top =
          `${newY}px`;
    }
);


/* =========================================================
   КНОПКА "ДА"
   ========================================================= */

yesBtn.addEventListener(
    "click",
    () => {
      burstHearts();


      /*
        Полностью скрываем кнопку "Нет".
      */
      noBtn.style.display =
          "none";


      /*
        Скрываем первый экран.
      */
      questionStep.classList.remove(
          "step-visible"
      );


      questionStep.setAttribute(
          "aria-hidden",
          "true"
      );


      /*
        Показываем календарь.
      */
      plannerStep.classList.add(
          "step-visible"
      );


      plannerStep.setAttribute(
          "aria-hidden",
          "false"
      );


      renderCalendar();


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
);


/* =========================================================
   АНИМАЦИЯ СЕРДЕЧЕК
   ========================================================= */

function burstHearts() {
  const chars = [
    "♥",
    "♡",
    "✦",
    "♥",
    "♡",
  ];


  for (
      let i = 0;
      i < 34;
      i++
  ) {
    const node =
        document.createElement(
            "span"
        );


    node.className =
        "confetti-heart";


    node.textContent =
        chars[
            Math.floor(
                Math.random() *
                chars.length
            )
            ];


    node.style.left =
        `${Math.random() * 100}%`;


    node.style.fontSize =
        `${
            12 +
            Math.random() *
            18
        }px`;


    node.style.setProperty(
        "--fall",

        `${
            1.8 +
            Math.random() *
            1.8
        }s`
    );


    node.style.setProperty(
        "--drift",

        `${
            -100 +
            Math.random() *
            200
        }px`
    );


    node.style.setProperty(
        "--spin",

        `${
            -220 +
            Math.random() *
            440
        }deg`
    );


    node.style.animationDelay =
        `${
            Math.random() *
            0.3
        }s`;


    confettiLayer.appendChild(
        node
    );


    setTimeout(
        () => {
          node.remove();
        },

        4000
    );
  }
}


/* =========================================================
   КАЛЕНДАРЬ
   ========================================================= */

function renderCalendar() {
  const year =
      viewDate.getFullYear();


  const month =
      viewDate.getMonth();


  monthLabel.textContent =
      monthNames[month];


  yearLabel.textContent =
      year;


  calendarDays.innerHTML = "";


  const first =
      new Date(
          year,
          month,
          1
      );


  const last =
      new Date(
          year,
          month + 1,
          0
      );


  /*
    Переводим воскресенье=0
    в формат понедельник=0.
  */
  const offsetMonday =
      (
          first.getDay() +
          6
      ) %
      7;


  /*
    Пустые клетки.
  */
  for (
      let i = 0;
      i < offsetMonday;
      i++
  ) {
    const blank =
        document.createElement(
            "span"
        );


    calendarDays.appendChild(
        blank
    );
  }


  /*
    Дни текущего месяца.
  */
  for (
      let day = 1;
      day <= last.getDate();
      day++
  ) {
    const date =
        new Date(
            year,
            month,
            day
        );


    const btn =
        document.createElement(
            "button"
        );


    btn.type = "button";

    btn.className = "day";

    btn.textContent = day;


    /*
      Старые даты блокируем.
    */
    if (
        date < today
    ) {
      btn.disabled = true;
    }


    /*
      Сегодня.
    */
    if (
        sameDate(
            date,
            today
        )
    ) {
      btn.classList.add(
          "is-today"
      );
    }


    /*
      Выбранный день.
    */
    if (
        sameDate(
            date,
            selectedDate
        )
    ) {
      btn.classList.add(
          "is-selected"
      );
    }


    btn.addEventListener(
        "click",
        () => {
          selectedDate =
              date;


          renderCalendar();

          updateSelection();
        }
    );


    calendarDays.appendChild(
        btn
    );
  }


  const currentMonthFloor =
      new Date(
          today.getFullYear(),
          today.getMonth(),
          1
      );


  prevMonth.disabled =
      viewDate <=
      currentMonthFloor;
}


/* =========================================================
   НАЗАД ПО КАЛЕНДАРЮ
   ========================================================= */

prevMonth.addEventListener(
    "click",
    () => {
      const prev =
          new Date(
              viewDate.getFullYear(),
              viewDate.getMonth() - 1,
              1
          );


      const floor =
          new Date(
              today.getFullYear(),
              today.getMonth(),
              1
          );


      if (
          prev < floor
      ) {
        return;
      }


      viewDate = prev;


      renderCalendar();
    }
);


/* =========================================================
   ВПЕРЁД ПО КАЛЕНДАРЮ
   ========================================================= */

nextMonth.addEventListener(
    "click",
    () => {
      viewDate =
          new Date(
              viewDate.getFullYear(),
              viewDate.getMonth() + 1,
              1
          );


      renderCalendar();
    }
);


/* =========================================================
   ГОТОВЫЕ ВАРИАНТЫ ВРЕМЕНИ
   ========================================================= */

timePresets.addEventListener(
    "click",
    (e) => {
      const btn =
          e.target.closest(
              "button[data-time]"
          );


      if (!btn) {
        return;
      }


      selectedTime =
          btn.dataset.time;


      customTime.value = "";


      timePresets
          .querySelectorAll(
              "button"
          )
          .forEach(
              (item) => {
                item.classList.toggle(
                    "is-selected",
                    item === btn
                );
              }
          );


      updateSelection();
    }
);


/* =========================================================
   СВОЁ ВРЕМЯ
   ========================================================= */

customTime.addEventListener(
    "input",
    () => {
      selectedTime =
          customTime.value;


      timePresets
          .querySelectorAll(
              "button"
          )
          .forEach(
              (item) => {
                item.classList.remove(
                    "is-selected"
                );
              }
          );


      updateSelection();
    }
);


/* =========================================================
   ФОРМАТИРОВАНИЕ ДАТЫ
   ========================================================= */

function formatDate(date) {
  if (!date) {
    return "";
  }


  return (
      `${date.getDate()} ` +
      `${monthNamesGenitive[
          date.getMonth()
          ]} ` +
      `${date.getFullYear()}`
  );
}


/* =========================================================
   ОБНОВЛЕНИЕ ВЫБОРА
   ========================================================= */

function updateSelection() {
  /*
    Дата и время выбраны.
  */
  if (
      selectedDate &&
      selectedTime
  ) {
    selectionText.textContent =
        `${formatDate(
            selectedDate
        )} в ${selectedTime}`;


    shareBtn.disabled =
        false;


    copyBtn.disabled =
        false;


    return;
  }


  /*
    Выбрана только дата.
  */
  if (
      selectedDate
  ) {
    selectionText.textContent =
        `${formatDate(
            selectedDate
        )} — теперь выбери время`;


    shareBtn.disabled =
        true;


    copyBtn.disabled =
        true;


    return;
  }


  selectionText.textContent =
      "Выбери дату и время";


  shareBtn.disabled =
      true;


  copyBtn.disabled =
      true;
}


/* =========================================================
   ТЕКСТ ОТВЕТА
   ========================================================= */

function buildAnswerText() {
  return (
      `${CONFIG.shareIntro}\n` +
      `Давай ` +
      `${formatDate(
          selectedDate
      )} ` +
      `в ${selectedTime} ✨`
  );
}


/* =========================================================
   ПОДЕЛИТЬСЯ
   ========================================================= */

shareBtn.addEventListener(
    "click",
    async () => {
      if (
          !selectedDate ||
          !selectedTime
      ) {
        return;
      }


      const text =
          buildAnswerText();


      try {
        /*
          На мобильном откроется
          системное меню:
          Telegram / WhatsApp / Messages...
        */
        if (
            navigator.share
        ) {
          await navigator.share({
            title:
                "Наше свидание 💗",

            text,
          });


          showToast(
              "Осталось выбрать, куда отправить 💌"
          );
        } else {
          /*
            Если Web Share API нет,
            просто копируем текст.
          */
          await copyText(
              text
          );


          showToast(
              "Ответ скопирован — отправь его мне 💌"
          );
        }
      } catch (err) {
        /*
          Человек закрыл меню
          "Поделиться".
        */
        if (
            err &&
            err.name ===
            "AbortError"
        ) {
          return;
        }


        /*
          В случае другой ошибки
          копируем текст.
        */
        await copyText(
            text
        );


        showToast(
            "Ответ скопирован 💌"
        );
      }
    }
);


/* =========================================================
   СКОПИРОВАТЬ ОТВЕТ
   ========================================================= */

copyBtn.addEventListener(
    "click",
    async () => {
      if (
          !selectedDate ||
          !selectedTime
      ) {
        return;
      }


      await copyText(
          buildAnswerText()
      );


      showToast(
          "Ответ скопирован 💗"
      );
    }
);


/* =========================================================
   КОПИРОВАНИЕ
   ========================================================= */

async function copyText(
    text
) {
  /*
    Современный способ.
  */
  if (
      navigator.clipboard &&
      window.isSecureContext
  ) {
    await navigator.clipboard.writeText(
        text
    );


    return;
  }


  /*
    Старый способ,
    если сайт открыт не через HTTPS.
  */
  const area =
      document.createElement(
          "textarea"
      );


  area.value =
      text;


  area.style.position =
      "fixed";


  area.style.left =
      "-9999px";


  area.style.opacity =
      "0";


  document.body.appendChild(
      area
  );


  area.select();


  document.execCommand(
      "copy"
  );


  area.remove();
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    message
) {
  clearTimeout(
      toastTimer
  );


  toast.textContent =
      message;


  toast.classList.add(
      "show"
  );


  toastTimer =
      setTimeout(
          () => {
            toast.classList.remove(
                "show"
            );
          },

          2600
      );
}


/* =========================================================
   ЗАПУСК
   ========================================================= */

renderCalendar();