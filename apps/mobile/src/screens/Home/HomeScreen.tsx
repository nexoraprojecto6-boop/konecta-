import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KONECTA</Text>
      <Text style={styles.greeting}>Olá, {user?.name}</Text>

      <TouchableOpacity
        style={styles.ctaCard}
        onPress={() => navigation.navigate("Discovery")}
      >
        <Text style={styles.ctaLabel}>O que você precisa?</Text>
        <Text style={styles.ctaButtonText}>🔎 Encontrar agora</Text>
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.secondaryButtonText}>Meu perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("ActivateProfessional")}
        >
          <Text style={styles.secondaryButtonText}>
            Quero oferecer serviços
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 32,
  },
  ctaCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
  },
  ctaLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryActions: {
    width: "100%",
    marginTop: 24,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#111",
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 16,
  },
  logoutButtonText: {
    color: "#c0392b",
    fontWeight: "600",
  },
});
