const form = document.getElementById("myform");

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const premiumUser= localStorage.getItem("isPremium");
  if(premiumUser==='yes'){
    document.getElementById('premium').innerHTML="You are a premium user!"
  }
  axios
    .get("http://localhost:3000/expense/get-expense", { headers: { "Authorization": token } })
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
  const token = localStorage.getItem("token");
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
      headers: { "Authorization": token },
    })
    .then((response) => display(response.data.newExpense))
    .catch((e) => console.log(e));
});

document.getElementById('rzp-button1').onclick=async function(e){
  const token= localStorage.getItem('token');
  const response= await axios.get("http://localhost:3000/purchase/premiummembership",{headers:{"Authorization":token}})
  console.log(response);
  var options={
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function(response){
      await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      },{headers:{"Authorization":token}})

      alert("You are a premium user now!")
      document.getElementById('premium').textContent="You are a premium user!"
      localStorage.setItem('isPremium',"yes");
    }
  }
  const rzp1= new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed',function(response){
    console.log(response);
    alert("Something went wrong!")
  })
}

function display(exp) {
  const parentElement = document.getElementById("items");
  let childHtml = `<li id=${exp.id}>${exp.amount} ${exp.description} ${exp.category}
    <button onclick=deleteUser(${exp.id})>Delete</button></li>`;
  parentElement.innerHTML += childHtml;
}

function deleteUser(expenseId) {
  const token=localStorage.getItem('token');
  const pe = document.getElementById("items");
  const ce = document.getElementById(expenseId);
  pe.removeChild(ce);
  axios
    .delete(`http://localhost:3000/expense/delete-expense/${expenseId}`,{ headers: { Authorization: token }})
    .then(() => console.log("expense deleted"))
    .catch((e) => console.log(e));
}
