import styles from ".StudentProfileCard.module.css";
import defaultAvatar from "../../../assets/default-avatar.png"; // Placeholder image for students without a profile picture
import { useNavigate } from "react-router-dom";

export default function StudentProfileCard({ student }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/students/${student.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img
        src={student.profilePicture || defaultAvatar}
        alt={`${student.firstName} ${student.lastName}`}
        className={styles.avatar}
      />
      <h3 className={styles.name}>{`${student.firstName} ${student.lastName}`}</h3>
      <p className={styles.headline}>{student.headline}</p>
    </div>
  );
}