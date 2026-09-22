import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "FeedSearch">;

const RECENT = ["Eletricista Maianga", "Designer Gráfico", "Mecânico Kilamba", "Cabeleireira Talatona"];
const POPULAR = ["🔧 Mecânica", "⚡ Eletricista", "💆 Beleza", "📱 Tecnologia", "🏠 Imóveis", "📷 Fotografia"];

export function FeedSearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");

  function goToResults(q: string) {
    if (!q.trim()) return;
    navigation.navigate("FeedSearchResults", { query: q });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => goToResults(query)}
            placeholder="Pesquisar..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <Pressable style={styles.goButton} onPress={() => goToResults(query)}>
          <Text style={styles.goButtonText}>Ir</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionLabel}>PESQUISAS RECENTES</Text>
        {RECENT.map((item) => (
          <Pressable key={item} style={styles.recentRow} onPress={() => goToResults(item)}>
            <Ionicons name="time-outline" size={16} color={colors.muted} />
            <Text style={styles.recentText}>{item}</Text>
          </Pressable>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>POPULARES AGORA</Text>
        <View style={styles.popularWrap}>
          {POPULAR.map((item) => (
            <Pressable key={item} style={styles.popularChip} onPress={() => goToResults(item)}>
              <Text style={styles.popularText}>{item}</Text>
            </Pressable>
          ))}
        </View>
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
    ...cardShadow,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#F7F9FD",
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 14, fontFamily: fonts.semibold },
  goButton: { backgroundColor: colors.purple, borderRadius: 12, paddingHorizontal: 14, height: 40, alignItems: "center", justifyContent: "center" },
  goButtonText: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 13 },
  body: { padding: 18 },
  sectionLabel: { color: colors.muted, fontSize: 12, fontFamily: fonts.bold, marginBottom: 10 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recentText: { fontSize: 13, color: colors.ink, fontFamily: fonts.semibold },
  popularWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  popularChip: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...cardShadow,
  },
  popularText: { fontSize: 13, color: colors.ink, fontFamily: fonts.semibold },
});
