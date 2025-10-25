import { Routes, Route } from "react-router-dom";
import Layout from "./admin/components/Layout";
import Dashboard from "./admin/pages/Dashboard";
import Rooms from "./admin/pages/rooms/Rooms";
import RoomEdit from "./admin/pages/rooms/RoomEdit";
import RoomAdd from "./admin/pages/rooms/RoomAdd";
import AdminContacts from "./admin/pages/AdminContacts";

import Customers from "./admin/pages/customers/Customers";
import CustomerAdd from "./admin/pages/customers/CustomerAdd";
import CustomerEdit from "./admin/pages/customers/CustomerEdit";

import Users from "./admin/pages/users/Users";
import UserAdd from "./admin/pages/users/UserAdd";
import UserEdit from "./admin/pages/users/UserEdit";

import Services from "./admin/pages/services/Services";
import ServiceAdd from "./admin/pages/services/ServiceAdd";
import ServiceEdit from "./admin/pages/services/ServiceEdit";

import Bookings from "./admin/pages/bookings/Bookings";
import BookingAdd from "./admin/pages/bookings/BookingAdd";
import BookingEdit from "./admin/pages/bookings/BookingEdit";
import BookingDetail from "./admin/pages/bookings/BookingDetail";

import BookingServices from "./admin/pages/booking-services/BookingServices";
import BookingServiceAdd from "./admin/pages/booking-services/BookingServiceAdd";
import BookingServiceEdit from "./admin/pages/booking-services/BookingServiceEdit";

import Invoices from "./admin/pages/invoices/Invoices";
import InvoiceAdd from "./admin/pages/invoices/InvoiceAdd";
import InvoiceEdit from "./admin/pages/invoices/InvoiceEdit";

import ClientLayout from "./client/components/ClientLayout";
import Home from "./client/pages/Home";
import RoomsClient from "./client/pages/Rooms";
import RoomDetail from "./client/pages/RoomDetail";
import ServicesClient from "./client/pages/Services";
import About from "./client/pages/About";
import Contact from "./client/pages/Contact";
import Payment from "./client/pages/Payment";
import PaymentGateway from "./client/pages/PaymentGateway";
import MyBookings from "./client/pages/MyBookings";
import Pay from "./client/pages/Pay";
import MyBookingDetail from "./client/pages/MyBookingDetail";
import ClientProfile from "./client/pages/ClientProfile";
import ForgotPassword from "./client/pages/ForgotPassword";
import ReviewForm from "./client/pages/ReviewForm";
import PaymentSuccess from "./client/pages/PaymentSuccess";

import Login from "./admin/pages/Login";
import LoginClient from "./client/pages/LoginClient";
import RegisterClient from "./client/pages/RegisterClient";
import ChangePassword from "./client/pages/ChangePassword";
import PrivateRoute from "./admin/components/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<LoginClient />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/add" element={<RoomAdd />} />
          <Route path="rooms/edit/:id" element={<RoomEdit />} />
          <Route path="contacts" element={<AdminContacts />} />

          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<CustomerAdd />} />
          <Route path="customers/edit/:id" element={<CustomerEdit />} />

          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />

          <Route path="services" element={<Services />} />
          <Route path="services/add" element={<ServiceAdd />} />
          <Route path="services/edit/:id" element={<ServiceEdit />} />

          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/add" element={<BookingAdd />} />
          <Route path="bookings/edit/:id" element={<BookingEdit />} />
          <Route path="bookings/detail/:id" element={<BookingDetail />} />

          <Route path="booking-services" element={<BookingServices />} />
          <Route path="booking-services/add" element={<BookingServiceAdd />} />
          <Route
            path="booking-services/edit/:id"
            element={<BookingServiceEdit />}
          />

          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/add" element={<InvoiceAdd />} />
          <Route path="invoices/edit/:id" element={<InvoiceEdit />} />
        </Route>

        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<RoomsClient />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="payment" element={<Payment />} />
          <Route path="payment-gateway" element={<PaymentGateway />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="pay" element={<Pay />} />
          <Route path="my-bookings/:id" element={<MyBookingDetail />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="payment-success" element={<PaymentSuccess />} />

          <Route path="services" element={<ServicesClient />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="review/:bookingId" element={<ReviewForm />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
