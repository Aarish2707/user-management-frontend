import React, {useState} from "react";
const login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ email:"", password:"" });

    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch("https://user-management-backend-2-9ynl.onrender.com/api/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if(res.ok){
                localStorage.setItem("token",data.token);
                setIsAuthenticated(true);
            }
            else{
                alert(data.error || "Login Failed");
            }
        }
        catch(err){
            console.log("Login error:",err);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="text" name="email" required placeholder="email" onChange={handleChange}/>
            <input type="password" name="password" required placeholder="password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    )
}
export default Login;