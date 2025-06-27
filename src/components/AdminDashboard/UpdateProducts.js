import { Button, Modal, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Notyf } from 'notyf';

export default function UpdateProduct({ product, fetchData, children }) {
  const notyf = new Notyf();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [showEdit, setShowEdit] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(null);

  const openEdit = () => setShowEdit(true);

  const closeEdit = () => {
    setShowEdit(false);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
  };

  const updateProduct = (event) => {
    event.preventDefault();

    fetch(`https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/products/${product._id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, description, price }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          notyf.success("Product updated successfully!");
          setUpdatedProduct(data.product); // Set the updated product in state
        } else {
          notyf.error("Update failed. Please try again.");
        }
      })
      .catch(() => {
        notyf.error("Network error. Please try again.");
      })
      .finally(() => {
        fetchData(); // Refresh product data after update
        closeEdit(); // Close the modal after the update
      });
  };

  // Sync updated product state with the parent component
  useEffect(() => {
    if (updatedProduct) {
      // If the product has been updated, we might want to update the parent product data
      fetchData();
    }
  }, [updatedProduct, fetchData]);

  return (
    <>
      <span onClick={openEdit} style={{ cursor: 'pointer' }}>
        {children || (
          <Button variant="primary" size="sm">
            Update
          </Button>
        )}
      </span>

      <Modal show={showEdit} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={updateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={closeEdit}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
