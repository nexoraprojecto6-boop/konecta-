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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { KonectaLogo } from "../../components/KonectaLogo";
import { colors, fonts, radius, heroGradient } from "../../theme/tokens";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Falha ao entrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={heroGradient} style={styles.header}>
        <KonectaLogo white size="lg" />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Acesse a sua conta para continuar.</Text>

        <View style={styles.form}>
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
            placeholder="Senha"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {formError && <Text style={styles.error}>{formError}</Text>}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")} style={styles.linkRow}>
          <Text style={styles.linkText}>
            Não tem conta? <Text style={styles.linkTextBold}>Cadastrar-se</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FD" },
  header: { height: 220, alignItems: "center", justifyContent: "flex-end", paddingBottom: 32 },
  body: { padding: 24, paddingTop: 28, gap: 6 },
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
