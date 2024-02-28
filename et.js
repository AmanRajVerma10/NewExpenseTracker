const form = document.getElementById("myform");
const token = localStorage.getItem("token");

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showPremiumUserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = `You are a premium user!`;
}

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const userLeaderBoardArray = await axios.get(
      "http://localhost:3000/premium/getleaderboard",
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);
    const leaderboardElements = document.getElementById("leaders");
    leaderboardElements.innerHTML = `<h2>Leaderboard</h2>`;
    userLeaderBoardArray.data.arr.forEach((element) => {
      leaderboardElements.innerHTML += `<li>name: ${element.name} expense: ${element.totalexpense}</li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

window.addEventListener("DOMContentLoaded", () => {
  const decodedToken = parseJwt(token);
  if (decodedToken.ispremiumuser) {
    showPremiumUserMessage();
    showLeaderboard();
  }

  axios
    .get("http://localhost:3000/expense/get-expense", {
      headers: { Authorization: token },
    })
    .then((exp) => {
      exp.data.expenses.map((expense) => {
        display(expense);
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const expense = event.target.exp.value;
  const description = event.target.des.value;
  const category = event.target.cat.value;
  const obj = {
    expense,
    description,
    category,
  };
  axios
    .post("http://localhost:3000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((response) => display(response.data.newExpense))
    .catch((e) => console.log(e));
});

document.getElementById("rzp-button1").onclick = async function (e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("You are a premium user now!");
      showPremiumUserMessage();
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong!");
  });
};

function display(exp) {
  const parentElement = document.getElementById("items");
  let childHtml = `<li id=${exp.id}>${exp.amount} ${exp.description} ${exp.category}
    <button onclick=deleteUser(${exp.id},${exp.amount})>Delete</button></li>`;
  parentElement.innerHTML += childHtml;
}

function deleteUser(expenseId, amount) {
  const pe = document.getElementById("items");
  const ce = document.getElementById(expenseId);
  pe.removeChild(ce);
  axios
    .delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {
      headers: { Authorization: token, price: amount },
    })
    .then(() => console.log("expense deleted"))
    .catch((e) => console.log(e));
}

function download() {
  axios
    .get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((e) => console.log(e));
}
