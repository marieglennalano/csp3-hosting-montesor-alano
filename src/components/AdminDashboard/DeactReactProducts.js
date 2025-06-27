import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Notyf } from 'notyf';

export default function ToggleProductStatus({ productId, isActive, fetchData }) {
  const notyf = new Notyf();
  const [loading, setLoading] = useState(false);

  const toggleProductStatus = () => {
    setLoading(true);

    const endpoint = isActive
      ? `https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/${productId}/archive`
      : `https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/${productId}/activate`;

    fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          notyf.success(`Product ${isActive ? 'archived' : 'activated'} successfully!`);
          fetchData();
        } else {
          notyf.error(`Failed to ${isActive ? 'archive' : 'activate'} the product.`);
        }
      })
      .catch(() => notyf.error('Network error! Please try again later.'))
      .finally(() => setLoading(false));
  };

  return (
    <Button
      variant={isActive ? 'danger' : 'success'}
      size="sm"
      onClick={toggleProductStatus}
      disabled={loading}
      className="mx-1"
    >
      {loading ? 'Processing...' : isActive ? 'Archive' : 'Activate'}
    </Button>
  );
}
