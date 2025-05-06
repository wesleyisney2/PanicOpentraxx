// app/auth/registro.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  useWindowDimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SERVER_URL = "http://velaopentraxx.sytes.net:3320";

export default function Registro() {
  /* -------- dimensões dinâmicas -------- */
  const { width } = useWindowDimensions();
  const CARD_W = Math.min(width * 0.9, 420); // máx 420 px
  const HERO_H = CARD_W * 0.45;              // 45 % da largura

  const router = useRouter();
  const [nome,  setNome]  = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha nome, e‑mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${SERVER_URL}/create/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_usuario: nome,
          email_usuario: email,
          senha_usuario: senha,
          funcao_usuario: "",
          telefone_usuario: "",
          foto_usuario: "",
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        Alert.alert("Sucesso", "Usuário registrado com sucesso!");
        router.replace("/auth/login");
      } else {
        Alert.alert("Erro no registro", data.error || "Falha ao registrar usuário.");
      }
    } catch (err) {
      console.error("Erro no registro:", err);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* ---------------- CARD ---------------- */}
            <View style={[styles.card, { width: CARD_W }]}>
              {/* ------------- HERO ------------- */}
              <ImageBackground
                source={require("@/assets/images/frameworks-2.jpg")} // troque se quiser
                style={{ height: HERO_H, justifyContent: "flex-end" }}
                resizeMode="cover"
              >
                {/* overlay p/ contraste */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.heroTitle}>Crie sua conta</Text>
              </ImageBackground>

              {/* ------------- FORM ------------- */}
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  <Text style={{ fontWeight: "300" }}>USER </Text>
                  <Text style={{ fontWeight: "700" }}>SIGN‑UP</Text>
                </Text>

                {/* nome */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#0093ff"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>

                {/* email */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="E‑mail"
                    placeholderTextColor="#0093ff"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* senha */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#0093ff"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                  />
                </View>

                {/* botão */}
                <TouchableOpacity
                  onPress={handleRegistro}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#42A5F5", "#1E88E5", "#0D47A1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>REGISTRAR</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* voltar */}
                <Text style={styles.link} onPress={() => router.back()}>
                  Voltar para Login
                </Text>
              </View>
            </View>
            {/* -------------- /CARD -------------- */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ----------------- ESTILOS ----------------- */
const styles = StyleSheet.create({
  flex: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },

  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    paddingBottom: 18,
  },

  form: { paddingVertical: 28, paddingHorizontal: 24 },

  formTitle: {
    fontSize: 16,
    color: "#0D47A1",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 24,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D47A120", // 12 % opacidade
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  input: { flex: 1, height: 46, color: "#0D47A1" },

  button: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },

  link: {
    color: "#1976D2",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
});
