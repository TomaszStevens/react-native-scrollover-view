import React from "react";
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
}) => {
  const SCREEN_HEIGHT = useSharedValue(Dimensions.get("window").height);
  const STATUS_BAR_HEIGHT = useSharedValue(getStatusBarHeight());

  const TOP_CONTENT_HEIGHT = useSharedValue(0);
  const BOTTOM_CONTENT_HEIGHT = useSharedValue(0);

  const onLayoutTopContent = (e) => {
    TOP_CONTENT_HEIGHT.value = e.nativeEvent.layout.height;
  };
  const onLayoutBottomContent = (e) => {
    BOTTOM_CONTENT_HEIGHT.value = e.nativeEvent.layout.height;
  };

  const translationY = useSharedValue(0);
  const scrollView = useAnimatedRef();

  const scrollHandler = useAnimatedScrollHandler((e) => {
    translationY.value = e.contentOffset.y;
  });

  const topContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  const footerStyle = useAnimatedStyle(() => {
    let DISTANCE_TO_BOTTOM =
      BOTTOM_CONTENT_HEIGHT.value -
      (SCREEN_HEIGHT.value -
        TOP_CONTENT_HEIGHT.value -
        STATUS_BAR_HEIGHT.value);

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
      {topContent && (
        <Animated.View style={topContentStyle} onLayout={onLayoutTopContent}>
          {topContent()}
        </Animated.View>
      )}
      {bottomContent && (
        <View onLayout={onLayoutBottomContent}>{bottomContent()}</View>
      )}
    </>
  );

  const HiddenTopContent = () => (
    <>
      {hiddenTopContent && (
        <View
          style={{
            ...styles.hiddenTopContent,
            top: STATUS_BAR_HEIGHT.value + TOP_CONTENT_HEIGHT.value,
          }}
        >
          {hiddenTopContent()}
        </View>
      )}
    </>
  );

  return (
    <View style={{ ...styles.container, backgroundColor }}>
      <HiddenTopContent />
      <Animated.ScrollView
        ref={scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar />
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
