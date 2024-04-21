/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaDollarSign } from "react-icons/fa";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { DotLoaderOverlay } from 'react-spinner-overlay'
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const CreateJob = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem('user'));
  const companyID = localStorage.getItem('token');
  const firestore = getFirestore()

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

  const [jobform, setjobform] = useState({
    jobTitle: '',
    jobPostedBy: company?.email,
    jobPostedAt: new Date(),
    jobDescription: '',
    jobType: '',
    jobSkills: [],
    jobExperience: '',
    jobSalaryType: '',
    jobMinimumSalary: '',
    jobMaximumSalary: '',
    jobDate: '',
    jobCompany: company?.name,
    jobCompanyAddress: company?.address,
    jobCompanyLogo: company?.image,
  })

  const handleChange = (key, value) => {
    setjobform((prevFields) => {
      return { ...prevFields, [key]: value }
    })
  }

  function handleJob() {
    if (
      jobform.jobTitle === "" ||
      jobform.jobDescription === "" ||
      jobform.jobType === "" ||
      jobform.jobSkills?.length === 0 ||
      jobform.jobExperience === "" ||
      jobform.jobSalaryType === "" ||
      jobform.jobMinimumSalary === "" ||
      jobform.jobMaximumSalary === "" ||
      jobform.jobCompany === "" ||
      jobform.jobCompanyAddress === ""
    ) {
      enqueueSnackbar("Fields are required", {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
      return
    }
    setLoading(true)
    addDoc(collection(firestore, "jobs"), {
      ...jobform,
      jobPostId: companyID
    })
      .then(() => {
        setLoading(false)
        enqueueSnackbar("Job Post Successfully", {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
        setTimeout(() => {
          navigate("/")
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      })
  }

  console.log(jobform);
  console.log(selectedOption);

  // console.log(watch("example"));

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <SnackbarProvider />
      <DotLoaderOverlay color='#3575E2' loading={loading} />
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <div className="space-y-5">
          {/* 1st row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                placeholder="Enter Job Title"
                // {...register("jobTitle")}
                className="block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                value={jobform.jobCompany}
                onChange={(e) => handleChange("jobCompany", e.target.value)}
                placeholder="Ex: Microsoft"
                className="create-job-input"
              />
            </div>
          </div>

          {/* 2nd row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input
                onChange={(e) => handleChange("jobMinimumSalary", e.target.value)}

                placeholder="$20k"
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input

                onChange={(e) => handleChange("jobMaximumSalary", e.target.value)}

                placeholder="$100k"
                className="create-job-input"
              />
            </div>
          </div>

          {/* 3rd row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select onChange={(e) => handleChange("jobSalaryType", e.target.value)} className="create-job-input">
                <option value="">Choose your salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                onChange={(e) => handleChange("jobCompanyAddress", e.target.value)}
                placeholder="Ex: New York"
                className="create-job-input"
              />
            </div>
          </div>

          {/* 4th row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input

                onChange={(e) => handleChange("jobDate", e.target.value)}
                className="create-job-input"
                placeholder="Ex: 2023-11-03"
                type="date"
              />
            </div>

            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select

                onChange={(e) => handleChange("jobExperience", e.target.value)}
                className="create-job-input"
              >
                <option value="">Select Experience Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          {/* 5th row */}
          <div className="">
            <label className="block mb-2 text-lg">Required Skill Sets:</label>
            <CreatableSelect
              className="create-job-input py-4"
              defaultValue={selectedOption}
              onChange={(e) => {
                setjobform((prevFields) => {
                  return {
                    ...prevFields,
                    jobSkills: e
                  }
                })
              }}
              options={options}
              isMulti
            />
          </div>

          {/* 6th row */}
          <div className="create-job-flex">
            {/* <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo</label>
              <input
                onChange={(e) => handleChange("jobCompanyLogo", e.target.value)}

                type="url"
                placeholder="Paste your image url: https://weshare.com/img1.jpg"
                className="create-job-input"
              />
            </div> */}

            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                onChange={(e) => handleChange("jobType", e.target.value)}

                className="create-job-input"
              >
                <option value="">Select employment type</option>
                <option value="Internee">Internee</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Type</label>
              <select
                onChange={(e) => handleChange("jobType", e.target.value)}
                className="create-job-input"
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>


          </div>
          {jobform.jobType === "Contract" && (
            <div className="w-full">
              <label className="block mb-2 text-lg">Job Duration</label>
              <select
                onChange={(e) => handleChange("jobDuration", e.target.value)}
                className="create-job-input"
              >
                <option value="">Select job duration</option>
                <option value="8 Months">8 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
              </select>
            </div>
          )}

          {/* 7th row */}
          <div className="w-full">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              onChange={(e) => handleChange("jobDescription", e.target.value)}

              className="w-full pl-3 py-1.5 focus:outline-none"
              rows={6}
              placeholder="job description"
            />
          </div>

          {/* last row */}
          {/* <div className="w-full">
            <label className="block mb-2 text-lg">Job Posted by</label>
            <input
              onChange={(e) => handleChange("jobPostedBy", e.target.value)}

              type="email"
              // value={company?.email}
              className="w-full pl-3 py-1.5 focus:outline-none"
              placeholder="your email"
            />
          </div> */}

          <button onClick={handleJob} className="block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
