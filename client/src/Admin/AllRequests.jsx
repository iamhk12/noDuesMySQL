import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavRoot from "./NavRoot";
import "./AllRequests.css";

const AllRequests = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const storedID = localStorage.getItem("id");
        const storedPassword = localStorage.getItem("password");
        const expirationDate = new Date(localStorage.getItem("expirationDate"));

        if (storedID && storedPassword && expirationDate > new Date()) {
            if (storedID === "admin" && storedPassword === "rait") {
                console.log("Good");
            } else {
                localStorage.removeItem("id");
                localStorage.removeItem("password");
                localStorage.removeItem("expirationDate");

                navigate("/admin/login");
            }
        }
        //eslint-disable-next-line
    }, []);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        console.log("Fetching requests");
        try {
            const response = await fetch("http://localhost:5000/getAllRequests");
            const data = await response.json();
            setRequests(data.requests);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handleStatusChange = async (rollNumber, field, value) => {
        console.log("Changing for " + rollNumber + " " + field);
        try {
            await fetch("http://localhost:5000/rootUpdateRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNumber, section: field, value }),
            });
            // Update the specific field in the local state
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.rollNumber === rollNumber ? { ...req, [field]: value } : req
                )
            );
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

    const getStatusLabel = (value) => {
        return (
            <span className={value ? "spanApp" : "spanPen"}>
                {value ? "Approved" : "Pending"}
            </span>
        );
    };
    const [searchQuery, setSearchQuery] = useState("");
    const filteredRequests = requests.filter((request) => {
        return (
            request.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
    return (
        <>
            <NavRoot />
            <div className="allRequestsPage">
                <h2>All Requests</h2>
                <div className="centeringdiv">
                    <div className="searchBox ">
                        <input
                            type="text"
                            placeholder="Search by name or roll number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Full Name</th>
                            <th>Department</th>
                            <th>Class</th>
                            <th>DEP Labs</th>
                            <th>Common Labs</th>
                            <th>Accounts</th>
                            <th>Exam</th>
                            <th>Library</th>
                            <th>DEP Library</th>
                            <th>Store</th>
                            <th>TPC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td>
                                    <span style={{ fontWeight: 780 }}>{request.rollNumber}</span>
                                </td>
                                <td>{request.fullName}</td>
                                <td>{request.department}</td>
                                <td>{request.classValue}</td>
                                <td>
                                    {getStatusLabel(request.deplabs)}
                                    <select
                                        value={request.deplabs === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "deplabs",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.commonlabs)}
                                    <select
                                        value={request.commonlabs === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "commonlabs",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.accounts)}
                                    <select
                                        value={request.accounts === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "accounts",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.exam)}
                                    <select
                                        value={request.exam === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "exam",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.library)}
                                    <select
                                        value={request.library === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "library",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.deplib)}
                                    <select
                                        value={request.deplib === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "deplib",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.store)}
                                    <select
                                        value={request.store === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "store",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.tpc)}
                                    <select
                                        value={request.tpc === 0 ? false : true}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                request.rollNumber,
                                                "tpc",
                                                e.target.value === "true" ? true : false
                                            )
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </>
    );
};

export default AllRequests;
