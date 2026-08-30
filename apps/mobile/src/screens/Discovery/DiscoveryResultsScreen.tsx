import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DiscoveryResultItem } from "@konecta/types";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import * as api from "../../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "DiscoveryResults">;

export function DiscoveryResultsScreen({ route, navigation }: Props) {
  const { q, lat, lng, radiusKm } = route.params;
  const [items, setItems] = useState<DiscoveryResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .searchDiscovery({ q, lat, lng, radiusKm })
      .then((res) => setItems(res.items))
      .catch(() => setError("Falha ao buscar resultados próximos"))
      .finally(() => setLoading(false));
  }, [q, lat, lng, radiusKm]);

  const handleOpen = (item: DiscoveryResultItem) => {
    if (item.type === "professional") {
      navigation.navigate("ProfessionalPublic", { userId: item.id });
    } else {
      navigation.navigate("CompanyPublic", { id: item.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          Nenhum resultado encontrado num raio de {radiusKm} km.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleOpen(item)}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.type === "professional" ? item.profession : "Empresa"}
            {item.category ? ` · ${item.category}` : ""}
          </Text>
          <Text style={styles.meta}>
            📍 {item.distanceKm.toFixed(1)} km
            {item.city ? ` · ${item.city}` : ""}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  list: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#444", marginTop: 2 },
  meta: { fontSize: 13, color: "#777", marginTop: 6 },
  error: { color: "#c0392b" },
  empty: { color: "#666", textAlign: "center" },
});
