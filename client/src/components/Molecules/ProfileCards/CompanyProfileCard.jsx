import styles from "./CompanyProfileCard.module.css";
import LikeIcon from "../../../assets/icons/like.svg";
import LikeFilledIcon from "../../../assets/icons/like-filled.svg";
import { useNavigate } from "react-router-dom";
import IconOnlyButton from "../../Atoms/Buttons/IconOnlyButton";
import TagContainer from "../../Atoms/Tags/TagContainer";
import Tag from "../../Atoms/Tags/Tag";
import { useSaved } from "../../../context/SavedContext";

export default function CompanyProfileCard({ company }) {
    const navigate = useNavigate();
    const { isSaved, toggleSave, isLoggedIn } = useSaved();

    const handleClick = () => {
    navigate(`/companies/${company._id}`);
    };

    const saved = isSaved(company._id);

    if (!company) return null;

    return (
        <div className={styles.cardContainer}>
            <div className={styles.topHalfContainer}>
                <div className={styles.headingContainer}>
                    <div className={styles.nameHeartContainer}>
                        <h2 className={styles.companyName}>{company.company}</h2>
                        {isLoggedIn && (
                            <button
                                type="button"
                                className={styles.likeButton}
                                onClick={(e) => { e.stopPropagation(); toggleSave(company, "company"); }}
                                aria-label={saved ? "Remove from saved" : "Save company"}
                            >
                                <img
                                    src={saved ? LikeFilledIcon : LikeIcon}
                                    alt=""
                                    aria-hidden="true"
                                    className={styles.likeIcon}
                                />
                            </button>
                        )}
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
                <p className={styles.infoContent}>{company.about || "No description available."}</p>
            </div>
            <div className={styles.infoContainer}>
                <h2 className={styles.infoHeading}>LIA Spaces</h2>
                <Tag tagName={company.liaSpaces} tagType="small" />
            </div>
        </div>
    );
}