import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, fonts, radius, cardShadow } from "../../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "PostForm">;

export function PostFormScreen({ route, navigation }: Props) {
  const { type } = route.params;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("Luanda");
  const [tags, setTags] = useState("");

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>{type}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.field}>
          <Text style={styles.label}>TÍTULO</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Preciso de um eletricista urgente"
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>LOCALIZAÇÃO</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Luanda - Maianga"
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <TextInput
            style={styles.textarea}
            value={desc}
            onChangeText={setDesc}
            placeholder="Descreva em detalhes o que você precisa ou oferece..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>TAGS (separar por vírgula)</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="Ex: Eletricista, Urgente, Maianga"
            placeholderTextColor={colors.muted}
          />
        </View>

        <Pressable style={styles.uploadBox}>
          <View style={styles.uploadIcon}>
            <Text style={{ fontSize: 22 }}>📷</Text>
          </View>
          <View>
            <Text style={styles.uploadTitle}>Adicionar imagem</Text>
            <Text style={styles.uploadDesc}>Opcional · máx. 5 fotos</Text>
          </View>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("PostPreview", { type, title, desc, location, tags })
          }
        >
          <Text style={styles.primaryButtonText}>Pré-visualizar publicação</Text>
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
  body: { padding: 18, gap: 14, paddingBottom: 100 },
  field: { gap: 7 },
  label: { fontSize: 11, fontFamily: fonts.bold, color: colors.muted },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.white,
    fontFamily: fonts.regular,
  },
  textarea: {
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.white,
    fontFamily: fonts.regular,
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.line,
    padding: 16,
  },
  uploadIcon: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.needBg, alignItems: "center", justifyContent: "center" },
  uploadTitle: { fontSize: 13, fontFamily: fonts.bold, color: colors.ink },
  uploadDesc: { fontSize: 11, color: colors.muted, marginTop: 2, fontFamily: fonts.regular },
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
  },
  primaryButton: { height: 54, borderRadius: radius.md, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
});
