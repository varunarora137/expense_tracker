let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
let productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
const taxCalculation = document.querySelector(".tax-calculation");
const taxSubmit = document.querySelector("#total-tax-button");
const resetTax = document.querySelector("#reset-button");
const graphLabels = [];
const graphData = [];
const color = [];
const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
const transaction = document.querySelector(".transaction");
const dashboard = document.querySelector(".dashboard");
const ai = document.querySelector(".ai");
const signout = document.querySelector(".bottom");
const successful_login = document.querySelector(".successful-login");
const userLoggedIn = document.querySelector(".profile p");
const pay_now = document.querySelector("#pay-now");
const tax_value = document.querySelector(".stats");

let idIndex = 0;
let tempAmount = 0;
let obj = JSON.parse(localStorage.getItem("currentUser"));

const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["demo-chart"],
    datasets: [
      {
        label: "Money In Rupees",
        data: [1],
        backgroundColor: color,
        borderColor: colorGenerator(),
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 100,
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  },
});

if (obj.saved === true) {
  let temp_obj = JSON.parse(localStorage.getItem("userData"));
  let arr = Object.keys(temp_obj);
  for (let i of arr) {
    if (i === obj.email) {
      productTitle.disabled = false;
      userAmount.disabled = false;
      renderTransactions(temp_obj[i].graphLabel, temp_obj[i].graphData);
    }
  }
}

//Set Budget Part
totalAmountButton.addEventListener("click", () => {
  console.log("hello");

  tempAmount = totalAmount.value;
  //empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    productTitle.disabled = false;
    userAmount.disabled = false;
    //Set Budget
    amount.innerHTML = tempAmount;

    //Set Balance
    balanceValue.innerText =
      "₹" +
      (Number(tempAmount) -
        Number(
          expenditureValue.innerText.slice(1, expenditureValue.innerText.length)
        ));

    //Clear Input Box
    totalAmount.value = "";
    updateChart();
  }
});

//Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//tax calculation
taxSubmit.addEventListener("click", () => {
  console.log("hello");
  const temp_income = document.querySelector("#total-income").value;
  const income = Number(document.querySelector("#total-income").value);

  console.log(temp_income);
  if (temp_income !== "" && income >= 0) {
    document.querySelector("#tax-error").classList.add("hide");
    const taxslab = document.querySelector("#tax-slab");
    taxslab.disabled = false;
    if (income <= 300000) {
      taxslab.value = "0%";
      tax_value.innerText = "Nil";
    } else if (income > 300000 && income <= 600000) {
      taxslab.value = "5%";
      tax_value.innerText = `₹ ${income * 0.05}`;
    } else if (income > 600000 && income <= tax_value) {
      taxslab.value = "10%";
      tax_value.innerText = `₹ ${income * 0.1}`;
    } else if (income > 900000 && income <= 1200000) {
      taxslab.value = "15%";
      tax_value.innerText = `₹ ${income * 0.15}`;
    } else if (income > 1200000 && income <= 1500000) {
      taxslab.value = "20%";
      tax_value.innerText = `₹ ${income * 0.2}`;
    } else {
      taxslab.value = "30%";
      tax_value.innerText = `₹ ${income * 0.3}`;
    }
    taxslab.disabled = true;
  } else {
    document.querySelector("#tax-error").classList.remove("hide");
    document.querySelector("#tax-error").classList.add("error");
    document.querySelector("#tax-slab").value = "";
    document.querySelector(".stats").innerText = "Nil";
  }
});

resetTax.addEventListener("click", () => {
  document.querySelector("#tax-error").classList.add("hide");
  document.querySelector("#tax-slab").value = "";
  document.querySelector("#total-income").value = "";
  document.querySelector(".stats").innerText = "Nil";
});

//Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let flag = true;
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText.slice(
    1,
    balanceValue.innerText.length
  );
  let currentExpense = expenditureValue.innerText.slice(
    1,
    expenditureValue.innerText.length
  );
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  let parentText = parentDiv.querySelector(".product").innerText;
  if (edit) {
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    flag = false;
    disableButtons(true);
  }
  balanceValue.innerText =
    "₹" + (parseInt(currentBalance) + parseInt(parentAmount));
  expenditureValue.innerText =
    "₹" + (parseInt(currentExpense) - parseInt(parentAmount));
  parentDiv.remove();
  updateChart(parentText, Number(parentAmount), true);
};

//Function To Create List
function listCreator(expenseName, expenseValue) {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add(
    "sublist-content",
    "flex-space",
    `${Number(expenseValue) >= 0 ? "border-left-red" : "border-left-green"}`
  );
  sublistContent.id = `${idIndex++}`;
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
}

//Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  //empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  //Enable buttons
  disableButtons(false);
  //Expense
  productTitleError.classList.add("hide");

  let expenditure = parseInt(userAmount.value);
  //Total expense (existing + new)
  let sum =
    parseInt(
      expenditureValue.innerText.slice(1, expenditureValue.innerText.length)
    ) + expenditure;
  expenditureValue.innerText = "₹" + sum;
  //Total balance(budget - total expense)
  const totalBalance = Number(tempAmount) - sum;
  balanceValue.innerText = "₹" + totalBalance;

  //Create list
  listCreator(productTitle.value, userAmount.value);
  updateChart(productTitle.value, Number(userAmount.value));
  //Empty inputs
  productTitle.value = "";
  userAmount.value = "";
});

//chart

function colorGenerator() {
  let str = "#";
  for (let i = 1; i <= 6; i++) {
    let num = Math.trunc(Math.random() * 16);
    str += hex[num];
  }
  return str;
}

function updateChart(title = "money left", value, flag = false) {
  const leftIncome =
    Number(amount.innerText) -
    Number(
      expenditureValue.innerText.slice(1, expenditureValue.innerText.length)
    );
  title = title.toLowerCase();
  let ind = -1;
  graphLabels.forEach((a, i) => {
    if (a === title) {
      if (graphData[i] === value || a === "money left") {
        ind = i;
      }
    }
  });
  if (flag === true) {
    graphData.splice(ind, 1);
    graphLabels.splice(ind, 1);
  } else {
    if (ind !== -1) {
      if (value === undefined) value = leftIncome;
      graphData[ind] = value;
    } else {
      if (value === undefined) value = leftIncome;
      graphData.push(value);
      graphLabels.push(title);
    }
  }
  graphData[0] = leftIncome;
  chart.data.labels = graphLabels;
  chart.data.datasets[0].data = graphData;
  color.push(colorGenerator());
  chart.data.datasets[0].backgroundColor = color;

  obj.saved = true;
  obj.graphLabel = graphLabels;
  obj.graphData = graphData;

  localStorage.setItem("currentUser", JSON.stringify(obj));

  chart.update();
}

//go to transaction directly

transaction.addEventListener("click", () => {
  document.querySelector(".list").scrollIntoView({ behavior: "smooth" });
  dashboard.classList.remove("active-border-aside");
  transaction.classList.add("active-border-aside");
});

//go to dashboard

dashboard.addEventListener("click", () => {
  document.body.scrollIntoView({ behavior: "smooth" });
  transaction.classList.remove("active-border-aside");
  dashboard.classList.add("active-border-aside");
});

document.querySelector(".heading").addEventListener("click", () => {
  document.body.scrollIntoView({ behavior: "smooth" });
  transaction.classList.remove("active-border-aside");
  dashboard.classList.add("active-border-aside");
});

//signout

signout.addEventListener("click", () => {
  let temp_obj = JSON.parse(localStorage.getItem("userData"));
  let arr = Object.keys(temp_obj);
  for (let i of arr) {
    if (i === obj.email) {
      temp_obj[i] = obj;
    }
  }
  localStorage.setItem("userData", JSON.stringify(temp_obj));
  successful_login.style.display = "block";
  // successful_login.querySelector("p").innerText = "Successfully Logged Out";
  setTimeout(() => {
    successful_login.style.display = "none";
    window.location.href = "../index.html";
  }, 2000);
});

//user name display

document.addEventListener("DOMContentLoaded", () => {
  userLoggedIn.innerText = `${obj.name}`;
});

//ai integration

ai.addEventListener("click", () => {
  window.location.href = "../gemini/gemini.html";
});

//render transactions form localstorage

function renderTransactions(labels, data) {
  amount.innerText = "₹" + data.reduce((acc, i) => acc + i, 0);
  tempAmount = data.reduce((acc, i) => acc + i, 0);
  const expense_sum = data.reduce((acc, i) => acc + i, 0) - data[0];
  expenditureValue.innerText = "₹" + expense_sum;
  balanceValue.innerText = "₹" + data[0];

  for (let i = 1; i < data.length; i++) {
    listCreator(labels[i], data[i]);
  }
  updateChart(labels, data);
}

function updateChart(labels, data) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;

  let colors = [];

  for (let i = 0; i < data.length; i++) {
    colors.push(colorGenerator());
  }

  chart.data.datasets[0].backgroundColor = colors;

  chart.update();
}

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
