import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate, useParams } from "react-router-dom";
import "./Form.css";

function AddStudent({ isEdit = false }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', dob: '', fatherName: '', motherName: '',
        phone: '', qualification: '', course: '', duration: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`http://localhost:5000/api/students/${id}`)
                .then(res => setFormData(res.data))
                .catch(err => console.error("Error loading student:", err));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/students/${id}`, formData);
                alert("Student updated successfully!");
            } else {
                await axios.post('http://localhost:5000/api/students', formData);
                alert("Student added successfully!");
            }
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Error submitting data.");
        }
    };

    return (
        <div className="form-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #0f0f0f, #1a1a1a)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: "black",
            padding: '30px'
        }}>
            {!showForm ? (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        textAlign: "center",
                        padding: "40px",
                        background: "#1e1e1e",
                        borderRadius: "20px",
                        boxShadow: "0 12px 25px rgba(0, 0, 0, 0.4)",
                        color: "#FF8C00",
                        maxWidth: "500px"
                    }}
                >
                    <h1 style={{ fontSize: '2rem' }}>
                        <Typewriter
                            words={['Welcome To The Skill Boost World']}
                            loop={1}
                            cursor
                            cursorStyle='|'
                            typeSpeed={70}
                            deleteSpeed={40}
                            delaySpeed={1000}
                        />
                    </h1>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                        padding: '40px',
                        position: 'relative'
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '25px',
                            fontSize: '28px',
                            cursor: 'pointer',
                            color: '#e74c3c',
                            fontWeight: 'bold'
                        }}
                        whileHover={{ rotate: 90, scale: 1.3 }}
                        onClick={() => navigate('/')}
                    >
                        ✕
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ textAlign: 'center', marginBottom: '30px' }}
                    >
                        <h1 style={{ color: '#FF8C00' }}>THE SKILL BOOST</h1>
                        <p style={{ color: 'black', fontSize: '17px' }}>Advanced Computer Training Institute</p>
                        <p style={{ color: 'black', fontSize: '17px' }}>SCO-7, First Floor, Sector 68, Mohali</p>
                        <p style={{ color: 'black', fontSize: '17px' }}> www.theskillboost.com | 9808978342</p>
                        <h2 style={{ marginTop: '20px', color: '#FF8C00' }}>
                            {isEdit ? "Edit Student" : "Student Form"}
                        </h2>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="attendance-form">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            {Object.keys(formData).map((key, i) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
                                >
                                    <label htmlFor={key} style={{ fontWeight: 'bold', color: '#34495e' }}>
                                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                    </label>
                                    <input
                                        type="text"
                                        id={key}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        required
                                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1')}`}
                                        style={{
                                            padding: '12px 15px',
                                            borderRadius: '10px',
                                            border: '1px solid #ccc',
                                            fontSize: '15px',
                                            outline: 'none',
                                            backgroundColor: '#f9f9f9',
                                            width: "80%",
                                            transition: 'border 0.3s ease',
                                            color: "black"
                                        }}
                                        onFocus={(e) => e.target.style.border = "2px solid #4caf50"}
                                        onBlur={(e) => e.target.style.border = "1px solid #ccc"}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#FF8C00",
                                boxShadow: "0 0 20px #FF8C00",
                                color: "#fff"
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '14px 35px',
                                fontSize: '17px',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#27ae60',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        >
                            {isEdit ? "Update" : "Submit"}
                        </motion.button>
                    </form>
                </motion.div>
            )}
        </div>
    );
}

export default AddStudent;
