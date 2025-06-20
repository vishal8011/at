import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Fetch all students
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

    // ✅ Fetch selected student's attendance from backend
    const handleViewAttendance = async (student) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/attendance/student/${student._id}`);
            const data = Array.isArray(res.data) ? res.data : res.data.attendance;
            setSelectedStudent(student);
            setAttendance(data || []);
        } catch (err) {
            console.error("Error fetching attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    const closeAttendance = () => {
        setSelectedStudent(null);
        setAttendance([]);
    };

    return (
        <div style={styles.wrapper}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={styles.card}
            >
                <h1 style={styles.title}>Welcome</h1>

                <div style={styles.buttonRow}>
                    <motion.button onClick={() => navigate("/add-student")} style={styles.glowButton1} whileHover={{ scale: 1.05 }}>Add Student</motion.button>
                    <motion.button onClick={() => navigate("/students")} style={styles.glowButton2} whileHover={{ scale: 1.05 }}>View Students</motion.button>
                    <motion.button onClick={() => navigate("/attendance")} style={styles.glowButton3} whileHover={{ scale: 1.05 }}>Take Attendance</motion.button>
                </div>

                {students.length > 0 && (
                    <div style={styles.listWrapper}>
                        <h3 style={styles.listTitle}>Student List</h3>
                        <ul style={styles.list}>
                            {students.map((s, index) => (
                                <li key={s._id} style={styles.listItem}>
                                    <div style={styles.studentInfo}>
                                        {index + 1}. <strong>{s.name}</strong>
                                        <span> </span>
                                    </div>
                                    <button
                                        onClick={() => handleViewAttendance(s)}
                                        style={styles.attendanceButton}
                                    >
                                        View Attendance
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={styles.attendanceBox}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ color: "#00ffcc" }}>Attendance: {selectedStudent.name}</h3>
                            <button onClick={closeAttendance} style={styles.closeButton}>✖</button>
                        </div>

                        {loading ? (
                            <p style={{ color: "#ccc" }}>Loading...</p>
                        ) : attendance.length === 0 ? (
                            <p style={{ color: "#ccc" }}>No attendance records.</p>
                        ) : (
                            <ul style={styles.attendanceList}>
                                {attendance.map((entry, i) => (
                                    <li key={i} style={styles.attendanceItem}>
                                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                                        <span style={{ fontWeight: "bold", color: entry.status === "Present" ? "lime" : "red" }}>
                                            {entry.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

const glowEffect = {
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 0 12px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.1)",
    transition: "0.3s ease-in-out",
};

const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "#0f2027",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif",
    },
    card: {
        background: "rgba(17, 17, 17, 0.75)",
        backdropFilter: "blur(15px)",
        borderRadius: "20px",
        padding: "30px",
        width: "100%",
        maxWidth: "850px",
        color: "#fff",
        boxShadow: "0 0 30px rgba(0,255,180,0.25)",
    },
    title: {
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "bold",
        color: "#00ffcc",
        marginBottom: "30px",
    },
    buttonRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px",
        marginBottom: "30px",
    },
    glowButton1: {
        background: "linear-gradient(45deg, #00c6ff, #0072ff)",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        ...glowEffect,
    },
    glowButton2: {
        background: "linear-gradient(45deg, #e96443, #904e95)",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        ...glowEffect,
    },
    glowButton3: {
        background: "linear-gradient(45deg, #56ab2f, #a8e063)",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        ...glowEffect,
    },
    listWrapper: {
        marginTop: "20px",
    },
    listTitle: {
        fontSize: "20px",
        color: "#00ff88",
        marginBottom: "12px",
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    listItem: {
        background: "#222",
        padding: "12px",
        marginBottom: "10px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    studentInfo: {
        fontWeight: "500",
        fontSize: "16px",
    },
    courseText: {
        fontStyle: "italic",
        fontSize: "14px",
        color: "#aaa",
    },
    attendanceButton: {
        background: "#00ffcc",
        color: "#000",
        border: "none",
        borderRadius: "6px",
        padding: "6px 12px",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
    },
    attendanceBox: {
        marginTop: "30px",
        padding: "20px",
        background: "#1f2a38",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(0,255,180,0.2)",
    },
    closeButton: {
        background: "transparent",
        border: "none",
        color: "#ff6666",
        fontSize: "20px",
        cursor: "pointer",
    },
    attendanceList: {
        marginTop: "10px",
        listStyle: "none",
        padding: 0,
    },
    attendanceItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        background: "#2e3d4f",
        marginBottom: "8px",
        borderRadius: "8px",
    },
};

export default Home;
