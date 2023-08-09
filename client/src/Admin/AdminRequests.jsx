import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminRequests.css';
import NavAdmin from './NavAdmin';

const AdminRequests = () => {
    const navigate = useNavigate();
    const [section, setSection] = useState('');
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        if (requests.length !== 0) {
            if (section === 'tpc') {
                console.log(requests);
            }
        }
        // eslint-disable-next-line
    }, [requests])
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

    useEffect(() => {
        const id = localStorage.getItem('id');
        let parts = id.split('@');
        let x = parts[0];

        setSection(x);
    }, []);

    useEffect(() => {
        if (section) {
            fetchRequests();
        }
        //eslint-disable-next-line
    }, [section]);

    const fetchRequests = () => {
        fetch('http://localhost:5000/adminrequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Store the requests in the state
                setRequests(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const handleApprove = (rollno) => {
        console.log("Making approval req for section:", section);
        // Update the request with the given roll number and set the section value to true
        const requestBody = {
            rollno: rollno,
            section: section,
        };

        // Send the updated request data to the backend
        fetch('http://localhost:5000/updateRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetchRequests(); // Fetch requests after successful update
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <NavAdmin />

            <div className='AR'>
                <div className='adminrequestpage'>
                    <h2>{section.toUpperCase()} Requests</h2>
                    {requests.length > 0 ? requests.map((request) => (
                        <div key={request._id} className='cardx'>
                            <p>Roll Number: <span className='boldtextB'>{request.rollNumber}</span></p>
                            <p>Department: <span className='boldtextB'>{request.department}</span></p>
                            <p>Full Name: <span className='boldtextB'>{request.fullName}</span></p>
                            <p>Class: <span className='boldtextB'>{request.classValue}</span></p>
                            <p>Semester: <span className='boldtextB'>{request.semester}</span></p>
                            <p>Placed: <span className='boldtextB'>{request.areYouPlaced === 1 ? "YES" : "NO"}</span></p>
                            {section === 'tpc' && request.higherStudies && (
                                <p>Higher Studies: <span className='boldtextB'>{request.higherStudies}</span></p>
                            )}
                            {section === 'tpc' && request.areYouPlaced === 1 && (

                                <>

                                    <div className='flexcenterdiv'>
                                        {JSON.parse(request.offerLetter) && JSON.parse(request.offerLetter).name && JSON.parse(request.offerLetter).myfile && (
                                            <>
                                                <p className='fileFor'>Offer Letter</p>
                                                {JSON.parse(request.offerLetter).name.endsWith('.pdf') ? (
                                                    <embed src={JSON.parse(request.offerLetter).myfile} type="application/pdf" />
                                                ) : (
                                                    <img src={JSON.parse(request.offerLetter).myfile} alt='offerLetter' />
                                                )}
                                            </>
                                        )}

                                        {JSON.parse(request.internship) && JSON.parse(request.internship).name && JSON.parse(request.internship).myfile && (
                                            <>
                                                <p className='fileFor'>Internship</p>
                                                {JSON.parse(request.internship).name.endsWith('.pdf') ? (
                                                    <embed src={JSON.parse(request.internship).myfile} type="application/pdf" />
                                                ) : (
                                                    <img src={JSON.parse(request.internship).myfile} alt='internship' />
                                                )}
                                            </>
                                        )}

                                        {JSON.parse(request.letterOfJoining) && JSON.parse(request.letterOfJoining).name && JSON.parse(request.letterOfJoining).myfile && (
                                            <>
                                                <p className='fileFor'>Letter of Joining</p>
                                                {JSON.parse(request.letterOfJoining).name.endsWith('.pdf') ? (
                                                    <embed src={JSON.parse(request.letterOfJoining).myfile} type="application/pdf" />
                                                ) : (
                                                    <img src={JSON.parse(request.letterOfJoining).myfile} alt='letterOfJoining' />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className='flexcenterdiv'>

                                <button onClick={() => handleApprove(request.rollNumber)}>Approve</button>
                            </div>
                        </div>
                    )) : <h3>No pending requests for {section}</h3>}
                </div>
            </div>

        </>
    );
};

export default AdminRequests;
