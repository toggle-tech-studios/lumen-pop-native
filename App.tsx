import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StartScreen } from './src/screens/StartScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { LevelLoadingScreen } from './src/screens/LevelLoadingScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SavedProgress, defaultProgress, todayKey } from './src/useGameLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Screen = 'loading' | 'start' | 'home' | 'level-loading' | 'game' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [progress, setProgress] = useState<SavedProgress>(defaultProgress);
  const [level, setLevel] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      try {
        const stored = await AsyncStorage.getItem('lumen-pop-progress');
        if (stored) {
          setProgress({ ...defaultProgress, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error(e);
      }
      setReady(true);
    }
    loadProgress();
  }, []);

  const updateProgress = async (next: SavedProgress) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem('lumen-pop-progress', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const completeLevel = (score: number, stars: number) => {
    const existing = progress.completed[level];
    const next: SavedProgress = {
      ...progress,
      highestUnlocked: Math.max(progress.highestUnlocked, level + 1),
      coins: progress.coins + 100 + stars * 25,
      completed: { 
        ...progress.completed, 
        [level]: { 
          stars: Math.max(stars, existing?.stars ?? 0), 
          bestScore: Math.max(score, existing?.bestScore ?? 0) 
        } 
      },
    };
    updateProgress(next);
  };

  const claimDailyGift = () => {
    if (progress.dailyGiftClaimedOn === todayKey()) return false;
    updateProgress({ ...progress, coins: progress.coins + 250, dailyGiftClaimedOn: todayKey() });
    return true;
  };

  const openLevel = (nextLevel?: number) => {
    const destination = nextLevel ?? progress.highestUnlocked;
    setLevel(destination);
    setScreen('level-loading');
  };

  if (!ready) return null;

  const renderScreen = () => {
    if (screen === 'start') return <StartScreen onStart={() => setScreen('home')} />;
    if (screen === 'settings') return <SettingsScreen progress={progress} onChange={updateProgress} onBack={() => setScreen('home')} />;
    if (screen === 'level-loading') return <LevelLoadingScreen level={level} onReady={() => setScreen('game')} />;
    if (screen === 'game') return <GameScreen key={level} levelNumber={level} progress={progress} onBack={() => setScreen('home')} onSettings={() => setScreen('settings')} onComplete={completeLevel} onCoinsChange={(coins) => updateProgress({ ...progress, coins })} onNextLevel={() => openLevel(level + 1)} />;
    return <HomeScreen progress={progress} onGame={openLevel} onSettings={() => setScreen('settings')} onGift={claimDailyGift} />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {renderScreen()}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12053c',
  },
});
