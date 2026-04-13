import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export function useCompanyProfile(companyId) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!companyId) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiFetch(`/api/companies/profile/${companyId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [companyId]);

    return { profile, loading, error };
}