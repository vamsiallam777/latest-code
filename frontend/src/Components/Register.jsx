import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../Components/Register.css";

const Registration = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    return () => {
      document.body.style.margin = "";
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email.includes("@")) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phonenumber)) {
      setPhoneError("Phone number must be 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,12}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 4-12 characters, include at least one capital letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePhoneNumber();
    validatePassword();
    validateConfirmPassword();
    if (emailError || phoneError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phonenumber,
          password,
          role
        }),
      });

      console.log('Registration request payload:', {
        name, email, phonenumber, role
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      if (response.ok) {
        const data = isJson ? await response.json() : await response.text();
        console.log('Registration response:', data);

        setSnackbarData({
          message: `${data.message || "Registration successful!"} as ${role}`,
          severity: "success",
        });
        setSnackbarOpen(true);

        setTimeout(() => {
          setSnackbarData({
            message: "Navigating to login...",
            severity: "info",
          });
          setSnackbarOpen(true);

          setTimeout(() => navigate("/login"), 2000);
        }, 2000);
      } else {
        const errorData = isJson ? await response.json() : await response.text();
        setSnackbarData({
          message: errorData.error || "Registration failed.",
          severity: "error",
        });
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarData({
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-box">
        <div className="reg-header">
          <h2 className="reg-heading">Welcome!</h2>
          <p className="reg-subheading">Register here to access the account</p>
        </div>
        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-row">
            <div className="reg-input-container">
              <label className="reg-label">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="reg-input"
              />
            </div>
            <div className="reg-input-container">
              <label className="reg-label">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                required
                className="reg-input"
              />
              {emailError && <p className="reg-error">{emailError}</p>}
            </div>
          </div>
          <div className="reg-input-container">
            <label className="reg-label">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              onBlur={validatePhoneNumber}
              required
              className="reg-input"
            />
            {phoneError && <p className="reg-error">{phoneError}</p>}
          </div>
          <div className="reg-row">
            <div className="reg-input-container">
              <label className="reg-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                required
                className="reg-input"
              />
              {passwordError && <p className="reg-error">{passwordError}</p>}
            </div>
            <div className="reg-input-container">
              <label className="reg-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
                required
                className="reg-input"
              />
              {confirmPasswordError && (
                <p className="reg-error">{confirmPasswordError}</p>
              )}
            </div>
          </div>
          <div className="reg-show-password-container">
            <label className="reg-show-password-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="reg-checkbox"
              />{" "}
              Show Password
            </label>
          </div>
          <div className="reg-input-container">
            <label className="reg-label">Role</label>
            <div className="reg-radio-container">
              <label className="reg-radio-label">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="reg-radio-button"
                />{" "}
                Admin
              </label>
              <label className="reg-radio-label">
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="reg-radio-button"
                />{" "}
                Student
              </label>
            </div>
          </div>
          <button type="submit" className="reg-button">
            Register
          </button>
        </form>
        <p className="reg-already-text">
          Already have an account?{" "}
          <span className="reg-link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarData.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Registration;