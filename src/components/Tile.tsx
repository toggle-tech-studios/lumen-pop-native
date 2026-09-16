import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Tile as TileType } from '../useGameLogic';

interface TileProps {
  tile: TileType;
  index: number;
  selected: boolean;
  popping: boolean;
  fresh: boolean;
  size: number;
}

const images = {
  solar_closed: require('../../assets/solar_closed.png'),
  solar_opened: require('../../assets/solar_opened.png'),
  verdant_closed: require('../../assets/verdant_closed.png'),
  verdant_opened: require('../../assets/verdant_opened.png'),
  terra_closed: require('../../assets/terra_closed.png'),
  terra_opened: require('../../assets/terra_opened.png'),
  nova_closed: require('../../assets/nova_closed.png'),
  nova_opened: require('../../assets/nova_opened.png'),
  cosmic_closed: require('../../assets/cosmic_closed.png'),
  cosmic_opened: require('../../assets/cosmic_opened.png'),
  aether_closed: require('../../assets/aether_closed.png'),
  aether_opened: require('../../assets/aether_opened.png'),
  blaze_closed: require('../../assets/blaze_closed.png'),
  blaze_opened: require('../../assets/blaze_opened.png'),
  fusion_orb: require('../../assets/fusion_orb.png'),
};

export const TileComponent = React.memo(({ tile, selected, popping, fresh, size }: TileProps) => {
  const scale = useSharedValue(fresh ? 0 : 1);
  const opacity = useSharedValue(fresh ? 0 : 1);
  const translateY = useSharedValue(fresh ? -40 : 0);

  useEffect(() => {
    if (fresh) {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 12 });
    }
  }, [fresh]);

  useEffect(() => {
    if (popping) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0, { duration: 200 })
      );
      opacity.value = withTiming(0, { duration: 350 });
    }
  }, [popping]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: selected && !popping ? 1.1 : scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  const artwork = tile.fusion 
    ? images.fusion_orb 
    : images[`${tile.color}_${selected ? 'opened' : 'closed'}` as keyof typeof images];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View 
        style={[
          styles.tile, 
          selected && styles.selected,
          tile.fusion && styles.fusionTile,
          animatedStyle
        ]}
      >
        <Animated.Image 
          source={artwork} 
          style={[
            tile.fusion ? styles.fusionArt : styles.lumenArt,
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  tile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
  },
  fusionTile: {
    backgroundColor: 'rgba(110,76,196,0.2)',
  },
  lumenArt: {
    width: '84%',
    height: '84%',
  },
  fusionArt: {
    width: '86%',
    height: '86%',
  },
});
