import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Topbar } from '../components/Topbar';
import { Volume2, VolumeX, Music2, CircleHelp, Gem, ChevronRight, Home } from 'lucide-react-native';
import { SavedProgress } from '../useGameLogic';
import { Button } from '../components/Button';

interface SettingsScreenProps {
  progress: SavedProgress;
  onChange: (next: SavedProgress) => void;
  onBack: () => void;
}

export function SettingsScreen({ progress, onChange, onBack }: SettingsScreenProps) {
  const [info, setInfo] = useState<'how' | 'about' | null>(null);

  return (
    <View style={styles.container}>
      <Topbar onBack={onBack} label="YOUR POCKET" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>A small constellation of controls</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Make the meadow feel like yours.</Text>
        
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              {progress.sound ? <Volume2 size={17} color="#ffe477" /> : <VolumeX size={17} color="#ffe477" />}
            </View>
            <View style={styles.copy}>
              <Text style={styles.rowTitle}>Sound effects</Text>
              <Text style={styles.rowDesc}>Every pop, sparkle, and tiny wake-up</Text>
            </View>
            <Switch 
              value={progress.sound}
              onValueChange={(val) => onChange({ ...progress, sound: val })}
              trackColor={{ false: 'rgba(255,255,255,0.22)', true: '#62e0c0' }}
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.iconBox}>
              <Music2 size={17} color="#ffe477" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.rowTitle}>Meadow music</Text>
              <Text style={styles.rowDesc}>Soft loops for longer journeys</Text>
            </View>
            <Switch 
              value={progress.music}
              onValueChange={(val) => onChange({ ...progress, music: val })}
              trackColor={{ false: 'rgba(255,255,255,0.22)', true: '#62e0c0' }}
            />
          </View>
        </View>

        <View style={styles.group}>
          <TouchableOpacity style={styles.row} onPress={() => setInfo(info === 'how' ? null : 'how')}>
            <View style={styles.iconBox}>
              <CircleHelp size={17} color="#ffe477" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.rowTitle}>How to play</Text>
              <Text style={styles.rowDesc}>Link one straight line in any direction</Text>
            </View>
            <ChevronRight size={17} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => setInfo(info === 'about' ? null : 'about')}>
            <View style={styles.iconBox}>
              <Gem size={17} color="#ffe477" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.rowTitle}>About Lumen Pop</Text>
              <Text style={styles.rowDesc}>Made for curious thumbs and bright minds</Text>
            </View>
            <ChevronRight size={17} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        {info === 'how' && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>How to play</Text>
            <Text style={styles.infoDesc}>Press and drag through 3 or more matching Lumens in a single horizontal, vertical, or diagonal line. Release to pop them, then watch gravity refill the board.</Text>
          </View>
        )}
        
        {info === 'about' && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>About Lumen Pop</Text>
            <Text style={styles.infoDesc}>A tiny constellation game about waking friendly Lumens, building bright chains, and finding a little wonder in every move.</Text>
          </View>
        )}

        <Button variant="soft" onPress={onBack} style={{ marginTop: 20 }}>
          <Home size={16} color="#33206b" style={{ marginRight: 8 }} />
          <Text style={{ color: '#33206b', fontWeight: '800', fontSize: 16 }}>Return to meadow</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12053c',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.64)',
  },
  title: {
    color: 'white',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 25,
  },
  group: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 14,
  },
  row: {
    minHeight: 62,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  rowTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  rowDesc: {
    color: 'rgba(255,255,255,0.54)',
    fontSize: 11,
    marginTop: 2,
  },
  infoPanel: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  infoTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
  },
  infoDesc: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 12,
    lineHeight: 18,
  },
});
