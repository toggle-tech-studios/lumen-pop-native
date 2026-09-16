import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react-native';

interface TopbarProps {
  onSettings?: () => void;
  onBack?: () => void;
  label?: string;
}

export function Topbar({ onSettings, onBack, label = 'LUMEN POP' }: TopbarProps) {
  return (
    <View style={styles.topbar}>
      {onBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <ArrowLeft size={19} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.brand}>
          <Image source={require('../../assets/lumen-pop-logo.png')} style={styles.logoMark} />
        </View>
      )}
      <Text style={styles.eyebrow}>{label}</Text>
      {onSettings ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onSettings}>
          <SettingsIcon size={19} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 42 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 40, // rough safe area
    paddingBottom: 8,
    zIndex: 2,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 13,
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.64)',
  },
});
