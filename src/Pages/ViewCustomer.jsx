// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import Navbar from "../Components/Navbar";
import Alert from "../Components/Alert";

function ViewCustomer() {
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "",
    name: "",
    age: "",
    email: "",
    image: null,
  });
  const [customer, SetCustomer] = useState([]);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterAge, setFilterAge] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);

  const onCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };
  useEffect(() => {
    fetchCustomer();
  }, [search, sortField, sortOrder, filterAge, page]);

  const fetchCustomer = async () => {
    const queryParams = new URLSearchParams({
      page,
      size: 3,
      search,
      sortBy: sortField || null,
      order: sortOrder || null,
      filterAge,
    }).toString();

    fetch(`http://localhost:8081/getCustomer?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data : ", data);
        SetCustomer(data.content);
        setTotalPages(data.totalPages);
      });
  };
  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  // const viewCustomer = async (id) => {
  //   const baseURL = "http://localhost:8081/viewCustomer/" + id;
  //   await axios.get(baseURL);
  //   fetchCustomer();
  // };
  const deleteCustomer = async (id) => {
    const baseURL = "http://localhost:8081/deleteCustomer/" + id;
    await axios.get(baseURL);
    fetchCustomer();
  };
  const handleUpdate = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateFormOpen(true);
  };
  const ViewCustomerDetails = async (id) => {
    const baseURL = "http://localhost:8081/viewCustomer/" + id;
    const res = await axios.get(baseURL);
    console.log("res.data", res.data);
    setSelectedCustomer((prev) => ({
      ...prev,
      ...res.data,
    }));
    setIsViewFormOpen(true);
  };
  const closeViewForm = () => {
    setIsViewFormOpen(false);
  };
  const closeUpdateForm = () => {
    setIsUpdateFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedCustomer((prev) => ({
            ...prev,
            [name]: reader.result, // Base64 encoding
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSelectedCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const UpdateCustomer = async (e) => {
    e.preventDefault();
    const baseURL = "http://localhost:8081/updateCustomer";
    try {
      await axios.post(baseURL, selectedCustomer);
      setAlert({ show: true, message: "Customer Updated Successfully" });
      setIsUpdateFormOpen(false);
      fetchCustomer();
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
        setAlert({
          show: true,
          message: err.message + " : " + "Failed to update",
        });
      }
    }
  };

  const exportToPDF = () => {
    axios({
      url: "http://localhost:8081/export/pdf",
      method: "GET",
      responseType: "blob", 
    }).then((response) => {
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.pdf");
      document.body.appendChild(link);
      link.click();
    });
  };

  const exportToExcel = () => {
    axios({
      url: "http://localhost:8081/export/excel",
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };


  return (
    <>
      {/* <Navbar /> */}
      {alert.show && <Alert message={alert.message} onClose={onCloseAlert} />}
      <div className=" flex items-center justify-center py-15.5 bg-[#161633] h-screen">
        <div className="max-w-5xl w-full bg-transparent rounded-lg p-10">
          <h1 className="text-center text-3xl font-bold text-amber-200 mb-10">
            Customers' Data
          </h1>
          <div className="flex text-amber-200 justify-between">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" p-2 mb-3 border-b-1"
            />
            {/* <div className="flex space-x-3 mb-3"> */}
            <select
              onChange={(e) => setSortField(e.target.value)}
              value={sortField}
              className="p-2 rounded"
            >
              <option value="name">Sort by Name</option>
              <option value="id">Sort by ID</option>
              <option value="age">Sort by Age</option>
            </select>
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="p-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <input
              type="number"
              placeholder="Filter by Age"
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className=" p-2 mb-3 border-b-1"
            />
            {/* <select
              // onChange={(e) => setSortOrder(e.target.value)}
              value={""}
              className="p-2 rounded"
            >
              <option value="pdf">To pdf</option>
              <option value="excel">To excel</option>
            </select> */}
            <select
             className="p-2 rounded"
              onChange={(e) => {
                if (e.target.value === "pdf") exportToPDF();
                else if (e.target.value === "excel") exportToExcel();
              }}
            >
              <option value="">Export as...</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
            {/* </div> */}
          </div>
          <div className="overflow-y-scroll max-h-96 hide-scrollbar">
            <ul role="list" className="divide-y divide-gray-100 max-w-5xl">
              {customer.map((customer) => (
                <li
                  key={customer.email}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4 items-center">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="size-12 flex-none rounded-full bg-gray-50 object-cover"
                    />

                    <div className="min-w-0 flex-auto">
                      {/* <p className="text-sm/6 font-semibold text-amber-200">
                        {customer.id}
                      </p> */}
                      <p className="text-sm/6 font-semibold text-amber-200">
                        {customer.name}
                      </p>
                      {/* <p className="mt-1 truncate text-xs/5 text-gray-500">
                        {customer.age} years old
                      </p> */}
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:items-end  justify-between items-center space-x-10 space-y-0.5">
                    <p className="mt-1 truncate text-xs/5 text-gray-500">
                      {customer.email}
                    </p>
                    <div className="flex flex-row space-x-2">
                      <button
                        onClick={() => ViewCustomerDetails(customer.id)}
                        className="mt-1 truncate text-xs/5 text-gray-500 hover: pr-1 pl-1 "
                      >
                        <EyeIcon className="size-6 hover:fill-blue-400" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="mt-1 truncate text-xs/5 text-gray-500 hover: pr-1 pl-1 "
                      >
                        <TrashIcon className="size-6 hover:fill-red-400" />
                      </button>
                      <button
                        onClick={() => handleUpdate(customer)}
                        className="mt-1 truncate text-xs/5 text-gray-500 pr-1 pl-1"
                      >
                        <PencilSquareIcon className="size-6 hover:fill-green-500" />
                      </button>
                      {/* <FontAwesomeIcon icon="fa-regular fa-pen-to-square" /> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="text-amber-200"
              onClick={prevPage}
              disabled={page === 0}
            >
              <ArrowLeftCircleIcon className="size-6" />
            </button>
            <h2 className="text-amber-200">
              {" "}
              {page + 1} / {totalPages}
            </h2>{" "}
            {/* Show 1-based index */}
            <button
              className="text-amber-200"
              onClick={nextPage}
              disabled={page >= totalPages - 1}
            >
              <ArrowRightCircleIcon className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* View Customer */}

      {isViewFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-[#161633] rounded-lg shadow-lg w-full max-w-sm px-6 py-8 right relative">
            <button
              onClick={closeViewForm}
              className="mt-1 truncate text-xs/5 text-gray-500 pr-1 pl-1 absolute right-0 mr-6 mt-0 border-2 rounded-full w-7 h-7 flex"
            >
              <XMarkIcon className="size-6" />
            </button>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="flex flex-col items-center space-y-4">
                <img
                  alt={selectedCustomer.name}
                  src={selectedCustomer.image}
                  className="size-28 flex-none rounded-full object-cover"
                />
                <div className=" flex flex-col justify-evenly">
                  <p className="text-lg font-semibold text-amber-200">
                    Customer Id: {selectedCustomer.id}
                  </p>
                  <p className="text-lg text-gray-500">
                    Name: {selectedCustomer.name}
                  </p>
                  <p className="text-lg text-gray-500">
                    Age: {selectedCustomer.age} years old
                  </p>
                  <p className="text-lg text-gray-500">
                    Email: {selectedCustomer.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"></div>
          </div>
        </div>
      )}

      {/* Update Form */}
      {isUpdateFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-[#161633] rounded-lg shadow-lg w-full max-w-sm px-6 py-8 right relative">
            <button
              onClick={closeUpdateForm}
              className="mt-1 truncate text-xs/5 text-gray-500 pr-1 pl-1 absolute right-0 mr-6 mt-0 border-2 rounded-full w-7 h-7 flex"
            >
              <XMarkIcon className="size-6" />
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight text-amber-200">
                Update Customer
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                method="POST"
                onSubmit={UpdateCustomer}
                className="space-y-6"
              >
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
                      value={selectedCustomer.name}
                      // required
                      onChange={handleChange}
                      className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-100 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
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
                      type="number"
                      placeholder="Age"
                      value={selectedCustomer.age}
                      // required
                      onChange={handleChange}
                      className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-100 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                      type="email"
                      placeholder="Email"
                      value={selectedCustomer.email}
                      // required
                      autoComplete="email"
                      onChange={handleChange}
                      className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-amber-100 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
                {/* <div>
              <label
                htmlFor="file"
                className="block text-sm/6 font-medium text-amber-200"
              >
                image
              </label>
              <div className="mt-2">
                <input
                  id="image"
                  name="image"
                  type="file"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-amber-200 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div> */}

                <div>
                  <button
                    type="submit"
                    value={"submit"}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ViewCustomer;
