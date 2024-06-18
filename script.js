document.querySelector(".sign--up").addEventListener("click", () => {
  localStorage.setItem("flag", "0");
  window.location.href = "./login-form/signup.html";
});

document.querySelector(".sign--in").addEventListener("click", () => {
  localStorage.setItem("flag", "1");
  window.location.href = "./login-form/signup.html";
});
