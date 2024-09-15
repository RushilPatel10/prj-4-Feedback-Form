import React, { useState, useEffect } from "react";
import "./App.css";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    rating: 0,
    feedback: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("submittedData"));
    if (storedData) {
      setSubmittedData(storedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submittedData", JSON.stringify(submittedData));
  }, [submittedData]);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) formErrors.password = "Password is required";
    if (!formData.rating) formErrors.rating = "Rating is required";
    return formErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      if (isEditing) {

        const updatedData = submittedData.map((item, index) =>
          index === editIndex ? formData : item
        );
        setSubmittedData(updatedData);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setSubmittedData([...submittedData, formData]);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        rating: 0,
        feedback: "",
      });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name: </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-dark"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
  
      <div className="form-group">
        <label>Email: </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-dark"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
  
      <div className="form-group">
        <label>Password: </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input-dark"
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
  
      <div className="form-group">
        <label>Rating: </label>
        <div className="rating-container">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              style={{
                cursor: "pointer",
                color: formData.rating > index ? "gold" : "gray",
              }}
              onClick={() => handleRatingChange(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
        {errors.rating && <p className="error">{errors.rating}</p>}
      </div>
  
      <div className="form-group">
        <label>Feedback: </label>
        <textarea
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          className="input-dark"
        />
      </div>
  
      <button type="submit" className="btn-dark">{isEditing ? "Update" : "Submit"}</button>
    </form>
  
    <h2>Submitted Data</h2>
    {submittedData.length > 0 && (
      <table className="table-dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Password</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < data.rating ? "gold" : "gray" }}>
                    ★
                  </span>
                ))}
              </td>
              <td>{data.feedback}</td>
              <td>
                <button onClick={() => handleEdit(index)} className="btn-action">Edit</button>
                <button onClick={() => handleDelete(index)} className="btn-action">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  

  );
}

export default Form;
