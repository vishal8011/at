import React, { useState } from "react";
import axios from "axios";





import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckStudent = () => {
    const [studentName, setStudentName] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setError("");

        try {
            const res = await axios.get(`http://localhost:5000/api/attendance/name/${studentName}`);
            setResult(res.data);
        } catch (err) {
            setError("Student not found or error fetching data.");
        }
    };

    const handleClose = () => {
        navigate("/");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={styles.container}
        >
            <div style={styles.headerRow}>
                <h2 style={styles.title}> Check Student Attendance</h2>
                <motion.button
                    onClick={handleClose}
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    style={styles.closeBtn}
                >
                    ×
                </motion.button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <motion.input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Student Name"
                    style={styles.input}
                    whileFocus={{ scale: 1.03 }}
                />
                <motion.button
                    type="submit"
                    style={styles.button}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Check
                </motion.button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            {result && (
                <motion.div
                    style={styles.result}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p><strong> Name:</strong> {result.name}</p>
                    <p><strong> Course:</strong> {result.course}</p>
                    <p>
                        <strong> Status:</strong>{" "}
                        <span style={{ color: result.status === "Present" ? "#00ff99" : "#ff5555" }}>
                            {result.status}
                        </span>
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

const styles = {
    container: {
        background: "linear-gradient(to bottom right, #1a1a1a, #0f0f0f)",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        fontFamily: "Segoe UI, sans-serif",
    },
    title: {
        fontSize: "30px",
        color: "#ff6b6b",
        marginBottom: "10px",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "500px",
        alignItems: "center",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "20px",
    },
    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solidrgb(255, 107, 107)",
        width: "250px",
        backgroundColor: "#222",
        color: "#fff",
        outline: "none",
        transition: "0.3s",
    },
    button: {
        padding: "12px 24px",
        background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px",
    },
    result: {
        background: "#1c1c1c",
        padding: "24px",
        borderRadius: "14px",
        boxShadow: "0 0 20px #ff4b2b",
        maxWidth: "320px",
        textAlign: "left",
        fontSize: "16px",
        lineHeight: "1.6",
    },
    error: {
        color: "#ff4b2b",
        fontWeight: "bold",
    },
    closeBtn: {
        background: "#ff4b2b",
        color: "#fff",
        fontSize: "22px",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
    },
};

export default CheckStudent;
