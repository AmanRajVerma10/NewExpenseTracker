const form= document.getElementById('forgotPasswordForm')

form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email=e.target.email.value;
    const response= await axios.post('http://localhost:300/password/forgotpassword',{
        email
    })
    console.log(response);
})