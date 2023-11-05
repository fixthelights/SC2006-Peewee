import React, { useState, useEffect } from "react";

const Access_Key: string = "YOUR_ACCESS_KEY"; // Replace this with your actual access key

const App: React.FC = () => {
  const [img, setImg] = useState<string>("");
  const [res, setRes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async (): Promise<void> => {
    setLoading(true);
    try {
      const data: Response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${img}&client_id=${Access_Key}&per_page=20`
      );
      const dataJ: any = await data.json();
      if (!data.ok) {
        throw new Error(`${dataJ.errors[0]}`);
      }
      const result: any[] = dataJ.results;
      setRes(result);
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleSubmit = (): void => {
    fetchRequest();
    setImg("");
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-center align-items-center input">
            <input
              className="col-3 form-control-sm py-1 fs-4 text-capitalize border border-3 border-dark"
              type="text"
              placeholder="Search Anything..."
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn bg-dark text-white fs-3 mx-3"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="col-12 d-flex justify-content-evenly flex-wrap">
        {res.map((val: any, index: number) => (
          <img
            key={index}
            className="col-3 img-fluid img-thumbnail"
            src={val.urls.small}
            alt={val.alt_description}
          />
        ))}
      </div>
    </>
  );
};

export default App;
export {};