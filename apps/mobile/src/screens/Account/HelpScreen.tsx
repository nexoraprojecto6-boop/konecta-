import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Help">;

const FAQS = [
  { q: "Como publicar uma oferta de serviço?", a: 'Toque no botão central "K" ou em "Fazer uma publicação" no feed. Selecione "Ofereço serviço" e preencha os detalhes.' },
  { q: "Como encontrar profissionais perto de mim?", a: "Use a pesquisa no topo do feed ou navegue pelas categorias. Ative a sua localização para resultados mais precisos." },
  { q: "Os contratos são seguros?", a: "Sim! O KONECTA garante que os pagamentos ficam em custódia até o serviço ser confirmado como concluído." },
  { q: "Como avaliar um prestador de serviço?", a: "Após o contrato ser concluído, receberá uma notificação para avaliar o prestador com 1 a 5 estrelas." },
];

export function HelpScreen({ navigation }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Ajuda e suporte</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <LinearGradient colors={["#a90072", "#d60770"]} style={styles.contactCard}>
          <Text style={{ fontSize: 30 }}>💬</Text>
          <View>
            <Text style={styles.contactTitle}>Fale connosco</Text>
            <Text style={styles.contactDesc}>Suporte disponível das 8h às 20h</Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>PERGUNTAS FREQUENTES</Text>
        {FAQS.map((faq, i) => (
          <Pressable key={faq.q} style={styles.faqCard} onPress={() => setOpen(open === i ? null : i)}>
            <View style={styles.faqHead}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Ionicons name={open === i ? "chevron-up" : "chevron-down"} size={16} color={colors.purple} />
            </View>
            {open === i && <Text style={styles.faqAnswer}>{faq.a}</Text>}
          </Pressable>
        ))}
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
  body: { padding: 18 },
  contactCard: { flexDirection: "row", gap: 14, alignItems: "center", borderRadius: radius.lg, padding: 20, marginBottom: 20 },
  contactTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },
  contactDesc: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2, fontFamily: fonts.regular },
  sectionLabel: { fontSize: 12, fontFamily: fonts.bold, color: colors.muted, marginBottom: 12 },
  faqCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 15, marginBottom: 10 },
  faqHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  faqQuestion: { flex: 1, fontSize: 13, fontFamily: fonts.semibold, color: colors.ink },
  faqAnswer: { fontSize: 13, color: "#637392", lineHeight: 19, marginTop: 10, fontFamily: fonts.regular },
});
