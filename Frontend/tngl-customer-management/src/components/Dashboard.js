// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api/customers';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    Address: '',
    CustomerNumber: '',
    MeterSerialNumber: '',
  });

  const [updateCustomerId, setUpdateCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(API_URL);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ Name: '', Address: '', CustomerNumber: '', MeterSerialNumber: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error.message);
    }
  };

  const handleUpdateClick = (id) => {
    const customerToUpdate = customers.find((customer) => customer.Customer_id === id);
    setFormData({ ...customerToUpdate });
    setUpdateCustomerId(id);
    setShowModal(true);
  };  

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`${API_URL}/${updateCustomerId}`, formData);
      setUpdateCustomerId(null);
      setFormData({ Name: '', Address: '', CustomerNumber: '', MeterSerialNumber: '' });
      setShowModal(false); // Close the modal
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error.message);
    }
  };  

  const handleCancelUpdate = () => {
    setUpdateCustomerId(null);
    setFormData({ Name: '', Address: '', CustomerNumber: '', MeterSerialNumber: '' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      // Make sure 'id' is defined before making the delete request
      if (id) {
        console.log('Deleting customer with ID:', id);
        await axios.delete(`${API_URL}/${id}`);
        fetchCustomers(); // Refresh the customer data after delete
      } else {
        console.error('Customer ID is undefined. Unable to delete.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error.message);
    }
  };
  

  return (
    <div>
      <style>{`
        body {
          background-color: #343a40; /* Dark theme background color */
          color: #ffffff; /* Text color */
        }
      `}</style>

      {/* Add Customer Form */}
      <div className="card mt-5 text-white bg-dark text-center">
        <div className="card-header">
          <h3>Add New Customer</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Number"
                  name="CustomerNumber"
                  value={formData.CustomerNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Meter Serial Number"
                  name="MeterSerialNumber"
                  value={formData.MeterSerialNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Customer
            </button>
          </form>
        </div>
      </div>

      {/* Customer Table */}
      <div className="container-fluid text-center pt-5">
        <div className="card-header">
          <h3>Customer Data</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-light">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Customer Number</th>
                <th>Meter Serial Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_id} className="table-row">
                  <td>{customer.Name}</td>
                  <td>{customer.Address}</td>
                  <td>{customer.CustomerNumber}</td>
                  <td>{customer.MeterSerialNumber}</td>
                  <td>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => handleUpdateClick(customer.Customer_id)}
                    >
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(customer.Customer_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Customer Modal */}
        <Modal show={showModal} onHide={handleCancelUpdate} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'white' }}>Update Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="updateName">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="updateName"
                  placeholder="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="updateAddress">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="updateAddress"
                  placeholder="Address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="updateCustomerNumber">Customer Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="updateCustomerNumber"
                  placeholder="Customer Number"
                  name="CustomerNumber"
                  value={formData.CustomerNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="updateMeterSerialNumber">Meter Serial Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="updateMeterSerialNumber"
                  placeholder="Meter Serial Number"
                  name="MeterSerialNumber"
                  value={formData.MeterSerialNumber}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Update Customer
            </Button>
            <Button variant="secondary" onClick={handleCancelUpdate}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
