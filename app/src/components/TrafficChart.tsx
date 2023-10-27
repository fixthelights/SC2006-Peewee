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
} from "recharts";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

interface TrafficChartProps {
   //currentData: Array<{ time: string; amount: number }>
   carsNow: number
   average: number
   data: Array<{ time: string; amount: number }>
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
          <Title>Past Traffic Trend</Title>
          <Stack spacing={1} direction="row">
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Current expected traffic:
            </Typography>
            <DisplayExpectedTraffic />
          </Stack>
          <ResponsiveContainer>
            <LineChart
              /*series={[
                {data:{data}}, 
                {data:{currentData}},
              ]}*/
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
                  Total cars
                </Label>
              </YAxis>
              <Line
                isAnimationActive={true}
                type="monotone"
                dataKey="amount"
                stroke={theme.palette.primary.main}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
          </React.Fragment>
    )
  }
  
export {TrafficChart}

