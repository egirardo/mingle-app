import BackgroundVideo from '../../assets/background-video.mp4';
import styles from './BackgroundVideo.module.css';

export default function LandingPageBackgroundVideo() {
    return(
        <div className={styles.backgroundVideoContainer}>
            <video autoPlay loop muted id="bg-video">
                <source src={BackgroundVideo} type="video/mp4" />
            </video>
        </div>
    )
}