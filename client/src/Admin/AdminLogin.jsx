import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
    const navigate = useNavigate();

    // AUTHORIZATION
    useEffect(() => {
        const storedID = localStorage.getItem('id');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedID && storedPassword && expirationDate > new Date() && storedID === "admin" && storedPassword === "rait") {
            navigate('/root')
        }

        else if (storedID && storedPassword && expirationDate > new Date()) {
            if ((storedID === "deplabs@rait" && storedPassword === "rait@deplabs") ||
                (storedID === "commonlabs@rait" && storedPassword === "rait@commonlabs") ||
                (storedID === "accounts@rait" && storedPassword === "rait@accounts") ||
                (storedID === "exam@rait" && storedPassword === "rait@exam") ||
                (storedID === "library@rait" && storedPassword === "rait@library") ||
                (storedID === "store@rait" && storedPassword === "rait@store") ||
                (storedID === "deplib@rait" && storedPassword === "rait@deplib") ||
                (storedID === "tpc@rait" && storedPassword === "rait@tpc")) {

                navigate('/adminrequests')
            }
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('id');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/admin/login');
        }
        // eslint-disable-next-line
    }, []);

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");


    const loginAdmin = async (e) => {
        e.preventDefault();

        if (id === "" || password === "") {
            alert("Enter admin Id and password");
            return;
        }


        if (id === "admin" && password === "rait") {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to three days from now

            localStorage.setItem("id", id);
            localStorage.setItem("password", password);
            localStorage.setItem("expirationDate", expirationDate.toISOString());

            navigate('/root')
            return;
        }
        else if ((id === "deplabs@rait" && password === "rait@deplabs") ||
            (id === "commonlabs@rait" && password === "rait@commonlabs") ||
            (id === "accounts@rait" && password === "rait@accounts") ||
            (id === "exam@rait" && password === "rait@exam") ||
            (id === "library@rait" && password === "rait@library") ||
            (id === "store@rait" && password === "rait@store") ||
            (id === "deplib@rait" && password === "rait@deplib") ||
            (id === "tpc@rait" && password === "rait@tpc")) {


            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to three days from now

            localStorage.setItem("id", id);
            localStorage.setItem("password", password);
            localStorage.setItem("expirationDate", expirationDate.toISOString());

            navigate('/adminrequests')
            return;
        }
        else if ((id === "deplabs@rait" && password !== "rait@deplabs") ||
            (id === "commonlabs@rait" && password !== "rait@commonlabs") ||
            (id === "accounts@rait" && password !== "rait@accounts") ||
            (id === "exam@rait" && password !== "rait@exam") ||
            (id === "library@rait" && password !== "rait@library") ||
            (id === "store@rait" && password !== "rait@store") ||
            (id === "deplib@rait" && password !== "rait@deplib") ||
            (id === "tpc@rait" && password !== "rait@tpc")) {

            alert("Incorrect ID/Password");
            return;

        }
        else {
            alert("Please login through faculty ID/Password")
            return;

        }



    };


    return (
        <>
            <div className="adminloginpage">
                <NavLink to="/login" className="goToAdminBtn"> RAIT Student</NavLink>
                <div className="loginform">
                    <h2>No Dues - Faculty</h2>
                    <form onSubmit={loginAdmin}>
                        <div className="detailslogin">
                            <label htmlFor="rollno">Section ID :</label>
                            <input
                                autoComplete="off"
                                type="text"
                                id="rollno"
                                name="rollno"
                                onChange={(e) => setId(e.target.value)}
                                value={id}
                                placeholder=""
                                className="form-input"
                            />

                            <label htmlFor="password">Password :</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder=""
                                className="form-input"
                            />

                            <input
                                type="submit"
                                value="Submit"
                                className="submit-btn"
                            />
                        </div>
                    </form>
                </div>
                <footer className="madebyFooter">
                    Made by <a href="https://linkedin.com/in/iamhk12" target="_blank" rel="noreferrer" >Himanshu Kothari </a>, <a target="_blank" rel="noreferrer" href="https://linkedin.com/in/nishtharaut" >Nishtha Raut</a>,
                    <a href="https://www.linkedin.com/in/jamal-mydeen-09887924a" target="_blank" rel="noreferrer"> Jamal Mydeen </a>
                </footer>
            </div>
        </>
    );
};

export default AdminLogin;
