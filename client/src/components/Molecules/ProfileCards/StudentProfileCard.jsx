import styles from "./StudentProfileCard.module.css";
import LikeIcon from "../../../assets/icons/like.svg";
import { useNavigate } from "react-router-dom";
import IconOnlyButton from "../../Atoms/Buttons/IconOnlyButton";
import TagContainer from "../../Atoms/Tags/TagContainer";
import DefaultAvatar from "../../../assets/default-avatar.png";

// isOwnCard: if true, hides the like icon (logged-in student viewing their own card)
export default function StudentProfileCard({ student, isOwnCard = false }) {
    const navigate = useNavigate();

    const handleClick = () => {
        // studentId is the auth ID the backend route /students/profile/:id expects
        navigate(`/students/${student.studentId}`);
    };

    if (!student) return null;

    return (
        <div className={styles.cardContainer}>
            <div className={styles.topHalfContainer}>
                <div className={styles.headingContainer}>
                    <div className={styles.photoHeartContainer}>
                        <img
                            src={student.profileImage || DefaultAvatar}
                            alt={`${student.firstName}'s profile`}
                            className={styles.profileImage}
                        />
                        {!isOwnCard && (
                            <img className={styles.likeIcon} src={LikeIcon} alt="Like" />
                        )}
                    </div>
                    <IconOnlyButton
                        className={styles.viewProfileButton}
                        iconSrc="arrow45"
                        buttonColor="transparent"
                        ariaLabel="View Student Profile"
                        onClick={handleClick}
                    />
                </div>
                <div className={styles.nameProgramContainer}>
                    <h2 className={styles.studentName}>{student.firstName} {student.lastName}</h2>
                    <p className={styles.studentProgram}>{student.program}</p>
                </div>
                <div className={styles.tagContainer}>
                    <TagContainer tags={[...student.skills]} tagType="profileCard" />
                </div>
            </div>
            <div className={styles.infoContainer}>
                <h2 className={styles.infoHeading}>Let's Talk About</h2>
                <p className={styles.infoContent}>{student.questions?.[0]}</p>
            </div>
        </div>
    );
}