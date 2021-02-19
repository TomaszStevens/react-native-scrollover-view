import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { getStatusBarHeight } from "react-native-status-bar-height";

const ScrolloverView = ({
  topContent,
  bottomContent,
  footerContent,
  hiddenTopContent,
  backgroundColor,
  statusBarBackgroundColor,
  footerBackgroundColor,
  safeAreaForced,
}) => {
  const [hasLaidOut, setHasLaidOut] = useState(false);

  const SCREEN_HEIGHT = useSharedValue(Dimensions.get("window").height);
  const STATUS_BAR_HEIGHT = useSharedValue(getStatusBarHeight());

  const [TOP_BLOCK_HEIGHT, SET_TOP_BLOCK_HEIGHT] = useState(0);
  const SHARED_TOP_BLOCK_HEIGHT = useSharedValue(0);
  const BOTTOM_CONTENT_HEIGHT = useSharedValue(0);

  const onLayoutTopBlockContent = (e) => {
    SHARED_TOP_BLOCK_HEIGHT.value = e.nativeEvent.layout.height;
    SET_TOP_BLOCK_HEIGHT(e.nativeEvent.layout.height);
    setHasLaidOut(true); // Required to force rerender of hidden content to correct position
  };
  const onLayoutBottomContent = (e) => {
    BOTTOM_CONTENT_HEIGHT.value = e.nativeEvent.layout.height;
  };

  const translationY = useSharedValue(0);
  const scrollView = useAnimatedRef();

  const scrollHandler = useAnimatedScrollHandler((e) => {
    translationY.value = e.contentOffset.y;
  });

  const topBlockStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, SHARED_TOP_BLOCK_HEIGHT.value],
        [1, 0.5],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY:
            translationY.value +
            interpolate(translationY.value, [0, -200], [0, 10]),
        },
        {
          scale: interpolate(
            translationY.value,
            [0, -200],
            [1, 1.2],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const hiddenContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, -200],
        [0.2, 1.2],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [0, -200],
            [0, 25],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const footerStyle = useAnimatedStyle(() => {
    let DISTANCE_TO_BOTTOM =
      BOTTOM_CONTENT_HEIGHT.value -
      (SCREEN_HEIGHT.value - SHARED_TOP_BLOCK_HEIGHT.value);

    return {
      top: 50,
      opacity: interpolate(
        translationY.value,
        [DISTANCE_TO_BOTTOM + 20, DISTANCE_TO_BOTTOM + 120],
        [0, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [DISTANCE_TO_BOTTOM + 20, DISTANCE_TO_BOTTOM + 260],
            [-60, 60],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const StatusBar = () => (
    <View
      style={{
        height: STATUS_BAR_HEIGHT.value,
        backgroundColor: statusBarBackgroundColor ?? backgroundColor,
      }}
    />
  );

  const Footer = () => (
    <>
      {footerContent && (
        <View
          style={{
            ...styles.footer,
            backgroundColor: footerBackgroundColor ?? backgroundColor,
          }}
        >
          {<Animated.View style={footerStyle}>{footerContent()}</Animated.View>}
        </View>
      )}
    </>
  );

  const Content = () => (
    <>
      <Animated.View style={topBlockStyle} onLayout={onLayoutTopBlockContent}>
        {typeof safeAreaForced !== "undefined" ? (
          safeAreaForced && <StatusBar />
        ) : (
          <StatusBar />
        )}
        {topContent && topContent()}
      </Animated.View>
      {bottomContent && (
        <View onLayout={onLayoutBottomContent}>{bottomContent()}</View>
      )}
    </>
  );

  const HiddenTopContent = () => {
    return (
      <>
        {hiddenTopContent && (
          <Animated.View
            style={[
              {
                ...styles.hiddenTopContent,
                top: TOP_BLOCK_HEIGHT,
              },
              hiddenContentStyle,
            ]}
          >
            {hiddenTopContent()}
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor }}>
      {hasLaidOut && <HiddenTopContent />}
      <Animated.ScrollView
        ref={scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Footer />
        <Content />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  hiddenTopContent: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    width: "100%",
    height: 400,
    position: "absolute",
    bottom: -350,
  },
});

export default ScrolloverView;
