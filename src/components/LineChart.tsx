import { ThemeMode, useDarkMode } from '@lib/hooks/useDarkMode';
import { FC, useEffect, useState } from 'react';
import { LineChart as LineChartLib, Line, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const darkThemeStroke = 'rgb(248 250 252)';
const lightThemeStroke = '#8884d8';

type Props = {
  data: any[];
  xKey: string;
  yKey: string;
}

export const LineChart: FC<Props> = ({ data, xKey, yKey }) => {
  const [theme] = useDarkMode();
  // get window width from brower
  const width = typeof window !== 'undefined' ? window.innerWidth - 48 - 16 - 16 : 1000;
  const firstRenderStroke = theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke;
  const [strokeColor, setStrokeColor] = useState(firstRenderStroke);

  useEffect(() => {
    setStrokeColor(theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke);
  }, [theme]);

  return <LineChartLib width={width} height={400} data={data}>
    <Line type="monotone" dataKey={yKey} stroke={strokeColor} />
    <CartesianGrid stroke="#ccc" />
    <Tooltip labelFormatter={(v: string) => new Date(v).toLocaleString()} />
    <XAxis dataKey={xKey}
      angle={20}
      interval={24}
      stroke={strokeColor}
      tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
    <YAxis dataKey={yKey} stroke={strokeColor} />
  </LineChartLib>;
};
