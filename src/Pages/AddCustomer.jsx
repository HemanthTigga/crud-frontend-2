import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Alert from "../Components/Alert";
import { getProtectedResource } from "../Services/AuthService";

function AddCustomer() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "" });
  const onCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };

  useEffect(() => {
    getProtectedResource("addCustomer")
      .then((response) => {
        console.log("Customer data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Customer resource:", error);
      });
  });
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: null,
    email: "",
    image: null,
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   setErrors({...errors, [e.target.name] : ""});
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({
        ...formData,
        [name]: name === "age" || name === "id" ? Number(value) : value,
      });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(errors);
    try {
      const formDatatoSend = new FormData();
      const customerData = {
        id: formData.id,
        name: formData.name,
        age: formData.age,
        email: formData.email,
      };

      formDatatoSend.append(
        "customer",
        new Blob([JSON.stringify(customerData)], { type: "application/json" })
      );

      if (formData.image) {
        formDatatoSend.append("image", formData.image);
      }
      // await axios.post("http://localhost:8081/addCustomer", formData);
      await axios.post("http://localhost:8081/addCustomer", formDatatoSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // alert("Customer added successfully");
      setFormData({
        id: null,
        name: "",
        age: null,
        email: "",
        image: null,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else if (
        (err.response && err.response.status === 409) ||
        err.response.status === 500
      ) {
        setAlert({
          show: true,
          message:
            err.response.data.errorCode + " : " + err.response.data.message,
        });
      } else {
        setAlert({
          show: true,
          message: err.message + " : " + "Customer not added",
        });
      }
    }
  };
  return (
    <>
      {/* <Navbar/> */}
      {alert.show && <Alert message={alert.message} onClose={onCloseAlert} />}
      <div className="flex flex-col-reverse sm:flex-row justify-center items-center h-screen lg:px-24 bg-[#161633]">
        <div className="w-full sm:w-auto sm:max-w-xs lg:max-w-xl flex justify-center mb-4 sm:mb-0">
          <DotLottieReact
            src="https://lottie.host/d65f890a-8ae1-422b-8db9-275bf1b11ef3/yNQ150ROU9.lottie"
            loop
            autoplay
            className="w-3xl pr-0 mr-0"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center px-6  lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-amber-200">
              Add Customer
            </h2>
          </div>

          <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
            <form method="POST" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm/6 font-medium text-amber-200"
                >
                  Customer Id
                </label>
                <div className="mt-2">
                  <input
                    id="id"
                    name="id"
                    // type="number"
                    placeholder="Id"
                    // required
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.id && <p className="text-red-500">{errors.id}</p>}
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm/6 font-medium text-amber-200"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    // required
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="age"
                    className="block text-sm/6 font-medium text-amber-200"
                  >
                    Age
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="age"
                    name="age"
                    // type="number"
                    placeholder="Age"
                    // required
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.age && <p className="text-red-500">{errors.age}</p>}
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
                    placeholder="Email"
                    // required
                    autoComplete="email"
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm/6 font-medium text-amber-200"
                >
                  Upload Image
                </label>
                <div className="mt-2">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    placeholder="Choose File"
                    onChange={handleChange}
                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  value={"submit"}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCustomer;
