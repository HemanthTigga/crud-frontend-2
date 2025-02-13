import { DotLottiePlayer } from "@dotlottie/react-player";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { getProtectedResource } from "../Services/AuthService";
// import { getProtectedResource } from "../Services/AuthService";

// const API_URL = "http://localhost:8081/";

// export const AuthHeader = () => {
//   const token = sessionStorage.getItem("jwtToken");
//   console.log("token : ", token);
//   if (token) {
//     console.log("Authorization header set");
//     return { Authorization: "Bearer " + token };
//   } else {
//     console.log("No token found");
//     return {};
//   }
// };

// export const getProtectedResource = () => {
//   console.log("Calling getProtectedResource");
//   const headers = AuthHeader();
//   console.log("Headers: ", headers);
//   return axios.get(`${API_URL}getCustomer`, {headers:  headers });
// };

export default function LoginUser() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({ show: false, message: "" });
  const onCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const handleUserId = (e) => {
    setUserId(e.target.value);
    setErrors({ [e.target.name]: "" });
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrors({ [e.target.name]: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId);
    console.log(password);
    //email validation
    // const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$/;
    // if (!emailRegex.test(userId)) {
    //   setAlert({ show: true, message: "Invalid email format!!!" });
    //   return;
    // }

    //password validation
    // const passwordRegex =
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;
    // if (!passwordRegex.test(password)) {
    //   setAlert({
    //     show: true,
    //     message:
    //       "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    //   });
    //   return;
    // }
    try {
      const res = await axios.post("http://localhost:8081/loginUser", {
        userId,
        password,
      });
      console.log("res : ", res);
      if (res.data == null) {
        setAlert({
          show: true,
          message: "User not found. Please register to continue",
        });
        navigate("/registerUser");
      } else if (res.data) {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("jwtToken", res.data);
        setAlert({ show: true, message: "Login Successfull" });
        console.log(" login Success");
        navigate("/");

        // Call the protected resource function after login
        getProtectedResource('')
          .then((response) => {
            console.log("Protected resource data:", response.data);
          })
          .catch((error) => {
            console.error("Error fetching protected resource:", error);
          });
      } else {
        setAlert({ show: true, message: "Incorrect Password" });
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else if (err.response && err.response.status === 409) {
        setAlert({
          show: true,
          message:
            err.response.data.errorCode + " : " + err.response.data.message,
        });
      } else if (err.response && err.response.status === 500) {
        console.log(err.response.data);
        setAlert({
          show: true,
          message:
            err.response.data.errorCode + " : " + err.response.data.message,
        });
      } else {
        setAlert({ show: true, message: err.message + " : " + "Login failed" });
      }
    }
  };
  return (
    <>
      {alert.show && <Alert message={alert.message} onClose={onCloseAlert} />}

      <div className="flex flex-col-reverse sm:flex-row justify-center items-center min-h-screen lg:px-24 bg-[#161633]">
        <div className="w-full sm:w-auto sm:max-w-xs lg:max-w-xl flex justify-center mb-4 sm:mb-0">
          <DotLottieReact
            src="https://lottie.host/d6b4cff2-2006-48f1-9f1d-6c9ba6c96b69/4kDlpZZfip.lottie"
            loop
            autoplay
            className="w-3xl pr-0 mr-0"
          />
        </div>
        {/* <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-2 lg:px-5"> */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-2 lg:px-5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-amber-200">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                    value={userId}
                    onChange={handleUserId}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-amber-200 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.userId && (
                    <p className="text-red-500">{errors.userId}</p>
                  )}
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
                    value={password}
                    onChange={handlePassword}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-amber-200 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to={"/registerUser"}
                className="font-semibold text-emerald-600 hover:text-emerald-500"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
