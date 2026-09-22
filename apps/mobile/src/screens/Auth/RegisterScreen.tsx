import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { APP_REGIONS, type AppRegion } from "@konecta/config";
import type { AuthStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { KonectaLogo } from "../../components/KonectaLogo";
import { colors, fonts, radius, heroGradient } from "../../theme/tokens";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState<AppRegion>("AO");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      await register({ name, email, password, region });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Falha ao cadastrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={heroGradient} style={styles.header}>
        <Pressable onPress={() => navigation.navigate("Login")} hitSlop={12} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <KonectaLogo white size="sm" />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Junte-se a milhares de pessoas e profissionais.</Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha (mín. 8 caracteres, 1 letra e 1 número)"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.regionRow}>
            {APP_REGIONS.map((r) => (
              <Pressable
                key={r}
                style={[styles.regionOption, region === r && styles.regionOptionSelected]}
                onPress={() => setRegion(r)}
              >
                <Text style={region === r ? styles.regionTextSelected : styles.regionText}>
                  {r === "AO" ? "Angola" : "Moçambique"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {formError && <Text style={styles.error}>{formError}</Text>}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Criar conta</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")} style={styles.linkRow}>
          <Text style={styles.linkText}>
            Já tem conta? <Text style={styles.linkTextBold}>Entrar</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: { height: 120, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 4 },
  body: { padding: 24, paddingTop: 24, gap: 4, paddingBottom: 48 },
  title: { color: colors.ink, fontSize: 22, fontFamily: fonts.extrabold },
  subtitle: { color: colors.muted, fontSize: 13, fontFamily: fonts.regular, marginBottom: 8 },
  form: { gap: 12, marginTop: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 15,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.white,
    fontFamily: fonts.semibold,
  },
  regionRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  regionOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  regionOptionSelected: { backgroundColor: colors.purple, borderColor: colors.purple },
  regionText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13 },
  regionTextSelected: { color: colors.white, fontFamily: fonts.extrabold, fontSize: 13 },
  button: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: { color: colors.white, fontSize: 15, fontFamily: fonts.extrabold },
  linkRow: { marginTop: 16, alignItems: "center" },
  linkText: { color: colors.muted, fontSize: 13, fontFamily: fonts.regular },
  linkTextBold: { color: colors.purple, fontFamily: fonts.extrabold },
  error: { color: "#c0392b", fontSize: 12, marginTop: 4, fontFamily: fonts.semibold },
});
