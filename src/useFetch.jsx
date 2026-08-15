import { useState, useEffect } from "react";

function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const results = await response.json();
        setData(results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

export default useFetch;
