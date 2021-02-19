# What is this?

A react-native component that will allow you to quickly implement scroll-over functionality in order to give the pages on your app a nice layered feel.

The package makes use of react-native-reanimated v2 alpha and was built and tested using version 2.0.0-rc.0. Installation of this package requires some extra steps that can be found here - https://docs.swmansion.com/react-native-reanimated/docs/installation. An attempt to use this package without upgrading to Reanimated 2 will fail.

# Installation

`npm i react-native-scrollover-view`

## Example

```
import React from "react";
import { View, Text } from "react-native";
import ScrolloverView from 'react-native-scrollover-view';

const App = () => {

  const Top = () => (
    <View
      style={{
        height: 400,
        backgroundColor: "#99bab1",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Some mind-blowing static content...</Text>
    </View>
  );

  const Bottom = () => (
    <View
      style={{
        height: 800,
        borderRadius: 30,
        backgroundColor: "#629af5",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Some cool stuff to scroll through...</Text>
    </View>
  );

  const Footer = () => (
    <View
      style={{
        height: 140,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Some funky footer content...</Text>
    </View>
  );

  const Hidden = () => (
    <View style={{ padding: 30, width: "100%" }}>
      <Text style={{ textAlign: "center" }}>Something hidden...</Text>
    </View>
  );

  return(
    <ScrolloverView
      topContent={Top}
      bottomContent={Bottom}
      backgroundColor={"#99bab1"}
      footerBackgroundColor={"black"}
      footerContent={Footer}
      hiddenTopContent={Hidden}
    />
  );
};

export default App;
```

## Options

There are no required options, however, not providing _topContent_ or _bottomContent_ will likely render the use of this package futile.

- _topContent_ - The top content rendered in the scrollover-view. This will be static - i.e. the content that is "scrolled over". Takes any react-native component.
- _bottomContent_ - The bottom content rendered in the scrollover-view. This will be dynamic - i.e. the content that is itself "scrolled". Takes any react-native component.
- _footerContent_ - If used, when attempting to scroll beyond the bottom bounds of the scrollview, an animated footer will fade in from "behind" the bottom content. Takes any react-native component. Note: Providing a component with a height around 140 is recommended for best-effect.
- _hiddenTopContent_ - Hidden content that can be revealed by attempting to scroll beyond the upper bounds of the scrollview. Takes any react-native component.
- _backgroundColor_ - When used, will fill all empty white-space with the color provided. Takes any valid JavaScript color. Note: Specific parts of the background can be overridden with _statusBarBackgroundColor_ and _footerBackgroundColor_.
- _statusBarBackgroundColor_ - The colour of the status bar. Takes any valid JavaScript color.
- _footerBackgroundColor_ - The colour of the footer background. Takes any valid JavaScript color.
