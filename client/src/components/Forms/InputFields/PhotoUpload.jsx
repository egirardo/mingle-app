import { useRef, useState, useEffect } from "react";
import styles from "./PhotoUpload.module.css";
import TextInput from "./TextInput";
import Button from "../../Buttons/Button";
import photoIcon from "../../../assets/icons/photo.svg";

export default function PhotoUpload() {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke the previous blob URL to prevent memory leak
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
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
                    accept="image/*"
                    onChange={handleChange}
                    className={styles.hiddenInput}
                    aria-hidden="true"
                    name="profilePhoto"
                />
                <div className={styles.uploadButton}>
                    <Button
                        buttonName="Upload photo"
                        buttonColor="gray"
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
                />
            </div>
        </div>
    );
}