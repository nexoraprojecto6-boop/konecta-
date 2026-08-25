import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

export function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KONECTA</Text>
      <Text style={styles.subtitle}>Olá, {user?.name}</Text>
      <Text style={styles.info}>{user?.email}</Text>
      <Text style={styles.info}>
        Região: {user?.region === "AO" ? "Angola" : "Moçambique"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
