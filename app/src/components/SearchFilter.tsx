import React, { FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface Route {
  id: number;
  start: string;
  destination: string;
  distance: number;
  type: string;
}

const RouteFinderApp: FC = () => {
  const [error, setRouteError] = useState<Error | null>(null);
  const [isLoaded, setRouteIsLoaded] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParameters] = useState<(keyof Route)[]>(["start", "destination", "distance"]);
  const [filterParameter, setFilterParameter] = useState<string>("All");

  useEffect(() => {
    fetch("https://api.example.com/routes")
      .then((res) => res.json())
      .then(
        (result) => {
          setRouteIsLoaded(true);
          setRoutes(result);
        },
        (error) => {
          setRouteIsLoaded(true);
          setRouteError(error);
        }
      );
  }, []);

  function searchRoutes(routes: Route[]): Route[] {
    return routes.filter((route) => {
      if (route.type === filterParameter) {
        return searchParameters.some((param) => {
          return (
            route[param]
              .toString()
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) > -1
          );
        });
      } else if (filterParameter === "All") {
        return searchParameters.some((param) => {
          return (
            route[param]
              .toString()
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) > -1
          );
        });
      }
      return false; 
    });
  }

  if (error) {
    return (
      <p>
        {error.message}, if you get this error, the API used might have stopped working, but you can check the example for the route finding application.
      </p>
    );
  } else if (!isLoaded) {
    return <>Loading...</>;
  } else {
    return (
      <div className="route-finder-wrapper">
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="sr-only">Search routes here</span>
          </label>

          <div className="select">
            <select
              onChange={(e) => {
                setFilterParameter(e.target.value);
              }}
              className="custom-select"
              aria-label="Filter Routes By Type"
            >
              <option value="All">Filter By Type</option>
              <option value="North">North</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="South">South</option>
            </select>
            <span className="focus"></span>
          </div>
        </div>
        <ul className="route-card-grid">
          {searchRoutes(routes).map((route) => (
            <li key={route.id}>
              <article className="route-card">
                <div className="card-content">
                  <h2 className="route-name">
                    Route: {route.start} to {route.destination}
                  </h2>
                  <p>Distance: {route.distance} miles</p>
                  <p>Type: {route.type}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<RouteFinderApp />, document.getElementById("root"));
export {};
