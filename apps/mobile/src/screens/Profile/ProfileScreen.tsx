import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { PROVINCES, type AppRegion } from "@konecta/config";
import type { UserLocation } from "@konecta/types";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

export function ProfileScreen() {
  const { user, accessToken, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [savingLocation, setSavingLocation] = useState(false);
  const [requestingGps, setRequestingGps] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const region = (user?.region ?? "AO") as AppRegion;
  const provinces = PROVINCES[region] ?? [];

  useEffect(() => {
    if (!accessToken) return;
    api
      .getMyLocation(accessToken)
      .then((loc) => {
        setLocation(loc);
        setProvince(loc.province ?? "");
        setCity(loc.city ?? "");
      })
      .catch(() => setLocationError("Não foi possível carregar a localização"))
      .finally(() => setLoadingLocation(false));
  }, [accessToken]);

  const handleSaveProfile = async () => {
    if (!accessToken) return;
    setProfileError(null);
    setProfileSaved(false);
    setSavingProfile(true);
    try {
      const updated = await api.updateProfile(accessToken, { name });
      updateUser(updated);
      setProfileSaved(true);
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Falha ao salvar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveLocationText = async () => {
    if (!accessToken) return;
    setLocationError(null);
    setSavingLocation(true);
    try {
      const updated = await api.updateMyLocation(accessToken, { province, city });
      setLocation(updated);
    } catch (e) {
      setLocationError(
        e instanceof Error ? e.message : "Falha ao salvar localização",
      );
    } finally {
      setSavingLocation(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocationError(null);
    setRequestingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(
          "Permissão de localização negada. Você ainda pode preencher província e cidade manualmente.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});

      if (!accessToken) return;
      if (!province || !city) {
        setLocationError(
          "Preencha província e cidade antes de usar o GPS (obrigatórios na primeira vez).",
        );
        return;
      }

      const updated = await api.updateMyLocation(accessToken, {
        province,
        city,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLocation(updated);
    } catch {
      setLocationError("Não foi possível obter a localização atual");
    } finally {
      setRequestingGps(false);
    }
  };

  const handleRemoveLocation = async () => {
    if (!accessToken) return;
    setLocationError(null);
    setSavingLocation(true);
    try {
      await api.deleteMyLocation(accessToken);
      setLocation({
        province: null,
        city: null,
        latitude: null,
        longitude: null,
        updatedAt: null,
      });
      setProvince("");
      setCity("");
    } catch {
      setLocationError("Falha ao remover localização");
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.readOnly}>{user?.email}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      {profileError && <Text style={styles.error}>{profileError}</Text>}
      {profileSaved && <Text style={styles.success}>Perfil atualizado.</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveProfile}
        disabled={savingProfile}
      >
        {savingProfile ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar perfil</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.title, styles.sectionSpacing]}>Localização</Text>

      {loadingLocation ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.label}>Província</Text>
          <View style={styles.regionRow}>
            {provinces.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.provinceOption,
                  province === p && styles.provinceOptionSelected,
                ]}
                onPress={() => setProvince(p)}
              >
                <Text
                  style={
                    province === p
                      ? styles.provinceTextSelected
                      : styles.provinceText
                  }
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Cidade</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          {location?.latitude !== null && location?.latitude !== undefined && (
            <Text style={styles.readOnly}>
              Coordenadas: {location.latitude.toFixed(4)},{" "}
              {location.longitude?.toFixed(4)}
            </Text>
          )}

          {locationError && <Text style={styles.error}>{locationError}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveLocationText}
            disabled={savingLocation}
          >
            <Text style={styles.buttonText}>Salvar província/cidade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleUseCurrentLocation}
            disabled={requestingGps}
          >
            {requestingGps ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.secondaryButtonText}>
                Usar minha localização atual
              </Text>
            )}
          </TouchableOpacity>

          {location?.province && (
            <TouchableOpacity onPress={handleRemoveLocation}>
              <Text style={styles.link}>Remover localização</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 22, fontWeight: "bold" },
  sectionSpacing: { marginTop: 32 },
  label: { fontSize: 13, color: "#666", marginTop: 16, marginBottom: 4 },
  readOnly: { fontSize: 15, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  regionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  provinceOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  provinceOptionSelected: { backgroundColor: "#111", borderColor: "#111" },
  provinceText: { color: "#111", fontSize: 13 },
  provinceTextSelected: { color: "#fff", fontSize: 13 },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryButton: { backgroundColor: "#eee" },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondaryButtonText: { color: "#111", fontWeight: "600" },
  link: { textAlign: "center", marginTop: 16, color: "#c0392b" },
  error: { color: "#c0392b", marginTop: 8 },
  success: { color: "#27ae60", marginTop: 8 },
});
