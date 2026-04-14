import styles from "./CompanyProfile.module.css";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import Button from "../Atoms/Buttons/Button";
import Tag from "../Atoms/Tags/Tag";
import TagContainer from "../Atoms/Tags/TagContainer";
import { apiFetch } from "../../api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSaved } from "../../context/SavedContext";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // expects route: /companies/:id
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isSaved, toggleSave, isLoggedIn } = useSaved();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch(`/api/companies/profile/${id}`);
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
          { profile.website ? (
            <div className={styles.buttonsContainer}>
              <IconOnlyButton
                iconSrc="arrowBack"
                buttonColor="transparent"
                ariaLabel="Go back to previous page"
                onClick={() => navigate(-1)}
                />
              <Button
                buttonName="Website"
                iconSrc="arrow45"
                variant="transparentUnderlinePrimary"
                ariaLabel="External Website Link"
                onClick={() => window.open(profile.website, '_blank', 'noopener,noreferrer')}
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
           <section className={styles.infoSection}>
              <div className={styles.headingContainer}>
  
                <div className={styles.headings}>
                  {isLoggedIn && (
                  <div className={styles.largeIconButton}>
                    <IconOnlyButton
                      iconSrc={isSaved(id) ? "bigFilledHeart" : "bigHeart"}
                      variant="iconBig"
                      buttonColor="transparent"
                      ariaLabel={isSaved(id) ? "Remove from saved" : "Save company"}
                      onClick={() => profile && toggleSave(profile, "company")}
                    />
                  </div>
                )}
                  <h1 className={styles.heading}>{profile.company}</h1>
                  <TagContainer tags={[...profile.skills]} tagType="small" />
                </div>
                
  
              </div>
  
              <div className={styles.textContainer}>
  
                <h2 className={styles.sectionHeading}>About</h2>
                <p>{profile.about || "No description available."}</p>
  
              </div>
              <div className={styles.textContainer}>
  
                <h2 className={styles.sectionHeading}>Lia Spaces</h2>
                <Tag tagName={profile.liaSpaces} tagType="small" />
  
              </div>
  
            </section>

      </div>
    </div>

  )
}