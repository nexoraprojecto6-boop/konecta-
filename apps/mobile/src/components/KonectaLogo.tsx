import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme/tokens";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: number; name: number }> = {
  sm: { box: 28, name: 16 },
  md: { box: 38, name: 20 },
  lg: { box: 52, name: 27 },
};

export function KonectaLogo({ white = false, size = "md" }: { white?: boolean; size?: Size }) {
  const s = SIZES[size];
  const mainColor = white ? colors.white : colors.purple;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.box,
          { width: s.box, height: s.box, backgroundColor: white ? "rgba(255,255,255,0.15)" : "#fcebf6" },
        ]}
      >
        <Text style={{ color: mainColor, fontFamily: fonts.black, fontSize: s.box * 0.62, lineHeight: s.box * 0.68 }}>K</Text>
      </View>
      <View>
        <Text style={{ color: mainColor, fontFamily: fonts.extrabold, fontSize: s.name, letterSpacing: -0.5 }}>KONECTA</Text>
        {size !== "sm" && (
          <Text style={{ color: white ? "rgba(255,255,255,0.75)" : colors.muted, fontSize: 9 }}>
            Tudo o que você precisa.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  box: { borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
