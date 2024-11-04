import { useState, useEffect } from "react";
import api from "../../../../api/api";

const useFetchNumbers = (areaCode) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!areaCode) return;

    const fetchNumbers = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/firmsetting-page/fetch-numbers/`, {
          params: {
            area_code: areaCode,
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, [areaCode]);

  return { data, loading, error };
};

export default useFetchNumbers;

const usePurchaseNumber = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const savePhoneNumber = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/purchase-number/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { savePhoneNumber, loading, error, success };
};

export { usePurchaseNumber };
