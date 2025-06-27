import { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import AdminView from '../../components/AdminDashboard/AdminView';
import UserContext from '../../context/UserContext';
import AddToCart from '../../components/AddToCart/AddToCart'; 

import cleanser from '../../images/productS/cleanser.png';
import toner from '../../images/productS/toner.png';
import serum from '../../images/productS/serum.png';
import moisturizer from '../../images/productS/moisturizer.png';
import facemask from '../../images/productS/facemask.png';
import exfoliator from '../../images/productS/exfoliator.png';
import spot from '../../images/productS/spot.png';
import eyecream from '../../images/productS/eyecream.png';
import sunscreen from '../../images/productS/sunscreen.png';
import lipbalm from '../../images/productS/lipbalm.png';
import oil from '../../images/productS/oil.png';
import guashua from '../../images/productS/guashua.png';

import './Products.css';

const productImages = [
  cleanser, toner, serum, moisturizer, facemask, exfoliator, spot, eyecream, sunscreen, lipbalm, oil, guashua
];

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  const fetchData = () => {
    const endpoint = 'https://sw3285xufl.execute-api.us-west-2.amazonaws.com/production/products/active';

    fetch(endpoint, {
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data || []);
      })
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (user?.isAdmin) {
    return <AdminView productsData={products} fetchData={fetchData} />;
  }

  return (
    <div className="skincare-products">
      {products.length > 0 ? (
        products.map((product, idx) => (
          <Card key={product._id || product.id} className="skincare-card">
            <div className="image-container">
              <Card.Img
                variant="top"
                src={productImages[idx % productImages.length]}
                className="product-image"
              />
              <div className="image-overlay"></div>
            </div>

            <Card.Body className="card-content">
              <Card.Title className="product-title">
                {product.name || product.productName}
              </Card.Title>
              <Card.Text className="product-description">{product.description}</Card.Text>
              <Card.Text className="product-price">₱{product.price}</Card.Text>
              <AddToCart productId={product._id || product.id} disabled={!user || !user.id || user.isAdmin} />
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-center w-100 text-muted">No products available.</p>
      )}
    </div>
  );
}