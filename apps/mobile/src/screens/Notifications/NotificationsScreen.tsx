import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

/**
 * Dados demonstrativos: o KONECTA ainda não tem um modelo de notificações
 * no backend. Quando existir, isto passa a vir de api.listNotifications().
 */
const NOTIFICATIONS = [
  { id: "1", icon: "💬", text: "Carlos Mendes comentou na sua publicação", time: "5 min", read: false },
  { id: "2", icon: "❤️", text: "Ana Silva curtiu a sua publicação", time: "30 min", read: false },
  { id: "3", icon: "📄", text: "Novo contrato recebido de Eduardo Lopes", time: "1h", read: false },
  { id: "4", icon: "✅", text: "Contrato com Manuel Costa foi concluído", time: "2h", read: true },
  { id: "5", icon: "👤", text: "Jorge Simões quer entrar em contacto", time: "3h", read: true },
  { id: "6", icon: "⭐", text: "Recebeu uma avaliação de 5 estrelas!", time: "1d", read: true },
];

export function NotificationsScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.item, !item.read && styles.itemUnread]}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sem notificações por agora.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    ...cardShadow,
  },
  itemUnread: { backgroundColor: "#FFF7FB" },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.needBg,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 19 },
  textWrap: { flex: 1 },
  text: { color: colors.ink, fontSize: 13, fontFamily: fonts.semibold, lineHeight: 18 },
  time: { color: colors.muted, fontSize: 10, fontFamily: fonts.regular, marginTop: 3 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.pink },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40, fontFamily: fonts.regular },
});
