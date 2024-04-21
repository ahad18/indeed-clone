import React, { useState } from "react";
import { getFirestore, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
    FaFacebookF,
    FaGoogle,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLoaderOverlay } from 'react-spinner-overlay'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { Link } from "react-router-dom";

const Signup = () => {

    const firestore = getFirestore()
    const storage = getStorage()

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [usertype, setUserType] = useState('company');
    const [companyForm, setCompanyForm] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: null,
        image: null,
        role: 'company',
        createdAt: new Date(),
    })
    const [candidateform, setCandidateForm] = useState({
        candidateName: '',
        candidateEmail: '',
        password: '',
        role: 'candidate',
        createdAt: new Date(),
    })

    function handleRegister() {
        setLoading(true)
        if (usertype === "company") {
            if (companyForm.name === "" || companyForm.email === "" || companyForm.address === "" || companyForm.password === "" || companyForm.phone === null) {
                setLoading(false)
                enqueueSnackbar("Fields are required", {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
            }
            else {
                const email = companyForm.email
                const password = companyForm.password
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (user) => {
                        console.log("user creation succes", user.user);
                        setDoc(doc(firestore, "companies", user.user.uid), {
                            ...companyForm,
                            companyId: user.user.uid,
                            image: ""
                        })
                            .then(async () => {
                                console.log("company registered");
                                enqueueSnackbar("Registered Successfully", {
                                    variant: 'success',
                                    anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }
                                });
                                setLoading(false)
                                const storageRef = ref(storage, "companies", companyForm.image.name)
                                const uploadRes = await uploadBytesResumable(storageRef, companyForm.image)
                                const downloadURL = await getDownloadURL(uploadRes.ref)
                                if (downloadURL) {
                                    enqueueSnackbar("image upload successfully", {
                                        variant: 'success',
                                        anchorOrigin: {
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }
                                    });
                                    updateDoc(doc(firestore, "companies", user.user.uid), {
                                        ...companyForm,
                                        image: downloadURL
                                    })
                                    setTimeout(() => {
                                        navigate("/login")
                                    }, 2000);
                                }
                                console.log("image uploaded ====>", downloadURL);
                            })
                    })
                    .catch((err) => {
                        setLoading(false)

                        setErrorMessage(err.code)
                        enqueueSnackbar(err?.code, {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                            
                        });
                        console.log(err);
                    })
            }
        }
        else {
            if (candidateform.candidateName === "" || candidateform.candidateEmail === "" || candidateform.password === "") {
                setLoading(false)
                enqueueSnackbar("Fields are required", {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
            }
            else {
                const email = candidateform.candidateEmail
                const password = candidateform.password
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (user) => {
                        console.log("user creation succes", user.user);
                        enqueueSnackbar("Registered Successfully", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        });
                        setDoc(doc(firestore, "candidates", user.user.uid), {
                            ...candidateform
                        })
                        setLoading(false)
                        setTimeout(() => {
                            navigate("/login")
                        }, 2000);
                    })
                    .catch((err) => {
                        setLoading(false)
                        setErrorMessage(err.code)
                        enqueueSnackbar(err?.code, {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        });
                        console.log(err);
                    })
            }
        }
    }

    console.log(companyForm);
    console.log(usertype);

    return (

        <div className="h-screen mx-auto container flex col" style={{ width: "100%", margin: "60px 0", }}>
            <SnackbarProvider />
            <DotLoaderOverlay color='#3575E2' loading={loading} />
            <div className="w-full max-w-lg mx-auto" style={{ width: "100%" }}>
                {/* <form */}
                {/* // style={{ width: "100%" }} */}
                {/* // onSubmit={handleRegister} */}
                {/* className="bg-white shadow-md rounded w-100% px-8 pt-8 pb-8 mb-4" */}
                {/* > */}
                <div className="justify-center flex">        
        <img className="" style={{
          height: '61px',
          width: '170px',
        }}
          src="public/images/logo.png" />
          </div>
                <h3 className="text-3xl text-center font-semibold mb-4 text-blue">Sign Up!</h3>
                <div className="flex items-center justify-between">
                    <button className="w-full bg-blue hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        // type="submit"
                        onClick={(e) => {
                            e.preventDefault()
                            setUserType('candidate')
                        }}>

                        Candidate

                    </button>
                    <span className="mt-5 mx-4">Or</span>
                    <button className="w-full bg-blue hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        // type="submit"
                        onClick={(e) => {
                            e.preventDefault()
                            setUserType('company')
                        }}>

                        Employer

                    </button>
                </div>
                {usertype === "candidate" ? (
                    <div className="grid grid-cols-1 gap-4 mt-5">
                        {Object.entries(candidateform).map(([k, v]) => {
                            if (k !== "createdAt" && k !== "role") {
                                return (
                                    <div className="mb-1" key={k}>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="name"
                                            type="text"
                                            placeholder={`Enter ${k.slice(0, 1).toUpperCase() + k.slice(1, 9) + " " + k.slice(9, 100)}`}
                                            onChange={(e) => {
                                                setCandidateForm((prevFields) => ({ ...prevFields, [k]: e.target.value }));
                                                console.log(e.target.value, k);
                                                console.log("key", k);
                                            }}
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 mt-5" style={{ width: "100%" }}>
                        {Object.entries(companyForm).map(([k, v]) => {
                            return (
                                k === "createdAt" || k === "role" || k === "jobs" ? "" : k === "image" ? (
                                    <>
                                        <div className="mb-1" key={k} style={{ width: "100%" }}>
                                            <input onChange={(e) => setCompanyForm((prevFields) => ({ ...prevFields, image: e.target.files[0] }))} type="file" id="actual-btn" hidden />
                                            <label for="actual-btn" className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                Upload Image
                                            </label>
                                        </div>
                                    </>
                                ) : (   
                                    <div className="mb-1" key={k} style={{ width: "100%" }}>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="name"
                                            type="text"
                                            placeholder={`Enter ${k}`}
                                            onChange={(e) => {
                                                setCompanyForm((prevFields) => ({ ...prevFields, [k]: e.target.value }))
                                            }}
                                        />
                                    </div>
                                )
                            )
                        })}
                    </div>
                )}

                {errorMessage && <p className="text-red-500 text-lg mt-4">{errorMessage}</p>}

                <div className="mt-5 mb-5">
                    <button className="w-full bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleRegister}>
                        Sign up
                    </button>


                    
                    {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a> */}
                </div>
                <div className="mt-8 text-center w-full mx-auto">
          <Link to="/login">Already a member? <span className='text-blue'>Sign in</span></Link>
          </div>
                {/* social login */}
                {/* <div className="mt-8 text-center w-full mx-auto">
                    <p className="mb-4">Sign up with Social</p>

                    <div className="flex items-center justify-center gap-4 w-full mx-auto">
                        <button
                            className=" border-2 text-blue hover:text-white hover:bg-blue font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center gap-2"
                            type="button"
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
                </div> */}
                {/* </form> */}

            </div>
        </div>
    );
};

export default Signup;
