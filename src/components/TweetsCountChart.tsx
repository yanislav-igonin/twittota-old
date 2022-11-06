import { useMemo } from 'react';
import { AxisOptions } from 'react-charts';
import { types } from 'twitter-api-sdk';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart<TweetsCountData>), {
  ssr: false,
});

type TweetsCountData = types.components['schemas']['SearchCount'];

export const TweetsCountChart = ({ series, label }: { series: TweetsCountData[], label: string }) => {
  const data = [{
    label,
    data: series,
    dataType: 'time',
  }];

  const primaryAxis = useMemo((): AxisOptions<TweetsCountData> => ({
    getValue: datum => new Date(datum.start) as unknown as Date,
    scaleType: 'time',
  }), []);
  const secondaryAxes = useMemo((): AxisOptions<TweetsCountData>[] => [{
    getValue: datum => datum.tweet_count as unknown,
    elementType: 'line',
  }], []);

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
};
