import React, { useContext, useState } from "react";
import { auth } from '../firebase/firebase.config';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import {

  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLoaderOverlay } from "react-spinner-overlay";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";

const Login = () => {

  const [errorMessage, seterrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();

  // console.log(signUpWithGmail);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  // const handleLogin = (event) => {
  //   event.preventDefault();
  //   const form = event.target;
  //   const email = form.email.value;
  //   const password = form.password.value;
  //   // console.log(email, password)
  //   login(email, password)
  //     .then((result) => {
  //       // Signed in
  //       const user = result.user;
  //       console.log(user);
  //       alert("Login successful!");
  //       navigate(from, { replace: true });
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       seterrorMessage("Please provide valid email & password!");
  //     });
  // };

  // login with google
  const handleRegister = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        localStorage.setItem("token", token)
        window.location.reload()
        navigate("/");
        console.log("Google login error", result);
      }).catch((error) => {
        console.log("Google login error", error);
      });
  };

  const firestore = getFirestore()

  return (
    <div className="h-screen mx-auto container flex items-center justify-center">
      <div className="w-full max-w-xs mx-auto">
        <DotLoaderOverlay loading={loading} color='#3575E2' />
        {/* <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4 
          "
        > */}
<div className="justify-center flex">        
        <img className="" style={{
          height: '61px',
          width: '170px',
        }}
          src="public/images/logo.png" />
          </div>
        <h3 className="text-5xl text-center mt-5 font-semibold mb-4 text-blue whitespace-nowrap">Please Login!</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="name@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setLoading(true)
              signInWithEmailAndPassword(auth, email, password)
                .then(async (user) => {
                  console.log("user login succes", user);
                  const docRef1 = doc(firestore, "candidates", user.user.uid);
                  const docRef2 = doc(firestore, "companies", user.user.uid);
                  const docSnap1 = await getDoc(docRef1);
                  const docSnap2 = await getDoc(docRef2);
                  const userData = docSnap1.data() === undefined ? docSnap2.data() : docSnap2.data() === undefined ? docSnap1.data() : null;
                  if (userData) {
                    localStorage.setItem("token", user.user.uid);
                    localStorage.setItem("user", JSON.stringify(userData));
                    window.location.reload();
                  }
                  setLoading(false);
                })
                .catch((err) => {
                  setLoading(false)
                  seterrorMessage(err?.code)
                  console.log(err);
                })
            }}
          >Login</button>

          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>

        {/* social login */}
        <div className="mt-8 text-center w-full mx-auto">
          <Link to="/sign-up">Not a member yet <span className='text-blue'>Sign up</span></Link>

          <div className="flex items-center justify-center mt-5 gap-4 w-full mx-auto">
            <button
              className=" border-2 text-blue hover:text-white hover:bg-blue font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center gap-2"
              type="button"
              onClick={handleRegister}
            >
              <FaGoogle />
            </button>
            <button
              className=" border-2 text-blue hover:text-white hover:bg-blue font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center gap-2"
              type="button"
            >
              <FaFacebookF />
            </button>
            <button
              className=" border-2 text-blue hover:text-white hover:bg-blue font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center gap-2"
              type="button"
            >
              <FaLinkedin />
            </button>
            <button
              className=" border-2 text-blue hover:text-white hover:bg-blue font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center gap-2"
              type="button"
            >
              <FaInstagram />
            </button>
          </div>
        </div>
        {/* </form> */}
        <p className="text-center text-gray-500 text-xs">

        </p>
      </div>

    </div>
  );
};

export default Login;
