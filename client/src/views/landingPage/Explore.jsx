import OtherPageLayout from "./Layout/OtherPageLayout";
import CompanyProfileCard from "../../components/Molecules/ProfileCards/CompanyProfileCard";

const mockCompany = {
  id: "64b1f2c9e4b0a12345678901", // fake MongoDB ObjectId
  company: "Tech Corp",
  contactPerson: "Jane Doe",
  email: "jane@techcorp.com",
  liaSpaces: "2 or more",
  skills: ["JavaScript", "React", "Node.js"],
  about: "We build cool stuff.",
  website: "https://techcorp.com"
};

function Explore() {
    return (
        <OtherPageLayout>
            <CompanyProfileCard company={mockCompany} />
        </OtherPageLayout>
    );
}

export default Explore;