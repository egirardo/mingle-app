import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../api";

// Separate storage keys prevent guest and student data from clobbering each other
// and isolate saves per student account.
const GUEST_KEY = "mingle_saved_guest";
const studentKey = (id) => `mingle_saved_student_${id}`;

function loadFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? [];
    } catch {
        return [];
    }
}

function writeToStorage(key, profiles) {
    localStorage.setItem(key, JSON.stringify(profiles));
}

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
    const [studentId, setStudentId] = useState(null);
    const [savedProfiles, setSavedProfiles] = useState(() => loadFromStorage(GUEST_KEY));

    // Ref gives toggleSave a synchronous, always-current read of savedProfiles
    // without adding it as a useCallback dependency.
    const savedProfilesRef = useRef(savedProfiles);
    useEffect(() => { savedProfilesRef.current = savedProfiles; }, [savedProfiles]);

    const isLoggedIn = Boolean(studentId);

    // Fetch auth state from the server and update studentId.
    const syncWithServer = useCallback(() => {
        apiFetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setStudentId(data?.id ?? null))
            .catch(() => setStudentId(null));
    }, []);

    // On mount, check the server to see if an auth cookie is already present.
    useEffect(() => {
        syncWithServer();
    }, [syncWithServer]);

    // Same-tab: authchange CustomEvent carries { detail: { id } } for instant update.
    // Cross-tab (localStorage signal): when login/logout happens in another tab,
    //   a 'mingle_auth_ts' key change triggers a fresh /api/auth/me check.
    // Visibility: re-verify when the user switches back to this tab, catching
    //   any auth changes that happened while it was in the background.
    useEffect(() => {
        const handleAuthChange = (e) => {
            setStudentId(e?.detail?.id ?? null);
        };

        const handleStorage = (e) => {
            if (e.key === "mingle_auth_ts") syncWithServer();
        };

        const handleVisibility = () => {
            if (document.visibilityState === "visible") syncWithServer();
        };

        window.addEventListener("authchange", handleAuthChange);
        window.addEventListener("storage", handleStorage);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("authchange", handleAuthChange);
            window.removeEventListener("storage", handleStorage);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [syncWithServer]);

    // When the account switches (login/logout/different student), reload from
    // the appropriate storage key so guest and student saves never mix.
    useEffect(() => {
        const key = studentId ? studentKey(studentId) : GUEST_KEY;
        setSavedProfiles(loadFromStorage(key));
    }, [studentId]);

    // When a student logs in, hydrate from the backend (source of truth).
    // Explicitly clears state on empty/error responses so stale guest data
    // or a previous student's data is never shown.
    useEffect(() => {
        if (!studentId) return;

        const controller = new AbortController();
        const key = studentKey(studentId);

        const hydrate = async () => {
            try {
                const likesRes = await apiFetch("/api/students/likes", {
                    signal: controller.signal,
                });

                // On failure, clear rather than leave potentially stale data visible
                if (!likesRes.ok) {
                    setSavedProfiles([]);
                    writeToStorage(key, []);
                    return;
                }

                const likes = await likesRes.json(); // [{ profileId, type }]

                // Backend says no saves — clear so old device data doesn't linger
                if (!likes.length) {
                    setSavedProfiles([]);
                    writeToStorage(key, []);
                    return;
                }

                // Reuse cached profile data where available; fetch the rest
                // in a single bulk request instead of one request per like.
                const currentMap = new Map(
                    loadFromStorage(key).map((e) => [e.profileId, e])
                );

                const typeMap = new Map(
                    likes.map(({ profileId, type }) => [String(profileId), type])
                );

                const missingIds = likes
                    .map(({ profileId }) => String(profileId))
                    .filter((id) => !currentMap.has(id));

                if (missingIds.length) {
                    try {
                        const bulkRes = await apiFetch(
                            `/api/companies/bulk?ids=${missingIds.join(",")}`,
                            { signal: controller.signal }
                        );
                        if (bulkRes.ok) {
                            const companies = await bulkRes.json();
                            for (const company of companies) {
                                const id = String(company._id);
                                currentMap.set(id, {
                                    profileId: id,
                                    type: typeMap.get(id) ?? "company",
                                    data: company,
                                });
                            }
                        }
                    } catch {
                        // Non-fatal — already-cached entries still render
                    }
                }

                const merged = likes
                    .map(({ profileId }) => currentMap.get(String(profileId)))
                    .filter(Boolean);
                setSavedProfiles(merged);
                writeToStorage(key, merged);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Failed to hydrate saves from backend:", err);
                }
            }
        };

        hydrate();
        return () => controller.abort();
    }, [studentId]);

    const isSaved = useCallback(
        (profileId) => savedProfiles.some((p) => p.profileId === String(profileId)),
        [savedProfiles]
    );

    const toggleSave = useCallback(
        async (profile, type) => {
            const profileId = type === "student"
                ? String(profile.studentId)
                : String(profile._id);
            const key = studentId ? studentKey(studentId) : GUEST_KEY;
            let alreadySaved = false;
            setSavedProfiles(prev => {
                alreadySaved = prev.some((p) => p.profileId === profileId);
                const updated = alreadySaved
                    ? prev.filter((p) => p.profileId !== profileId)
                    : [
                        ...prev.filter((p) => p.profileId !== profileId),
                        { profileId, type, data: profile },
                    ];
                writeToStorage(key, updated);
                return updated;
            });

            // Logged-in students also sync to the backend
            if (studentId) {
                try {
                    if (alreadySaved) {
                        await apiFetch(`/api/students/likes/${profileId}`, {
                            method: "DELETE",
                        });
                    } else {
                        await apiFetch("/api/students/likes", {
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
        [studentId]
    );

    return (
        <SavedContext.Provider value={{ savedProfiles, isSaved, toggleSave, isLoggedIn, studentId }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    const ctx = useContext(SavedContext);
    if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
    return ctx;
}
