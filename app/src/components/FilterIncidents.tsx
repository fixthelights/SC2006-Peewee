import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface Incident {
    id: number;
    title: string;
    type: string;
    location: string;
}

function App(): JSX.Element {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [items, setItems] = useState<Incident[]>([]);
    const [q, setQ] = useState<string>("");
    const [searchParam] = useState<string[]>(["type"]);
    const [filterParam, setFilterParam] = useState<string>("Show All");

    useEffect(() => {
        // Modify the API endpoint to fetch incidents data
        fetch("https://api.example.com/incidents")
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

    function search(items: Incident[]): Incident[] {
        return items.filter((item) => {
            if (filterParam === "Show All") {
                return searchParam.some((newItem) => {
                    return (
                        item[newItem as keyof Incident]
                            .toString()
                            .toLowerCase()
                            .indexOf(q.toLowerCase()) > -1
                    );
                });
            } else {
                return (
                    item.type === filterParam &&
                    searchParam.some((newItem) => {
                        return (
                            item[newItem as keyof Incident]
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
                        <span className="sr-only">Search incidents here</span>
                    </label>

                    <div className="select">
                        <select
                            onChange={(e) => {
                                setFilterParam(e.target.value);
                            }}
                            className="custom-select"
                            aria-label="Filter Incidents"
                        >
                            <option value="Show All">Show All</option>
                            <option value="Accidents">Accidents</option>
                            <option value="Roadworks">Roadworks</option>
                            <option value="Closure">Closure</option>
                            <option value="Slow Traffic">Slow Traffic</option>
                            <option value="Hide All">Hide All</option>
                        </select>
                        <span className="focus"></span>
                    </div>
                </div>
                <ul className="card-grid">
                    {search(items).map((item) => (
                        <li key={item.id}>
                            <article className="card">
                                <div className="card-content">
                                    <h2 className="card-name">{item.title}</h2>
                                    <p className="location">{item.location}</p>
                                    <p className="type">{item.type}</p>
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
export {};
