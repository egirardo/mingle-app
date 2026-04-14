import styles from "./PhotoUpload.module.css";
import { useRef, useState, useEffect } from "react";
import Button from "../../Buttons/Button";
import DefaultAvatar from "../../../../assets/default-avatar.png";

export default function EditPhoto({
  onFileChange,       // (File) => void — called when the user picks an image
  initialPreview,     // string | null — URL of existing profile image to show before any file is picked
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
          <img
            src={preview ?? initialPreview ?? DefaultAvatar}
            alt="Profile preview"
            className={styles.preview}
          />
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
    </div>
  );
}