import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Account } from '../../types';

interface YieldChartProps {
  accounts: Account[];
}

export const YieldChart: React.FC<YieldChartProps> = ({ accounts }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; // Account for padding

  // Generate mock historical yield data
  const generateYieldData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = accounts
      .filter(acc => acc.yieldRate && acc.yieldRate > 0)
      .map((account, index) => {
        // Generate some mock historical data around the current yield
        const baseYield = account.yieldRate || 0;
        const data = labels.map(() => {
          const variation = (Math.random() - 0.5) * 0.5; // ±0.25% variation
          return Math.max(0.1, baseYield + variation);
        });

        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];
        
        return {
          data,
          color: () => colors[index % colors.length],
          strokeWidth: 2,
        };
      });

    return { labels, datasets };
  };

  const yieldData = generateYieldData();

  if (yieldData.datasets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No yield data available</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007bff',
    },
    formatYLabel: (yValue: string) => `${yValue}%`,
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={yieldData}
        width={chartWidth}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={true}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
      />
      
      <View style={styles.legend}>
        {accounts
          .filter(acc => acc.yieldRate && acc.yieldRate > 0)
          .map((account, index) => {
            const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];
            return (
              <View key={account.id} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: colors[index % colors.length] }
                  ]} 
                />
                <Text style={styles.legendText}>
                  {account.name} ({account.yieldRate?.toFixed(1)}%)
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    marginTop: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});