import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Sobre o KONECTA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <LinearGradient colors={["#a90072", "#d60770"]} style={styles.logoWrap}>
          <Text style={styles.logoText}>K</Text>
        </LinearGradient>

        <Text style={styles.name}>KONECTA</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>

        <Text style={styles.desc}>
          O KONECTA é uma plataforma digital que conecta pessoas, profissionais e empresas. A nossa missão é
          facilitar o acesso a serviços de qualidade onde quer que esteja.
        </Text>

        <View style={styles.quoteCard}>
          <Text style={styles.quote}>"Tudo o que você precisa. Onde você estiver."</Text>
        </View>

        <Text style={styles.copyright}>© 2026 KONECTA · Angola</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: {
    backgroundColor: colors.white,
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: { fontSize: 15, fontFamily: fonts.extrabold, color: colors.ink },
  body: { padding: 24, alignItems: "center" },
  logoWrap: { width: 90, height: 90, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  logoText: { color: colors.white, fontFamily: fonts.black, fontSize: 48 },
  name: { fontSize: 26, fontFamily: fonts.extrabold, color: colors.ink },
  version: { fontSize: 13, color: colors.muted, marginBottom: 24, fontFamily: fonts.regular },
  desc: { fontSize: 14, color: "#637392", lineHeight: 22, textAlign: "center", marginBottom: 24, fontFamily: fonts.regular },
  quoteCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, marginBottom: 20, width: "100%", ...cardShadow },
  quote: { fontSize: 13, fontStyle: "italic", color: colors.muted, lineHeight: 20, textAlign: "center", fontFamily: fonts.regular },
  copyright: { fontSize: 13, color: colors.muted, fontFamily: fonts.regular },
});
