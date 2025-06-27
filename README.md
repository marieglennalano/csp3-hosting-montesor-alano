# SkinCredible Capstone 3

LikhaHome is a full-stack e-commerce web application built as a capstone project. It features user authentication, product browsing, cart management, search functionality, and an admin dashboard for product and order management.

## Features

- **User Authentication**: Register and log in securely.
- **Home Page**: Welcome page with navigation to all main features.
- **Products Page**: Browse all available products with detailed information.
- **Search Function**: Quickly find products by name.
- **Cart**: Add, edit quantity, and remove products from your cart.
- **Checkout**: Place orders and view order history.
- **Admin Dashboard**:
  - Upload new products
  - Edit or remove existing products
  - View and manage all orders

## Getting Started

## Login Account: 

```
Admin: 
username: admin@mail.com    
password: admin123
```

```
Regular User: 
username: johndoe@mail.com
password: user1234
```


### 1. Install Dependencies

```
npm install
```

### 2. Run the Application

```
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production

```
npm run build
```

## Folder Structure

- `src/pages/` — Main pages (Home, Products, Cart, Login, Register, Admin Dashboard, etc.)
- `src/components/` — Reusable UI components
- `src/context/` — React context providers for user and cart state
- `src/utils/` — Utility functions
- `capstoneBackend/` — Backend API (Node.js/Express)

## API Endpoints

- `/register` — Register a new user
- `/login` — User login
- `/products/all` — Get all products
- `/products/search-by-name` — Search products
- `/cart/get-cart` — Get user's cart
- `/cart/add-to-cart` — Add item to cart
- `/cart/update-cart-quantity` — Update cart item quantity
- `/cart/remove-from-cart` — Remove item from cart
- `/order/checkout` — Place an order
- `/order/my-orders` — View user's orders
- `/admin/products` — Admin product management
- `/admin/orders` — Admin order management

## Admin Features

- Access the admin dashboard after logging in as an admin user.
- Upload, edit, and delete products.
- View and manage all orders.

## Technologies Used

- React (frontend)
- React Bootstrap (UI)
- Node.js & Express (backend)
- MongoDB (database)

## Authors

- Admin Dashboard: Pescante
- User View: De Jesus
- Other functions: Collaboration between De Jesus & Pescante

---

For any issues or contributions, please open an issue or pull request.
