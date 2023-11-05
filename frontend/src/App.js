import './App.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import WebFont from "webfontloader"
import React, { useEffect, useState } from "react";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping"
import  ConfirmOrder from "./component/Cart/ConfirmOrder"
import axios from "axios";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from "./component/Admin/ProductReviews";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";
import NotFound from "./component/layout/Not Found/Not Found";

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    try {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
    }catch(error){
      console.log(error)
    }
  } 
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Chilanka"]
      }
    })
 
    store.dispatch(loadUser());
 
    getStripeApiKey();
  
  }, [])

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/product/:id" Component={ProductDetails} />
        <Route exact path="/products" Component={Products} />
        <Route path='/products/:keyword' Component={Products} />
        <Route exact path='/search' Component={Search} />

        <Route exact path="/password/forgot" Component={ForgotPassword} />
        <Route exact path='/password/reset/:token' Component={ResetPassword} />
        <Route exact path="/Cart" Component={Cart} />
        <Route exact path="/login" Component={LoginSignUp} />
        <Route exact path="/about" Component={About} />
        <Route exact path='/contact' Component={Contact}/>

        
     {/* This is the best way to Implement Protected Route but due to some reason 
     in Protected Route Component it's not working properly. So I implemented it 
     in other's way in  below in future look back to it.Although the below 
     implementation also work absolutely fine.
  
     <Route element={<ProtectedRoute />} >
          <Route exact path="/account" Component={Profile} />
          <Route exact path="/me/update" Component={UpdateProfile} />
          <Route exact path="/password/update" Component={UpdatePassword} />
          <Route exact path="/shipping" Component={Shipping} />
          <Route exact path="/order/confirm" Component={ConfirmOrder} />
          {stripeApiKey && (<Route exact path="/process/payment" element={(<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>)}/>)}
           <Route exact path="/success" Component={OrderSuccess} />
         <Route exact path="/orders" Component={MyOrders} />
        </Route>
  */ }  
  {/*Here all Route are Protected Route*/}
          <Route exact path="/account" Component={isAuthenticated?Profile:LoginSignUp} />
          <Route exact path="/me/update" Component={isAuthenticated?UpdateProfile:LoginSignUp} />
          <Route exact path="/password/update" Component={isAuthenticated?UpdatePassword:LoginSignUp} />
          <Route exact path="/orders" Component={isAuthenticated?MyOrders:LoginSignUp} />
          <Route exact path='/order/:id' Component={isAuthenticated?OrderDetails:LoginSignUp} />

          <Route exact path="/shipping" Component={isAuthenticated?Shipping :Cart} />
          <Route exact path="/order/confirm" Component={isAuthenticated?ConfirmOrder:Cart} />
          {stripeApiKey  && (<Route exact path="/process/payment" element={(<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>)}/>)}
           <Route exact path="/success" Component={isAuthenticated?OrderSuccess:Cart} />
         

        {/* This way also protected route can be created
        <Route exact path="/orders" Component={isAuthenticated?MyOrders:LoginSignUp} />
  */}

  {/* Here All are Protected Route that can only user by admin  */}
  
   <Route exact path="/admin/dashboard" Component={(isAuthenticated && user?.role==="admin")?Dashboard:LoginSignUp}/>
   <Route exact path="/admin/products" Component={(isAuthenticated && user?.role==="admin")?ProductList:LoginSignUp}/>
   <Route exact path="/admin/product" Component={(isAuthenticated && user?.role==="admin")?NewProduct:LoginSignUp}/>
   <Route exact path="/admin/product/:id" Component={(isAuthenticated && user?.role==="admin")?UpdateProduct:LoginSignUp}/>
   <Route exact path="/admin/orders" Component={(isAuthenticated && user?.role==="admin")?OrderList:LoginSignUp}/>
   <Route exact path="/admin/order/:id" Component={(isAuthenticated && user?.role==="admin")?ProcessOrder:LoginSignUp}/>
   <Route exact path="/admin/users" Component={(isAuthenticated && user?.role==="admin")?UsersList:LoginSignUp}/>
   <Route exact path="/admin/user/:id" Component={(isAuthenticated && user?.role==="admin")?UpdateUser:LoginSignUp}/>
   <Route exact path="/admin/reviews" Component={(isAuthenticated && user?.role==="admin")?ProductReviews:LoginSignUp}/>
   <Route path="*" Component={window.location.pathname === "/process/payment" ? null : NotFound } />
      </Routes>

      <Footer />
    </Router>


  );
}

export default App;
