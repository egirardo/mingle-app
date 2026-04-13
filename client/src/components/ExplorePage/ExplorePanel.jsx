import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../../api";
import ProfileCards from "../Molecules/ProfileCards/ProfileCards";
import CompanyProfileCard from "../Molecules/ProfileCards/CompanyProfileCard";
import StudentProfileCard from "../Molecules/ProfileCards/StudentProfileCard";
import TabSlider from "../Atoms/Tabs/TabSlider";
import DragExpand from "../../assets/icons/drag-expand.svg";
// TODO: import ExploreFilters from "../Molecules/ExploreFilters/ExploreFilters";
import styles from "./ExplorePanel.module.css";

const TABS = ["Companies", "Students", "Saved"];

function getLoggedInStudentId() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = jwtDecode(token);
        return payload?.id ?? null;
    } catch {
        return null;
    }
}

export default function ExplorePanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loggedInStudentId, setLoggedInStudentId] = useState(getLoggedInStudentId);

    // Keep loggedInStudentId in sync with login/logout events
    useEffect(() => {
        const handleAuthChange = () => setLoggedInStudentId(getLoggedInStudentId());
        window.addEventListener("authchange", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);
        return () => {
            window.removeEventListener("authchange", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    // ── Data fetching ───────────────────────────────────────────────────────
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            setError(null);

            const alreadyCached =
                (activeTab === "Companies" && companies.length > 0) ||
                (activeTab === "Students" && students.length > 0) ||
                (activeTab === "Saved" && saved.length > 0);

            if (alreadyCached) return;

            setLoading(true);
            try {
                if (activeTab === "Companies") {
                    const res = await apiFetch("/api/companies", { signal });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setCompanies(data);
                }

                if (activeTab === "Students") {
                    const res = await apiFetch("/api/students", { signal });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setStudents(data);
                }

                // TODO: update this endpoint to match your likes/saved API
                if (activeTab === "Saved") {
                    const res = await apiFetch("/api/likes", { signal });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setSaved(data);
                }
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message);
            } finally {
                // Don't clear loading state if this request was superseded
                if (!signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
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
            return students.map((student) => (
                <StudentProfileCard
                    key={student._id}
                    student={student}
                    isOwnCard={loggedInStudentId === String(student.studentId)}
                />
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
            <button
                type="button"
                className={styles.dragHandle}
                onClick={() => setIsExpanded(prev => !prev)}
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
                aria-expanded={isExpanded}
            >
                <img src={DragExpand} alt="" aria-hidden="true" />
            </button>

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