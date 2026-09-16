import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

interface LevelLoadingScreenProps {
  level: number;
  onReady: () => void;
}

export function LevelLoadingScreen({ level, onReady }: LevelLoadingScreenProps) {
  const [percent, setPercent] = useState(8);
  const progressAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2200,
      useNativeDriver: false,
    }).start();

    const listener = progressAnim.addListener(({ value }) => {
      setPercent(Math.round(value));
    });

    const timer = setTimeout(() => {
      onReady();
    }, 2400);

    return () => {
      progressAnim.removeListener(listener);
      clearTimeout(timer);
    };
  }, [level, onReady]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/lumen-pop-logo.png')} style={styles.logo} />
        <Text style={styles.eyebrow}>Preparing level {level}</Text>
        <Text style={styles.title}>Gathering the glow...</Text>
        
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
        </View>
        
        <Text style={styles.status}>
          {percent >= 100 ? 'The Lumens are ready' : 'Waking the Lumens for your board'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c0b52',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    paddingTop: 26,
    paddingHorizontal: 24,
    paddingBottom: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(28,11,82,0.58)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: 24,
    marginBottom: 14,
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.64)',
  },
  title: {
    marginTop: 9,
    marginBottom: 18,
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
  },
  loadingBar: {
    width: '100%',
    height: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#5eeaff', // Simplified gradient for now
    borderRadius: 99,
  },
  status: {
    marginTop: 11,
    color: 'rgba(255,255,255,0.52)',
    fontSize: 11,
  },
});
