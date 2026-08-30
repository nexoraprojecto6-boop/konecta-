import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { DEFAULT_DISCOVERY_RADIUS_KM } from "@konecta/config";

type Props = NativeStackScreenProps<RootStackParamList, "Discovery">;

/**
 * Tela central do KONECTA: "O que você precisa?". Captura a localização
 * atual do dispositivo e navega para os resultados. Nesta fase, sem
 * interpretação de intenção por IA — a busca textual acontece no
 * backend via ILIKE (ver DiscoveryService).
 */
export function DiscoverySearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(
          "É necessário permitir o acesso à localização para encontrar profissionais e empresas próximas.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});

      navigation.navigate("DiscoveryResults", {
        q: query.trim() || undefined,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        radiusKm: DEFAULT_DISCOVERY_RADIUS_KM,
      });
    } catch {
      setError("Não foi possível obter sua localização");
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KONECTA</Text>
      <Text style={styles.subtitle}>O que você precisa?</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: mecânico, eletricista, cabeleireiro..."
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loadingLocation}
      >
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>🔎 Encontrar agora</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  error: { color: "#c0392b", marginBottom: 12, textAlign: "center" },
});
