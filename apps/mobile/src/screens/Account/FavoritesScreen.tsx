import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { DEMO_POSTS } from "../../data/feedPosts";
import { FeedPostCard } from "../../components/FeedPostCard";
import { colors, fonts } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export function FavoritesScreen({ navigation }: Props) {
  // Demonstrativo: mostra os dois primeiros posts como exemplo de "guardados".
  const favorites = DEMO_POSTS.slice(0, 2);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Favoritos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyTitle}>Sem favoritos ainda</Text>
            <Text style={styles.emptyDesc}>Guarde publicações para as encontrar aqui.</Text>
          </View>
        ) : (
          favorites.map((post) => (
            <FeedPostCard key={post.id} post={post} onPress={() => navigation.navigate("PostDetail", { postId: post.id })} />
          ))
        )}
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
  body: { padding: 18, gap: 13 },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyEmoji: { fontSize: 44, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontFamily: fonts.extrabold, color: colors.ink },
  emptyDesc: { fontSize: 13, color: colors.muted, marginTop: 6, fontFamily: fonts.regular },
});
