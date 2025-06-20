import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Edit from './editform';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const [SelectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/students");
                setStudents(res.data);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };
        fetchStudents();
    }, []);

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`http://localhost:5000/api/students/${id}`);
                setStudents(students.filter(s => s._id !== id));
            } catch (err) {
                console.error("Error deleting student:", err);
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleSave = (updatedStudent) => {
        setStudents(students.map(s => s._id === updatedStudent._id ? updatedStudent : s));
    };

    return (
        <>
            <style>{`
                body {
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(-45deg, #00b894, #0984e3, #6c5ce7, #fd79a8);
                    background-size: 400% 400%;
                    animation: gradientFlow 15s ease infinite;
                    font-family: 'Segoe UI', sans-serif;
                }

                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <motion.div
                className="student-list"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={styles.container}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                    style={styles.headerRow}
                >
                    <h2 style={styles.title}>🎓 Student List</h2>
                    <motion.button
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            handleClose();
                            navigate("/");
                        }}
                        style={styles.closeBtn}
                    >
                        ×
                    </motion.button>
                </motion.div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Father Name</th>
                                <th>Mother Name</th>
                                <th>Qualification</th>
                                <th>Phone</th>
                                <th>Course</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <motion.tr
                                    key={student._id || index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={styles.tableRow}
                                >
                                    <td style={styles.cell}>{student.name || "-"}</td>
                                    <td style={styles.cell}>{student.dob || "-"}</td>
                                    <td style={styles.cell}>{student.fatherName || "-"}</td>
                                    <td style={styles.cell}>{student.motherName || "-"}</td>
                                    <td style={styles.cell}>{student.qualification || "-"}</td>
                                    <td style={styles.cell}>{student.phone || "-"}</td>
                                    <td style={styles.cell}>{student.course || "-"}</td>
                                    <td style={styles.cell}>{student.duration || "-"}</td>
                                    <td style={styles.cell}>
                                        <button onClick={() => handleEdit(student)} style={buttonStyles.edit}>Edit</button>
                                        <button onClick={() => handleDelete(student._id)} style={buttonStyles.delete}>Delete</button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {IsModalOpen && SelectedStudent && (
                    <Edit
                        isOpen={IsModalOpen}
                        onRequestClose={handleClose}
                        student={SelectedStudent}
                        onSave={handleSave}
                    />
                )}
            </motion.div>
        </>
    );
};

const styles = {
    container: {
        padding: "30px",
        maxWidth: "95%",
        margin: "30px auto",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        boxShadow: "0 0 30px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        overflowX: "auto",
        border: "2px solid rgba(255, 255, 255, 0.3)",
    },
    title: {
        color: "#fff",
        fontSize: "28px",
        fontWeight: "bold",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    closeBtn: {
        background: "#e74c3c",
        color: "#fff",
        fontSize: "20px",
        border: "none",
        borderRadius: "50%",
        width: "38px",
        height: "38px",
        cursor: "pointer",

    },


    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "12px",
        overflow: "hidden",
    },
    tableHeader: {
        backgroundColor: "#2c3e50",
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center",
    },
    tableRow: {
        borderBottom: "1px solid #ddd",
        textAlign: "center",
        fontSize: "14px",
    },
    cell: {
        border: "1px solid #ccc",
        padding: "8px",
        color: "#2c3e50",
        backgroundColor: "#ecf0f1",
    },
};

const buttonStyles = {
    edit: {
        background: "#3498db",
        border: "none",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "10px",
        marginRight: "6px",
    },
    delete: {
        background: "#e74c3c",
        border: "none",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "10px",
    },
};

export default StudentList;
