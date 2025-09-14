import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const UserForm = ({ addUser, editingUser, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user"
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill form when editing a user
    useEffect(() => {
        if (editingUser) {
            setFormData({
                ...editingUser,
                password: "" // Don't pre-fill password for security
            });
        }
    }, [editingUser]);

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name cannot exceed 50 characters';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        // Password validation (only for new users or if password is provided)
        if (!editingUser || formData.password) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Prepare data for submission
            const submitData = { ...formData };
            
            // Remove empty password for updates
            if (editingUser && !submitData.password) {
                delete submitData.password;
            }
            
            await addUser(submitData);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
                <label className="form-label" htmlFor="name">
                    Full Name *
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                    autoComplete="name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="email">
                    Email Address *
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                    autoComplete="email"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="phone">
                    Phone Number *
                </label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                    autoComplete="tel"
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="password">
                    Password {!editingUser && '*'}
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                    autoComplete={editingUser ? "new-password" : "new-password"}
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
                {!editingUser && (
                    <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                        Must contain at least 8 characters with uppercase, lowercase, and number
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="role">
                    Role *
                </label>
                <select
                    id="role"
                    name="role"
                    className="form-input"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="form-btn form-btn-secondary"
                    onClick={onCancel}
                    disabled={loading || isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="form-btn form-btn-primary"
                    disabled={loading || isSubmitting}
                >
                    {(loading || isSubmitting) && <LoadingSpinner size="small" overlay={false} />}
                    {editingUser ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;