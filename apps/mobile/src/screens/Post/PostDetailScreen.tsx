import React, { useState } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { DEMO_POSTS } from "../../data/feedPosts";
import { Avatar } from "../../components/Avatar";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetail">;

export function PostDetailScreen({ route, navigation }: Props) {
  const post = DEMO_POSTS.find((p) => p.id === route.params.postId);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!post) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Publicação não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View>
        <Image source={{ uri: post.image }} style={styles.hero} />
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.badge, post.type === "offer" && styles.badgeOffer]}>
            <Text style={[styles.badgeText, post.type === "offer" && styles.badgeOfferText]}>{post.typeLabel}</Text>
          </View>
          <View style={styles.iconActions}>
            <Pressable style={[styles.iconButton, saved && styles.iconButtonActive]} onPress={() => setSaved((v) => !v)}>
              <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={17} color={saved ? colors.purple : colors.muted} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="share-social-outline" size={17} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.authorRow}>
          <Avatar initials={post.avatarInitials} color={post.avatarColor} size={48} />
          <View>
            <Text style={styles.authorName}>
              {post.name} {post.verified && <Text style={styles.verified}>◆</Text>}
            </Text>
            <Text style={styles.authorMeta}>{post.time} · {post.place}</Text>
          </View>
        </View>

        <Text style={styles.desc}>{post.desc}</Text>

        <View style={styles.tags}>
          {post.tags.map((tag) => (
            <Text key={tag} style={styles.tag}>{tag}</Text>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.action} onPress={() => setLiked((v) => !v)}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={colors.purple} />
            <Text style={styles.actionText}>{post.likes + (liked ? 1 : 0)}</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={() => navigation.navigate("Comments", { postId: post.id })}>
            <Ionicons name="chatbubble-outline" size={20} color="#3473B5" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.contactButton} onPress={() => navigation.navigate("Contact", { postId: post.id })}>
          <Text style={styles.contactButtonText}>Entrar em contacto</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { color: colors.muted, fontFamily: fonts.semibold },
  hero: { width: "100%", height: 220 },
  backButton: {
    position: "absolute",
    top: 46,
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 20 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  badge: { borderRadius: 15, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.needBg },
  badgeOffer: { backgroundColor: colors.offerBg },
  badgeText: { fontSize: 10, fontFamily: fonts.bold, color: colors.purple },
  badgeOfferText: { color: colors.offerText },
  iconActions: { flexDirection: "row", gap: 8 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7F9FD",
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: { backgroundColor: colors.needBg },
  title: { fontSize: 20, fontFamily: fonts.extrabold, color: colors.ink, lineHeight: 26, marginBottom: 14 },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  authorName: { fontFamily: fonts.bold, color: colors.ink, fontSize: 14 },
  verified: { color: colors.purple, fontSize: 11 },
  authorMeta: { fontSize: 11, color: colors.muted, marginTop: 2, fontFamily: fonts.regular },
  desc: { fontSize: 13, lineHeight: 20, color: "#4a5877", fontFamily: fonts.regular, marginBottom: 14 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tag: { backgroundColor: colors.tagBg, color: colors.tagText, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontFamily: fonts.semibold },
  actionsRow: { flexDirection: "row", gap: 24, marginBottom: 20 },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 13, color: colors.ink, fontFamily: fonts.bold },
  contactButton: { height: 54, borderRadius: radius.md, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center", ...cardShadow },
  contactButtonText: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
});
