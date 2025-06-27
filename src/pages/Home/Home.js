import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import logo from '../../images/logo.png';
import skincareProducts from '../../data/ProductsData';

const Home = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get 3 random featured products
  const getRandomProducts = (arr, n) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };
  const randomFeatured = getRandomProducts(skincareProducts, 3);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay">
          <img src={logo} alt="SkinCredible Hulk" className="hero-logo" />
          <h1>Glow Up With Confidence</h1>
          <p>Trusted skincare that works for every skin type</p>
          <Link to="/products" className="hero-button">Shop Now</Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {randomFeatured.map(product => (
            <div className="product-card" key={product.id}>
              <img src={product.imageUrl} alt={product.productName} />
              <h3>{product.productName}</h3>
              <p className="product-price">₱{product.price}</p>
            </div>
          ))}
        </div>
        <Link to="/products" className="see-all">See All Products</Link>
      </section>

      {/* ABOUT SECTION */}
      <section className="about">
        <h2>Why SkinCredible Hulk?</h2>
        <p>
          We combine nature and science to bring you powerful skincare solutions
          that are safe, effective, and cruelty-free. Your skin deserves the best.
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial">
            <p>“The cleanser is amazing! My skin feels so soft.”</p>
            <span>- Jerico De Jesus</span>
          </div>
          <div className="testimonial">
            <p>“I've been using the moisturizer daily — love it!”</p>
            <span>- Chris Mortel</span>
          </div>
          <div className="testimonial">
            <p>“Sun protection has never felt this good on my skin.”</p>
            <span>- RD Pescante</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} SkinCredible Hulk. All rights reserved.</p>
      </footer>
      {showTopBtn && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
    </div>
  );
};

export default Home;
