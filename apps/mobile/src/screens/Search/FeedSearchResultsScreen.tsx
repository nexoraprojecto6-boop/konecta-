import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { DEMO_POSTS } from "../../data/feedPosts";
import { FeedPostCard } from "../../components/FeedPostCard";
import { colors, fonts, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "FeedSearchResults">;

export function FeedSearchResultsScreen({ route, navigation }: Props) {
  const { query } = route.params;

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return DEMO_POSTS.filter((p) =>
      `${p.name} ${p.title} ${p.desc} ${p.tags.join(" ")}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View>
          <Text style={styles.title}>"{query}"</Text>
          <Text style={styles.subtitle}>{results.length} resultado(s) encontrado(s)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Nenhum resultado</Text>
            <Text style={styles.emptyDesc}>Tente pesquisar com outras palavras.</Text>
          </View>
        ) : (
          results.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
            />
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
    ...cardShadow,
  },
  title: { fontSize: 16, fontFamily: fonts.extrabold, color: colors.ink },
  subtitle: { fontSize: 11, color: colors.muted, fontFamily: fonts.regular },
  body: { padding: 18, paddingBottom: 40, gap: 13 },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyEmoji: { fontSize: 44, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontFamily: fonts.extrabold, color: colors.ink },
  emptyDesc: { fontSize: 13, color: colors.muted, marginTop: 6, fontFamily: fonts.regular },
});
