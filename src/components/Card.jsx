
import moment from "moment";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiSearch } from "react-icons/fi";
import { Link, useNavigate, useNavigation } from "react-router-dom";

const Card = ({ data }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const { docId, jobId, jobCompanyLogo, jobTitle, jobCompany, jobCompanyAddress, employmentType, jobMinimumSalary, jobMaximumSalary, postingDate, jobDescription, jobPostedAt } = data;
  
  console.log(data)
  return (
    
    <div>
      <section className="card">
        <div className="flex gap-4 flex-col sm:flex-row items-start" onClick={() => navigate(`/jobs/${docId}`)}>
          <img src={jobCompanyLogo} alt="" className="w-16 h-16 mb-4" />
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
            <h4 className="text-primary mb-1 font-semibold mt-3">Posted {moment(jobPostedAt?.toDate()).fromNow()}</h4>

          </div>
          {user?.role === "candidate" && (
            <button
              type="submit"
              className="bg-blue py-2 px-8 text-white rounded"
            >
              Apply Now
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Card;
