import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { DEMO_POSTS } from "../../data/feedPosts";
import { Avatar } from "../../components/Avatar";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Contact">;

const CONTACT_OPTIONS = [
  { icon: "logo-whatsapp" as const, label: "WhatsApp" },
  { icon: "call-outline" as const, label: "Ligar" },
  { icon: "mail-outline" as const, label: "Mensagem" },
];

export function ContactScreen({ route, navigation }: Props) {
  const post = DEMO_POSTS.find((p) => p.id === route.params.postId);
  const [message, setMessage] = useState("");

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View>
          <Text style={styles.title}>Entrar em contacto</Text>
          <Text style={styles.subtitle}>{post ? `${post.name} · ${post.tags[0]}` : ""}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {post && (
          <View style={styles.profileCard}>
            <Avatar initials={post.avatarInitials} color={post.avatarColor} size={52} />
            <View>
              <Text style={styles.profileName}>
                {post.name} {post.verified && <Text style={styles.verified}>◆</Text>}
              </Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={13} color={colors.orange} />
                ))}
              </View>
              <Text style={styles.profileMeta}>48 trabalhos concluídos</Text>
            </View>
          </View>
        )}

        <View style={styles.optionsRow}>
          {CONTACT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.label}
              style={styles.optionButton}
              onPress={() => Alert.alert("KONECTA", `A abrir: ${opt.label}`)}
            >
              <Ionicons name={opt.icon} size={20} color={colors.ink} />
              <Text style={styles.optionText}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Sua mensagem</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          placeholder="Descreva o que você precisa..."
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Pressable
          style={styles.sendButton}
          onPress={() => {
            Alert.alert("KONECTA", "Mensagem enviada!");
            navigation.goBack();
          }}
        >
          <Text style={styles.sendButtonText}>Enviar mensagem</Text>
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
  subtitle: { fontSize: 11, color: colors.muted, fontFamily: fonts.regular },
  body: { padding: 18, gap: 16 },
  profileCard: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, ...cardShadow },
  profileName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  verified: { color: colors.purple },
  stars: { flexDirection: "row", gap: 2, marginTop: 4 },
  profileMeta: { fontSize: 11, color: colors.muted, marginTop: 4, fontFamily: fonts.regular },
  optionsRow: { flexDirection: "row", gap: 12 },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    gap: 6,
  },
  optionText: { fontSize: 11, fontFamily: fonts.bold, color: colors.ink },
  label: { fontSize: 13, fontFamily: fonts.bold, color: colors.ink },
  textarea: {
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.white,
    fontFamily: fonts.regular,
  },
  sendButton: { height: 54, borderRadius: radius.md, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center", marginTop: 4 },
  sendButtonText: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
});
