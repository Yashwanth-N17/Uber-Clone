import {Link} from 'react-router-dom';
const Start = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://plus.unsplash.com/premium_photo-1736613837750-c3c116b1d244?q=80&w=784&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full bg-red-400">
        <img className='w-16 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <div className="bg-white pb-7 py-4 px-4 ">
          <h2 className="test-3xl font-bold">Get Started with Uber</h2>
        <Link className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5" to='/login'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start;
