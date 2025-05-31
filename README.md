# 🍽️ Delicious Foods – Food Ordering Web App

Welcome to **Delicious Foods**, a modern food ordering web application inspired by Swiggy and Zomato.  
Order your favorite meals, enjoy lightning-fast delivery, and experience a seamless checkout process!

---

##  Features

- **Home Page**
  - Hero section with animated banner and search bar
  - Category filter with horizontal scrolling
  - Menu items displayed in modern, responsive cards
  - Real-time search for dishes and restaurants
  - "Add to Cart" with instant feedback

- **Cart**
  - View all selected items with images, descriptions, and prices
  - Adjust item quantities or remove items
  - See subtotal, delivery fee (free over $25), and total
  - Promo code input (UI)
  - Proceed to checkout or continue shopping

- **Order Summary & Checkout**
  - Enter delivery information (name, phone, email, address, instructions)
  - Choose payment method: Cash on Delivery, UPI, or Card
  - UPI ID validation and secure payment info
  - Order summary sidebar with all items and totals
  - Place order with loading state and error handling

- **Order Confirmation**
  - Animated success screen with order details
  - Estimated delivery time and SMS confirmation info
  - Option to continue shopping

- **Recommended Section**
  - Suggestions for pizza, drinks, desserts, etc.

- **Footer**
  - Quick links, categories, and social icons

- **Responsive Design**
  - Fully mobile-friendly and works on all devices

- **Modern UI**
  - Clean, vibrant design with gradients, icons, and subtle animations

---

##  Tech Stack

- **React** (functional components & hooks)
- **Firebase Firestore** (for menu and order data)
- **React Router**
- **Context API** (for cart management)
- **Custom CSS** 
- **Deployed with Node.js**

---

##  Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/nirajguptaa/Food-Ordering-app.git
   cd food-ordering-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project and Firestore database.
   - Add your Firebase config to `src/config/firebase.js`.

4. **Run the app**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📋 Folder Structure

```
src/
  components/
  context/
  screens/
    HomeScreen.js
    CartScreen.js
    OrderSummaryScreen.js
  config/
    firebase.js
  App.js
  index.js
  ...
```

---

##  Credits

- Inspired by Swiggy, Zomato, and modern food delivery UIs.


---

## 📱 Screenshots
![image](https://github.com/user-attachments/assets/13be46f2-85f1-4707-ac37-abcd074e37b8)
![image](https://github.com/user-attachments/assets/32403b25-965d-4527-ace1-33db7d128881)
![image](https://github.com/user-attachments/assets/4a850630-b972-4a0b-a0d1-d5934898c0be)
![image](https://github.com/user-attachments/assets/ddd27922-9dac-4996-ac52-16cac53aa036)





---

## License

This project is for educational/demo purposes.  
Feel free to use and modify!
