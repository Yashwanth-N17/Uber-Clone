import { Link } from "react-router-dom";
import { useState } from "react";

const CaptainLogin = () => {

  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captainData, setCaptainData] = useState({});
  
    const submitHandler = (e) =>{
      e.preventDefault();
      setCaptainData({
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
            type="emial"
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
          Join a fleet? <Link className="text-blue-600" to='/captain-signup' >Register as a Captain</Link>
        </p>
      </div>
      <div>
        <Link className="bg-[#d5622d] flex justify-center items-center text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base" to='/login'>
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin;
