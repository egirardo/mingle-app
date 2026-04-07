import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.png"; // Placeholder image for students without a profile picture
import styles from "./ViewProfile.module.css";

export default function ViewProfile() {
  const { id } = useParams(); // expects route: /students/:id
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className={styles.profileContainer}>
        

        <h1>{profile.firstName} {profile.lastName}</h1>
        <p>{profile.program}</p>

    
        {profile.profileImage
            ? <img className={styles.profileImage} src={profile.profileImage} alt="Profile" />
            : <img className={styles.profileImage} src={defaultAvatar} alt="Default avatar" />
        }

        {/* Skills is an array — map over it */}
        {profile.skills.map((skill) => (
            <span key={skill}>{skill}</span>
        ))}

        {/* Questions is an array of up to 3 strings */}
        {profile.questions.map((answer, i) => (
            <p key={i}>{answer}</p>
        ))}

        <p>{profile.about}</p>
        <a href={profile.portfolio}>{profile.portfolio}</a>
    </div>
  );
}