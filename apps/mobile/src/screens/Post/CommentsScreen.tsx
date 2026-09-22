import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Avatar } from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Comments">;

type Comment = { id: string; name: string; initials: string; color: string; time: string; text: string };

const INITIAL_COMMENTS: Comment[] = [
  { id: "1", name: "Rosa Dias", initials: "RD", color: "#d60770", time: "1h", text: "Excelente publicação! Conheço um profissional de confiança." },
  { id: "2", name: "Paulo Neto", initials: "PN", color: "#5379b2", time: "2h", text: "Já trabalhei com ele antes, recomendo!" },
  { id: "3", name: "Maria Santos", initials: "MS", color: "#a90072", time: "3h", text: "Tenho o contacto de um eletricista excelente no Maianga." },
];

export function CommentsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: String(Date.now()), name: user?.name ?? "Você", initials: (user?.name ?? "Você").slice(0, 2).toUpperCase(), color: colors.purple, time: "Agora", text },
    ]);
    setText("");
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View>
          <Text style={styles.title}>Comentários</Text>
          <Text style={styles.subtitle}>{comments.length} comentários</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {comments.map((c) => (
          <View key={c.id} style={styles.commentRow}>
            <Avatar initials={c.initials} color={c.color} size={38} />
            <View style={styles.commentBubble}>
              <View style={styles.commentHead}>
                <Text style={styles.commentName}>{c.name}</Text>
                <Text style={styles.commentTime}>{c.time}</Text>
              </View>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <Avatar initials={(user?.name ?? "Você").slice(0, 2).toUpperCase()} color={colors.purple} size={36} />
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escrever comentário..."
            placeholderTextColor={colors.muted}
          />
          <Pressable onPress={send} hitSlop={8}>
            <Ionicons name="arrow-up-circle" size={30} color={colors.purple} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  subtitle: { fontSize: 11, color: colors.muted, fontFamily: fonts.regular },
  body: { padding: 18, gap: 18 },
  commentRow: { flexDirection: "row", gap: 12 },
  commentBubble: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: 13, ...cardShadow },
  commentHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  commentName: { fontSize: 12, fontFamily: fonts.bold, color: colors.ink },
  commentTime: { fontSize: 10, color: colors.muted, fontFamily: fonts.regular },
  commentText: { fontSize: 13, color: "#637392", lineHeight: 19, fontFamily: fonts.regular },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    paddingBottom: 28,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: "#F7F9FD",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 6,
    height: 44,
  },
  input: { flex: 1, fontSize: 13, color: colors.ink, fontFamily: fonts.regular },
});
