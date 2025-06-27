import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Card, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UpdateProduct from './UpdateProducts';
import ToggleProductStatus from './DeactReactProducts';

import './AdminView.css';

export default function AdminView() {
  const notyf = new Notyf();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);

  // Orders state
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchAllProducts = () => {
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        setProducts([]);
        notyf.error("Failed to fetch products.");
      });
  };

  const fetchAllOrders = () => {
    setOrdersLoading(true);
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/orders/all-orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          setOrders(data.orders);
        }
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const ordersByUser = Array.isArray(orders) ? orders.reduce((acc, order) => {
    const userId = order.userId?._id || order.userId;
    const userName = order.userId?.name || `User ID: ${userId}`;
    if (!acc[userId]) {
      acc[userId] = { user: { name: userName }, orders: [] };
    }
    acc[userId].orders.push(order);
    return acc;
  }, {}) : {};

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  function createProduct(e) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price) {
      notyf.error("Please fill in all fields.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      notyf.error("Please enter a valid price.");
      return;
    }
    let token = localStorage.getItem('token');
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: name.trim(), description: description.trim(), price: parsedPrice })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Product already exists") {
          notyf.error("Error: Product already exists.");
        } else if (data.result !== false) {
          setName("");
          setDescription("");
          setPrice("");
          notyf.success("Product Creation Successful");
          fetchAllProducts();
          handleClose();
        } else {
          notyf.error("Something went wrong");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        notyf.error("An error occurred while adding the product.");
      });
  }

  return (
    <div className="dashboard-container">
      <Card className="admin-card">
        <Card.Body>
          <h1 className="admin-header">Admin Dashboard</h1>

          <Row className="mb-4">
            <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start">
              <Button variant="primary" onClick={handleShow} className="action-btn">
                Add New Product
              </Button>
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end">
              <Button variant="success" onClick={() => { setShowOrdersModal(true); fetchAllOrders(); }} className="action-btn">
                Show User Orders
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="product-table">
            <thead className="table-dark text-center">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map(product => (
                  <tr key={product._id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.description}</td>
                    <td>₱{product.price}</td>
                    <td className={product.isActive ? 'text-success' : 'text-danger'}>{product.isActive ? 'Available' : 'Unavailable'}</td>
                    <td className="actions">
                      <UpdateProduct product={product} fetchData={fetchAllProducts}>
                        <Button variant="primary" size="sm">Update</Button>
                      </UpdateProduct>
                      <ToggleProductStatus
                        productId={product._id}
                        isActive={product.isActive}
                        fetchData={fetchAllProducts}
                        buttonLabel={product.isActive ? 'Disable' : 'Enable'}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No products found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Product Creation Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createProduct}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter Product Name" required value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control type="text" placeholder="Enter Product Description" required value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price:</Form.Label>
              <Form.Control type="number" placeholder="Enter Product Price" required value={price} onChange={e => setPrice(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-3">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Orders Modal */}
      <Modal show={showOrdersModal} onHide={() => setShowOrdersModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>All Orders Per User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordersLoading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            Object.keys(ordersByUser).length === 0 ? (
              <div>No orders found.</div>
            ) : (
              Object.values(ordersByUser).map(({ user, orders }) => (
                <div key={user._id || user.email} className="order-summary">
                  <h5>{user.name}</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                          <td>₱{order.totalPrice?.toFixed(2) || '0.00'}</td>
                          <td>{order.status || 'N/A'}</td>
                          <td>
                            <ul className="order-items">
                              {(order.productsOrdered || []).map(item => (
                                <li key={item.productId._id}>
                                  {item.productId.name} x {item.quantity} (₱{(item.productId.price * item.quantity).toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))
            )
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
