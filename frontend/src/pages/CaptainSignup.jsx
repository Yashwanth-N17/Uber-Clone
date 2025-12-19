import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const captainData = {
      fullname:{
        firstname : firstName,
        lastname : lastName
      },
      email : email,
      password : password,
      vehicle :{
        color : vehicleColor,
        plate : vehiclePlate,
        capacity : vehicleCapacity,
        vehicleType : vehicleType
      }
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
    if(response.status === 201){
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home')

    }

  };

  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-base font-medium mb-2">
            What's our Captain's name
          </h3>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              required
              placeholder="First name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              required
              placeholder="Last name"
            />
          </div>
          <h3 className="text-base font-medium mb-2">
            What's our Captain's email
          </h3>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-base placeholder:text-sm"
            required
            placeholder="email@example.com"
          />
          <p className="text-base font-medium mb-2">Enter Password</p>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg placeholder:text-sm"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            placeholder="password"
          />

          <h3 className="text-base font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-6">
            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-4 mb-6">
            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value);
              }}
            />
            <select
              required
              className="bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-base placeholder:text-sm"
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <button className="bg-[#111] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-base placeholder:text-sm">
            Create a Captain account
          </button>
        </form>
        <p className="text-center font-sans mb-0.5">
          Already have a account?
          <Link className="text-blue-600" to="/captain-login">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
