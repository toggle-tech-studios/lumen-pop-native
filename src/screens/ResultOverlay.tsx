import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Button } from '../components/Button';
import { Sparkles, Pause, RotateCcw, ChevronRight, Play, ArrowLeft, Star } from 'lucide-react-native';

interface ResultOverlayProps {
  type: 'complete' | 'fail' | 'pause';
  score: number;
  target: number;
  stars: number;
  onPrimary: () => void;
  onSecondary?: () => void;
  onClose: () => void;
}

export function ResultOverlay({ type, score, target, stars, onPrimary, onSecondary, onClose }: ResultOverlayProps) {
  const won = type === 'complete';
  const paused = type === 'pause';

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.modal}>
          <View style={styles.successOrb}>
            {won ? <Sparkles size={34} color="#582a9e" /> : paused ? <Pause size={31} color="#582a9e" fill="#582a9e" /> : <RotateCcw size={31} color="#582a9e" />}
          </View>
          
          <Text style={styles.title}>
            {won ? 'Glow-getter!' : paused ? 'Glow paused' : 'The Lumens went shy'}
          </Text>
          <Text style={styles.description}>
            {won ? 'That chain lit up the whole meadow. Your constellation is shining.' : paused ? 'Your board is waiting exactly where you left it.' : 'Every little light gets another chance. Try a shorter, brighter chain.'}
          </Text>

          {won && (
            <View style={styles.resultRow}>
              <View style={styles.resultPill}>
                <Text style={styles.resultPillValue}>{score.toLocaleString()}</Text>
                <Text style={styles.resultPillLabel}>of {target.toLocaleString()}</Text>
              </View>
              <View style={styles.resultPill}>
                <View style={styles.starsRow}>
                  {[1, 2, 3].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      color={stars >= star ? '#ffdc63' : '#554977'} 
                      fill={stars >= star ? '#ffdc63' : '#554977'} 
                    />
                  ))}
                </View>
                <Text style={styles.resultPillLabel}>stars</Text>
              </View>
            </View>
          )}

          <Button onPress={onPrimary} style={{ width: '100%', marginBottom: 10 }}>
            {won ? (
              <>
                <Text style={styles.btnPrimaryText}>Next level</Text>
                <ChevronRight size={17} color="#291063" style={{ marginLeft: 8 }} />
              </>
            ) : paused ? (
              <>
                <Text style={styles.btnPrimaryText}>Resume glow</Text>
                <Play size={17} color="#291063" fill="#291063" style={{ marginLeft: 8 }} />
              </>
            ) : (
              <>
                <Text style={styles.btnPrimaryText}>Try again</Text>
                <RotateCcw size={17} color="#291063" style={{ marginLeft: 8 }} />
              </>
            )}
          </Button>

          {onSecondary && (
            <Button variant="ghost" onPress={onSecondary} style={{ width: '100%', marginBottom: 10 }}>
              <Text style={styles.btnGhostText}>{won ? 'Replay level' : 'Leave level'}</Text>
              <ArrowLeft size={16} color="white" style={{ marginLeft: 8 }} />
            </Button>
          )}

          <Button variant="ghost" onPress={onClose} style={{ width: '100%' }}>
            <Text style={styles.btnGhostText}>{won ? 'Keep exploring' : paused ? 'Close pause' : 'Keep playing'}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(13,3,42,0.5)',
  },
  modal: {
    width: '100%',
    maxWidth: 390,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 25,
    borderRadius: 30,
    backgroundColor: '#1b0a4e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
  },
  successOrb: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: '#ffb53a',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
    marginBottom: 12,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: 'white',
    marginBottom: 7,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 22,
    maxWidth: 260,
  },
  resultRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 23,
  },
  resultPill: {
    minWidth: 88,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  resultPillValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  resultPillLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    height: 24,
    alignItems: 'center',
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
});
