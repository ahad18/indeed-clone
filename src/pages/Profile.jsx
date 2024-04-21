/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaDollarSign } from "react-icons/fa";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { DotLoaderOverlay } from 'react-spinner-overlay'
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiSearch } from "react-icons/fi";
import moment from "moment";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const Profile = () => {

  const [loading, setLoading] = useState(false);
  const storage = getStorage()
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = localStorage.getItem('token');
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redux", label: "Redux" },
  ];

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: null,
    image: null,
    role: 'company',
    jobs: null,
  })

  const handleChange = (key, value) => {
    setProfile((prevFields) => {
      return { ...prevFields, [key]: value }
    })
  }

  const firestore = getFirestore()

  function handleJob() {
    setLoading(true)
    updateDoc(doc(firestore, "companies", userId), {
      ...profile,
    })
      .then(async () => {
        setLoading(false)
        console.log("company registered");
        setLoading(false)
        const storageRef = ref(storage, "companies", profile.image.name)
        const uploadRes = await uploadBytesResumable(storageRef, profile.image)
        const downloadURL = await getDownloadURL(uploadRes.ref)
        if (downloadURL) {
          updateDoc(doc(firestore, "companies", userId), {
            ...companyForm,
            image: downloadURL
          })
        }
        console.log("image uploaded ====>", downloadURL);
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {

    setProfile({
      name: user?.name,
      email: user?.email,
      password: user?.password,
      address: user?.address,
      phone: user?.phone,
      image: user?.image,
      role: user?.role,
    })
  }, [])

  const getJobs = async () => {
    setIsLoading(true)
    try {
      const collectionRef = collection(firestore, "jobs");
      const querySnapshot = await getDocs(query(collectionRef, where("jobPostId", "==", userId)));
      const jobsData = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
      setJobs(jobsData);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getJobs()
  }, [])

  console.log(jobs);

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <SnackbarProvider />
      <h1 className="text-3xl font-bold text-primary mb-10 mt-10">
        Company <span className="text-blue">Profile</span>
      </h1>
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <DotLoaderOverlay color='#3575E2' loading={loading} />
        <div className="space-y-5">
          {/* 1st row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                defaultValue="Web Developer"
                // {...register("jobTitle")}
                className="block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Email</label>
              <input

                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Ex: Microsoft"
                className="create-job-input"
              />
            </div>
          </div>

          {/* 2nd row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Password</label>
              <input
                onChange={(e) => handleChange("password", e.target.value)}

                value={profile.password}
                placeholder="$20k"
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Address</label>
              <input

                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}

                placeholder="$100k"
                className="create-job-input"
              />
            </div>
          </div>

          {/* 3rd row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Phone</label>
              <input

                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ex: New York"
                className="create-job-input"
              />
            </div>
          </div>

          {/* last row */}
          <div className="w-full">
            <label className="block mb-2 text-lg">Profile</label>
            <img
              onClick={() => navigate("/profile")}
              className="inline-block h-20 w-20 rounded-full ring-2 ring-white"
              src={profile?.image}
              alt=""
            />
            <input
              id="upload-btn"
              hidden
              onChange={(e) => handleChange("image", e.target.files[0])}
              type="file"
              className="w-full pl-3 py-1.5 focus:outline-none"
              placeholder="your email"
            />
            <label for="upload-btn" className="block mb-2 text-lg">Upload</label>
          </div>

          <button onClick={handleJob} className="block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer">
            Submit
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-primary mb-10 mt-10">
        Jobs <span className="text-blue">Posted</span>
      </h1>
      {jobs?.length === 0 || jobs === null ? (
        <h1 className="text-3xl font-bold text-primary mb-10 mt-10">
          No <span className="text-blue">Jobs Available</span>
        </h1>
      ) : isLoading ? (
        <>
          <Skeleton width="100%" height="200px" />
          <Skeleton width="100%" height="200px" />
          <Skeleton width="100%" height="200px" />
          <Skeleton width="100%" height="200px" />
        </>
      ) : jobs?.map(({
        docId, jobId, jobCompanyLogo, jobTitle, jobCompany, jobCompanyAddress, employmentType, jobMinimumSalary, jobMaximumSalary, postingDate, jobDescription, jobPostedAt
      }) => {
        return (
          <div>
            <section className="card">
              <div className="flex gap-4 flex-col sm:flex-row items-start" onClick={() => navigate(`/jobs/${docId}`)}>
                <img src={jobCompanyLogo} alt={jobTitle} className="w-16 h-16 mb-4" />
                <div className="card-details">
                  <h3 className="text-lg font-semibold">{jobTitle}</h3>
                  <h4 className="text-primary mb-1">{jobCompany}</h4>

                  <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
                    <span className="flex items-center gap-2"><FiMapPin /> {jobCompanyAddress}</span>
                    <span className="flex items-center gap-2"><FiClock /> {employmentType}</span>
                    <span className="flex items-center gap-2"><FiDollarSign /> {jobMinimumSalary}-{jobMaximumSalary}k</span>
                    <span className="flex items-center gap-2"><FiCalendar /> {postingDate}</span>
                  </div>

                  <p className="text-base text-primary/70">{jobDescription}</p>
                  <h4 className="text-primary mb-1 font-semibold mt-3">Posted {moment(jobPostedAt.toDate()).fromNow()}</h4>

                </div>
                <button
                  onClick={async () => {
                    setIsLoading(true)
                    deleteDoc(doc(firestore, "jobs", docId))
                      .then((res) => {
                        setIsLoading(false)
                        enqueueSnackbar("Job deleted successfully", {
                          variant: 'success',
                          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right'
                          }
                        });
                      })
                      .catch((err) => {
                        setIsLoading(false)
                      })
                  }}
                  type="submit"
                  className="bg-blue py-2 px-8 text-white rounded"
                >
                  Delete
                </button>
              </div>

            </section>
          </div>
        )
      })}
    </div>
  );
};

export default Profile;
