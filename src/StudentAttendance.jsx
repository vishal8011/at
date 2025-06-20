import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SubmitAttendance = () => {
    const [students, setStudents] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/students");
                setStudents(res.data);
            } catch (err) {
                console.error("❌ Error fetching students:", err.message);
            }
        };
        fetchStudents();
    }, []);

    const handleStatusChange = (id, status) => {
        setStatusMap((prev) => ({ ...prev, [id]: status }));
    };

    const handleSubmit = async () => {
        const updatedStudents = students
            .filter(student => statusMap[student._id])
            .map((student) => ({
                _id: student._id,
                status: statusMap[student._id],
            }));

        if (updatedStudents.length === 0) {
            setMessage("⚠️ Please mark attendance for at least one student.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/submit-attendance", {
                students: updatedStudents,
            });

            if (response.data.success) {
                setMessage("✅ Attendance submitted successfully!");
                setTimeout(() => navigate("/"), 2000); // 🔄 Redirect after 2s
            } else {
                setMessage("❌ Server responded but attendance not saved.");
            }
        } catch (error) {
            console.error("❌ Error submitting attendance:", error);
            setMessage("❌ Server error while submitting attendance.");
        }
    };

    return (
        <div style={styles.wrapper}>
            <div className="animated-bg" />
            <motion.div
                style={styles.container}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h2 style={styles.heading}>Mark Attendance</h2>
                {students.map((student, index) => (
                    <motion.div
                        key={student._id}
                        style={styles.studentRow}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <span style={styles.name}>{student.name}</span>
                        <label>
                            <input
                                type="radio"
                                name={student._id}
                                value="Present"
                                onChange={() => handleStatusChange(student._id, "Present")}
                            />
                            <span style={styles.label}>Present</span>
                        </label>
                        <label style={{ marginLeft: "15px" }}>
                            <input
                                type="radio"
                                name={student._id}
                                value="Absent"
                                onChange={() => handleStatusChange(student._id, "Absent")}
                            />
                            <span style={styles.label}>Absent</span>
                        </label>
                    </motion.div>
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.button}
                    onClick={handleSubmit}
                >
                    Submit Attendance
                </motion.button>

                {message && <p style={styles.message}>{message}</p>}
            </motion.div>

            <style>{`
                .animated-bg {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background:
                        radial-gradient(circle at 20% 20%, rgba(0,255,213,0.2), transparent 60%),
                        radial-gradient(circle at 80% 80%, rgba(255,0,255,0.1), transparent 60%),
                        url('https://cdn.pixabay.com/photo/2023/07/13/17/39/ai-generated-8124026_1280.png') center/cover no-repeat;
                    background-color: #0a0f1c;
                    z-index: -1;
                    animation: float 10s ease-in-out infinite;
                    filter: brightness(0.3) contrast(1.2);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 10px",
        overflow: "hidden",
    },
    container: {
        background: "rgba(0, 31, 43, 0.7)",
        padding: "30px",
        borderRadius: "20px",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 50px #00ffd5aa",
        color: "#fff",
        maxWidth: "90%",
        zIndex: 2,
    },
    heading: {
        color: "#00ffd5",
        marginBottom: "20px",
        textAlign: "center",
        fontSize: "26px",
    },
    studentRow: {
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
    },
    name: {
        marginRight: "15px",
        fontWeight: "bold",
        minWidth: "100px",
    },
    label: {
        color: "#00ffd5",
        marginLeft: "5px",
    },
    button: {
        marginTop: "20px",
        padding: "10px 20px",
        background: "linear-gradient(to right, #00ffd5, #00b3ff)",
        color: "#001f2b",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
        width: "100%",
        fontSize: "16px",
    },
    message: {
        marginTop: "15px",
        textAlign: "center",
        color: "#00ffd5",
        fontWeight: "bold",
    },
};

export default SubmitAttendance;
