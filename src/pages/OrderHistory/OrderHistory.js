import { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 2000, position: { x: 'right', y: 'bottom' } });

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          notyf.error(data.error);
        } else {
          setOrders(data.orders || []);  // Fallback to empty array if orders is undefined
        }
      })
      .catch(err => {
        notyf.error('Failed to load orders');
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <Card key={order._id || index} className="mb-4">
            <Card.Body>
              <Card.Title>Order #{index + 1}</Card.Title>
              <p><strong>Total:</strong> ₱{order.totalPrice}</p>
              <hr />
              <Row>
                {order.productsOrdered.map((item, i) => (
                  <Col md={6} key={i}>
                    <p><strong>Product:</strong> {item.productId?.name || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Subtotal:</strong> ₱{item.subtotal}</p>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
