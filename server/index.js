const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = process.env.PORT || 5000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'noDues',
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// const app = express.app();
// app.use(cors());

app.post('/student/login', async (req, res) => {
    const { rollNumber, password } = req.body;

    const sqlQuery = "SELECT * FROM students WHERE rollNumber = ?";
    const values = [rollNumber];

    connection.query(sqlQuery, values, async (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            // Student does not exist, create a new student record with the default password and empty fields
            const newStudent = {
                rollNumber,
                password: 'dypatil@123',
                fullName: '',
                department: '',
                classValue: '',
                passedOutYear: '',
                postalAddress: '',
                email: '',
                semester: '',
                phone: '',
                date: null,
                feeReceiptNumber: '',
                amount: '',
                areYouPlaced: false,
                offerLetter: JSON.stringify({}),
                internship: JSON.stringify({}),
                letterOfJoining: JSON.stringify({}),
                isFilled: false,
                isCompleted: false
            };

            const insertQuery = "INSERT INTO students SET ?";
            connection.query(insertQuery, newStudent, (err, insertResult) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.json({ authenticated: true, created: true }); // Authentication successful and a new student record is created
            });
        } else {
            // Student exists, check the password
            if (results[0].password === password) {
                return res.json({ authenticated: true, created: false }); // Authentication successful
            } else {
                return res.json({ authenticated: false }); // Authentication failed
            }
        }
    });
});

app.post('/submitform', async (req, res) => {
    try {
        const {
            rollNumber,
            fullName,
            department,
            classValue,
            passedOutYear,
            postalAddress,
            email,
            semester,
            phone,
            date,
            feeReceiptNumber,
            amount,
            isPursuingHS,
            higherStudies,
            areYouPlaced,
            offerLetter,
            internship,
            letterOfJoining
        } = req.body;

        // Check if the student exists in the database
        const sqlQueryStudent = "SELECT * FROM students WHERE rollNumber = ?";
        const studentValues = [rollNumber];

        connection.query(sqlQueryStudent, studentValues, async (err, studentResults) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (studentResults.length === 0) {
                res.status(404).json({ message: 'Student not found' });
                return;
            }

            // Update the student record with the form data
            const sqlUpdateStudent = `UPDATE students SET
          fullName = ?,
          classValue = ?,
          department = ?,
          passedOutYear = ?,
          postalAddress = ?,
          email = ?,
          semester = ?,
          phone = ?,
          date = ?,
          feeReceiptNumber = ?,
          amount = ?,
          isPursuingHS = ?,
          higherStudies = ?,
          areYouPlaced = ?,
          offerLetter = ?,
          internship = ?,
          letterOfJoining = ?,
          isFilled = ?
          WHERE rollNumber = ?`;

            const studentUpdateValues = [
                fullName,
                classValue,
                department,
                passedOutYear,
                postalAddress,
                email,
                semester,
                phone,
                date,
                feeReceiptNumber,
                amount,
                isPursuingHS,
                higherStudies,
                areYouPlaced === true ? 1 : 0,
                JSON.stringify(offerLetter),
                JSON.stringify(internship),
                JSON.stringify(letterOfJoining),
                true,
                rollNumber
            ];

            connection.query(sqlUpdateStudent, studentUpdateValues, async (err, studentUpdateResult) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if a request record exists for the student
                const sqlQueryRequest = "SELECT * FROM requests WHERE rollNumber = ?";
                const requestValues = [rollNumber];

                connection.query(sqlQueryRequest, requestValues, async (err, requestResults) => {
                    if (err) {
                        console.error("Error executing MySQL query:", err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    if (requestResults.length === 0) {
                        // Create a new request record for the student with the form data
                        const sqlInsertRequest = `INSERT INTO requests (
                rollNumber,
                fullName,
                classValue,
                department,
                semester,
                areYouPlaced,
                deplabs,
                commonlabs,
                accounts,
                exam,
                library,
                deplib,
                store,
                tpc
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                        const requestInsertValues = [
                            rollNumber,
                            fullName,
                            classValue,
                            department,
                            semester,
                            areYouPlaced,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false
                        ];

                        connection.query(sqlInsertRequest, requestInsertValues, async (err, requestInsertResult) => {
                            if (err) {
                                console.error("Error executing MySQL query:", err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }

                            res.status(200).json({ message: 'Form submitted successfully' });
                        });
                    } else {
                        // Update the existing request record with the form data
                        const sqlUpdateRequest = `UPDATE requests SET
                fullName = ?,
                classValue = ?,
                department = ?,
                semester = ?,
                deplabs = ?,
                commonlabs = ?,
                accounts = ?,
                exam = ?,
                library = ?,
                deplib = ?,
                store = ?,
                tpc = ?
                WHERE rollNumber = ?`;

                        const requestUpdateValues = [
                            fullName,
                            classValue,
                            department,
                            semester,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            rollNumber
                        ];

                        connection.query(sqlUpdateRequest, requestUpdateValues, async (err, requestUpdateResult) => {
                            if (err) {
                                console.error("Error executing MySQL query:", err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }

                            res.status(200).json({ message: 'Form submitted successfully' });
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post("/checkDefaulter", async (req, res) => {
    const { rollNumber } = req.body;

    const sqlQuery = "SELECT * FROM defaulters WHERE rollNumber = ?";
    const values = [rollNumber];

    connection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            const updateQuery = "UPDATE requests SET deplabs = ?, commonlabs = ?, accounts = ?, exam = ?, library = ?, deplib = ?, store = ?, tpc = ? WHERE rollNumber = ?";
            const updateValues = [1, 1, 1, 1, 1, 1, 1, 0, rollNumber];

            connection.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) {
                    console.error("Error updating sections:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // console.log("Updated all sections to true.");
                return res.status(200).json({ message: 'All sections updated to true for non-defaulter' });
            });
        } else {
            // If student is a defaulter, update sections based on defaulter status
            const defaulter = results[0];

            // Iterate over each section and check if it's 0
            const sectionsToUpdate = [];
            for (const [key, value] of Object.entries(defaulter)) {
                if (key !== "rollNumber" && value === 0) {
                    sectionsToUpdate.push(key);
                }
            }

            // Update each section that needs to be updated to 1 (not defaulter)
            sectionsToUpdate.forEach((section) => {
                if (section !== "tpc") {
                    const updateQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
                    const updateValues = [1, rollNumber]; // Update the section to 1 (not defaulter)

                    connection.query(updateQuery, updateValues, (err, updateResult) => {
                        if (err) {
                            console.error(`Error updating ${section} section:`, err);
                        } else {
                            console.log(`Updated ${section} section.`);
                        }
                    });
                }
            });

            return res.status(200).json({ updatedSections: sectionsToUpdate, defaulter });
        }
    });
});



app.post('/updateRequest', async (req, res) => {
    try {
        const { rollno, section } = req.body;

        const sqlQuery = 'SELECT * FROM requests WHERE rollNumber = ?';
        const values = [rollno];

        connection.query(sqlQuery, values, async (err, results) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ error: 'Failed to update request' });
            }

            const request = results[0];

            if (!request) {
                return res.status(405).json({ error: 'Request not found' });
            }

            request[section] = true;

            const updateQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
            const updateValues = [true, rollno];

            connection.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) {
                    console.error("Error executing MySQL update query:", err);
                    return res.status(500).json({ error: 'Failed to update request' });
                }

                return res.json({ ...request, [section]: true });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update request' });
    }
});

app.post('/getStudent', async (req, res) => {
    const { rollNumber } = req.body;

    const sqlQuery = "SELECT * FROM students WHERE rollNumber = ?";
    const values = [rollNumber];

    connection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Student not found" });
        }

        return res.status(200).json(results[0]);
    });
});

app.post('/getStudentRequest', async (req, res) => {
    const { rollNumber } = req.body;

    const sqlQuery = "SELECT * FROM requests WHERE rollNumber = ?";
    const values = [rollNumber];

    connection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        return res.status(200).json({ success: true, request: results[0] });
    });
});

app.post('/adminrequests', async (req, res) => {
    try {
        const { section } = req.body;

        let sqlQuery;
        let values = [];

        // Find requests with false in the given section
        if (section !== 'tpc') {
            sqlQuery = `SELECT * FROM requests WHERE ${section} = ?`;
            values = [false];
        } else if (section === 'tpc') {
            sqlQuery = `SELECT * FROM requests WHERE tpc = ?`;
            values = [false];
        }

        connection.query(sqlQuery, values, async (err, results) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ message: 'Server Error' });
            }

            let request = results;

            if (section === 'tpc') {
                for (let i = 0; i < request.length; i++) {
                    if (request[i]) {

                        const studentQuery = `SELECT * FROM students WHERE rollNumber = ?`;
                        const studentValues = [request[i].rollNumber];
                        const [studentResult] = await connection.promise().query(studentQuery, studentValues);

                        const temp = studentResult[0];

                        const newrequest = {
                            rollNumber: request[i].rollNumber,
                            fullName: request[i].fullName,
                            department: request[i].department,
                            classValue: request[i].classValue,
                            semester: request[i].semester,
                            areYouPlaced: request[i].areYouPlaced,
                            deplabs: request[i].deplabs,
                            commonlabs: request[i].commonlabs,
                            accounts: request[i].accounts,
                            exam: request[i].exam,
                            library: request[i].library,
                            deplib: request[i].deplib,
                            store: request[i].store,
                            tpc: request[i].tpc,
                            higherStudies : temp.higherStudies,
                            offerLetter: temp.offerLetter,
                            internship: temp.internship,
                            letterOfJoining: temp.letterOfJoining
                        };

                        request[i] = newrequest;
                    }
                }
            }

            res.status(200).json(request);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/rootUpdateRequest', async (req, res) => {

    const { rollNumber, section, value } = req.body;
    console.log("Changing for " + rollNumber + " " + section + " making it " + value)

    const sqlQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
    const values = [value, rollNumber];

    connection.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json(result);
    });
});

app.post('/student/changePassword', async (req, res) => {
    const { rollNumber, currentPassword, newPassword } = req.body;

    const sqlQuery = "SELECT * FROM students WHERE rollNumber = ? AND password = ?";
    const values = [rollNumber, currentPassword];

    connection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid current password' });
        }

        const updateQuery = "UPDATE students SET password = ? WHERE rollNumber = ?";
        const updateValues = [newPassword, rollNumber];

        connection.query(updateQuery, updateValues, (err, updateResult) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ passwordChanged: true });
        });
    });
});

app.post('/updateIsComp', async (req, res) => {
    const { rollNumber } = req.body;

    const sqlQuery = "UPDATE students SET isCompleted = 1 WHERE rollNumber = ?";
    const values = [rollNumber];

    connection.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ message: 'Student document updated successfully.' });
    });
});
app.get('/getAllStudents', async (req, res) => {
    const sqlQuery = "SELECT * FROM students";

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ students: results });
    });
});
app.get('/getAllRequests', async (req, res) => {
    const sqlQuery = "SELECT * FROM requests";

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ requests: results });
    });
});


app.post('/addDefaulter', (req, res) => {
    const { rollNumber, name, section } = req.body;

    if (!rollNumber || !section) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sqlQuery = 'SELECT * FROM defaulters WHERE rollNumber = ?';
    const values = [rollNumber];

    connection.query(sqlQuery, values, async (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            const newStudent = {
                rollNumber,
                name,
                [section]: true
            };

            const insertQuery = 'INSERT INTO defaulters SET ?';
            connection.query(insertQuery, newStudent, (err, insertResult) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.status(200).json({ message: 'Success' });
            });
        }
        else {
            const updateQuery = `UPDATE defaulters SET ${section} = ? WHERE rollNumber = ?`;
            const updateValues = [true, rollNumber];

            connection.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.status(200).json({ message: 'Success' });
            });
        }
    });
});


app.listen(port, () => {
    console.log("Listening on port:", port);
});