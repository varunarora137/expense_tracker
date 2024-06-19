var options = {
  key: "rzp_test_fOqmASUXt5fJSs",
  currency: "INR", //your business name
  description: "Test Transaction",

  callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
  prefill: {
    email: "patni@example.com",
    contact: "9000090000", //Provide the customer's phone number for better conversion rates
  },
  notes: {
    address: "Razorpay Corporate Office",
  },
  theme: {
    color: "#3399cc",
  },
};
pay_now.onclick = function (e) {
  if (Number(tax_value.innerText.slice(1)) > 300000) {
    options.amount = `${Number(tax_value.innerText.slice(1)) * 100}`;
    options.name = `${JSON.parse(localStorage.getItem("currentUser")).name}`;
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }
  e.preventDefault();
};
