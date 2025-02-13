import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [errors,setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "" });
  const onCloseAlert = () => {
    setAlert({ show: false, message: "" });
  }

  const [register, setRegister] = React.useState({
    email: "",
    username: "",
    password: "",
    role: "user",
  });
  
  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value
    });
    setErrors({...errors,[e.target.name]:''});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(register);

    // const emailRegex =/^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$/;
    // if(!emailRegex.test(register.email)){
    //   setAlert({show:true,message:"Invalid email format"});
    //   return;
    // }

    // const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;
    // if(!passwordRegex.test(register.password)){
    //   setAlert({show:true, message:"Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."});
    //   return;
    // }
    try {
      const res = await axios.post("http://localhost:8081/registerUser", register);
      console.log(res.data);
      // sessionStorage.setItem("isAuthenticated", "true");
      // sessionStorage.setItem("jwtToken", res.data);
      console.log("User added successfully");
      navigate("/loginUser");
    } catch (err) {
      console.log("User not added");
      console.log(err);
      if(err.response && err.response.status === 400){
        setErrors(err.response.data);
      } else if(err.response && err.response.status === 409){
        setAlert({show:true,message:err.response.data.errorCode+" : "+err.response.data.message})
      } else if(err.response && err.response.status === 500){
        console.log(err.response.data);
        setAlert({show:true,message:err.response.data.errorCode+" : "+err.response.data.message});
      } else{
        setAlert({ show: true, message: err.message+" : "+"Registration failed" });
      }
    }
  };
  return (
    <>
      {alert.show && <Alert message={alert.message} onClose={onCloseAlert}/>}
      <div className="flex flex-col-reverse sm:flex-row justify-center items-center min-h-screen lg:px-24 bg-[#161633] overflow-hidden">
        <div className="w-full sm:w-auto sm:max-w-xs lg:max-w-xl flex justify-center mb-4 sm:mb-0">
          <DotLottieReact
            src="https://lottie.host/4e992644-dc1f-481d-84e4-93f8faa43a19/m3ksWuRjuu.lottie"
            loop
            autoplay
            className="w-3xl pr-0 mr-0"
          />
        </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-amber-200">
              Sign Up to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm/6 font-medium text-amber-200"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    // required
                    value={register.username}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.username && <p className="text-red-500">{errors.username}</p>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-amber-200"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    // type="email"
                    // required
                    autoComplete="email"
                    value={register.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-amber-200"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    // required
                    autoComplete="current-password"
                    value={register.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.password && <p className="text-red-500">{errors.password}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
