import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { axiosMain } from "@/Utils/axiosUtil";
import CompanyStatic from "../../../../public/Comany-Static-Logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface JobPost {
  title: string;
  company_id: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

interface Company {
  company_id: string;
  name: string;
  logo: string;
}

interface CombinedJobPost extends JobPost {
  companyName: string;
  logo: string;
}

const RecommendedJobs: React.FC = () => {
  console.log("Inside RecommendedJobs");

  const [recommendedJobs, setRecommendedJobs] = useState<CombinedJobPost[]>([]);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      company_id: string;
      profileImage: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  console.log("allProfileImages", allProfileImages);
  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const response = await axiosMain.get(`/user/getAllJobPosts`);

      const jobPosts: JobPost[] = response.data?.jobPosts || [];
      const companies: Company[] = response.data?.companies || [];

      // Create a map of companies for quick lookup
      const companyMap = new Map<string, Company>();
      companies.forEach((company) => {
        companyMap.set(company.company_id, company);
      });

      // Combine jobPosts with company details
      const combinedData: CombinedJobPost[] = jobPosts.map((job) => {
        const company = companyMap.get(job.company_id);
        return {
          ...job,
          companyName: company?.name || "Unknown Company",
          logo: company?.logo || "/placeholder.svg",
        };
      });

      setRecommendedJobs(combinedData);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
      setError("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const getAllProfileImages = async () => {
    try {
      const response = await axiosMain.get("/user/getAllCompanyProfileImages");
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  useEffect(() => {
    getAllProfileImages();
  }, [recommendedJobs]);

  const renderCompanyAvatar = (companyId: string, companyName: string) => {
    const companyProfileImage = allProfileImages.find(
      (img) => img.company_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={companyProfileImage || CompanyStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Recommended Jobs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recommendedJobs.length === 0 ? (
        <p className="text-gray-400">No job posts available right now.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div
            className="w-full md:w-1/3 h-[400px] relative bg-cover bg-center rounded-xl"
            style={{
              backgroundImage:
                "url('https://images.ctfassets.net/pdf29us7flmy/4vqUBQWFBgeB7FWjdT5Csb/064c7127f6ae2f9ea5d1b10e8b91466c/Career_Guide_Photos-2160x1215-GettyImages-1307598870.jpg?w=720&q=100&fm=jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-xl"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Find Your Dream Job</h3>
              <p className="text-sm">
                Explore opportunities tailored just for you
              </p>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4 h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {recommendedJobs.map((job, index) => (
              <div
                key={index}
                className="group bg-gray-900 p-4 rounded-xl border border-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    {renderCompanyAvatar(job.company_id, job.companyName)}
                    {/* {allProfileImages
                      ? allProfileImages
                          .filter((img) => job.company_id === img.company_id)
                          .map(
                            (img, index) => (
                              console.log("img img img", img),
                              (
                                <img
                                  key={index}
                                  src={img.profileImage}
                                  alt="Company Logo"
                                  className="w-12 h-12 rounded-full"
                                />
                              )
                            )
                          )
                      : null} */}
                    <div>
                      <h3 className="font-semibold group-hover:text-red-500 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-400">{job.companyName}</p>
                    </div>
                  </div>
                  {/* <Button variant="ghost" size="icon">
                    <BookmarkPlus className="w-5 h-5" />
                  </Button> */}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-500 font-semibold">
                      {job.salary}
                    </span>
                    <span className="text-gray-400">{job.posted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendedJobs;
