import * as React from "react";
import {FC} from "react"
import Typography from "@mui/material/Typography";
import Title from "../components/Title";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";


interface TrafficChartProps {
   carsNow: number
   average: number
   data: Array<{ time: string; trend: number | null, current: number | null}>
}

const TrafficChart: FC<TrafficChartProps> = ({carsNow, average, data}) => {
    const theme = useTheme();
    const DisplayExpectedTraffic = () => {
        if (carsNow > 1.25*average) {
          return (
            <Typography component="h2" variant="h6" color="red" gutterBottom>
              High
            </Typography>
          );
        } else if (carsNow < 0.75*average) {
          return (
            <Typography component="h2" variant="h6" color="green" gutterBottom>
              Low
            </Typography>
          );
        } else {
          return (
            <Typography component="h2" variant="h6" color="orange" gutterBottom>
              Moderate
            </Typography>
          );
        }
      };

    return ( 
        <React.Fragment>
          <Title>Road Conditions at Camera Today</Title>
          <Stack spacing={1} direction="row">
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Live Traffic Conditions:
            </Typography>
            <DisplayExpectedTraffic />
          </Stack>
          <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{
            top: 50,
            right: 16,
            bottom: 0,
            left: 24,
          }}
            >
              <XAxis
                dataKey="time"
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
                tickCount={23}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
              >
                <Label
                  angle={270}
                  position="left"
                  style={{
                    textAnchor: "middle",
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Average Cars at Camera
                </Label>
              </YAxis>
              <Tooltip/>
              <Legend/>
              <Line
                isAnimationActive={true}
                type="monotone"
                dataKey="trend"
                stroke={theme.palette.primary.main}
                dot={true}
                label="trend"
              />
              <Line
                isAnimationActive={true}
                type="monotone"
                dataKey="current"
                stroke="#FF0000"
                dot={{ stroke: 'red', strokeWidth: 10}}
                label="current car count"
              />
            </LineChart>
          </ResponsiveContainer>
          </React.Fragment>
    )
  }
  
export {TrafficChart}

