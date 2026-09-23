import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, heroGradient, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Account">;

export function AccountScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? "U").slice(0, 2).toUpperCase();

  const menuItems = [
    { icon: "✏️", label: "Editar perfil", onPress: () => navigation.navigate("Profile") },
    { icon: "❤️", label: "Favoritos", onPress: () => navigation.navigate("Favorites") },
    { icon: "🏢", label: "Minha empresa", onPress: () => Alert.alert("KONECTA", "Em breve nesta fase.") },
    { icon: "⚙️", label: "Configurações", onPress: () => navigation.navigate("Settings") },
    { icon: "❓", label: "Ajuda e suporte", onPress: () => navigation.navigate("Help") },
    { icon: "ℹ️", label: "Sobre o KONECTA", onPress: () => navigation.navigate("About") },
    { icon: "🚪", label: "Terminar sessão", onPress: () => logout(), danger: true },
  ];

  return (
    <View style={styles.screen}>
      <LinearGradient colors={heroGradient} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? "Utilizador"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.statsRow}>
          {[
            { n: "12", l: "Publicações" },
            { n: "3", l: "Contratos" },
            { n: "4.8", l: "Avaliação" },
          ].map((s) => (
            <View key={s.l} style={styles.stat}>
              <Text style={styles.statNumber}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 19 }}>{item.icon}</Text>
              <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
              {!item.danger && <Text style={styles.chevron}>›</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20, alignItems: "center" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 24 },
  name: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 17 },
  email: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2, fontFamily: fonts.regular },
  statsRow: { flexDirection: "row", gap: 20, marginTop: 14 },
  stat: { alignItems: "center" },
  statNumber: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 17 },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2, fontFamily: fonts.regular },
  body: { padding: 18, paddingBottom: 40 },
  menuCard: { backgroundColor: colors.white, borderRadius: radius.xl, overflow: "hidden", ...cardShadow },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: fonts.semibold, color: colors.ink },
  menuLabelDanger: { color: colors.pink },
  chevron: { color: colors.muted, fontSize: 18 },
});
