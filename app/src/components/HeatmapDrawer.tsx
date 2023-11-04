import { cellToBoundary } from "h3-js";
import { PolygonF } from "@react-google-maps/api"

interface HeatmapDrawerProps{
    peakMap: HexIndexPeak[]
}

interface HexIndexPeak{
    hexIndex: string,
    avgPeakedness: number
}

function HeatmapDrawer({peakMap}: HeatmapDrawerProps) {


const generatePaths = (hexindex7Id: string) => {
    const coordPair = cellToBoundary(hexindex7Id, true);
    const pathObject: google.maps.LatLngLiteral[] = [];
    coordPair.map((coord)=> {
        pathObject.push({ lat: coord[1], lng: coord[0]});
    })
    return pathObject;
}

const generateOptions = (avgPeakedness: number) => {
    avgPeakedness = avgPeakedness * 100

    const options = {
        fillColor: "#E14C48",
        fillOpacity: 0.8,
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 1,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1
    }

    // Conditionally set color of polygon
    if(avgPeakedness <= 40) {options.fillColor = "#FEDD87"; options.fillOpacity = 0.2}
    else if(avgPeakedness <= 60){options.fillColor = "#FED976"; options.fillOpacity = 0.4}
    else if(avgPeakedness <= 80){options.fillColor = "#FC9653"; options.fillOpacity = 0.6}
    else if(avgPeakedness <= 90){options.fillColor = "#F77645"; options.fillOpacity = 0.7}

    return options
}

  return (
    <>
        {peakMap.map((hexIndexPeak) => (
            <PolygonF
            paths={generatePaths(hexIndexPeak.hexIndex)}
            options={generateOptions(hexIndexPeak.avgPeakedness)}
        />
        ))}
    </>
  );

};

export default HeatmapDrawer;