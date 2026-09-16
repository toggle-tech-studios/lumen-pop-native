import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Topbar } from '../components/Topbar';
import { Board } from '../components/Board';
import { Booster } from '../components/Booster';
import { ResultOverlay } from './ResultOverlay';
import { Sparkles, Pause, Star } from 'lucide-react-native';
import {
  SavedProgress,
  levelConfig,
  makeBoard,
  Tile,
  LumenColor,
  BoosterKind,
  directionBetween,
  lineStep,
  hasPlayableChain,
  rowOf,
  colOf,
  collapseBoard,
  useSoundEngine,
} from '../useGameLogic';

interface GameScreenProps {
  levelNumber: number;
  progress: SavedProgress;
  onBack: () => void;
  onSettings: () => void;
  onComplete: (score: number, stars: number) => void;
  onCoinsChange: (coins: number) => void;
  onNextLevel: () => void;
}

export function GameScreen({
  levelNumber,
  progress,
  onBack,
  onSettings,
  onComplete,
  onCoinsChange,
  onNextLevel,
}: GameScreenProps) {
  const config = useMemo(() => levelConfig(levelNumber), [levelNumber]);
  const [board, setBoard] = useState<(Tile | null)[]>(() => makeBoard(levelNumber));
  const [selected, setSelected] = useState<number[]>([]);
  const [popping, setPopping] = useState<number[]>([]);
  const [freshTiles, setFreshTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(config.moves);
  const [overlay, setOverlay] = useState<'complete' | 'fail' | 'pause' | null>(null);
  const [activeType, setActiveType] = useState<LumenColor | null>(null);
  const [activeBooster, setActiveBooster] = useState<BoosterKind | null>(null);
  const [coins, setCoins] = useState(progress.coins);
  const [toast, setToast] = useState('');
  
  const chainRef = useRef<number[]>([]);
  const chainDirectionRef = useRef<any>(null);
  const busyRef = useRef(false);
  const completionSentRef = useRef(false);
  
  const { play } = useSoundEngine(progress.sound);

  const starsForScore = (value: number) => value >= config.targetScore ? 3 : value >= config.targetScore * 0.66 ? 2 : value >= config.targetScore * 0.33 ? 1 : 0;
  const stars = starsForScore(score);
  const progressPercent = Math.min(100, (score / config.targetScore) * 100);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const clearActiveChain = useCallback(() => {
    setSelected([]);
    chainRef.current = [];
    chainDirectionRef.current = null;
    setActiveType(null);
  }, []);

  const performRemoval = useCallback((indices: number[], chainColor: LumenColor, bonus = 0) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const uniqueIndices = [...new Set(indices)];
    setPopping(uniqueIndices);
    play('pop', Math.min(3, uniqueIndices.length / 3));

    setTimeout(() => {
      setBoard((current) => {
        const cleared = current.map((tile, index) => uniqueIndices.includes(index) ? null : tile);
        const result = collapseBoard(cleared, levelNumber, config.canSpawnVortex);
        setFreshTiles(result.refilled);
        setTimeout(() => setFreshTiles([]), 720);
        play('gravity', Math.min(2, result.refilled.length / 5));
        return result.board;
      });
      setPopping([]);
      setScore((current) => current + bonus);
      setTimeout(() => { busyRef.current = false; }, 270);
    }, 300);
  }, [levelNumber, config, play]);

  const onPointerDown = useCallback((index: number) => {
    if (busyRef.current || !board[index]) return;
    if (activeBooster) {
      // booster logic stub
      setActiveBooster(null);
      return;
    }
    chainRef.current = [index];
    chainDirectionRef.current = null;
    setSelected([index]);
    setActiveType(board[index]!.color);
    play('wake');
  }, [board, activeBooster, play]);

  const onPointerMove = useCallback((index: number) => {
    if (busyRef.current || activeBooster) return;
    const tile = board[index];
    if (!tile || !activeType) return;
    
    const chain = chainRef.current;
    
    // Backtrack
    if (chain.length > 1 && chain[chain.length - 2] === index) {
      chain.pop();
      chainDirectionRef.current = chain.length > 1 ? directionBetween(chain[0], chain[1]) : null;
      setSelected([...chain]);
      play('backtrack');
      return;
    }
    
    // Add to chain
    if (chain.includes(index) || tile.color !== activeType) return;
    const direction = chainDirectionRef.current ?? directionBetween(chain[chain.length - 1], index);
    if (!direction || !lineStep(chain[chain.length - 1], index, direction)) return;
    
    if (chain.length === 1) chainDirectionRef.current = direction;
    chain.push(index);
    setSelected([...chain]);
    play('link', Math.min(3, chain.length / 2));
  }, [board, activeType, activeBooster, play]);

  const onPointerUp = useCallback(() => {
    if (busyRef.current) return;
    const chain = chainRef.current;
    
    if (chain.length < 3) {
      if (chain.length > 0) showToast('Almost there · link one more Lumen');
      play('backtrack');
      clearActiveChain();
      return;
    }
    
    const chainColor = board[chain[0]]!.color;
    const scoreGain = chain.length === 3 ? 300 : chain.length === 4 ? 650 : 1100 + (chain.length - 5) * 450;
    
    setMoves((current: number) => Math.max(0, current - 1));
    performRemoval(chain, chainColor, scoreGain);
    clearActiveChain();
    
    const nextScore = score + scoreGain;
    if (nextScore >= config.targetScore && !completionSentRef.current) {
      completionSentRef.current = true;
      setTimeout(() => {
        play('win');
        setOverlay('complete');
        onComplete(nextScore, starsForScore(nextScore));
      }, 760);
    } else if (moves <= 1) {
      setTimeout(() => {
        play('lose');
        setOverlay('fail');
      }, 820);
    }
  }, [board, score, moves, config, performRemoval, clearActiveChain, showToast, play]);

  const resetGame = () => {
    busyRef.current = false;
    completionSentRef.current = false;
    clearActiveChain();
    setBoard(makeBoard(levelNumber));
    setScore(0);
    setMoves(config.moves);
    setOverlay(null);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/bg_level_1.png')} style={StyleSheet.absoluteFill} imageStyle={{ opacity: 0.28 }} />
      <View style={styles.gradientOverlay} />
      
      <Topbar onBack={onBack} onSettings={onSettings} label={config.world.toUpperCase()} />
      
      <View style={styles.content}>
        <View style={styles.levelHeading}>
          <View>
            <Text style={styles.headingTitle}>Level {levelNumber} <Text style={{ color: '#a5f3fc' }}>·</Text> {config.title}</Text>
            <Text style={styles.headingDesc}>{config.lesson}</Text>
          </View>
          <TouchableOpacity style={styles.pauseBtn} onPress={() => setOverlay('pause')}>
            <Pause size={18} color="white" fill="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={styles.statLabel}>Target score</Text>
            <Text style={styles.statValue}>{config.targetScore.toLocaleString()}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
          <View style={[styles.statBox, { flex: 1.35 }]}>
            <Text style={styles.statLabel}>Stars</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((star) => (
                <Star key={star} size={18} color={stars >= star ? '#ffdc63' : '#554977'} fill={stars >= star ? '#ffdc63' : '#554977'} />
              ))}
            </View>
          </View>
          <View style={[styles.statBox, { flex: 1 }]}>
            <Text style={styles.statLabel}>Moves</Text>
            <Text style={[styles.statValue, { color: '#fef08a' }]}>{moves}</Text>
          </View>
        </View>

        <Board 
          board={board}
          selected={selected}
          popping={popping}
          freshTiles={freshTiles}
          activeType={activeType}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />

        <Text style={styles.hint}>
          <Sparkles size={12} color="#fef08a" /> Drag through matching Lumens to link 3 or more
        </Text>

        <View style={styles.boosterRow}>
          <Booster kind="shuffle" onClick={() => {}} disabled={busyRef.current} />
          <Booster kind="bomb" onClick={() => {}} disabled={busyRef.current} />
          <Booster kind="burst" onClick={() => {}} disabled={busyRef.current} />
        </View>

        <View style={styles.currencyLine}>
          <Text style={styles.currencyText}>{coins.toLocaleString()} shards</Text>
          <Text style={styles.currencyNote}>Prism Vortexes appear after 5-link charges</Text>
        </View>
      </View>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {overlay && (
        <ResultOverlay 
          type={overlay} 
          score={score} 
          target={config.targetScore} 
          stars={stars} 
          onPrimary={overlay === 'complete' ? onNextLevel : overlay === 'fail' ? resetGame : () => setOverlay(null)} 
          onSecondary={overlay === 'complete' ? resetGame : overlay === 'pause' ? onBack : undefined} 
          onClose={() => setOverlay(null)} 
        />
      )}
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
    backgroundColor: 'rgba(20,8,56,0.6)',
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
  levelHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headingTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
  },
  headingDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 3,
  },
  pauseBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 14,
  },
  statBox: {
    backgroundColor: 'rgba(28,15,89,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  statValue: {
    fontSize: 19,
    fontWeight: '700',
    color: 'white',
    marginTop: 3,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 99,
    marginTop: 7,
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#53e7ff',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
  },
  hint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.52)',
    fontSize: 11,
    marginTop: 14,
  },
  boosterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
  },
  currencyLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  currencyText: {
    color: '#ffe176',
    fontWeight: '700',
    fontSize: 10,
  },
  currencyNote: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
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
