import { GoogleGenerativeAI } from "@google/generative-ai";

const transaction = document.querySelector(".transaction");
const dashboard = document.querySelector(".dashboard");
const video = document.querySelector("video");
const ans_div = document.querySelector(".ans-div");
const ques = document.querySelector(".text");
const circle = document.querySelector(".circle");
const signout = document.querySelector(".bottom");
const successful_login = document.querySelector(".successful-login");
let i = 0;
let obj = JSON.parse(localStorage.getItem("currentUser"));

document.querySelector(".profile p").innerText = obj.name;
//gemini
const API_KEY = "AIzaSyC-e5cQX2Ulywwh1Fx3RPnLONE_NpHatvc";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//hamburger

document.querySelector(".ham-click").addEventListener("click", () => {
  document.querySelector(".aside").style.width = "16rem";
  document.querySelector(".hamburger").style.zIndex = "4";
  document.querySelector(".aside").style.zIndex = "5";
  setTimeout(() => {
    document.querySelector(".close-div").style.visibility = "visible";
    document.querySelector(".bottom").style.bottom = "1rem";
    document.querySelector(".aside-inside").style.display = "block";
  }, 200);
  // document.querySelector(".hamburger").style.display = "none";
});

document.querySelector(".close-div").addEventListener("click", () => {
  if (window.innerWidth <= 600) {
    document.querySelector(".aside").style.width = "40px";
  } else {
    document.querySelector(".aside").style.width = "50px";
  }
  document.querySelector(".hamburger").style.zIndex = "5";
  document.querySelector(".aside").style.zIndex = "4";
  setTimeout(() => {
    document.querySelector(".bottom").style.bottom = "-50px";
    document.querySelector(".close-div").style.visibility = "hidden";
    document.querySelector(".aside-inside").style.display = "none";
  }, 200);
  // document.querySelector(".ham-click").style.display = "block";
});

//go to dahboard

document.querySelector(".heading").addEventListener("click", () => {
  window.location.href = "../expense-tracker-js/dashboard.html";
});

dashboard.addEventListener("click", () => {
  window.location.href = "../expense-tracker-js/dashboard.html";
});

//go to transactions

transaction.addEventListener("click", () => {
  localStorage.setItem("transactionClicked", "yes");
  window.location.href = "../expense-tracker-js/dashboard.html#listed";
});

//video hide

circle.addEventListener("click", creatQues);
ques.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    creatQues();
  }
});

function creatQues() {
  const question = ques.value;
  if (question.length <= 0) {
    return;
  }
  video.style.display = "none";

  const div = `<div class="ques-display">
          <h2>Question:-</h2>
          <p>${question}</p>
        </div>`;
  ans_div.innerHTML += div;

  const another_div = `<div class="ans-display">
    <h2 style="margin-bottom: 0.5em">Answer:-</h2>
    <p class="ans ans-${i}" style="padding-left: 1.5em">
    </p>
  </div>`;
  ans_div.innerHTML += another_div;
  createAns(question, i);
  i++;
  ques.value = "";
}

async function createAns(ques_by_prompt, i) {
  try {
    document.querySelector(
      `.ans-${i}`
    ).innerHTML = `<h2 id="loading" style="text-align:center">Loading</h2>`;
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
  } catch (error) {
    document.querySelector(`.ans-${i}`).innerText = "ERROR!!!";
    console.log("error");
  }
}

//signout

signout.addEventListener("click", () => {
  // let temp_obj = JSON.parse(localStorage.getItem("userData"));
  // let arr = Object.keys(temp_obj);
  // for (let i of arr) {
  //   if (i === obj.email) {
  //     temp_obj[i] = obj;
  //   }
  // }
  // localStorage.setItem("userData", JSON.stringify(temp_obj));
  successful_login.style.display = "block";
  setTimeout(() => {
    successful_login.style.display = "none";
    window.location.href = "../index.html";
  }, 2000);
});
