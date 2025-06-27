import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import Swal from 'sweetalert2';

export default function AddToCart({ productId, disabled }) {
  const { user } = useContext(UserContext);

  const handleAddToCart = () => {
    if (!user || !user.id || user.isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Not allowed',
        text: 'Only logged-in users can add to cart.',
      });
      return;
    }

    fetch('https://sw3285xufl.execute-api.us-west-2.amazonaws.com/production/cart/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Item added to cart successfully") {
          Swal.fire({
            icon: 'success',
            title: 'Added to Cart!',
            text: 'Product has been added to your cart.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Failed to add to cart.',
          });
        }
      })
  };

  return (
    <Button
      variant="primary"
      className="add-to-cart-btn"
      onClick={handleAddToCart}
      disabled={disabled || user?.isAdmin}
    >
      Add to Cart
    </Button>
  );
}