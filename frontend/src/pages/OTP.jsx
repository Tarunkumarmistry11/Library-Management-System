import React, { useEffect, useState } from "react";
import lmsLogo from "../assets/Lms logo.png";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message, email]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/register"}
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-40 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12">
              Check your Mailbox
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Enter the OTP sent to your registered email to proceed. Secure
              your access with a quick verification!
            </p>
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="number"
                  value={otp}
                  onchange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold text-white bg-black py-2 rounded-lg hover:bg-white hover:text-black cursor-pointer transition"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-indigo-500 text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
              <img src={lmsLogo} alt="Logo_with_title" className="mb-12 h-44 w-auto" />
            </div>
            <p className="text-gray-300 mb-12">
              New to our platform? Join us today—sign up now and get started!
            </p>
            <Link
              to={"/register"}
              className="border-2 mt-5 border-black px-8 w-full font-semibold text-white bg-black py-2 rounded-lg hover:bg-white hover:text-black cursor-pointer transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
