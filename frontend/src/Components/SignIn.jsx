import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./SignIn.css";

const SignIn = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.padding = "";
      document.body.style.margin = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const[email,setemail]=useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isPhoneNumber = /^\d{10}$/.test(Phonenumber);
 
      if (!isEmail && !isPhoneNumber) {
        setSnackbarData({
          message: isEmail ? "Please enter a valid email" :
                   Phonenumber.match(/^\d+$/) ? "Phone number must be exactly 10 digits" :
                   "Please enter a valid email",
          severity: "error",
        });
        setSnackbarOpen(true);
        return;
      }
 
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: isEmail ? Phonenumber : null,
          phonenumber: isPhoneNumber ? Phonenumber : null,
          password: password
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        dispatch(setUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          token: data.token
        }));
        console.log('Login response:', data);
        setSnackbarData({
          message: `Successful login as ${data.role}!`,
          severity: "success",
        });
        setSnackbarOpen(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setSnackbarData({
          message: data.message || "Login failed. Please try again.",
          severity: "error",
        });
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarData({
        message: "Server connection failed. Please try again later.",
        severity: "error",
      });
      setSnackbarOpen(true);
    }
  };
  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="signin-header">
          <h2 className="signin-heading">Welcome Back!</h2>
          <p className="signin-sub-heading">Sign in to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="signin-input-container">
            <label className="signin-label">Email / Phone Number</label>
            <input
              type="text"
              placeholder="Enter Email or Phone Number"
              value={Phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)||setemail(e.target.value)}
              required
              className="signin-input"
            />
          </div>
          <div className="signin-input-container">
            <div className="signin-password-label-container">
              <label className="signin-label">Password</label>
              <span
                className="signin-forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signin-input"
            />
            <div className="signin-checkbox-container">
              <label className="signin-checkbox-label">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="signin-checkbox"
                />Show Password
              </label>
            </div>
          </div>
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <div className="signin-register-container">
          <p className="signin-register-text">
            Not a user?{" "}
            <span className="signin-register-link" onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        </div>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarData.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;