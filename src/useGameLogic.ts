import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

export type LumenColor = 'solar' | 'verdant' | 'terra' | 'nova' | 'cosmic' | 'aether' | 'blaze';
export type Tile = { id: number; color: LumenColor; fusion?: boolean };
export type BoosterKind = 'shuffle' | 'bomb' | 'burst';
export type SavedProgress = {
  highestUnlocked: number;
  completed: Record<number, { stars: number; bestScore: number }>;
  coins: number;
  sound: boolean;
  music: boolean;
  dailyGiftClaimedOn?: string;
};
export type LineDirection = { row: number; col: number };
export type SoundKind = 'wake' | 'link' | 'backtrack' | 'pop' | 'gravity' | 'booster' | 'special' | 'win' | 'lose';

export const BOARD_SIZE = 6;
export const colors: LumenColor[] = ['solar', 'verdant', 'terra', 'nova', 'cosmic', 'aether', 'blaze'];
export const boosterPrices: Record<BoosterKind, number> = { shuffle: 100, bomb: 150, burst: 250 };

export const defaultProgress: SavedProgress = {
  highestUnlocked: 1,
  completed: {},
  coins: 1000,
  sound: true,
  music: true,
};

let nextTileId = 100;
const freshTileId = () => nextTileId++;

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const levelConfig = (level: number) => ({
  level,
  targetScore: 5000 + (level - 1) * 1000,
  moves: 40 + (level - 1) * 20,
  world: level < 11 ? 'Starlight Meadows' : level < 26 ? 'Crystal Valley' : 'Twilight Grove',
  title: level < 11 ? 'First Glow' : level < 26 ? 'Crystal Drift' : 'Moonlit Bloom',
  lesson: level <= 2 ? 'Make an easy 3-link to wake the meadow' : level <= 5 ? 'Longer chains charge brighter rewards' : 'Find the clearest line through the glow',
  canSpawnVortex: level >= 5,
});

export const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
export const rowOf = (index: number) => Math.floor(index / BOARD_SIZE);
export const colOf = (index: number) => index % BOARD_SIZE;
export const lineDirections: LineDirection[] = [
  { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
  { row: 0, col: -1 }, { row: 0, col: 1 },
  { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
];

export const directionBetween = (from: number, to: number): LineDirection | null => {
  const row = rowOf(to) - rowOf(from);
  const col = colOf(to) - colOf(from);
  if (Math.abs(row) > 1 || Math.abs(col) > 1 || (row === 0 && col === 0)) return null;
  return { row: Math.sign(row), col: Math.sign(col) };
};

export const lineStep = (from: number, to: number, direction: LineDirection) => {
  return rowOf(to) - rowOf(from) === direction.row && colOf(to) - colOf(from) === direction.col;
};

export const hasPlayableChain = (board: (Tile | null)[]) => {
  for (let start = 0; start < board.length; start += 1) {
    const tile = board[start];
    if (!tile) continue;
    for (const direction of lineDirections) {
      let length = 1;
      let row = rowOf(start) + direction.row;
      let col = colOf(start) + direction.col;
      while (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        const next = row * BOARD_SIZE + col;
        if (board[next]?.color !== tile.color) break;
        length += 1;
        if (length >= 3) return true;
        row += direction.row;
        col += direction.col;
      }
    }
  }
  return false;
};

const installGuaranteedLine = (board: Tile[], color: LumenColor = 'solar') => {
  const directions = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
  ];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const starts: number[] = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const endRow = row + direction.row * 2;
      const endCol = col + direction.col * 2;
      if (endRow >= 0 && endRow < BOARD_SIZE && endCol >= 0 && endCol < BOARD_SIZE) starts.push(row * BOARD_SIZE + col);
    }
  }
  const start = starts[Math.floor(Math.random() * starts.length)] ?? 0;
  const startRow = rowOf(start);
  const startCol = colOf(start);
  for (let step = 0; step < 3; step += 1) {
    const index = (startRow + direction.row * step) * BOARD_SIZE + startCol + direction.col * step;
    if (board[index] && !board[index].fusion) board[index].color = color;
  }
};

export const makeBoard = (level = 1): Tile[] => {
  let board: Tile[] = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, id) => ({
    id: freshTileId(),
    color: randomColor(),
  }));
  installGuaranteedLine(board, level <= 2 ? 'solar' : randomColor());
  if (level >= 8 && Math.random() < 0.1) board[17] = { id: freshTileId(), color: 'cosmic', fusion: true };
  return board;
};

export const collapseBoard = (board: (Tile | null)[], level = 1, spawnVortex = false) => {
  const next: (Tile | null)[] = Array(36).fill(null);
  const refilled: number[] = [];
  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const survivors: Tile[] = [];
    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      const tile = board[row * BOARD_SIZE + col];
      if (tile) survivors.push(tile);
    }
    for (let row = BOARD_SIZE - 1, i = 0; row >= 0; row -= 1, i += 1) {
      if (survivors[i]) next[row * BOARD_SIZE + col] = survivors[i];
      else {
        next[row * BOARD_SIZE + col] = { id: freshTileId(), color: randomColor() };
        refilled.push(row * BOARD_SIZE + col);
      }
    }
  }
  if (spawnVortex && level >= 5 && Math.random() < 0.72) {
    const slot = refilled[Math.floor(Math.random() * refilled.length)];
    if (slot !== undefined) next[slot] = { id: freshTileId(), color: 'cosmic', fusion: true };
  }
  if (!hasPlayableChain(next)) {
    installGuaranteedLine(next as Tile[], level <= 2 ? 'solar' : randomColor());
  }
  return { board: next as Tile[], refilled };
};

export function useSoundEngine(enabled: boolean) {
  const play = useCallback(async (kind: SoundKind, intensity = 1) => {
    if (!enabled) return;
    // STUB: Replace with expo-av Audio.Sound.createAsync if files are available
  }, [enabled]);

  return { play };
}
