import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { motion } from 'framer-motion';

Modal.setAppElement('#root');

const Edit = ({ isOpen, onRequestClose, student, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        motherName: '',
        qualification: '',
        dob: '',
        course: '',
        duration: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                fatherName: student.fatherName,
                motherName: student.motherName,
                qualification: student.qualification,
                dob: student.dob,
                course: student.course,
                duration: student.duration,
                phone: student.phone || '',
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(
                `http://localhost:5000/api/students/${student._id}`,
                formData
            );
            onSave(res.data.student || { ...formData, _id: student._id });
            onRequestClose();
        } catch (err) {
            const msg = err.response?.data?.error || err.message || "Failed to update student.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
            <motion.div
                initial={{ opacity: 0, y: "-100vh" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100vh" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <motion.h2
                    style={styles.heading}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    Edit Student
                </motion.h2>

                <motion.form
                    onSubmit={handleSubmit}
                    style={styles.form}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {Object.keys(formData).map((key, i) => (
                        <motion.div
                            key={key}
                            style={styles.formGroup}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <label style={styles.label}>
                                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            </label>
                            <motion.input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                style={styles.input}
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>
                    ))}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px orange" }}
                        whileTap={{ scale: 0.95 }}
                        style={styles.button}
                    >
                        {loading ? "Saving..." : "Save"}
                    </motion.button>
                </motion.form>
            </motion.div>
        </Modal>
    );
};

const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
    },
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '30px',
        width: '800px',
        height: '80vh',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#000000',
        border: '2px solid orange',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        overflowY: 'auto',
    },
};

const styles = {
    heading: {
        marginBottom: '20px',
        color: 'orange',
        textAlign: 'center',
        fontSize: '26px',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
        color: 'black',
        fontSize: '15px',
    },
    input: {
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        color: 'black',
        fontSize: '15px',
        outline: 'none',
        transition: '0.3s',
    },
    button: {
        background: 'linear-gradient(to right, orange, darkorange)',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0 4px 12px rgba(255, 165, 0, 0.5)',
    },
};

export default Edit;
