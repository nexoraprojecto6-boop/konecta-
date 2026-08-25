import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { APP_REGIONS, type AppRegion } from "@konecta/config";
import type { AuthStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";

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
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 8 caracteres, 1 letra e 1 número)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.regionRow}>
        {APP_REGIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.regionOption,
              region === r && styles.regionOptionSelected,
            ]}
            onPress={() => setRegion(r)}
          >
            <Text
              style={
                region === r ? styles.regionTextSelected : styles.regionText
              }
            >
              {r === "AO" ? "Angola" : "Moçambique"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {formError && <Text style={styles.error}>{formError}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  regionRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  regionOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  regionOptionSelected: { backgroundColor: "#111", borderColor: "#111" },
  regionText: { color: "#111" },
  regionTextSelected: { color: "#fff" },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { textAlign: "center", marginTop: 16, color: "#111" },
  error: { color: "#c0392b", marginBottom: 8 },
});
