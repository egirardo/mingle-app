import { useState } from "react";
import styles from "./ExploreFilters.module.css";
import SearchBar from "../Atoms/Forms/InputFields/SearchBar";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import CheckboxGroup from "../Atoms/Forms/Checkboxes/CheckboxGroup";
import skillOptions from "../../data/filterOptions.json";

const programOptions = [
    { id: "program-digital-designer", name: "Digital Designer", checkboxLabel: "Digital Designer" },
    { id: "program-web-developer", name: "Web Developer", checkboxLabel: "Web Developer" },
];

export default function ExploreFilters({ activeTab, onSearch, onSkillsChange, onProgramsChange }) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterKey, setFilterKey] = useState(0);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch?.(value);
    };

    const clearFilters = () => {
        setSearchQuery("");
        onSearch?.("");
        onSkillsChange?.([]);
        onProgramsChange?.([]);
        setFilterKey((k) => k + 1);
    };

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.searchFilterContainer}>
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSearch={() => onSearch?.(searchQuery)}
                />
                <IconOnlyButton
                    iconSrc={filtersOpen ? "x" : "filter"}
                    buttonColor="transparent"
                    ariaLabel={filtersOpen ? "Close filters" : "Open filters"}
                    variant="iconOnlyMedium"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                />
            </div>
            {filtersOpen && (
                <div className={styles.sortContainer}>
                    <div>
                        <h2 className={styles.sortHeading}>Skills</h2>
                        <CheckboxGroup key={`skills-${filterKey}`} checkboxes={skillOptions} onChange={onSkillsChange} />
                    </div>
                    {activeTab === "Students" && (
                        <div>
                            <h2 className={styles.sortHeading}>Program</h2>
                            <CheckboxGroup key={`programs-${filterKey}`} checkboxes={programOptions} onChange={onProgramsChange} />
                        </div>
                    )}
                    <button type="button" className={styles.clearButton} onClick={clearFilters}>
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}