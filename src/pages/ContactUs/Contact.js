import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Accordion } from "react-bootstrap";
import "./Contact.css";

const ACCORDION_DATA = [
  {
    title: "How can I track my order?",
    content: "Once your order is shipped, you will receive an email with tracking information. You can also view your order status in your account dashboard.",
  },
  {
    title: "What payment methods do you accept?",
    content: "We accept all major credit cards, PayPal, and select digital wallets.",
  },
  {
    title: "How do I return a product?",
    content: "Contact us within 14 days of receiving your order. We will provide instructions for returns and refunds.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <div className="contact-bg">
      <div className="contact-bg-content">
        <div className="contact-card">
          <h2 className="contact-title">Contact Us</h2>
          <Form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label className="contact-label">Name</Form.Label>
              <Form.Control
                className="contact-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="contact-label">Email</Form.Label>
              <Form.Control
                className="contact-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
            <Button className="contact-btn" type="submit">
              Contact Us
            </Button>
          </Form>
          <Accordion className="accordion mt-4">
            {ACCORDION_DATA.map((item, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={idx}>
                <Accordion.Header>{item.title}</Accordion.Header>
                <Accordion.Body>{item.content}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}