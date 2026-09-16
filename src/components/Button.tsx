import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'soft';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({ onPress, title, children, variant = 'primary', style, textStyle, disabled }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isSoft = variant === 'soft';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isGhost && styles.ghost,
        isSoft && styles.soft,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children || (
        <Text style={[
          styles.textBase,
          isPrimary && styles.primaryText,
          isGhost && styles.ghostText,
          isSoft && styles.softText,
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  primary: {
    backgroundColor: '#ffcf42', // Approximate gradient fallback
    borderBottomWidth: 4,
    borderBottomColor: '#c76e37',
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  soft: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.86)',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  textBase: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#291063',
  },
  ghostText: {
    color: 'white',
  },
  softText: {
    color: '#33206b',
  },
  disabled: {
    opacity: 0.5,
  },
});
