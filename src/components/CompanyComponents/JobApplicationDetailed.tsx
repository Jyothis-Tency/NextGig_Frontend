import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { axiosCompany, axiosUser } from "@/Utils/axiosUtil";

interface IUser {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  gender: string;
  preferredLocation: string;
  preferredRoles: string[];
  salaryExpectation: number;
  remoteWork: boolean;
  willingToRelocate: boolean;
  resume: string;
  profileImage: string;
  bio: string;
  skills: string[];
  proficiency: { skill: string; level: string }[];
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    reasonForLeaving: string;
  }[];
  education: {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  certifications: string[];
  languages: { language: string; proficiency: string }[];
  portfolioLink: string;
}

interface IJobApplication {
  _id: string;
  job_id: string;
  user_id: string;
  company_id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
  resume: string;
  coverLetter: string;
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  companyName: string;
  jobTitle: string;
  createdAt: string;
}

export function JobApplicationDetailed() {
  const [application, setApplication] = useState<IJobApplication | null>(null);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { applicationId } = useParams<{ applicationId: string }>();
  const userId = "some_user_id";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const applicationResponse = await axiosCompany.get(
          `job-applications-detailed/${applicationId}`
        );
        setApplication(applicationResponse.data.application);
        const user_id = applicationResponse.data.application.user_id;

        const userResponse = await axiosUser.get(`/user-profile/${user_id}`);
        setUserDetails({
          ...userResponse.data.userProfile,
          profileImage: userResponse.data.image,
        });
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchApplicationDetails();
  }, [applicationId, userId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axiosCompany.put(`update-application-status/${applicationId}`, {
        status: newStatus,
      });
      setApplication((prev) =>
        prev
          ? { ...prev, status: newStatus as IJobApplication["status"] }
          : null
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!application || !userDetails) {
    return <div className="text-center text-white">Application not found.</div>;
  }

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Application Details</h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
      </div>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Job Application Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Job Title:</strong> {application.jobTitle}
              </p>
              <p>
                <strong>Company:</strong> {application.companyName}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* <div>
              <p>
                <strong>Status:</strong>
                <Badge
                  className={`ml-2 ${
                    application.status === "Pending"
                      ? "bg-yellow-500"
                      : application.status === "Shortlisted"
                      ? "bg-blue-500"
                      : application.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {application.status}
                </Badge>
              </p>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-2 bg-gray-700 text-white rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div> */}
          </div>
          {application.coverLetter && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
              <p>{application.coverLetter}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Applicant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            {userDetails.profileImage && (
              <img
                src={userDetails.profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">
              {userDetails.firstName} {userDetails.lastName}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phone}
              </p>
              <p>
                <strong>Location:</strong> {userDetails.location}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Job Preferences</h3>
              <p>
                <strong>Preferred Location:</strong>{" "}
                {userDetails.preferredLocation}
              </p>
              <p>
                <strong>Salary Expectation:</strong> $
                {userDetails.salaryExpectation}
              </p>
              <p>
                <strong>Remote Work:</strong>{" "}
                {userDetails.remoteWork ? "Yes" : "No"}
              </p>
              <p>
                <strong>Willing to Relocate:</strong>{" "}
                {userDetails.willingToRelocate ? "Yes" : "No"}
              </p>
            </div>
          </div>
          {userDetails.bio && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Bio</h3>
              <p>{userDetails.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Skills and Proficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <ul className="list-disc list-inside">
                {userDetails.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Proficiency</h3>
              <ul className="list-disc list-inside">
                {userDetails.proficiency.map((prof, index) => (
                  <li key={index}>
                    {prof.skill}: {prof.level}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {userDetails.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                {exp.jobTitle} at {exp.company}
              </h3>
              <p>{exp.location}</p>
              <p>
                {new Date(exp.startDate).toLocaleDateString()} -{" "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString()
                  : "Present"}
              </p>
              <ul className="list-disc list-inside mt-2">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {userDetails.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                {edu.degree} in {edu.fieldOfStudy}
              </h3>
              <p>{edu.institution}</p>
              <p>
                {new Date(edu.startDate).toLocaleDateString()} -{" "}
                {new Date(edu.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {userDetails.certifications.length > 0 && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {userDetails.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {userDetails.languages.length > 0 && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {userDetails.languages.map((lang, index) => (
                <li key={index}>
                  {lang.language}: {lang.proficiency}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {userDetails.portfolioLink && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={userDetails.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Portfolio
            </a>
          </CardContent>
        </Card>
      )}

      {application.resume && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Resume
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
