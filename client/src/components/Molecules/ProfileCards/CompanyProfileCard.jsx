import styles from "./CompanyProfileCard.module.css";
import LikeIcon from "../../../assets/icons/like.svg";
import { useNavigate } from "react-router-dom";
import IconOnlyButton from "../../Atoms/Buttons/IconOnlyButton";
import TagContainer from "../../Atoms/Tags/TagContainer";
import Tag from "../../Atoms/Tags/Tag";

export default function CompanyProfileCard({ company }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/companies/${company.id}`);
    };

    if (!company) return null;

    return (
        <div className={styles.cardContainer}>
            <div className={styles.topHalfContainer}>
                <div className={styles.headingContainer}>
                    <div className={styles.nameHeartContainer}>
                        <h2 className={styles.companyName}>{company.company}</h2>
                        <img src={LikeIcon} alt="Like" />
                    </div>
                    <IconOnlyButton
                        iconSrc="arrow45"
                        buttonColor="transparent"
                        ariaLabel="View Company Profile"
                        onClick={handleClick}
                    />
                </div>
                <div className={styles.tagContainer}>
                    <TagContainer tags={[...company.skills]} tagType="profileCard" />
                </div>
            </div>
            <div className={styles.infoContainer}>
                <h2 className={styles.infoHeading}>About</h2>
                <p className={styles.infoContent}>{company.about}</p>
            </div>
            <div className={styles.infoContainer}>
                <h2 className={styles.infoHeading}>LIA Spaces</h2>
                <Tag tagName={company.liaSpaces} tagType="small" />
            </div>
        </div>
    );
}