import Footer from "./components/Footer"
import Main from "./components/Main"
import Sidebar from "./components/Sidebar"
import { useEffect, useState } from "react"

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      if (!NASA_KEY) {
        console.error("NASA API Key is not defined.");
        return;
      }

      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;
      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;

      try {
        setLoading(true); 
        const res = await fetch(url);
        
        if (!res.ok) { 
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log('Fetched from API today');
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false); 
      }
    }

    fetchAPIData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      ) : data ? (
        <>
          <Main data={data} />
          {showModal && (
            <Sidebar data={data} handleToggleModal={handleToggleModal} />
          )}
          <Footer data={data} handleToggleModal={handleToggleModal} />
        </>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
}

export default App;
