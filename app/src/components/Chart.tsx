import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import {useState} from 'react'

// Generate Sales Data
function createData(time: string, carNumbers?: number) {
  return { time, carNumbers };
}

/*useEffect(()=> {  
      axios.get('http://localhost:2000/') 
      .then((res)=> setTrafficDataList(res.data));
  }, []);*/

/*const trafficData =[]
function populateData(){
  trafficDataList.map((data)=>{
    trafficData.push(createData(data.time, data.numVehicles))
  });
}*/

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

/*let data = reportList.map((report)=>{
    return <IncidentListItem
              incidentType: report.incident
              incidentTime: kiv
              incidentLocation: kiv
              incidentDescription: report.description
            />
  });*/

export default function Chart() {
  const theme = useTheme();
  const [trafficDataList, getTrafficDataList] = useState([])
  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Traffic Level
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="carNumbers"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}