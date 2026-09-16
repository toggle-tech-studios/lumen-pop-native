import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { BoosterKind, boosterPrices } from '../useGameLogic';
import Svg, { Path, Circle } from 'react-native-svg';

interface BoosterProps {
  kind: BoosterKind;
  onClick: () => void;
  disabled?: boolean;
}

function BoosterIcon({ kind }: { kind: BoosterKind }) {
  if (kind === 'shuffle') {
    return (
      <Svg viewBox="0 0 32 32" width={22} height={22}>
        <Path d="M6 9h4c5 0 6 14 12 14h4M6 23h4c2.3 0 3.6-3 4.7-5.8M19.2 9.7C20.2 7.7 21.5 9 23 9h3" fill="none" stroke="#23104c" strokeWidth={2.4} strokeLinecap="round" />
        <Path d="m23 6 4 3-4 3M23 20l4 3-4 3" fill="none" stroke="#23104c" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (kind === 'bomb') {
    return (
      <Svg viewBox="0 0 32 32" width={22} height={22}>
        <Circle cx={15} cy={18} r={8.5} fill="none" stroke="#23104c" strokeWidth={2.4} />
        <Path d="M20.5 11.5 24 8M23.5 7.5l2 2M14 6v3" fill="none" stroke="#23104c" strokeWidth={2.4} strokeLinecap="round" />
        <Circle cx={12.5} cy={15.5} r={1.5} fill="#23104c" />
      </Svg>
    );
  }
  return (
    <Svg viewBox="0 0 32 32" width={22} height={22}>
      <Path d="M16 4v6M16 22v6M4 16h6M22 16h6M7.5 7.5l4 4M20.5 20.5l4 4M24.5 7.5l-4 4M11.5 20.5l-4 4" stroke="#23104c" strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={16} cy={16} r={5.5} fill="none" stroke="#23104c" strokeWidth={2.4} />
    </Svg>
  );
}

export function Booster({ kind, onClick, disabled }: BoosterProps) {
  const descriptions: Record<BoosterKind, string> = { shuffle: 'cross the glow', bomb: 'clear a pocket', burst: 'send a wave' };
  
  const getIconBg = () => {
    if (kind === 'shuffle') return '#ffcf4e';
    if (kind === 'bomb') return '#ff7c9f';
    return '#7cf4e3';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onClick}
      style={[styles.booster, disabled && styles.disabled]}
    >
      <View style={[styles.boosterIcon, { backgroundColor: getIconBg() }]}>
        <BoosterIcon kind={kind} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{kind.charAt(0).toUpperCase() + kind.slice(1)}</Text>
        <Text style={styles.description}>{boosterPrices[kind]} shards · {descriptions[kind]}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  booster: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  disabled: {
    opacity: 0.5,
  },
  boosterIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  description: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
