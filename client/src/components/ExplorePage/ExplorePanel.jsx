import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../../api";
import ProfileCards from "../Molecules/ProfileCards/ProfileCards";
import CompanyProfileCard from "../Molecules/ProfileCards/CompanyProfileCard";
import StudentProfileCard from "../Molecules/ProfileCards/StudentProfileCard";
import TabSlider from "../Atoms/Tabs/TabSlider";
import DragExpand from "../../assets/icons/drag-expand.svg";
import ExploreFilters from "./ExploreFilters";
import styles from "./ExplorePanel.module.css";
import { useSaved } from "../../context/SavedContext";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loggedInStudentId, setLoggedInStudentId] = useState(getLoggedInStudentId);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const fetchedTabs = useRef(new Set());
    const { savedProfiles } = useSaved();

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

            if (fetchedTabs.current.has(activeTab)) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                if (activeTab === "Companies") {
                    const res = await apiFetch("/api/companies", { signal });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    fetchedTabs.current.add("Companies");
                    setCompanies(data);
                }

                if (activeTab === "Students") {
                    const res = await apiFetch("/api/students", { signal });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    fetchedTabs.current.add("Students");
                    setStudents(data);
                }

                // Saved tab reads from SavedContext (localStorage / backend-synced)
                // No API fetch needed here
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
        setSearchQuery("");
        setSelectedSkills([]);
        setSelectedPrograms([]);
    };

    const matchesSearch = (name) =>
        !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = (skills) =>
        selectedSkills.length === 0 || selectedSkills.some((s) => skills?.includes(s));

    const getCards = () => {
        if (activeTab === "Companies")
            return companies
                .filter((c) => matchesSearch(c.company ?? "") && matchesSkills(c.skills))
                .map((company) => (
                    <CompanyProfileCard key={company._id} company={company} />
                ));

        if (activeTab === "Students")
            return students
                .filter((s) => {
                    const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
                    const programMatch = selectedPrograms.length === 0 || selectedPrograms.includes(s.program);
                    return matchesSearch(name) && matchesSkills(s.skills) && programMatch;
                })
                .map((student) => (
                    <StudentProfileCard
                        key={student._id}
                        student={student}
                        isOwnCard={loggedInStudentId === String(student.studentId)}
                    />
                ));

        if (activeTab === "Saved")
            return savedProfiles
                .filter(({ type, data }) => {
                    const name = type === "student"
                        ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
                        : (data.company ?? "");
                    const programMatch = type !== "student" ||
                        selectedPrograms.length === 0 ||
                        selectedPrograms.includes(data.program);
                    return matchesSearch(name) && matchesSkills(data.skills) && programMatch;
                })
                .map(({ profileId, type, data }) =>
                    type === "student"
                        ? <StudentProfileCard key={profileId} student={data} />
                        : <CompanyProfileCard key={profileId} company={data} />
                );

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

            <h1 className={styles.heading}>Explore</h1>

            <div className={styles.controls}>
                <TabSlider tabs={TABS} defaultIndex={0} onChange={handleTabChange} />
                <ExploreFilters
                    key={activeTab}
                    activeTab={activeTab}
                    onSearch={(query) => setSearchQuery(query)}
                    onSkillsChange={(skills) => setSelectedSkills(skills)}
                    onProgramsChange={(programs) => setSelectedPrograms(programs)}
                />
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