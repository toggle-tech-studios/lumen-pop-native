import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Button } from '../components/Button';
import { Play, ChevronRight } from 'lucide-react-native';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      
      <View style={styles.content}>
        <Image source={require('../../assets/lumen-pop-logo.png')} style={styles.logo} />
        
        <Text style={styles.eyebrow}>A pocket adventure of tiny lights</Text>
        
        <Text style={styles.title}>
          Wake the wonder.{'\n'}
          <Text style={styles.titleHighlight}>Pop the light.</Text>
        </Text>
        
        <Text style={styles.description}>
          Link three or more Lumens by touch. Every chain wakes a little more of the world.
        </Text>
        
        <Button onPress={onStart} style={styles.button}>
          <Play size={18} color="#291063" fill="#291063" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Begin the journey</Text>
          <ChevronRight size={18} color="#291063" style={{ marginLeft: 8 }} />
        </Button>
        
        <Text style={styles.footerText}>
          No rush. Just little bursts of magic.
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12053c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.75,
  },
  blob1: {
    width: 112,
    height: 112,
    backgroundColor: 'rgba(103,232,249,0.15)', // cyan-300/15
    left: '8%',
    top: '15%',
  },
  blob2: {
    width: 176,
    height: 176,
    backgroundColor: 'rgba(249,168,212,0.15)', // pink-300/15
    right: '7%',
    bottom: '13%',
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  logo: {
    width: Math.min(width * 0.63, 270),
    height: Math.min(width * 0.63, 270),
    borderRadius: Math.min(width * 0.63, 270) * 0.31,
  },
  eyebrow: {
    marginTop: 28,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.64)',
  },
  title: {
    marginTop: 12,
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 38,
  },
  titleHighlight: {
    color: '#a5f3fc', // cyan-200
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 32,
  },
  buttonText: {
    color: '#291063',
    fontWeight: '800',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
});
