import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Topbar } from '../components/Topbar';
import { Button } from '../components/Button';
import { Sparkles, ChevronRight, Gift, Settings as SettingsIcon, Crown, Lock } from 'lucide-react-native';
import { SavedProgress, todayKey } from '../useGameLogic';
import { BlurView } from 'expo-blur';

interface HomeScreenProps {
  progress: SavedProgress;
  onGame: (level?: number) => void;
  onSettings: () => void;
  onGift: () => boolean;
}

const { height } = Dimensions.get('window');

function MapNode({ level, left, top, locked, current, stars, onClick }: any) {
  return (
    <TouchableOpacity
      style={[styles.mapNode, { left, top }]}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={[styles.nodeOrb, locked && styles.nodeOrbLocked, current && styles.nodeOrbCurrent]}>
        {locked ? <Lock size={18} color="rgba(255,255,255,0.72)" /> : <Text style={[styles.nodeText, locked && styles.nodeTextLocked]}>{level}</Text>}
      </View>
      <View style={styles.nodeLabel}>
        <Text style={styles.nodeLabelText}>
          {locked ? 'Locked' : stars ? `${stars} stars` : level === 1 ? 'First glow' : 'Ready'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function HomeScreen({ progress, onGame, onSettings, onGift }: HomeScreenProps) {
  const latest = progress.highestUnlocked;
  const mapLevels = Array.from({ length: Math.max(10, Math.min(16, latest + 3)) }, (_, index) => index + 1);
  const mapRows = Math.ceil(mapLevels.length / 4);
  
  const mapPosition = (level: number) => {
    const row = Math.floor((level - 1) / 4);
    const slot = (level - 1) % 4;
    const order = row % 2 === 0 ? slot : 3 - slot;
    return { left: `${14 + order * 24}%`, top: `${10 + row * (78 / Math.max(1, mapRows - 1))}%` };
  };

  const pathPoints = mapLevels.map((level) => {
    const position = mapPosition(level);
    return `${parseFloat(position.left) * 4},${parseFloat(position.top) * 3.3}`;
  }).join(' ');

  const [notice, setNotice] = useState('');
  const giftClaimed = progress.dailyGiftClaimedOn === todayKey();
  
  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2200);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/bg_level_1.png')} style={StyleSheet.absoluteFill} imageStyle={{ opacity: 0.48 }} />
      <View style={styles.gradientOverlay} />
      
      <Topbar onSettings={onSettings} />
      
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <View>
            <Text style={styles.eyebrow}>The first spark</Text>
            <Text style={styles.welcomeTitle}>Good morning,{'\n'}<Text style={{ color: '#a5f3fc' }}>stargazer.</Text></Text>
            <Text style={styles.welcomeSubtitle}>The Lumens are humming your name.</Text>
          </View>
          <View style={styles.energyPill}>
            <View style={styles.energyCore} />
            <Text style={styles.energyText}>{progress.coins.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          <ImageBackground source={require('../../assets/bg_level_2.png')} style={StyleSheet.absoluteFill} />
          <View style={styles.mapOverlay} />
          <View style={[styles.mapScene, { flex: 1 }]}>
            <Svg width="100%" height="100%" viewBox="0 0 400 330" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
              <Polyline points={pathPoints} fill="none" stroke="rgba(255,242,154,0.6)" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            {mapLevels.map((level) => {
              const position = mapPosition(level);
              const unlocked = level <= progress.highestUnlocked;
              return (
                <MapNode
                  key={level}
                  level={level}
                  left={position.left}
                  top={position.top}
                  locked={!unlocked}
                  current={level === latest}
                  stars={progress.completed[level]?.stars}
                  onClick={() => unlocked ? onGame(level) : showNotice('Complete the previous glow to unlock this level')}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <Button onPress={() => onGame(latest)} style={{ width: '100%', marginBottom: 12 }}>
            <Sparkles size={18} color="#291063" fill="#291063" style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>Continue to Level {latest}</Text>
            <ChevronRight size={18} color="#291063" style={{ marginLeft: 8 }} />
          </Button>
          
          <View style={styles.rowActions}>
            <Button variant="ghost" style={styles.flexBtn} onPress={() => showNotice(onGift() ? '250 shards added to your pocket' : 'Your daily gift is already claimed')}>
              <Gift size={17} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.btnGhostText}>{giftClaimed ? 'Gift claimed' : 'Daily gift'}</Text>
            </Button>
            <Button variant="ghost" style={styles.flexBtn} onPress={onSettings}>
              <SettingsIcon size={17} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.btnGhostText}>Settings</Text>
            </Button>
          </View>
        </View>
      </View>

      {notice ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{notice}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12053c',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,8,56,0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 18,
    marginBottom: 10,
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.64)',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  energyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 99,
  },
  energyCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffda5c',
    marginRight: 7,
  },
  energyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  mapCard: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    marginVertical: 10,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,6,73,0.38)',
  },
  mapScene: {
    width: '100%',
  },
  mapNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -27.5,
    marginTop: -27.5,
  },
  nodeOrb: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#ffc735', // Simplified
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5f1378',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.35,
    shadowRadius: 17,
    elevation: 5,
  },
  nodeOrbLocked: {
    backgroundColor: '#4a397e',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  nodeOrbCurrent: {
    // Should be animated in a fuller implementation
    borderColor: 'rgba(255,255,255,0.95)',
  },
  nodeText: {
    color: '#3a196e',
    fontWeight: '800',
    fontSize: 17,
  },
  nodeTextLocked: {
    color: 'rgba(255,255,255,0.72)',
  },
  nodeLabel: {
    marginTop: 8,
    backgroundColor: 'rgba(17,4,57,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  nodeLabelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  actions: {
    marginTop: 17,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 12,
  },
  flexBtn: {
    flex: 1,
  },
  btnPrimaryText: {
    color: '#291063',
    fontWeight: '800',
    fontSize: 16,
  },
  btnGhostText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  miniPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
  },
  miniPanelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniPanelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(253,224,71,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPanelTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  miniPanelDesc: {
    color: 'rgba(255,255,255,0.64)',
    fontSize: 11,
    marginTop: 2,
  },
  miniPanelStat: {
    color: 'rgba(255,255,255,0.64)',
    fontSize: 11,
  },
  toast: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(26,9,69,0.9)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    zIndex: 40,
  },
  toastText: {
    color: 'white',
    fontSize: 12,
  },
});
