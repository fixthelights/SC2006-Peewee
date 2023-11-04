import * as React from "react";
import { FC } from "react";
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
  carsNow: number;
  average: number;
  data: any[];
}

const TrafficChart: FC<TrafficChartProps> = ({ carsNow, average, data }) => {
  const theme = useTheme();

  const DisplayExpectedTraffic: FC = () => {
    if (carsNow > 1.25 * average) {
      return (
        <Typography component="h2" variant="h6" color="error" gutterBottom>
          High
        </Typography>
      );
    } else if (carsNow < 0.75 * average) {
      return (
        <Typography component="h2" variant="h6" color="success" gutterBottom>
          Low
        </Typography>
      );
    } else {
      return (
        <Typography component="h2" variant="h6" color="warning" gutterBottom>
          Moderate
        </Typography>
      );
    }
  };

  return (
    <React.Fragment>
      <Title>Past Traffic Trend</Title>
      <Stack spacing={1} direction="row">
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Current expected traffic:
        </Typography>
        <DisplayExpectedTraffic />
      </Stack>
      <ResponsiveContainer width="100%" height={400}>
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
            stroke={theme.palette.text.primary}
            style={{ fontSize: 12 }}
            allowDataOverflow
          />
          <YAxis
            stroke={theme.palette.text.primary}
            style={{ fontSize: 12 }}
            allowDataOverflow
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                fontSize: 12,
              }}
            >
              Total cars
            </Label>
          </YAxis>
          <Tooltip />
          <Legend />
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey="trend"
            stroke={theme.palette.primary.main}
            dot={{ r: 3 }}
            label={{ fontSize: 12, position: "top" }}
          />
          <Line
            isAnimationActive={true}
            type="monotone"
            dataKey="current"
            stroke={theme.palette.secondary.main}
            dot={{ r: 3 }}
            label={{ fontSize: 12, position: "top" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export { TrafficChart };