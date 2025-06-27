import { useState, useEffect } from 'react';
import { Table, Spinner, Container, Alert } from 'react-bootstrap';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setOrdersLoading(true);
    fetch('https://sw3285xufl.execute-api.us-west-2.amazonaws.com/production/orders/all-orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setOrdersLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders.');
        setOrdersLoading(false);
      });
  }, []);

  // Group orders by userId (populated with { _id, name })
  let grouped = [];
  if (Array.isArray(orders)) {
    const map = {};
    for (const order of orders) {
      // userId is populated with { _id, name }
      const userObj = order.userId || {};
      const userId = userObj._id || order.userId || 'Unknown';
      if (!map[userId]) {
        map[userId] = {
          user: userObj,
          orders: []
        };
        grouped.push(map[userId]);
      }
      map[userId].orders.push(order);
    }
  }

  return (
    <Container className="mt-4">
      <h2>All Users' Orders</h2>
      {ordersLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : grouped.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (

        grouped.map(({ user, orders }) => (
          <div key={user._id || user.name } style={{ marginBottom: '2rem' }}>
            <h5>
              {user.name || user._id || 'Unknown User'}{' '}
              <small>({user._id || 'No ID'})</small>
            </h5>
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
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {(order.productsOrdered || []).map(item => (
                          <li key={item.productId?._id || item.productId}>
                            {item.productId?.name || 'Unknown Product'} x {item.quantity}
                            {item.productId?.price !== undefined && (
                              <> (₱{item.productId.price})</>
                            )}
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
      )}
    </Container>
  );
}