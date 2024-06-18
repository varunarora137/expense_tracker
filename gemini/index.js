import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDw18JFSzEgbPcK0MOO8SnQPQ_xvWhU6Gg";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const bars = document.querySelector(".bars");
const bars_modified = document.querySelector(".bars-modified");
const gemini_modified = document.querySelector(".gemini");
const gemini_dropdown = document.querySelector(".gemini-dropdown");
const question_asked = document.querySelector(".type-ques");
const send = document.querySelector(".send");
const gallery = document.querySelector("#gallery");
const mic = document.querySelector("#mic");
const content_main = document.querySelector(".content-main");
const main_div = document.querySelector(".content-main-outer");

const head_modified = document.querySelector(".head-modified");
const normal_aside = document.querySelector(".normal-aside");
const foot_modified = document.querySelector(".foot-modified");
const initial_foot = document.querySelector(".foot");
const initial_head = document.querySelector(".head");
const temp = document.querySelector(".temp");

let i = 0;
let ques_by_prompt = "";

bars.addEventListener("click", () => {
  document.querySelector("main").style.width = "calc(100vw - 285px)";
  normal_aside.style.width = "285px";
  initial_head.style.display = "none";
  initial_foot.style.display = "none";
  head_modified.style.display = "flex";
  foot_modified.style.top = "524px";
  temp.style.width = "285px";
});
bars_modified.addEventListener("click", () => {
  document.querySelector("main").style.width = "calc(100vw - 68px)";
  normal_aside.style.width = "68px";
  head_modified.style.display = "none";
  foot_modified.style.top = "750px";
  initial_head.style.display = "flex";
  initial_foot.style.display = "flex";
  temp.style.width = "68px";
});
gemini_modified.addEventListener("click", () => {
  if (gemini_dropdown.style.display === "none") {
    gemini_dropdown.style.display = "block";
  } else {
    gemini_dropdown.style.display = "none";
  }
});

function ansDivCreation() {
  ques_by_prompt = question_asked.value;
  send.style.display = "none";
  gallery.style.right = "65px";
  mic.style.right = "20px";
  question_asked.value = "";
  content_main.style.display = "none";
  i++;
  const ans_div = `<div class="content-ans">
            <div class="ques">
              <div class="circle"></div>
              <p class="ques-txt">${ques_by_prompt}</p>
            </div>
            <div class="speaker speaker-${i}">
              <button>Show drafts<i class="fa-solid fa-caret-down"></i></button>
              <div><i class="fa fa-volume-up" aria-hidden="true"></i></div>
            </div>
            <div class="ans-icon">
              <div class="gemini-icon gemini-icon-${i}">
                <img src="images/google-gemini-icon.png" alt="gemini" />
              </div>
              <div class="ans ans-${i}"></div>
            </div>
            <div class="various-icons  various-icons-${i}">
              <div class="outer-circle-icon">
                <i class="fa-solid fa-thumbs-up"></i>
              </div>
              <div class="outer-circle-icon">
                <i class="fa-solid fa-thumbs-down"></i>
              </div>
              <div class="outer-circle-icon"><i class="fas fa-edit"></i></div>
              <div class="outer-circle-icon">
                <i class="fas fa-share-alt"></i>
              </div>
              <div class="outer-circle-icon">
                <i class="fa-brands fa-google"></i>
              </div>
              <div class="outer-circle-icon three-dots">
                <i class="fas fa-ellipsis-v"></i>
              </div>
            </div>
          </div>`;
  main_div.innerHTML += ans_div;
  document.querySelector(`.gemini-icon-${i}`).classList.add("rotate360");
  run(i);
}

function enterQues() {
  question_asked.addEventListener("keyup", (e) => {
    send.style.display = "block";
    gallery.style.right = "120px";
    mic.style.right = "65px";
    if (question_asked.value === "") {
      send.style.display = "none";
      gallery.style.right = "65px";
      mic.style.right = "20px";
    }
    if (e.key === "Enter" && question_asked.value !== "") {
      ansDivCreation();
    }
  });

  send.addEventListener("click", () => ansDivCreation);
}
enterQues();

async function run(i) {
  try {
    document.querySelector(
      `.ans-${i}`
    ).innerHTML = `<div id="loading" style="position:relative; top:10px;">Loading</div>`;
    const loadingElement = document.getElementById("loading");
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 6;
      loadingElement.innerHTML = "Loading" + ".".repeat(dotCount);
    }, 500);
    const result = await model.generateContent(ques_by_prompt);
    const response = await result.response;
    const text = await response.text();
    clearInterval(interval);
    const modified_text = marked.parse(text);
    document.querySelector(`.ans-${i}`).innerHTML = modified_text;
    document.querySelector(`.various-icons-${i}`).style.display = "flex";
    document.querySelector(`.speaker-${i}`).style.visibility = "visible";
    document.querySelector(`.gemini-icon-${i}`).classList.remove("rotate360");
  } catch (error) {
    document.querySelector(`.ans-${i}`).innerText = "ERROR!!!";
  }
}
