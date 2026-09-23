import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { CONTRACTS, CONTRACT_STATUS_LABEL, type ContractStatus } from "../../data/contracts";
import { colors, fonts, radius, heroGradient, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Contracts">;

const TABS: { key: "all" | ContractStatus; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Ativos" },
  { key: "pending", label: "Pendentes" },
  { key: "completed", label: "Concluídos" },
];

export function ContractsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<"all" | ContractStatus>("all");
  const filtered = tab === "all" ? CONTRACTS : CONTRACTS.filter((c) => c.status === tab);

  return (
    <View style={styles.screen}>
      <LinearGradient colors={heroGradient} style={styles.header}>
        <Text style={styles.title}>Meus Contratos</Text>
        <Text style={styles.subtitle}>{CONTRACTS.length} contratos no total</Text>
      </LinearGradient>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            {tab === t.key && <View style={styles.tabLine} />}
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {filtered.map((c) => {
          const s = CONTRACT_STATUS_LABEL[c.status];
          return (
            <Pressable
              key={c.id}
              style={styles.card}
              onPress={() => navigation.navigate("ContractDetail", { contractId: c.id })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle} numberOfLines={2}>{c.title}</Text>
                <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                  <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                </View>
              </View>
              <Text style={styles.provider}>Prestador: {c.provider}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>{c.date}</Text>
                <Text style={styles.value}>{c.value}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: { paddingTop: 54, paddingHorizontal: 18, paddingBottom: 20 },
  title: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 20 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4, fontFamily: fonts.regular },
  tabs: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: 8 },
  tab: { paddingVertical: 13, paddingHorizontal: 10, alignItems: "center" },
  tabText: { fontSize: 12, color: colors.muted, fontFamily: fonts.semibold },
  tabTextActive: { color: colors.purple, fontFamily: fonts.extrabold },
  tabLine: { height: 3, width: "100%", backgroundColor: colors.purple, borderRadius: 2, marginTop: 8 },
  body: { padding: 18, gap: 12 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, ...cardShadow },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { flex: 1, marginRight: 10, fontSize: 14, fontFamily: fonts.bold, color: colors.ink },
  statusPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 10, fontFamily: fonts.bold },
  provider: { fontSize: 12, color: colors.muted, marginTop: 8, fontFamily: fonts.regular },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  date: { fontSize: 11, color: colors.muted, fontFamily: fonts.regular },
  value: { fontSize: 13, fontFamily: fonts.extrabold, color: colors.purple },
});
