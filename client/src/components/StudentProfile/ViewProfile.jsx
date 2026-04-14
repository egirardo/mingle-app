import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import defaultAvatar from "../../assets/default-avatar.png"; // Placeholder image for students without a profile picture
import styles from "./ViewProfile.module.css";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import Button from "../Atoms/Buttons/Button";
import TagContainer from "../Atoms/Tags/TagContainer";
import { apiFetch } from "../../api";
import LikeIcon from "../../assets/icons/like.svg";
import LikeFilledIcon from "../../assets/icons/like-filled.svg";
import { useSaved } from "../../context/SavedContext";

export default function ViewProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // expects route: /students/:id
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        localStorage.removeItem("token");
        setCurrentUserId(null);
      }
    }
  }, []);

  const isOwner = currentUserId && profile?.studentId === currentUserId;
  const { isSaved, toggleSave, isLoggedIn } = useSaved();
  const showLike = !isLoggedIn;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch(`/api/students/profile/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.viewProfileContainer}>
        <div className={styles.profileContainer}>
          { profile.portfolio ? (
            <div className={styles.buttonsContainer}>
              <IconOnlyButton
                iconSrc="arrowBack"
                buttonColor="transparent"
                ariaLabel="Go back to previous page"
                onClick={() => navigate(-1)}
                />
              <Button
                buttonName="Portfolio"
                iconSrc="arrow45"
                variant="transparentUnderlinePrimary"
                ariaLabel="External Portfolio Link"
                onClick={() => window.open(profile.portfolio, '_blank', 'noopener,noreferrer')}
                /> 
            </div> 
            ) : (
            <div className={styles.buttonContainer}>
              <IconOnlyButton
                iconSrc="arrowBack"
                buttonColor="transparent"
                ariaLabel="Go back to previous page"
                onClick={() => navigate(-1)}
              />
            </div> ) }

                <div className={styles.photoHeartContainer}>
                  <img
                    className={styles.profileImage}
                    src={profile.profileImage || defaultAvatar}
                    alt="Profile"
                  />
                  {showLike && (
                    <button
                      type="button"
                      className={styles.likeButton}
                      onClick={() => toggleSave(profile, "student")}
                      aria-label={isSaved(profile.studentId) ? "Remove from saved" : "Save profile"}
                    >
                      <img
                        className={styles.likeIcon}
                        src={isSaved(profile.studentId) ? LikeFilledIcon : LikeIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
          <section className={styles.infoSection}>

            <div className={styles.headingContainer}>

              <div className={styles.headings}>
                <h1 className={styles.heading}>{profile.firstName} {profile.lastName}</h1>
                <p className={styles.subHeading}>{profile.program}</p>
              </div>
              
              <TagContainer tags={[...profile.skills]} tagType="small" />

            </div>

            <div className={styles.textContainer}>

              <h2 className={styles.sectionHeading}>Fun Fact</h2>
              <p>{profile.about}</p>

            </div>

            <div className={styles.textContainer}>
              <h2 className={styles.sectionHeading}>Ask Me About</h2>
              {profile.questions.map((answer, i) => (
                  <p key={i}>{answer}</p>
              ))}
            </div>

            {isOwner && (
              <Button
                buttonName="Edit Profile"
                variant="transparentUnderlinePrimary"
                ariaLabel="Edit Profile"
                onClick={() => navigate(`/students/${id}/edit`)}
              />
            )}

          </section>
        </div>
    </div>
  );
}