import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCalendars = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGetCalendars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/get-calendars/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGetCalendars();
  }, [fetchGetCalendars]);

  return { data, loading, error, refetch: fetchGetCalendars };
};

export default useGetCalendars;

const useGetIntegrateCalendars = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const integrateCalendars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/integrate-calendars/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    integrateCalendars();
  }, [integrateCalendars]);

  return { data, loading, error, refetch: integrateCalendars };
};

export { useGetIntegrateCalendars };
