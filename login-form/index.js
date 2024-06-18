const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const user_name = document.querySelector(".name");
const user_email = document.querySelector(".email");
const user_password = document.querySelector(".password");
const input_email = document.querySelector(".input-email");
const input_password = document.querySelector(".input-password");
const signup = document.querySelector(".signup");
const signin = document.querySelector(".signin");
const successful_login = document.querySelector(".successful-login");
const obj = JSON.parse(localStorage.getItem("userData")) || {};

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

signin.addEventListener("click", (e) => {
  e.preventDefault();
  const input_password_value = input_password.value;
  const input_email_value = input_email.value;
  if (input_email_value === "" || input_password_value === "") {
    alert("Please Fill All The Fields");
    return;
  }
  let temp_obj = JSON.parse(localStorage.getItem("userData"));
  if (!temp_obj) {
    input_password.value = "";
    input_email.value = "";
    alert("Please SignUp First");
    return;
  }
  const arr = Object.keys(temp_obj);
  for (let i of arr) {
    if (
      i === input_email_value &&
      input_password_value === temp_obj[i].password
    ) {
      input_password.value = "";
      input_email.value = "";
      successful_login.style.display = "block";
      successful_login.querySelector("p").innerText = "Successfully Logged In";
      setTimeout(() => {
        successful_login.style.display = "none";
        window.location.href = "../expense-tracker-js/dashboard.html";
      }, 2000);
      return;
    }
  }
  input_password.value = "";
  input_email.value = "";
  alert("Wrong UserName Or Password");
});

signup.addEventListener("click", (e) => {
  e.preventDefault();
  const newuser_name = user_name.value.toLowerCase();
  const newuser_email = user_email.value.toLowerCase();
  const newuser_password = user_password.value;
  if (newuser_name === "" || newuser_email === "" || newuser_password === "") {
    alert("Please Fill All The Fields");
    return;
  }
  obj[newuser_email] = {
    name: newuser_name,
    password: newuser_password,
  };
  localStorage.setItem("userData", JSON.stringify(obj));
  user_name.value = "";
  user_email.value = "";
  user_password.value = "";
  successful_login.style.display = "block";
  setTimeout(() => (successful_login.style.display = "none"), 2000);
});
