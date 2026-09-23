import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { CONTRACTS, CONTRACT_STATUS_LABEL } from "../../data/contracts";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "ContractDetail">;

const STEPS = ["Criado", "Aceite", "Em curso", "Concluído"];

export function ContractDetailScreen({ route, navigation }: Props) {
  const contract = CONTRACTS.find((c) => c.id === route.params.contractId);

  if (!contract) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Contrato não encontrado.</Text>
      </View>
    );
  }

  const s = CONTRACT_STATUS_LABEL[contract.status];
  const activeStep = contract.status === "completed" ? 3 : contract.status === "active" ? 2 : 1;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Contrato</Text>
        <View style={[styles.statusPill, { backgroundColor: s.bg, marginLeft: "auto" }]}>
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.contractTitle}>{contract.title}</Text>
          {[
            { label: "Prestador", val: contract.provider },
            { label: "Data", val: contract.date },
            { label: "Valor", val: contract.value },
          ].map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.val}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.progressLabel}>PROGRESSO</Text>
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={step} style={styles.step}>
                <View style={[styles.stepCircle, i <= activeStep && styles.stepCircleActive]}>
                  {i <= activeStep ? (
                    <Ionicons name="checkmark" size={13} color={colors.white} />
                  ) : (
                    <Text style={styles.stepNumber}>{i + 1}</Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, i <= activeStep && styles.stepLabelActive]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {contract.status !== "completed" && (
        <View style={styles.footer}>
          <Pressable
            style={styles.outlineButton}
            onPress={() => {
              Alert.alert("KONECTA", "Contrato cancelado");
              navigation.goBack();
            }}
          >
            <Text style={styles.outlineButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              Alert.alert("KONECTA", "Contrato confirmado!");
              navigation.goBack();
            }}
          >
            <Text style={styles.primaryButtonText}>Confirmar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { color: colors.muted, fontFamily: fonts.semibold },
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
  statusPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 10, fontFamily: fonts.bold },
  body: { padding: 18, gap: 14, paddingBottom: 100 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, ...cardShadow },
  contractTitle: { fontSize: 17, fontFamily: fonts.extrabold, color: colors.ink, marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { fontSize: 13, color: colors.muted, fontFamily: fonts.regular },
  rowValue: { fontSize: 13, fontFamily: fonts.bold, color: colors.ink },
  progressLabel: { fontSize: 12, fontFamily: fonts.bold, color: colors.muted, marginBottom: 14 },
  steps: { flexDirection: "row", alignItems: "flex-start" },
  step: { flex: 1, alignItems: "center" },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.line, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  stepCircleActive: { backgroundColor: colors.purple },
  stepNumber: { fontSize: 11, color: colors.muted, fontFamily: fonts.bold },
  stepLabel: { fontSize: 9, color: colors.muted, fontFamily: fonts.semibold, textAlign: "center" },
  stepLabelActive: { color: colors.purple },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingBottom: 32,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: { flex: 1, height: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.purple, alignItems: "center", justifyContent: "center" },
  outlineButtonText: { color: colors.purple, fontSize: 14, fontFamily: fonts.extrabold },
  primaryButton: { flex: 1, height: 54, borderRadius: radius.md, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: colors.white, fontSize: 14, fontFamily: fonts.extrabold },
});
