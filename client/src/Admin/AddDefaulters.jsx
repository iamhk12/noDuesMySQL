import React, { useState, useEffect } from "react"
import Nav from "./NavAdmin"
import { useNavigate } from "react-router-dom";
import "./AddDefaulters.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDefaulter = () => {

    const [section, setSection] = useState("")
    const [rollNumber, setRollNumber] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        const storedID = localStorage.getItem('id');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedID && storedPassword && expirationDate > new Date()) {
            if ((storedID === "deplabs@rait" && storedPassword === "rait@deplabs") ||
                (storedID === "commonlabs@rait" && storedPassword === "rait@commonlabs") ||
                (storedID === "accounts@rait" && storedPassword === "rait@accounts") ||
                (storedID === "exam@rait" && storedPassword === "rait@exam") ||
                (storedID === "library@rait" && storedPassword === "rait@library") ||
                (storedID === "store@rait" && storedPassword === "rait@store") ||
                (storedID === "deplib@rait" && storedPassword === "rait@deplib") ||
                (storedID === "tpc@rait" && storedPassword === "rait@tpc")) {


            } else {
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');

                navigate('/admin/login');
            }
        }

        Verify();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const id = localStorage.getItem('id');
        let parts = id.split('@');
        let x = parts[0];

        setSection(x);
    }, []);


    const Verify = () => {
        const storedID = localStorage.getItem('id');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedID && storedPassword && expirationDate > new Date()) {
            // Continue with the logged-in user flow
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/admin/login');
        }
    };

    const handleRollnoChange = (e) => {
        const inputValue = e.target.value;
        const uppercaseRollno = inputValue.replace(/\s/g, "").toUpperCase();
        setRollNumber(uppercaseRollno);
    };


    const defaulterSubmit = async (e) => {
        e.preventDefault();

        if (!rollNumber || !section) {
            alert("Enter Roll Number");
            return;
        }

        // Prepare the data to be sent to the server
        const formData = {
            rollNumber: rollNumber,
            name: name,
            section: section,
        };

        try {
            // Send a POST request to the server
            const response = await fetch("http://localhost:5000/addDefaulter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Defaulter added successfully!', {
                    position: 'top-right',
                    autoClose: 1600, 
                    pauseOnHover : false
                });
                setRollNumber("");
                setName("");
            } else {
                alert("Failed to add defaulter. Please try again later.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again later.");
        }
    };


    return (
        <>
            <Nav />
            <div className="adddefpage">
                <ToastContainer />
                <div className="defForm">
                    <h4>Add Defaulter : {section.toUpperCase()} </h4>
                    <form onSubmit={defaulterSubmit}>
                        <div className="detailslogin">
                            <label htmlFor="rollno">Roll Number <span className='reqstar'> * </span> </label>
                            <input
                                autoComplete="off"
                                type="text"
                                id="rollno"
                                name="rollno"
                                onChange={handleRollnoChange}
                                value={rollNumber}
                                placeholder="Enter Student Roll Number"
                                className="form-input"
                            />

                            <label htmlFor="name">Name :</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder="Enter Student Name"
                                className="form-input"
                            />
                            <div className="centeringdiv"><input
                                type="submit"
                                value="Add Defaulter"
                                className="submit-btn"
                            /></div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default AddDefaulter