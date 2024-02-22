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
    .then((data) => {
      console.log(data);
      e.target.name.value="";
      e.target.mail.value="";
      e.target.password.value="";
    })
    .catch((e) => {
      alert("SignUp Failed!")
    });
});
