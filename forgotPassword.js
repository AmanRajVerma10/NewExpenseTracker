const form= document.getElementById('forgotPasswordForm')

form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email=e.target.email.value;
    const response= await axios.post('http://localhost:3000/password/forgotpassword',{
        email
    })
    console.log(response);
})