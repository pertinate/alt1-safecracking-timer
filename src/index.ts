//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as a1lib from "alt1/base";
import ChatBoxReader from "alt1/chatbox";
import tooltip from "alt1/tooltip";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");
require("!file-loader?name=[name].[ext]!./icon.png");

let useTooltip =
  !!localStorage.getItem("useTooltip") &&
  localStorage.getItem("useTooltip") === "false"
    ? false
    : alt1.permissionOverlay;
let toggle = <HTMLInputElement>document.getElementById("tooltip_toggle");
if (useTooltip) toggle.setAttribute("checked", "checked");
else toggle.removeAttribute("checked");
toggle.addEventListener("change", (event) => {
  useTooltip = toggle.checked;
  localStorage.setItem("useTooltip", useTooltip ? "true" : "false");
  if (useTooltip) toggle.setAttribute("checked", "checked");
  else toggle.removeAttribute("checked");
});

var output = document.getElementById("output");

const ocr = new ChatBoxReader();
//on load, potentially set new available and start?
const safeLocations: {
  location: string;
  note: string;
  available: number;
  start: number;
}[] = JSON.parse(localStorage.getItem("safeLocations")) || [];
let index = Number(localStorage.getItem("currentIdx")) || 0;

let tooltipOpen = false;
setInterval(() => {
  const current = safeLocations
    .map((entry) => {
      const currentValue = Date.now() - entry.start;
      const max = entry.available - entry.start;
      const secondsLeft = currentValue > max ? 0 : (max - currentValue) / 1000;
      return { ...entry, currentValue, max, secondsLeft };
    })
    .filter((entry) => entry.secondsLeft == 0);

  if (useTooltip) {
    if (current.length > 0) {
      alt1.setTooltip(
        `${current
          .map((entry) => `[(${entry.location}): ${entry.note}]`)
          .join(", ")} are ready to be cracked again`
      );
      tooltipOpen = true;
    } else {
      if (tooltipOpen) {
        alt1.clearTooltip();
      }
      tooltipOpen = false;
    }
  } else {
    if (tooltipOpen) {
      alt1.clearTooltip();
    }
    tooltipOpen = false;
  }
}, 1000);
const redraw = () => {
  const progressList = document.getElementById("progress_list");

  if (progressList) {
    progressList.innerHTML = safeLocations.reduce((acc, next, idx) => {
      const currentValue = Date.now() - next.start;
      const max = next.available - next.start;
      const secondsLeft = currentValue > max ? 0 : (max - currentValue) / 1000;
      acc += `
            <li
                id="location-${idx}"
                style="display:flex;flex-direction: column;padding-left: 0; margin-left: 0;"
            >
                <div
                    style="display: flex;justify-content: space-between;align-items: center;padding-bottom: 4px;"
                >
                    <div>
                        <label class="nistext" id="location-label-${idx}">${
        next.location
      }</label>
                        <label id="location-arrow-${idx}" style="color: green;display: ${
        idx === index ? "inline-block" : "none"
      };">←</label>
                    </div>
                    <div>
                        <button
                            onclick="TEST.setCurrent(${idx})"
                        >Set</button>
                        <button
                            onclick="TEST.manualTriggerSafe(${idx})"
                        >Reset</button>
                        <button
                            onclick="TEST.deleteSafeLocation(${idx})"
                        >Delete</button>
                    </div>
                </div>
                <input id="note-${idx}" class="nisinput" placeholder="Add a note" value="${
        next.note || ""
      }" onchange="TEST.changeNoteFor(${idx}, this.value)"></input>
                <div>
                    <progress id="progress-${idx}" value="${currentValue}" max="${max}"></progress>
                    <label id="progress-label-${idx}">${Math.ceil(
        secondsLeft
      )} seconds left</label>
                </div>
            </li>
            `;
      return acc;
    }, "");
  }
};
export const setCurrent = (idx: number) => {
  index = idx;
};
export const manualTriggerSafe = (idx: number) => {
  safeLocations[idx].available = safeLocations[idx].start;
};
export const deleteSafeLocation = (idx: number) => {
  safeLocations.splice(idx, 1);
  redraw();
};
export const changeNoteFor = (idx: number, text: string) => {
  safeLocations[idx].note = text;
  const currentNote = document.getElementById(
    `progress-label-${idx}`
  ) as HTMLInputElement;
  currentNote.value = text;
};

let lastConsumedLine: string = localStorage.getItem("lastConsumedLine") || "";

const t = setInterval(function () {
  try {
    if (window.alt1) {
      let pos = ocr.find();
      if (pos) {
        let state = ocr.read();
        if (state) {
          state.forEach((line) => {
            if (line.text.includes("You crack open the safe!")) {
              let now = new Date().valueOf();
              safeLocations[index].available =
                now +
                (safeLocations[index]?.location === `Zemouregal's Fortress` ||
                safeLocations[index]?.location === "Wilderness"
                  ? 1000 * 60 * 10
                  : 1000 * 60 * 5);
              safeLocations[index].start = now;
              index++;

              if (index >= safeLocations.length) {
                index = 0;
              }
              lastConsumedLine = line.text;
            }
          });
        }
      }
    }

    safeLocations.forEach((loc, idx) => {
      const currentProgress = document.getElementById(
        `progress-${idx}`
      ) as HTMLProgressElement;
      const currentProgressLabel = document.getElementById(
        `progress-label-${idx}`
      ) as HTMLLabelElement;
      const currentLabelArrow = document.getElementById(
        `location-arrow-${idx}`
      ) as HTMLLabelElement;

      if (currentLabelArrow) {
        currentLabelArrow.style.display =
          idx === index ? "inline-block" : "none";
      }

      const currentValue = Date.now() - safeLocations[idx].start;
      const max = safeLocations[idx].available - safeLocations[idx].start;
      const secondsLeft = currentValue > max ? 0 : (max - currentValue) / 1000;

      if (currentProgress) {
        currentProgress.value = currentValue;
        currentProgress.max = max;
      }

      if (currentProgressLabel) {
        currentProgressLabel.innerText = `${Math.ceil(
          secondsLeft
        )} seconds left`;
      }
    });

    localStorage.setItem("safeLocations", JSON.stringify(safeLocations));
    localStorage.setItem("currentIdx", JSON.stringify(index));
    localStorage.setItem("lastConsumedLine", lastConsumedLine);
  } catch (ex) {
    console.error(ex);
  }
}, 1000);

setTimeout(() => {
  redraw();
}, 1000);

export const AddSafe = () => {
  const selector = document.getElementById(
    "safe_location"
  ) as HTMLSelectElement;
  safeLocations.push({
    location: selector.value,
    note: "",
    available: Date.now(),
    start: Date.now(),
  });
  redraw();
};

export const Start = () => {
  for (let index = 0; index < safeLocations.length; index++) {
    let now = new Date().valueOf();
    safeLocations[index].available =
      now +
      (safeLocations[index]?.location === `Zemouregal's Fortress` ||
      safeLocations[index]?.location === "Wilderness"
        ? 1000 * 60 * 10
        : 1000 * 60 * 5);
    safeLocations[index].start = now;
  }
};

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
  //tell alt1 about the app
  //this makes alt1 show the add app button when running inside the embedded browser
  //also updates app settings if they are changed
  alt1.identifyAppUrl("./appconfig.json");
  Start();
}
