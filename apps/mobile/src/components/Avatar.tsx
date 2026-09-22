import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme/tokens";

export function Avatar({
  initials,
  color = colors.purple,
  size = 44,
}: {
  initials: string;
  color?: string;
  size?: number;
}) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={{ color: colors.white, fontSize: size * 0.36, fontFamily: fonts.extrabold }}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
});
