import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Sidebar from "../Sidebar/Sidebar";
import Jobs from "./Jobs";
import Card from "../components/Card";
import Newsletter from "../components/Newsletter";
import { collection, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { auth } from "../firebase/firebase.config";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const firestore = getFirestore()
  const userId = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setQuery2(event.target.value);
  };

  const filteredItems = jobs?.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems?.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredData = (selected, query, query2) => {
    if (jobs?.length > 0) {
      let filteredJobs = jobs;
      if (query || query2) {
        filteredJobs = filteredItems;
      }
      if (selected) {
        filteredJobs = filteredJobs.filter(({ jobCompanyAddress, salaryType, experienceLevel, maxPrice, postingDate, employmentType }) =>
          jobCompanyAddress.toLowerCase() === selected.toLowerCase() ||
          postingDate === selected ||
          parseInt(maxPrice) <= parseInt(selected) ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
        );
      }
      const { startIndex, endIndex } = calculatePageRange();
      filteredJobs = filteredJobs.slice(startIndex, endIndex);
      return filteredJobs.map((data, i) => <Card key={i} data={data} />);
    }
  };

  const result = filteredData(selectedCategory, query, query2);

  const getJobs = async () => {
    setIsLoading(true)
    try {
      const collectionRef = collection(firestore, "jobs")
      onSnapshot(collectionRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { docId: doc.id, ...doc.data() }
        })
        setJobs(data.filter(f => f.jobPostId === user.companyId))
        setIsLoading(false)
      })
    }
    catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getJobs()
  }, [])

  console.log(jobs);
  console.log(user);

  return (
    <div>
      <Banner query={query} handleInputChange={handleInputChange} query2={query2} handleInputChange2={handleInputChange2} />

      {/* main content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        <div className="bg-white p-4 rounded">
          <Sidebar handleChange={handleChange} handleClick={handleClick} />
        </div>
        <div className={`${user === "candidate" ? "col-span-2" : "col-span-3"} bg-white p-4 rounded`}>
          {isLoading ? ( // Loading indicator
            <>
              <Skeleton width="100%" height="200px" />
              <Skeleton width="100%" height="200px" />
              <Skeleton width="100%" height="200px" />
              <Skeleton width="100%" height="200px" />
            </>
          ) : result?.length > 0 ? (
            <Jobs result={result} />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">{jobs?.jobs?.length} Jobs</h3>
              <p>No data found</p>
            </>
          )}

          {/* pagination block here */}

          {result?.length > 0 ? (
            <div className="flex justify-center mt-4 space-x-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="hover:underline"
              >
                Previous
              </button>
              <span className="mx-2">
                Page {currentPage} of{" "}
                {Math.ceil(filteredItems?.length / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredItems?.length / itemsPerPage)
                }
                className="hover:underline"
              >
                Next
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        {user.role === "candidate" && <div className="bg-white p-4 rounded">
          <Newsletter />
        </div>}
      </div>
    </div>
  );
};

export default Home;
