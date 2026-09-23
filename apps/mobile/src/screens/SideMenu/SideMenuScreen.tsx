import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { KonectaLogo } from "../../components/KonectaLogo";
import { colors, fonts, heroGradient } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "SideMenu">;

type MenuItem = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };

export function SideMenuScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const items: MenuItem[] = [
    { icon: "home-outline", label: "Feed", onPress: () => navigation.navigate("Home") },
    { icon: "search-outline", label: "Descobrir", onPress: () => navigation.navigate("Discovery") },
    { icon: "notifications-outline", label: "Notificações", onPress: () => navigation.navigate("Notifications") },
    { icon: "person-outline", label: "Minha conta", onPress: () => navigation.navigate("Account") },
    { icon: "briefcase-outline", label: "Oferecer serviços", onPress: () => navigation.navigate("ActivateProfessional") },
  ];

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />
      <View style={styles.panel}>
        <LinearGradient colors={heroGradient} style={styles.header}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{user?.name ?? "Utilizador"}</Text>
            <Text style={styles.userLocation}>Luanda, Angola</Text>
          </View>
        </LinearGradient>

        <View style={styles.itemsWrap}>
          {items.map((item) => (
            <Pressable
              key={item.label}
              style={styles.item}
              onPress={() => {
                navigation.goBack();
                item.onPress();
              }}
            >
              <Ionicons name={item.icon} size={20} color={colors.ink} />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.item}
          onPress={() => {
            navigation.goBack();
            logout();
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#c0392b" />
          <Text style={[styles.itemLabel, { color: "#c0392b" }]}>Sair</Text>
        </Pressable>

        <View style={styles.footer}>
          <KonectaLogo size="sm" />
          <Text style={styles.version}>Versão 1.0.0 · Angola</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row", backgroundColor: "rgba(9,20,45,0.4)" },
  backdrop: { flex: 1 },
  panel: { width: "78%", backgroundColor: colors.white },
  header: { padding: 20, paddingTop: 56, flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.3)", borderWidth: 2, borderColor: "rgba(255,255,255,0.6)" },
  userName: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
  userLocation: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2, fontFamily: fonts.regular },
  itemsWrap: { paddingVertical: 8 },
  item: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 14, paddingHorizontal: 20 },
  itemLabel: { fontSize: 14, fontFamily: fonts.semibold, color: colors.ink },
  footer: { marginTop: "auto", padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.line, gap: 8 },
  version: { fontSize: 10, color: colors.muted, fontFamily: fonts.regular },
});
