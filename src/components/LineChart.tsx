import { ThemeMode, useDarkMode } from '@lib/hooks/useDarkMode';
import { type FC, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart as LineChartLib,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const darkThemeStroke = 'rgb(248 250 252)';
const lightThemeStroke = '#8884d8';

type Props = {
  // Data should contain and be sorted by xKey.
  data: any[];
  xKey: string;
  yKey: string;
};
export const LineChart: FC<Props> = ({ data, xKey, yKey }) => {
  const [theme] = useDarkMode();
  const firstRenderStroke =
    theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke;
  const [strokeColor, setStrokeColor] = useState(firstRenderStroke);

  useEffect(() => {
    setStrokeColor(
      theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke,
    );
  }, [theme]);

  return (
    <ResponsiveContainer
      height={400}
      width="100%"
    >
      <LineChartLib data={data}>
        <Line
          dataKey={yKey}
          stroke={strokeColor}
          strokeWidth={2}
          type="monotone"
        />
        <CartesianGrid stroke="#ccc" />
        <Tooltip
          labelFormatter={(v: string) => {
            return new Date(v).toLocaleString();
          }}
        />
        <XAxis
          angle={20}
          dataKey={xKey}
          interval={24}
          stroke={strokeColor}
          strokeWidth={2}
          tickFormatter={(v: string) => {
            return new Date(v).toLocaleDateString();
          }}
        />
        <YAxis
          dataKey={yKey}
          stroke={strokeColor}
          strokeWidth={2}
        />
      </LineChartLib>
    </ResponsiveContainer>
  );
};
