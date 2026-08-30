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
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "ActivateProfessional">;

/**
 * Fluxo "Quero oferecer serviços": ativa a atuação profissional do
 * usuário (cria o ProfessionalProfile). A partir daqui, o usuário passa
 * a poder aparecer no Discovery e cadastrar seus serviços.
 */
export function ActivateProfessionalScreen({ navigation }: Props) {
  const { accessToken } = useAuth();
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestingGps, setRequestingGps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleUseLocation = async () => {
    setRequestingGps(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
    } catch {
      setError("Não foi possível obter a localização atual");
    } finally {
      setRequestingGps(false);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.activateProfessionalProfile(accessToken, {
        profession,
        city: city || undefined,
        latitude: coords?.lat,
        longitude: coords?.lng,
      });
      navigation.navigate("Home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao ativar perfil profissional");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quero oferecer serviços</Text>
      <Text style={styles.subtitle}>
        Ative sua atuação profissional para aparecer no KONECTA Discovery.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Profissão (ex: Mecânico)"
        value={profession}
        onChangeText={setProfession}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleUseLocation}
        disabled={requestingGps}
      >
        {requestingGps ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.secondaryButtonText}>
            {coords ? "Localização capturada ✓" : "Usar minha localização atual"}
          </Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting || !profession}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ativar perfil profissional</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 8, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButton: { backgroundColor: "#eee" },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondaryButtonText: { color: "#111", fontWeight: "600" },
  error: { color: "#c0392b", marginTop: 8 },
});
