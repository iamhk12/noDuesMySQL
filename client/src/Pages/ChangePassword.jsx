import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import Nav from "../components/Nav";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the passwords
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Get the rollNumber from local storage
    const rollNumber = localStorage.getItem("rollno");

    try {
      const response = await fetch("http://localhost:5000/student/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollNumber, currentPassword, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.passwordChanged) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          alert("Password Changed successfully, Please login again.")
          navigate("/logout");
        } else {
          alert("Failed to change password");
        }
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while changing the password");
    }
  };

  return (
    <>
      <Nav />
      <div className="changepasswordpage">
        <div className="changepasswordform">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="changepassworddetails">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
              />

              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />

              <input type="submit" value="Change Password" className="submit-btn" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
