import * as React from "react";
import {FC} from "react"
import Title from "../components/Title";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label
} from "recharts";
import {Typography, useTheme, Stack, useMediaQuery} from '../components/ComponentsIndex'

interface TrafficChartProps {
  carsNow: number;
  average: number;
  data: Array<{ time: string; trend: number | null; current: number | null }>;
}

const TrafficChart: FC<TrafficChartProps> = ({ carsNow, average, data }) => {
  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const DisplayExpectedTraffic = () => {
    if (carsNow > 1.25 * average) {
      return (
        <Typography fontSize={{xs:"1em",md:"1.25em"}} component="h2" variant="h6" color="red" gutterBottom>
          High
        </Typography>
      );
    } else if (carsNow < 0.75 * average) {
      return (
        <Typography fontSize={{xs:"1em",md:"1.25em"}} component="h2" variant="h6" color="green" gutterBottom>
          Low
        </Typography>
      );
    } else {
      return (
        <Typography fontSize={{xs:"1em",md:"1.25em"}} component="h2" variant="h6" color="orange" gutterBottom>
          Moderate
        </Typography>
      );
    }
  };

  return (
    <React.Fragment>
      <Title fontSize={{xs:"1em",md:"1.25em"}}>Past Traffic Trend</Title>
      <Stack spacing={1} direction="row">
        <Typography fontSize={{xs:"1em",md:"1.25em"}} component="h2" variant="h6" color="primary" gutterBottom>
          Current expected traffic:
        </Typography>
        <DisplayExpectedTraffic />
      </Stack>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: isScreenSmall ? -26 : 24,
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
            {!isScreenSmall && (
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
            )}
          </YAxis>
          <Tooltip />
          <Legend />
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
            dot={{ stroke: "red", strokeWidth: 2 }}
            label="current car count"
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export { TrafficChart };
