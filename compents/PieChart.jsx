import { View, Text } from 'react-native';
import React from 'react';
import PieChart from 'react-native-pie-chart';

export default function CircularChart({ title }) {
    const widthAndHeight = 155;
    const series = [10, 20, 30, 40];
    const sliceColor = ['#ffd700', '#ffb347', '#ff6f61', '#6a5acd'];

    return (
        <View>
            <Text>{title}</Text>
            <View>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    coverRadius={0}
                />
            </View>
        </View>
    );
}