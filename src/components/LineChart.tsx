import { ThemeMode, useDarkMode } from '@lib/hooks/useDarkMode';
import { FC, useEffect, useState } from 'react';
import { LineChart as LineChartLib, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const darkThemeStroke = 'rgb(248 250 252)';
const lightThemeStroke = '#8884d8';

type Props = {
  xKey: string;
  yKey: string;
  // Data should contain and be sorted by xKey.
  data: any[];
}
export const LineChart: FC<Props> = ({ data, xKey, yKey }) => {
  const [theme] = useDarkMode();
  const firstRenderStroke = theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke;
  const [strokeColor, setStrokeColor] = useState(firstRenderStroke);

  useEffect(() => {
    setStrokeColor(theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke);
  }, [theme]);

  return <ResponsiveContainer width="100%" height={400}>
    <LineChartLib data={data}>
      <Line type="monotone" dataKey={yKey} stroke={strokeColor} strokeWidth={2} />
      <CartesianGrid stroke="#ccc" />
      <Tooltip labelFormatter={(v: string) => new Date(v).toLocaleString()} />
      <XAxis dataKey={xKey}
        strokeWidth={2}
        angle={20}
        interval={24}
        stroke={strokeColor}
        tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
      <YAxis dataKey={yKey} stroke={strokeColor} strokeWidth={2} />
    </LineChartLib>
  </ResponsiveContainer>;
};
