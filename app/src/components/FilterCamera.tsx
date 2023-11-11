import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface Item {
    id: number;
    imageUrl: string;
    cameraType: string;
    location: string;
}

function App(): JSX.Element {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [items, setItems] = useState<Item[]>([]);
    const [q, setQ] = useState<string>("");
    const [searchParam] = useState<string[]>(["cameraType"]);
    const [filterParam, setFilterParam] = useState<string>("Show All");

    useEffect(() => {
        // Modify the API endpoint to fetch traffic cameras data
        fetch("https://api.example.com/traffic-cameras")
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }, []);

    function search(items: Item[]): Item[] {
        return items.filter((item) => {
            if (filterParam === "Show All") {
                return searchParam.some((newItem) => {
                    return (
                        item[newItem as keyof Item]
                            .toString()
                            .toLowerCase()
                            .indexOf(q.toLowerCase()) > -1
                    );
                });
            } else {
                return (
                    item.cameraType === filterParam &&
                    searchParam.some((newItem) => {
                        return (
                            item[newItem as keyof Item]
                                .toString()
                                .toLowerCase()
                                .indexOf(q.toLowerCase()) > -1
                        );
                    })
                );
            }
        });
    }

    if (error) {
        return (
            <p>
                {error.message}, if you get this error, the free API I used
                might have stopped working, but I created a simple example that
                demonstrates how this works,{" "}
                <a href="https://codepen.io/Spruce_khalifa/pen/mdXEVKq">
                    {" "}
                    check it out{" "}
                </a>{" "}
            </p>
        );
    } else if (!isLoaded) {
        return <>loading...</>;
    } else {
        return (
            <div className="wrapper">
                <div className="search-wrapper">
                    <label htmlFor="search-form">
                        <input
                            type="search"
                            name="search-form"
                            id="search-form"
                            className="search-input"
                            placeholder="Search for..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <span className="sr-only">Search traffic cameras here</span>
                    </label>

                    <div className="select">
                        <select
                            onChange={(e) => {
                                setFilterParam(e.target.value);
                            }}
                            className="custom-select"
                            aria-label="Filter Traffic Cameras"
                        >
                            <option value="Show All">Show All</option>
                            <option value="Accident Prone Zones">Accident Prone Zones</option>
                            <option value="Highway Cameras">Highway Cameras</option>
                            <option value="City Cameras">City Cameras</option>
                            <option value="Hide All">Hide All</option>
                        </select>
                        <span className="focus"></span>
                    </div>
                </div>
                <ul className="card-grid">
                    {search(items).map((item) => (
                        <li key={item.id}>
                            <article className="card">
                                <div className="card-image">
                                    <img src={item.imageUrl} alt={item.cameraType} />
                                </div>
                                <div className="card-content">
                                    <h2 className="card-name">{item.cameraType}</h2>
                                    <p className="location">{item.location}</p>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
export{};

