import { useState, useEffect, useMemo } from "react";
import api from "../../../../api/api";

const useUserAccounts = (activeTab) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      setLoading(true);
      try {
        const queryParam = getQueryParam(activeTab);
        const response = await api.get(`/api/firmsetting-page/user-accounts/`, {
          params: { q: queryParam },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab) {
      fetchUserAccounts();
    }
  }, [activeTab]);

  return { data, loading, error };
};

const getQueryParam = (activeTab) => {
  switch (activeTab) {
    case "all":
      return "All";
    case "active":
      return "Active";
    case "in-active":
      return "InActive";
    default:
      return "";
  }
};

export default useUserAccounts;
