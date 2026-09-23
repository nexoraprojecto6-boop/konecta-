import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "PostSuccess">;

export function PostSuccessScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#a90072", "#d60770"]} style={styles.iconWrap}>
        <Ionicons name="checkmark" size={46} color={colors.white} />
      </LinearGradient>

      <Text style={styles.title}>Publicado com sucesso!</Text>
      <Text style={styles.desc}>
        A sua publicação está agora disponível para todos os utilizadores do KONECTA na sua região.
      </Text>

      <View style={styles.statsCard}>
        {[
          { n: "0", l: "Visualizações" },
          { n: "0", l: "Contactos" },
          { n: "0", l: "Curtidas" },
        ].map((s) => (
          <View key={s.l} style={styles.stat}>
            <Text style={styles.statNumber}>{s.n}</Text>
            <Text style={styles.statLabel}>{s.l}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Voltar ao feed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD", alignItems: "center", justifyContent: "center", padding: 32 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 22, fontFamily: fonts.extrabold, color: colors.ink, textAlign: "center", marginBottom: 10 },
  desc: { fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 19, marginBottom: 26, fontFamily: fonts.regular },
  statsCard: { flexDirection: "row", justifyContent: "space-around", backgroundColor: colors.white, borderRadius: radius.lg, paddingVertical: 18, width: "100%", marginBottom: 24 },
  stat: { alignItems: "center" },
  statNumber: { fontSize: 20, fontFamily: fonts.extrabold, color: colors.purple },
  statLabel: { fontSize: 10, color: colors.muted, marginTop: 3, fontFamily: fonts.regular },
  button: { width: "100%", height: 54, borderRadius: radius.md, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" },
  buttonText: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
});
