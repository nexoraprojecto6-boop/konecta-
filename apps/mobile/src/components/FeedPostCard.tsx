import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { FeedPost } from "../data/feedPosts";
import { Avatar } from "./Avatar";
import { colors, fonts, radius, cardShadow } from "../theme/tokens";

export function FeedPostCard({ post, onPress }: { post: FeedPost; onPress: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.head}>
        <Avatar initials={post.avatarInitials} color={post.avatarColor} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {post.name} {post.verified && <Text style={styles.verified}>◆</Text>}
          </Text>
          <Text style={styles.meta}>{post.time} · {post.place}</Text>
        </View>
        <View style={[styles.badge, post.type === "offer" && styles.badgeOffer]}>
          <Text style={[styles.badgeText, post.type === "offer" && styles.badgeOfferText]}>{post.typeLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{post.desc}</Text>
          <View style={styles.tags}>
            {post.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        </View>
        <Image source={{ uri: post.image }} style={styles.image} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={(e) => { e.stopPropagation(); setLiked((v) => !v); }}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={colors.purple} />
          <Text style={styles.actionText}>{post.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={16} color="#3473B5" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 14, ...cardShadow },
  head: { flexDirection: "row", alignItems: "center", gap: 9 },
  name: { fontSize: 13, fontFamily: fonts.extrabold, color: colors.ink },
  verified: { color: colors.purple, fontSize: 10 },
  meta: { fontSize: 9, color: colors.muted, marginTop: 3, fontFamily: fonts.regular },
  badge: { borderRadius: 15, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: colors.needBg },
  badgeOffer: { backgroundColor: colors.offerBg },
  badgeText: { fontSize: 9, fontFamily: fonts.bold, color: colors.purple },
  badgeOfferText: { color: colors.offerText },
  content: { flexDirection: "row", gap: 10, marginTop: 11 },
  title: { fontSize: 14, fontFamily: fonts.extrabold, color: colors.ink, marginBottom: 5, lineHeight: 18 },
  desc: { fontSize: 11, lineHeight: 15, color: colors.muted, fontFamily: fonts.regular },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { backgroundColor: colors.tagBg, color: colors.tagText, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, fontSize: 8, fontFamily: fonts.semibold },
  image: { width: 88, height: 74, borderRadius: 10 },
  actions: { flexDirection: "row", gap: 18, borderTopWidth: 1, borderTopColor: colors.line, marginTop: 11, paddingTop: 10 },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { fontSize: 11, color: colors.ink, fontFamily: fonts.bold },
});
