import { useRef, useState, useEffect } from "react";
import styles from "./PhotoUpload.module.css";
import TextInput from "./TextInput";
import Button from "../../Buttons/Button";
import photoIcon from "../../../../assets/icons/photo.svg";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUpload({
  onFileChange, // (File) => void — called when the user picks an image
  portfolio = "", // controlled value for the portfolio URL field
  onPortfolioChange, // (string) => void — called on portfolio input change
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setError(""); // Clear previous errors

    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      e.target.value = "";
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB.");
      e.target.value = "";
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // File is valid, create preview and notify parent
    if (preview) URL.revokeObjectURL(preview);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    if (onFileChange) onFileChange(file);
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
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className={styles.preview}
            />
          ) : (
            <img
              src={photoIcon}
              alt=""
              className={styles.placeholderIcon}
              aria-hidden="true"
            />
          )}
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
        {error && (
          <p role="alert" className={styles.errorMessage}>
            {error}
          </p>
        )}
      </div>
      <div className={styles.portfolioSection}>
        <TextInput
          formLabel="Portfolio link"
          placeholder="https://www.yourportfolio.com"
          type="text"
          optional
          name="portfolio"
          value={portfolio}
          onChange={(e) => onPortfolioChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
