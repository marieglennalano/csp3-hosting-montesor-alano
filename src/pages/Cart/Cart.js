import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import useCheckoutOrder from '../../components/Order/CheckoutOrder';

const notyf = new Notyf({
    duration: 2000,
    position: { x: 'right', y: 'bottom' }
});

export default function Cart() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [total, setTotal] = useState(0);
    
    const fetchCart = async () => {
        try {
            const res = await fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/cart/get-cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await res.json();
            const items = data.cart?.cartItems || [];
            setCartItems(items);
            setTotal(data.cart?.totalPrice || 0);
            
            for (let item of items) {
                fetchProduct(item.productId);
            }
        } catch (error) {
            notyf.error('Failed to load cart');
        }
    };
    
    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line
    }, []);
    
    const fetchProduct = async (productId) => {
        if (productDetails[productId]) return;
        
        try {
            const res = await fetch(`https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/${productId}`);
            const data = await res.json();
            
            setProductDetails(prev => ({
                ...prev,
                [productId]: data.product || data
            }));
        } catch (error) {
            console.error(`❌ Error fetching product ${productId}:`, error);
            notyf.error('Failed to load product details');
        }
    };
    
    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        
        try {
            const res = await fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/cart/update-cart-quantity', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, newQuantity: quantity })
            });
            
            const result = await res.json();
            if (res.ok) {
                notyf.success('Quantity updated');
                fetchCart();
            } else {
                notyf.error(result?.error || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('❌ Error updating quantity:', error);
            notyf.error('Failed to update quantity');
        }
    };
    
    const removeFromCart = async (productId) => {
        try {
            const res = await fetch(`https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/cart/${productId}/remove-from-cart`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await res.json();
            if (res.ok) {
                notyf.success('Item removed');
                fetchCart();
            } else {
                notyf.error(result?.error || 'Failed to remove item');
            }
        } catch (error) {
            console.error('❌ Error removing item:', error);
            notyf.error('Failed to remove item');
        }
    };
    
    const clearCart = async () => {
        try {
            const res = await fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/cart/clear-cart', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await res.json();
            if (res.ok) {
                notyf.success('Cart cleared');
                fetchCart();
            } else {
                notyf.error(result?.error || 'Failed to clear cart');
            }
        } catch (error) {
            console.error('❌ Error clearing cart:', error);
            notyf.error('Failed to clear cart');
        }
    };
    
    const checkoutOrder = useCheckoutOrder(fetchCart);
    
    return (
        <Container className="mt-4">
        <h2>Your Cart</h2>
        
        {cartItems.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
        ) : (
            <>
            <Row>
            {cartItems.map(item => {
                const product = productDetails[item.productId];
                
                return (
                    <Col md={6} lg={4} key={item.productId} className="mb-4">
                    <Card>
                    {product?.imageUrl && (
                        <Card.Img variant="top" src={product.imageUrl} />
                    )}
                    <Card.Body>
                    <Card.Title>{product?.name || 'Loading...'}</Card.Title>
                    <Card.Text>Subtotal: ₱{item.subtotal.toFixed(2)}</Card.Text>
                    <div className="d-flex align-items-center mb-2">
                    <Form.Group style={{ width: '120px', marginBottom: 0 }}>
                    <Form.Label visuallyHidden>Quantity</Form.Label>
                    <Form.Control
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                    style={{ width: '80px', display: 'inline-block', marginRight: '8px' }}
                    />
                    </Form.Group>
                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{ marginLeft: '8px' }}
                    >
                    −
                    </Button>
                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ marginLeft: '4px' }}
                    >
                    +
                    </Button>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.productId)}
                    style={{ marginLeft: 'auto' }}
                    >
                    Remove
                    </Button>
                    </div>
                    </Card.Body>
                    </Card>
                    </Col>
                );
            })}
            </Row>
            
            <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ₱{total.toFixed(2)}</h4>
            <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={clearCart}>
            Clear Cart
            </Button>
            <Button
            variant="success"
            onClick={checkoutOrder}
            disabled={cartItems.length === 0}
            >
            Checkout
            </Button>
            </div>
            </div>
            </>
        )}
        </Container>
    );
}