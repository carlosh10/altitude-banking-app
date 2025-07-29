import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface GradientCardProps {
  children: React.ReactNode;
  gradient?: string[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient,
  style,
  contentStyle,
  shadow = 'md',
}) => {
  if (gradient) {
    return (
      <View style={[styles.container, theme.shadows[shadow], style]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCard, contentStyle]}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.whiteCard,
        theme.shadows[shadow],
        style,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradientCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  whiteCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
  },
});