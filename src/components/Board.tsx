import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, LayoutChangeEvent } from 'react-native';
import Svg, { Polyline, Circle as SvgCircle } from 'react-native-svg';
import { TileComponent } from './Tile';
import { Tile, LumenColor, BOARD_SIZE, rowOf, colOf } from '../useGameLogic';

interface BoardProps {
  board: (Tile | null)[];
  selected: number[];
  popping: number[];
  freshTiles: number[];
  activeType: LumenColor | null;
  onPointerDown: (index: number) => void;
  onPointerMove: (index: number) => void;
  onPointerUp: () => void;
}

const trailColors: Record<LumenColor, string> = {
  solar: '#ffe56f',
  verdant: '#7ef4b0',
  terra: '#ff9a65',
  nova: '#ff8ccc',
  cosmic: '#c29aff',
  aether: '#69eaff',
  blaze: '#ff6f8d',
};

export function Board({
  board,
  selected,
  popping,
  freshTiles,
  activeType,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BoardProps) {
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const tileSize = boardLayout.width / BOARD_SIZE;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (tileSize > 0) {
          const col = Math.floor(locationX / tileSize);
          const row = Math.floor(locationY / tileSize);
          if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            onPointerDown(row * BOARD_SIZE + col);
          }
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (tileSize > 0) {
          const col = Math.floor(locationX / tileSize);
          const row = Math.floor(locationY / tileSize);
          if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            onPointerMove(row * BOARD_SIZE + col);
          }
        }
      },
      onPanResponderRelease: () => {
        onPointerUp();
      },
      onPanResponderTerminate: () => {
        onPointerUp();
      },
    })
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBoardLayout(e.nativeEvent.layout);
  };

  const renderTrail = () => {
    if (selected.length < 1 || !activeType || tileSize === 0) return null;
    
    const points = selected.map(index => {
      const cx = (colOf(index) + 0.5) * tileSize;
      const cy = (rowOf(index) + 0.5) * tileSize;
      return `${cx},${cy}`;
    }).join(' ');

    const last = selected[selected.length - 1];
    const lastCx = (colOf(last) + 0.5) * tileSize;
    const lastCy = (rowOf(last) + 0.5) * tileSize;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          {selected.length > 1 && (
            <>
              <Polyline
                points={points}
                fill="none"
                stroke={trailColors[activeType]}
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.18}
              />
              <Polyline
                points={points}
                fill="none"
                stroke={trailColors[activeType]}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.86}
              />
            </>
          )}
          {selected.map(index => {
            const cx = (colOf(index) + 0.5) * tileSize;
            const cy = (rowOf(index) + 0.5) * tileSize;
            return (
              <SvgCircle
                key={index}
                cx={cx}
                cy={cy}
                r={6}
                fill={trailColors[activeType]}
              />
            );
          })}
          <SvgCircle
            cx={lastCx}
            cy={lastCy}
            r={12}
            fill="none"
            stroke={trailColors[activeType]}
            strokeWidth={2}
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.boardWrap}>
      <View 
        style={styles.board} 
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        {board.map((tile, index) => (
          <View key={tile ? tile.id : `empty-${index}`} style={{ width: `${100 / BOARD_SIZE}%`, height: `${100 / BOARD_SIZE}%` }}>
            {tile && (
              <TileComponent
                tile={tile}
                index={index}
                selected={selected.includes(index)}
                popping={popping.includes(index)}
                fresh={freshTiles.includes(index)}
                size={tileSize}
              />
            )}
          </View>
        ))}
        {renderTrail()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrap: {
    padding: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    aspectRatio: 1,
    width: '100%',
  },
  board: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(11,3,48,0.62)',
    borderRadius: 22,
    overflow: 'hidden',
  },
});
