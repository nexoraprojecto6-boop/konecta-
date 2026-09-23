import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, heroGradient, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "CreatePostType">;

const TYPES = [
  { icon: "🙋", label: "Preciso de serviço", desc: "Solicite um profissional ou serviço", color: colors.purple },
  { icon: "💼", label: "Ofereço serviço", desc: "Apresente os seus serviços ao mercado", color: colors.pink },
  { icon: "🛍️", label: "Produto", desc: "Venda ou ofereça um produto", color: colors.orange },
  { icon: "💡", label: "Oportunidade", desc: "Partilhe uma vaga ou oportunidade", color: "#5379b2" },
];

export function CreatePostTypeScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={heroGradient} style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={{ marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.title}>Nova publicação</Text>
        <Text style={styles.subtitle}>O que quer partilhar?</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        {TYPES.map((type) => (
          <Pressable
            key={type.label}
            style={styles.typeCard}
            onPress={() => navigation.navigate("PostForm", { type: type.label })}
          >
            <View style={[styles.typeIcon, { backgroundColor: `${type.color}18` }]}>
              <Text style={{ fontSize: 26 }}>{type.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.typeLabel}>{type.label}</Text>
              <Text style={styles.typeDesc}>{type.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: { paddingTop: 54, paddingHorizontal: 18, paddingBottom: 20 },
  title: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 20 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4, fontFamily: fonts.regular },
  body: { padding: 18, gap: 12 },
  typeCard: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, ...cardShadow },
  typeIcon: { width: 52, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  typeLabel: { fontSize: 15, fontFamily: fonts.bold, color: colors.ink },
  typeDesc: { fontSize: 12, color: colors.muted, marginTop: 3, fontFamily: fonts.regular },
});
