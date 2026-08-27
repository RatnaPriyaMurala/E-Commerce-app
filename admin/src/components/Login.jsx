import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  FaUserShield,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

const Login = ({ setToken }) => {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        backendUrl + "/api/user/admin",

        {

          email,

          password,

        }

      );

      if (response.data.success) {

        setToken(response.data.token);

      }

      else {

        toast.error(response.data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(error.message);

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-700 to-blue-700">

      <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-10">

        <div className="flex flex-col items-center mb-8">

          <FaUserShield
            className="text-cyan-600 mb-3"
            size={60}
          />

          <h1 className="text-3xl font-bold">
            Fish Mart
          </h1>

          <p className="text-gray-500">
            Admin Login
          </p>

        </div>

        <form
          onSubmit={onSubmitHandler}
          className="space-y-5"
        >

          <div>

            <label className="font-semibold">

              Email

            </label>

            <div className="flex items-center border rounded-lg mt-2 px-3">

              <FaEnvelope className="text-gray-400" />

              <input
                type="email"
                placeholder="admin@email.com"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full px-3 py-3 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="font-semibold">

              Password

            </label>

            <div className="flex items-center border rounded-lg mt-2 px-3">

              <FaLock className="text-gray-400" />

              <input
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full px-3 py-3 outline-none"
              />

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >

            Login

          </button>

        </form>

      </div>

    </div>

  );

};

export default Login;