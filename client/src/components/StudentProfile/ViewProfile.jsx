import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import defaultAvatar from "../../assets/default-avatar.png"; // Placeholder image for students without a profile picture
import styles from "./ViewProfile.module.css";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import Button from "../Buttons/Button";
import TagContainer from "../Tags/TagContainer";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/students/profile/${id}`);
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
                ariaLabel="Go back to home page"
                onClick={() => navigate("/")}
                />
              <Button
                buttonName="Portfolio"
                iconSrc="arrow45"
                buttonColor="transparent"
                variant="textUnderline"
                ariaLabel="External Portfolio Link"
                onClick={() => window.open(profile.portfolio, '_blank', 'noopener,noreferrer')}
                /> 
            </div> 
            ) : (
            <div className={styles.buttonContainer}>
              <IconOnlyButton
                iconSrc="arrowBack"
                buttonColor="transparent"
                ariaLabel="Go back to home page"
                onClick={() => navigate("/")}
              />
            </div> ) }

                {profile.profileImage
                    ? <img className={styles.profileImage} src={profile.profileImage} alt="Profile" />
                    : <img className={styles.profileImage} src={defaultAvatar} alt="Default avatar" />
                }
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
                buttonColor="transparent"
                variant="textUnderline"
                ariaLabel="Edit Profile"
                onClick={() => navigate(`/students/${id}/edit`)}
              />
            )}

          </section>
        </div>
    </div>
  );
}