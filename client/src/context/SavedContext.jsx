import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../api";

const LS_KEY = "mingle_saved";

function getStudentId() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return jwtDecode(token)?.id ?? null;
    } catch {
        return null;
    }
}

function loadFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY)) ?? [];
    } catch {
        return [];
    }
}

function writeToStorage(profiles) {
    localStorage.setItem(LS_KEY, JSON.stringify(profiles));
}

function authedFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    return apiFetch(path, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
    const [savedProfiles, setSavedProfiles] = useState(loadFromStorage);
    const [studentId, setStudentId] = useState(getStudentId);

    // Expose whether the viewer is a logged-in student
    const isLoggedIn = Boolean(studentId);

    // Keep studentId in sync with login/logout
    useEffect(() => {
        const handleAuthChange = () => setStudentId(getStudentId());
        window.addEventListener("authchange", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);
        return () => {
            window.removeEventListener("authchange", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    const isSaved = useCallback(
        (profileId) => savedProfiles.some((p) => p.profileId === String(profileId)),
        [savedProfiles]
    );

    const toggleSave = useCallback(
        async (profile, type) => {
            // Students are identified by studentId (auth ID); companies by _id
            const profileId = type === "student"
                ? String(profile.studentId)
                : String(profile._id);

            const alreadySaved = savedProfiles.some((p) => p.profileId === profileId);

            const updated = alreadySaved
                ? savedProfiles.filter((p) => p.profileId !== profileId)
                : [...savedProfiles, { profileId, type, data: profile }];

            setSavedProfiles(updated);
            writeToStorage(updated);

            // Logged-in students also sync company saves to the backend
            if (studentId) {
                try {
                    if (alreadySaved) {
                        await authedFetch(`/api/students/likes/${profileId}`, { method: "DELETE" });
                    } else {
                        await authedFetch("/api/students/likes", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ profileId, type }),
                        });
                    }
                } catch (err) {
                    console.error("Failed to sync save to backend:", err);
                }
            }
        },
        [savedProfiles, studentId]
    );

    return (
        <SavedContext.Provider value={{ savedProfiles, isSaved, toggleSave, isLoggedIn }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    const ctx = useContext(SavedContext);
    if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
    return ctx;
}
