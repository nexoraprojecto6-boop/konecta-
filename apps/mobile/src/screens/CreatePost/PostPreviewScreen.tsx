import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Avatar } from "../../components/Avatar";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "PostPreview">;

export function PostPreviewScreen({ route, navigation }: Props) {
  const { type, title, desc, location, tags } = route.params;
  const isOffer = type.startsWith("Ofereço");
  const tagList = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : ["Exemplo", "Konecta"];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Pré-visualização</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.notice}>
          <Text style={{ fontSize: 18 }}>👁️</Text>
          <Text style={styles.noticeText}>Assim é como a sua publicação aparecerá para outros utilizadores.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Avatar initials="EU" color={colors.purple} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Você</Text>
              <Text style={styles.meta}>Agora · {location || "Luanda"}</Text>
            </View>
            <View style={[styles.badge, isOffer && styles.badgeOffer]}>
              <Text style={[styles.badgeText, isOffer && styles.badgeOfferText]}>{type}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{title || "A minha publicação de exemplo"}</Text>
          <Text style={styles.postDesc}>
            {desc || "Descrição da publicação que será publicada no KONECTA para que profissionais e utilizadores possam ver."}
          </Text>
          <View style={styles.tags}>
            {tagList.map((tag) => (
              <Text key={tag} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.outlineButton} onPress={() => navigation.goBack()}>
          <Text style={styles.outlineButtonText}>Editar</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("PostSuccess")}
        >
          <Text style={styles.primaryButtonText}>Publicar agora</Text>
        </Pressable>
      </View>
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
  body: { padding: 18, paddingBottom: 100 },
  notice: { flexDirection: "row", gap: 10, backgroundColor: colors.needBg, borderRadius: radius.md, padding: 14, marginBottom: 16 },
  noticeText: { flex: 1, fontSize: 12, color: colors.purple, fontFamily: fonts.semibold },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 16, ...cardShadow },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  name: { fontSize: 13, fontFamily: fonts.extrabold, color: colors.ink },
  meta: { fontSize: 10, color: colors.muted, marginTop: 2, fontFamily: fonts.regular },
  badge: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: colors.needBg },
  badgeOffer: { backgroundColor: colors.offerBg },
  badgeText: { fontSize: 9, fontFamily: fonts.bold, color: colors.purple },
  badgeOfferText: { color: colors.offerText },
  postTitle: { fontSize: 15, fontFamily: fonts.extrabold, color: colors.ink, marginBottom: 6 },
  postDesc: { fontSize: 12, lineHeight: 18, color: colors.muted, fontFamily: fonts.regular },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: { backgroundColor: colors.tagBg, color: colors.tagText, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, fontSize: 9, fontFamily: fonts.semibold },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingBottom: 32,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: { flex: 1, height: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.purple, alignItems: "center", justifyContent: "center" },
  outlineButtonText: { color: colors.purple, fontSize: 14, fontFamily: fonts.extrabold },
  primaryButton: { flex: 2, height: 54, borderRadius: radius.md, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: colors.white, fontSize: 14, fontFamily: fonts.extrabold },
});
