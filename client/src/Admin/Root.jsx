import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Root.css";
import NavRoot from "./NavRoot";

const Root = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentRequest, setStudentRequest] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://localhost:5000/getAllStudents");
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data.students);
                } else {
                    // Handle error when fetching students
                }
            } catch (error) {
                // Handle error that occurred during the request
            }
        };

        fetchStudents();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const storedID = localStorage.getItem("id");
        const storedPassword = localStorage.getItem("password");
        const expirationDate = new Date(
            localStorage.getItem("expirationDate")
        );

        if (
            storedID &&
            storedPassword &&
            expirationDate > new Date()
        ) {
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

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRowClick = async (student) => {
        setSelectedStudent(student);
        setIsPopupVisible(true);

        try {
            const response = await fetch("http://localhost:5000/getStudentRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rollNumber: student.rollNumber }),
            });

            if (response.ok) {
                const data = await response.json();
                setStudentRequest(data.request);
            } else {
                // Handle error when fetching student request
            }
        } catch (error) {
            // Handle error that occurred during the request
        }
    };

    const filteredStudents = students.filter(
        (student) =>
            student.fullName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            student.rollNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const StudentPopup = ({ student }) => {
        if (!student) {
            return null;
        }

        return (
            <div className="popup">
                <button className="popup_close_btn" onClick={() => setIsPopupVisible(false)}>X</button>

                <div className="popup-content">
                    <div className="student-details">
                        <h3>Student Details</h3>
                        <p>
                            <strong>Roll Number: </strong>
                            {student.rollNumber}
                        </p>
                        <p>
                            <strong>Department: </strong>
                            {student.department}
                        </p>
                        <p>
                            <strong>Name: </strong>
                            {student.fullName}
                        </p>
                        <p>
                            <strong>Class: </strong>
                            {student.classValue}
                        </p>
                        <p>
                            <strong>Passed Out Year: </strong>
                            {student.passedOutYear}
                        </p>
                        <p>
                            <strong>Status: </strong>
                            <span className={student.isCompleted ? "spanApp" : "spanPen"}>
                                {student.isCompleted ? "Approved" : "Pending"}
                            </span>
                        </p>
                    </div>
                    <div className="student-request">
                        <h3>Student Request</h3>
                        {studentRequest ? (
                            <div>
                                <p>
                                    <strong>Placed? </strong>
                                    <span className={studentRequest.areYouPlaced ? "spanApp" : "spanPen"}>
                                        {studentRequest.areYouPlaced ? "Yes" : "No"}
                                    </span>
                                </p>
                                <p>
                                    <strong>DEP Labs: </strong>
                                    <span className={studentRequest.deplabs ? "spanApp" : "spanPen"}>
                                        {studentRequest.deplabs ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Common Labs: </strong>
                                    <span className={studentRequest.commonlabs ? "spanApp" : "spanPen"}>
                                        {studentRequest.commonlabs ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Accounts: </strong>
                                    <span className={studentRequest.accounts ? "spanApp" : "spanPen"}>
                                        {studentRequest.accounts ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Exam: </strong>
                                    <span className={studentRequest.exam ? "spanApp" : "spanPen"}>
                                        {studentRequest.exam ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Library: </strong>
                                    <span className={studentRequest.library ? "spanApp" : "spanPen"}>
                                        {studentRequest.library ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>DEP Library: </strong>
                                    <span className={studentRequest.deplib ? "spanApp" : "spanPen"}>
                                        {studentRequest.deplib ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Store: </strong>
                                    <span className={studentRequest.store ? "spanApp" : "spanPen"}>
                                        {studentRequest.store ? "Approved" : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    <strong>TPC: </strong>
                                    <span className={studentRequest.tpc ? "spanApp" : "spanPen"}>
                                        {studentRequest.tpc ? "Approved" : "Pending"}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p>No request found.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <>
            <NavRoot />
            <div className="rootPage">
                <h1 className="head" style={{ textAlign: "center" }}>
                    All Students
                </h1>

                <div className="root_content">
                    <input
                        type="text"
                        placeholder="Search by Name or Roll Number"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Dep</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Passed Out Year</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <>
                                    <tr
                                        key={student.rollNumber}
                                        onClick={() => handleRowClick(student)}
                                    >
                                        <td>{student.rollNumber}</td>
                                        <td>{student.department}</td>
                                        <td>{student.fullName}</td>
                                        <td>{student.classValue}</td>
                                        <td>{student.passedOutYear}</td>
                                        <td
                                            className={
                                                student.isCompleted ? "spanApp" : "spanPen"
                                            }
                                        >
                                            {student.isCompleted ? "Approved" : "Pending"}
                                        </td>
                                        
                                    </tr>
                                    
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isPopupVisible && (
                    <StudentPopup student={selectedStudent} />
                )}
            </div>

        </>
    );
};

export default Root;
