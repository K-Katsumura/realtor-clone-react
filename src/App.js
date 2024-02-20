import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
import RegisterBook from "./pages/RegisterBook";
import EditBooks from "./pages/EditBooks";
import BookDetail from "./pages/BookDetail";
import BookCategory from "./pages/BookCategory";
import OnLoanBook from "./pages/OnLoanBook";
import NotOnLoanBook from "./pages/NotOnLoanBook";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/category/:categoryName/:listingId" 
            element={<Listing />} 
          />
          <Route 
            path="/bookCategory/:bookCategoryName/:bookId" 
            element={<BookDetail />} 
          />
          <Route path="/offers" element={<Offers />} />
          <Route path="/onloanbook" element={<OnLoanBook />} />
          <Route path="/notonloanbook" element={<NotOnLoanBook />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/bookCategory/:bookCategoryName" element={<BookCategory />} />

          <Route path="create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing/>} />
          </Route>

          <Route path="/register-book" element={<PrivateRoute />}>
            <Route path="/register-book" element={<RegisterBook />} />
          </Route>
          <Route path="edit-book" element={<PrivateRoute />}>
            <Route path="/edit-book/:bookId" element={<EditBooks />} />
          </Route>
          
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
