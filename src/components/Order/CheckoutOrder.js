import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// ✅ Notification positioned bottom-right
const notyf = new Notyf({
  duration: 2000,
  position: { x: 'right', y: 'bottom' }
});

export default function useCheckoutOrder(fetchCart) {
  const navigate = useNavigate();

  const checkoutOrder = async () => {
    try {
      const res = await fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/orders/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await res.json();

      if (res.ok) {
        notyf.success('Order placed successfully');
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been placed successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        await fetchCart();
        navigate('/products');
      } else {
        notyf.error(result?.error || 'Checkout failed');
      }
    } catch (err) {
      console.error('❌ Error checking out:', err);
      notyf.error('Failed to place order');
    }
  };

  return checkoutOrder;
}