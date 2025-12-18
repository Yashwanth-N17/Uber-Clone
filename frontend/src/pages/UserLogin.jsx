import { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const submitHandler = (e) =>{
    e.preventDefault();
    setUserData({
      email:email,
      password : password
    })
    setEmail('');
    setPassword('');
  }
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            type="email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            required
            placeholder="email@example.com"
          />
          <p className="text-lg font-medium mb-2">Enter Password</p>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            type="password"
            value={password}
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            required
            placeholder="password"
          />
          <button className="bg-[#111] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center font-sans mb-0.5">
          New here? <Link className="text-blue-600" to='/signup' >Create new Account</Link>
        </p>
      </div>
      <div>
        <Link className="bg-[#10b461] flex justify-center items-center mb-5 text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base" to='/captain-login'>
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
