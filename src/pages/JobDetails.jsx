import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa6";
import Swal from 'sweetalert2'
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { DotLoaderOverlay } from "react-spinner-overlay";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";

const JobDetails = () => {

  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const [apply, setApply] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadCv, setUploadCv] = useState(null);
  const [uploadCv2, setUploadCv2] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("token");
  const firestore = getFirestore()
  const storage = getStorage()

  const getDetails = async () => {
    const docRef = doc(firestore, "jobs", id);
    const docSnap = await getDoc(docRef)
    setJob(docSnap.data())
    console.log(docSnap.data());
  }

  useEffect(() => {
    getDetails()
  }, [id])

  const handleJobApply = async () => {
    const obj = {
      ...user,
      appliedJobFor: id,
      resume: "",
      userId: userId
    }
    setLoading(true)
    addDoc(collection(firestore, "appliedCandidates"), obj)
      .then(async (response) => {
        const imgRef = ref(storage, `resume/${uploadCv2.name}`)
        uploadBytesResumable(imgRef, uploadCv2)
          .then((res) => {
            getDownloadURL(res.ref)
              .then(async (url) => {
                console.log("IMAGE UPLOADED", url);
                setDoc(doc(firestore, "appliedCandidates", response.id), {
                  ...obj,
                  resume: url
                })
                  .then(async () => {
                    try {
                      const resp = await axios.post("https://server-two-navy.vercel.app/send-email", {
                        to: job?.jobPostedBy,
                        downloadURL: url
                      })
                      console.log(resp.data);
                    }
                    catch (error) {
                      console.log(error);
                    }
                  })
              })
              .catch((err) => {
                console.log("IMAGE UPLOAD ERROR", err);
              })
          })
        setLoading(false)
        setSuccess(true)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err);
      })
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <DotLoaderOverlay color='#3575E2' loading={loading} />
      {success ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", flexDirection: "column" }}>
            <h1 className="text-3xl font-bold text-primary mb-3">
              Congratulations! Your <span className="text-blue">Resume</span> Submitted Successfully
            </h1>
            <p className="text-lg text-black/70 mb-8 cursor-pointer" onClick={() => navigate("/")}>
              Go back to homepage
            </p>
          </div>
        </>
      ) : apply ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", flexDirection: "column" }}>
          <input onChange={(e) => {
            setUploadCv(URL.createObjectURL(e.target.files[0]))
            setUploadCv2(e.target.files[0])
          }} id="cv-upload" type="file" hidden />
          <label
            for="cv-upload"
            className="bg-blue py-2 px-8 text-white rounded cursor-pointer"
          >
            Upload CV
          </label>
          {uploadCv && <iframe src={uploadCv} width="400px" height="300px"></iframe>}
          {uploadCv && (
            <button
              onClick={handleJobApply}
              for="cv-upload"
              className="bg-blue py-2 px-8 text-white rounded cursor-pointer"
            >
              Submit
            </button>
          )}
        </div>
      ) : (
        <>
          <PageHeader title={"Job Details Page"} path={"Single Job"} />
          <div className="mt-10">
            <div className="my-4">
              <h2 className="text-2xl font-medium text-blue">Location</h2>
              <p className="text-primary text-lg my-1">
                {job?.jobCompanyAddress}
              </p>
            </div>
            <div className="my-4">
              <h2 className="text-2xl font-medium text-blue">Job details</h2>
              <p className="text-primary text-sm my-1">
                {job?.jobDescription}
              </p>
            </div>

            <div className="my-4 space-y-2">
              <div className="flex items-center gap-2">
                <FaBriefcase />
                <p className="text-xl font-medium mb-2">Job type: {job?.jobType}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-md mb-2">Salary Starting from: {job?.jobMinimumSalary} - {job?.jobMaximumSalary}</p>
              </div>
              <button className="bg-indigo-700 px-6 py-1 text-white rounded-sm ms-2" onClick={() => setApply(true)}>
                Apply Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobDetails;
