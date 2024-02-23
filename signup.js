const form = document.getElementById("signupForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.mail.value;
  const password = e.target.password.value;
  const obj = { name, email, password };
  console.log(obj);
  axios
    .post("http://localhost:3000/user/sign-up", obj)
    .then((response) => {
      alert(response.data.message);
      e.target.name.value="";
      e.target.mail.value="";
      e.target.password.value="";
    })
    .catch((e) => {
      document.body.innerHTML+=`<div style="color:red">${e}</div>`;
    });
});
