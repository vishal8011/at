import React, { useState, useEffect } from "react";
import axios from "axios";



import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/students")
            .then(res => {
                const updatedStudents = res.data.map(student => ({
                    ...student,
                    status: "", // For UI selection
                }));
                setStudents(updatedStudents);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage("❌ Failed to fetch student data.");
                setLoading(false);
            });

        // Inject gradient animation keyframes only once
        if (!document.getElementById("gradientMoveKeyframes")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "gradientMoveKeyframes";
            styleSheet.innerText = `
                @keyframes gradientMove {
                    0% {background-position: 0% 50%;}
                    50% {background-position: 100% 50%;}
                    100% {background-position: 0% 50%;}
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    const handleStatusChange = (id, status) => {
        const updated = students.map(s =>
            s._id === id ? { ...s, status } : s
        );
        setStudents(updated);
    };

    const handleSubmit = async () => {
        const studentsWithStatus = students
            .filter(s => s.status === "Present" || s.status === "Absent" || s.status === "Leave")
            .map(s => ({ _id: s._id, status: s.status }));

        if (studentsWithStatus.length === 0) {
            setMessage("⚠️ Please mark attendance for at least one student.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/submit-attendance", {
                students: studentsWithStatus,
            });

            if (res.data.success) {
                setMessage("✅ Attendance submitted successfully!");
            } else {
                setMessage("❌ Submission failed.");
            }
        } catch (err) {
            console.error("❌ Error submitting attendance:", err);
            setMessage("❌ Server error while submitting attendance.");
        }
    };

    const handleClose = () => {
        setMessage("Redirecting to Home...");
        setTimeout(() => navigate("/"), 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.wrapper}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={styles.card}
            >
                <div style={styles.headerRow}>
                    <h2 style={styles.heading}>Attendance Dashboard</h2>
                    <motion.button
                        style={styles.closeBtn}
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                    >
                        ×
                    </motion.button>
                </div>

                {message && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        style={styles.message}
                    >
                        {message}
                    </motion.p>
                )}

                {loading ? (
                    <p style={{ textAlign: "center" }}>⏳ Loading students...</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Student Name</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            backgroundColor:
                                                student.status === "Present"
                                                    ? "#e0ffe0"
                                                    : student.status === "Absent"
                                                        ? "#ffe0e0"
                                                        : student.status === "Leave"
                                                            ? "#ffe0e0"
                                                            : "transparent",
                                        }}
                                    >
                                        <td style={styles.td}>{student.name}</td>
                                        <td style={{ ...styles.td, ...styles.radioGroup }}>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    value="Present"
                                                    checked={student.status === "Present"}
                                                    onChange={() => handleStatusChange(student._id, "Present")}
                                                />
                                                <span>Present</span>
                                            </label>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    value="Absent"
                                                    checked={student.status === "Absent"}
                                                    onChange={() => handleStatusChange(student._id, "Absent")}
                                                />
                                                <span>Absent</span>
                                            </label>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    value="Leave"
                                                    checked={student.status === "Leave"}
                                                    onChange={() => handleStatusChange(student._id, "Leave")}
                                                />
                                                <span>Leave</span>
                                            </label>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <motion.div
                    style={{ textAlign: "center", marginTop: "20px" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <button style={styles.okBtn} onClick={handleSubmit}>
                        Submit Attendance
                    </button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(-45deg, #1e3c72, #2a5298, #00c6ff, #0072ff)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",
        padding: "20px",
    },
    card: {
        background: "#fff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "700px",
        position: "relative",
        overflowX: "auto",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    heading: {
        fontSize: "22px",
        color: "#1e3c72",
        fontWeight: "bold",
    },
    closeBtn: {
        background: "#e74c3c",
        color: "#fff",
        fontSize: "20px",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        cursor: "pointer",
    },
    message: {
        color: "#27ae60",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "16px",
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    th: {
        textAlign: "left",
        padding: "14px",
        background: "#2a5298",
        color: "#fff",
        fontSize: "15px",
        minWidth: "150px",
    },
    td: {
        padding: "14px",
        borderBottom: "1px solid #ccc",
        fontSize: "14px",
    },
    radioGroup: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },
    radioLabel: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#000",
    },
    okBtn: {
        background: "#1abc9c",
        color: "#fff",
        fontSize: "15px",
        padding: "10px 25px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
};

export default AttendancePage;
