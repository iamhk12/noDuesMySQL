import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/NavB';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import saveAs from 'file-saver';
import './Request.css';
const Request = () => {
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [isC, setIsC] = useState(false);
    const [STUDENTDATA, setstudentData] = useState(null);
    useEffect(() => {
        const fetchStudentData = async () => {
            const storedRollNumber = localStorage.getItem('rollno');
            const storedPassword = localStorage.getItem('password');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (storedRollNumber && storedPassword && expirationDate > new Date()) {
                try {
                    const response = await fetch('http://localhost:5000/getStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rollNumber: storedRollNumber }),
                    });

                    if (response.ok) {
                        const student = await response.json();
                        // Check if stored password matches fetched student data password
                        if (storedPassword === student.password) {
                            console.log("Good")
                            if (!student.isFilled) {
                                navigate('/form');
                            }
                        } else {
                            navigate('/logout');
                        }
                        setstudentData(student);
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error);
                    // Handle error that occurred during the request
                }
            } else {
                // Clear the stored values if expired or not present
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');
                navigate('/');
            }
        };

        fetchStudentData();
    }, [navigate]);

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollno');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedRollNumber && storedPassword && expirationDate > new Date()) {
            getStudentRequest(storedRollNumber);
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   

    const getStudentRequest = async (rollNumber) => {
        const response = await fetch('http://localhost:5000/getStudentRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rollNumber }),
        });

        if (response.status === 401) navigate('/');

        if (response.ok) {
            const { request } = await response.json();
            setRequest(request);
            // Check if all boolean values in the request object are true
            const allTrue = request.deplabs && request.commonlabs && request.accounts && request.exam && request.library && request.deplib && request.store && request.tpc;
            console.log("Alltrue = " + allTrue)

            // Update isCompleted field of the associated Student document if all values are true
            if (allTrue) {
                try {
                    const studentResponse = await fetch('http://localhost:5000/updateIsComp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rollNumber }),
                    });

                    if (studentResponse.ok) {
                        console.log('Student document updated.');
                        setIsC(true);
                    } else {
                        console.log('Error updating student document.');
                    }
                } catch (error) {
                    // Handle error that occurred during student document update request
                    console.log('Error updating student document:', error);
                }
            }

        } else {
            // Handle request fetch error
            console.log('Error fetching student request.');
        }
    };
    const generateDocument = () => {
        let templateFile;
        if (STUDENTDATA.department === 'Computer' )
            templateFile = '/documents/ce_form.docx';
        if (STUDENTDATA.department === 'Electronics')
            templateFile = '/documents/el_form.docx';
        if (STUDENTDATA.department === 'Instrumentation')
            templateFile = '/documents/inst_form.docx';
        if (STUDENTDATA.department === 'EXTC')
            templateFile = '/documents/extc_form.docx';
        if (STUDENTDATA.department === 'IT')
            templateFile = '/documents/it_form.docx';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', templateFile, true);
        xhr.responseType = 'arraybuffer';
        // let rollno_ = STUDENTDATA.rollno_;

        xhr.onload = function () {
            const buffer = xhr.response;
            const zip = new PizZip(buffer);
            const doc = new Docxtemplater().loadZip(zip);

            // Modify the form fields data here
            doc.setData({
                fullName: STUDENTDATA.fullName || '', // Full Name
                date: new Date().toLocaleDateString(), // Current Date
                classValue: STUDENTDATA.classValue || '', // Class
                rollNumber: STUDENTDATA.rollNumber || '', // Roll Number
                passedOutMonthYear: `${STUDENTDATA.passedOutYear || ''}`, // Passed out in (Month & Year)
                semester: STUDENTDATA.semester || '', // Semester
                examSeatNo: '', // Exam Seat No - Not provided in the object
                postalAddress: STUDENTDATA.postalAddress || '', // Postal Address
                email: STUDENTDATA.email || '', // Email ID
                telMobileNo: STUDENTDATA.phone || '', // Tel / Mobile No
                feeReceiptNo: STUDENTDATA.feeReceiptNumber || '', // B.E. Fee Receipt No
                feeReceiptDate: STUDENTDATA.date || '', // Date
                feeAmount: STUDENTDATA.amount || '', // Amount
            });

            try {
                doc.render();
            } catch (error) {
                console.log(error);
                return;
            }

            const out = doc.getZip().generate({
                type: 'blob', // Generate a Blob instead of a Node.js buffer
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            saveAs(out, (STUDENTDATA.rollNumber) + '_form.docx');
        };

        xhr.send();
    };

    return (
        <>
            <Nav />
            {request && (
                <div className='requestpage'>
                    <div className='req'>
                        <h2 className='reqhead'>Request Details</h2>

                        <p className='formSTAT'>STATUS : <span className={(STUDENTDATA && STUDENTDATA.isCompleted) || (isC) ? "COMPLETED" : "PENDING"}>{(STUDENTDATA && STUDENTDATA.isCompleted) || (isC) ? "COMPLETED" : "PENDING"}</span></p>

                        { (STUDENTDATA && STUDENTDATA.isCompleted) || (isC) ? <div className='centeringdiv'><button className='downLoadBTN' onClick={generateDocument}>Download Form</button></div> : " "}

                        
                        <p>Roll Number: <span className='boldtext'>{request.rollNumber}</span></p>
                        <p>Full Name:<span className='boldtext'> {request.fullName}</span></p>
                        <p>Department:<span className='boldtext'> {request.department}</span></p>
                        <p>Class: <span className='boldtext'>{request.classValue}</span></p>
                        <p>Semester: <span className='boldtext'>{request.semester}</span></p>
                        <p>Departmental Labs: <span className={request.deplabs ? 'approved boldtext' : 'pending boldtext'}>{request.deplabs ? 'Approved' : 'Pending'}</span></p>
                        <p>FE Labs: <span className={request.commonlabs ? 'approved boldtext' : 'pending boldtext'}>{request.commonlabs ? 'Approved' : 'Pending'}</span></p>
                        <p>Accounts section: <span className={request.accounts ? 'approved boldtext' : 'pending boldtext'}>{request.accounts ? 'Approved' : 'Pending'}</span></p>
                        <p>Exam section: <span className={request.exam ? 'approved boldtext' : 'pending boldtext'}>{request.exam ? 'Approved' : 'Pending'}</span></p>
                        <p>Library : <span className={request.library ? 'approved boldtext' : 'pending boldtext'}>{request.library ? 'Approved' : 'Pending'}</span></p>
                        <p>Departmental Library : <span className={request.deplib ? 'approved boldtext' : 'pending boldtext'}>{request.deplib ? 'Approved' : 'Pending'}</span></p>
                        <p>Store : <span className={request.store ? 'approved boldtext' : 'pending boldtext'}>{request.store ? 'Approved' : 'Pending'}</span></p>
                        <p>Training & Placements : <span className={request.tpc ? 'approved boldtext' : 'pending boldtext'}>{request.tpc ? 'Approved' : 'Pending'}</span></p>


                    </div>
                </div>
            )}
        </>
    );

};

export default Request;
