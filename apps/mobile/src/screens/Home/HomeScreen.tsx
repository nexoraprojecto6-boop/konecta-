import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getApiHealth } from "../../services/api";

export function HomeScreen() {
  const [status, setStatus] = useState<string>("Verificando...");

  useEffect(() => {
    getApiHealth()
      .then((health) => setStatus(`API: ${health.status}`))
      .catch(() => setStatus("API indisponível"));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KONECTA</Text>
      <Text style={styles.subtitle}>Fase 1 — Fundação</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  status: {
    fontSize: 16,
    marginTop: 24,
  },
});
