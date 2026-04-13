import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../api";
import ProfileCards from "../Molecules/ProfileCards/ProfileCards";
import CompanyProfileCard from "../Molecules/ProfileCards/CompanyProfileCard";
import TabSlider from "../Atoms/Tabs/TabSlider";
import DragExpand from "../../assets/icons/drag-expand.svg";
// TODO: import StudentProfileCard from "../Molecules/ProfileCards/StudentProfileCard";
// TODO: import ExploreFilters from "../Molecules/ExploreFilters/ExploreFilters";
import styles from "./ExplorePanel.module.css";

const TABS = ["Companies", "Students", "Saved"];

export default function ExplorePanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // ── Data fetching ───────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === "Companies" && companies.length === 0) {
                    const res = await apiFetch("/api/companies");
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setCompanies(data);
                }
 
                if (activeTab === "Students" && students.length === 0) {
                    const res = await apiFetch("/api/students");
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setStudents(data);
                }
 
                // TODO: update this endpoint to match your likes/saved API
                if (activeTab === "Saved" && saved.length === 0) {
                    const res = await apiFetch("/api/likes");
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setSaved(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
 
        fetchData();
    }, [activeTab]);
 
    const handleTabChange = (index) => {
        setActiveTab(TABS[index]);
    };
 
    const getCards = () => {
        if (activeTab === "Companies")
            return companies.map((company) => (
                <CompanyProfileCard key={company._id} company={company} />
            ));
 
        if (activeTab === "Students")
            // TODO: swap for StudentProfileCard once available
            return students.map((student) => (
                <p key={student._id}>{student.firstName}</p>
            ));
 
        if (activeTab === "Saved")
            // TODO: saved items may be a mix of companies and students —
            // update this to render the correct card type based on item shape
            return saved.map((item) => (
                <CompanyProfileCard key={item._id} company={item} />
            ));
 
        return [];
    };
 
    const emptyMessage = {
        Companies: "No companies found.",
        Students: "No students found.",
        Saved: "No saved profiles yet.",
    };
 
    return (
        <div className={`${styles.panel} ${isExpanded ? styles.expanded : ""}`}>
            <div
                className={styles.dragHandle}
                onClick={() => setIsExpanded(prev => !prev)}
                role="button"
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
                aria-expanded={isExpanded}
            >
                <img src={DragExpand} alt="" aria-hidden="true" />
            </div>
 
            <div className={styles.controls}>
                <TabSlider tabs={TABS} defaultIndex={0} onChange={handleTabChange} />
                {/* TODO: add <ExploreFilters /> here, passing activeTab so filters can adapt per tab */}
            </div>
 
            <div className={styles.scrollArea}>
                <ProfileCards
                    cards={getCards()}
                    loading={loading}
                    error={error}
                    emptyMessage={emptyMessage[activeTab]}
                />
            </div>
        </div>
    );
}
 