import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfessionalProfile, Service } from "@konecta/types";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import * as api from "../../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "ProfessionalPublic">;

export function ProfessionalPublicScreen({ route }: Props) {
  const { userId } = route.params;
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getProfessionalProfile(userId),
      api.listServicesByOwner({ professionalProfileId: userId }),
    ])
      .then(([p, s]) => {
        setProfile(p);
        setServices(s);
      })
      .catch(() => setError("Perfil não encontrado"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Perfil não encontrado"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.profession}>{profile.profession}</Text>

      {profile.city && <Text style={styles.info}>📍 {profile.city}</Text>}
      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      {services.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Serviços</Text>
          {services.map((s) => (
            <Text key={s.id} style={styles.serviceItem}>
              • {s.name}
            </Text>
          ))}
        </>
      )}

      <View style={styles.contactRow}>
        {profile.phone && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${profile.phone}`)}
          >
            <Text style={styles.contactButtonText}>📞 Ligar</Text>
          </TouchableOpacity>
        )}
        {profile.whatsapp && (
          <TouchableOpacity
            style={[styles.contactButton, styles.whatsappButton]}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${profile.whatsapp?.replace(/\D/g, "")}`,
              )
            }
          >
            <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, padding: 24 },
  name: { fontSize: 22, fontWeight: "700" },
  profession: { fontSize: 16, color: "#444", marginTop: 4 },
  info: { fontSize: 14, color: "#666", marginTop: 12 },
  bio: { fontSize: 14, color: "#333", marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 24 },
  serviceItem: { fontSize: 14, marginTop: 6 },
  contactRow: { flexDirection: "row", gap: 12, marginTop: 32 },
  contactButton: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  whatsappButton: { backgroundColor: "#25D366" },
  contactButtonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#c0392b" },
});
