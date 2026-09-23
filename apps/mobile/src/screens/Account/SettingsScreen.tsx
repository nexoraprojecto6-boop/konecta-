import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <Pressable style={[styles.toggleTrack, value && styles.toggleTrackOn]} onPress={onChange}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const groups = [
    { title: "NOTIFICAÇÕES", items: [{ label: "Notificações push", val: notifEnabled, set: () => setNotifEnabled((v) => !v) }] },
    { title: "PRIVACIDADE", items: [{ label: "Localização ativa", val: locationEnabled, set: () => setLocationEnabled((v) => !v) }] },
    { title: "APARÊNCIA", items: [{ label: "Modo escuro", val: darkMode, set: () => setDarkMode((v) => !v) }] },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {groups.map((g) => (
          <View key={g.title} style={styles.group}>
            <Text style={styles.groupTitle}>{g.title}</Text>
            <View style={styles.groupCard}>
              {g.items.map((item, i) => (
                <View key={item.label} style={[styles.row, i < g.items.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Toggle value={item.val} onChange={item.set} />
                </View>
              ))}
            </View>
          </View>
        ))}

        <Pressable
          style={styles.dangerButton}
          onPress={() => {
            Alert.alert("KONECTA", "Conta eliminada");
            navigation.goBack();
          }}
        >
          <Text style={styles.dangerButtonText}>Eliminar conta</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: {
    backgroundColor: colors.white,
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: { fontSize: 15, fontFamily: fonts.extrabold, color: colors.ink },
  body: { padding: 18 },
  group: { marginBottom: 20 },
  groupTitle: { fontSize: 11, fontFamily: fonts.bold, color: colors.muted, marginBottom: 8 },
  groupCard: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: "hidden", ...cardShadow },
  row: { flexDirection: "row", alignItems: "center", padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: fonts.semibold, color: colors.ink },
  toggleTrack: { width: 48, height: 28, borderRadius: 14, backgroundColor: colors.line, justifyContent: "center" },
  toggleTrackOn: { backgroundColor: colors.purple },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, marginLeft: 3 },
  toggleThumbOn: { marginLeft: 23 },
  dangerButton: { padding: 15, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.pink, alignItems: "center" },
  dangerButtonText: { color: colors.pink, fontFamily: fonts.extrabold, fontSize: 14 },
});
