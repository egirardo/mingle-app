import styles from "./ProfileCards.module.css";

export default function ProfileCards({ cards, loading, error, emptyMessage }) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cards || cards.length === 0) return <p>{emptyMessage}</p>;

    return (
        <div className={styles.cardGrid}>
            {cards}
        </div>
    );
}