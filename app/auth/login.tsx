// app/auth/login.tsx
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
  Modal,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const SERVER_URL = "http://velaopentraxx.sytes.net:3320";

export default function Login() {
  const { width } = useWindowDimensions();          // largura dinâmica
  const CARD_W = Math.min(width * 0.9, 420);        // máx 420 px
  const HERO_H = CARD_W * 0.45;                     // 45 % da largura
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para o modal de erro customizado
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      showError("Por favor, preencha os campos de e‑mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        // Salva o token e os dados do usuário para uso em rotas protegidas
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/(tabs)/home");
      } else {
        // Caso ocorra erro de autenticação, exibe mensagem customizada
        if (data.error && data.error.toLowerCase().includes("senha")) {
          // Erro na senha
          showError("Senha incorreta. Por favor, verifique sua senha e tente novamente.");
        } else {
          // Outro erro (ex.: usuário não encontrado)
          showError(data.error || "Falha na autenticação.");
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      // Erro de conexão ou outro problema inesperado
      showError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
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
            {/* ---------- CARD ---------- */}
            <View style={[styles.card, { width: CARD_W }]}>
              {/* HERO */}
              <ImageBackground
                source={require("@/assets/images/frameworks-2.jpg")}
                style={{ height: HERO_H, justifyContent: "flex-end" }}
                resizeMode="cover"
              >
                <Text style={styles.heroTitle}>Bem‑vindo</Text>
              </ImageBackground>

              {/* FORM */}
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  <Text style={{ fontWeight: "300" }}>USER </Text>
                  <Text style={{ fontWeight: "700" }}>LOGIN</Text>
                </Text>

                {/* E‑MAIL */}
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

                {/* SENHA */}
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

                {/* BOTÃO */}
                <TouchableOpacity
                  onPress={handleLogin}
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
                      <Text style={styles.buttonText}>ENTRAR</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* LINKS */}
                <Text
                  style={styles.link}
                  onPress={() => router.push("/auth/registro")}
                >
                  Ainda não tem conta? Cadastre‑se
                </Text>
                <Text
                  style={[styles.link, { marginTop: 10 }]}
                  onPress={() => router.push("/auth/loginFuncionario")}
                >
                  Entrar como Funcionário
                </Text>
              </View>
            </View>
            {/* ---------- /CARD ---------- */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* modal de erro (sem alteração) */}
    </LinearGradient>
  );
}


/* --------------------- ESTILOS --------------------- */
const styles = StyleSheet.create({
  flex: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },

  /* CARD */
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
    backgroundColor: "#0D47A120",
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
    marginTop: 8,
  },
});