// app/tabs/perfil.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Defina a URL base onde as imagens estão disponíveis
const IMAGE_BASE_URL = "http://velaopentraxx.sytes.net:3320/"; // ajuste conforme necessário

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Carrega os dados do usuário do AsyncStorage ao montar o componente
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          console.log("Dados do usuário carregados:", parsed);
          setUser(parsed);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Função para deslogar o usuário
  const handleLogout = async () => {
    // Remover token e dados do usuário do AsyncStorage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // Redireciona para a tela de login
    router.replace("/auth/login");
  };

  // Enquanto os dados do usuário não estão carregados, mostra um indicador
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Cabeçalho com foto do usuário e nome */}
      <View style={styles.header}>
      <Image
          source={{
            uri: user?.foto_usuario
              ? `${IMAGE_BASE_URL}${user.foto_usuario}`
              : "https://cdn-icons-png.flaticon.com/512/456/456212.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.nome_usuario || "Usuário"}</Text>
      </View>

      {/* Seção 1: Perfil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/editUserConfig")}
          >
          <Text style={styles.optionText}>Editar Informações do Usuário</Text>
        </TouchableOpacity>
      </View>

      {/* Seção 2: Informações sobre a Empresa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações sobre a Empresa</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/empresaDetails")}
        >
          <Text style={styles.optionText}>Ver Detalhes da Empresa</Text>
        </TouchableOpacity>
      </View>

      {/* Seção 3: Configurações do App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações do App</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/configuracoes")}  // Rota para a nova tela de configurações
        >
          <Text style={styles.optionText}>Ajustar Configurações</Text>
        </TouchableOpacity>
      </View>

      {/* Seção 4: Sair da Aplicação */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Aplicação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  contentContainer: { 
    padding: 20 
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#007AFF",
    fontWeight: "bold",
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
