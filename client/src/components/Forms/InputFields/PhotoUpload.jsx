import { useRef, useState, useEffect } from "react";
import styles from "./PhotoUpload.module.css";
import TextInput from "./TextInput";
import Button from "../../Buttons/Button";
import photoIcon from "../../../assets/icons/photo.svg";

export default function PhotoUpload({
  onFileChange,       // (File) => void — called when the user picks an image
  portfolio = "",     // controlled value for the portfolio URL field
  onPortfolioChange,  // (string) => void — called on portfolio input change
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      if (onFileChange) onFileChange(file);
    }
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className={styles.photoUploadWrapper}>
      <div className={styles.avatarSection}>
        <button
          type="button"
          className={styles.avatarCircle}
          onClick={() => inputRef.current?.click()}
          aria-label="Upload profile photo"
        >
          {preview
            ? <img src={preview} alt="Profile preview" className={styles.preview} />
            : <img src={photoIcon} alt="" className={styles.placeholderIcon} aria-hidden="true" />
          }
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleChange}
          className={styles.hiddenInput}
          aria-hidden="true"
          name="profilePhoto"
        />
        <div className={styles.uploadButton}>
          <Button
            buttonName="Upload photo"
            variant="primaryGray"
            type="button"
            onClick={() => inputRef.current?.click()}
          />
        </div>
      </div>
      <div className={styles.portfolioSection}>
        <TextInput
          formLabel="Portfolio link"
          placeholder="www.yourportfolio.com"
          type="url"
          optional
          name="portfolio"
          value={portfolio}
          onChange={(e) => onPortfolioChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}