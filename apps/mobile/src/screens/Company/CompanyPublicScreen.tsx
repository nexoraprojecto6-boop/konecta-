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
import type { Company, Service } from "@konecta/types";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import * as api from "../../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "CompanyPublic">;

export function CompanyPublicScreen({ route }: Props) {
  const { id } = route.params;
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCompanyProfile(id),
      api.listServicesByOwner({ companyId: id }),
    ])
      .then(([c, s]) => {
        setCompany(c);
        setServices(s);
      })
      .catch(() => setError("Empresa não encontrada"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !company) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Empresa não encontrada"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        🏢 {company.tradeName}
        {company.verificationStatus === "VERIFIED" ? " ✓" : ""}
      </Text>
      {company.verificationStatus === "VERIFIED" && (
        <Text style={styles.verifiedLabel}>Empresa verificada</Text>
      )}

      {company.city && <Text style={styles.info}>📍 {company.city}</Text>}

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
        {company.phone && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${company.phone}`)}
          >
            <Text style={styles.contactButtonText}>📞 Ligar</Text>
          </TouchableOpacity>
        )}
        {company.whatsapp && (
          <TouchableOpacity
            style={[styles.contactButton, styles.whatsappButton]}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${company.whatsapp?.replace(/\D/g, "")}`,
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
  verifiedLabel: { fontSize: 13, color: "#27ae60", marginTop: 4 },
  info: { fontSize: 14, color: "#666", marginTop: 12 },
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
