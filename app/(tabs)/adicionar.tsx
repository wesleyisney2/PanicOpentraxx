// app/tabs/adicionar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ANTENA_URL = "http://186.201.175.90:3000/dados";
const CREATE_TAGS_URL = "http://velaopentraxx.sytes.net:3320/create/tags";

export default function AdicionarScreen() {
  const router = useRouter();

  // Estado para controlar a tela: inicial (landing) ou o formulário
  const [showForm, setShowForm] = useState(false);

  // Lista completa de dispositivos
  const [antennaDevices, setAntennaDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do formulário
  const [selectedMac, setSelectedMac] = useState("");
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");

  // Estado para busca e limitação da lista
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(10);

  // Busca os dispositivos da antena sem o filtro restritivo
  useEffect(() => {
    const fetchAntennaData = async () => {
      setLoading(true);
      try {
        const response = await fetch(ANTENA_URL);
        const data = await response.json();
        setAntennaDevices(data);
        if (data.length > 0) {
          setSelectedMac(data[0].mac);
        }
      } catch (err) {
        console.error("Erro ao buscar dados da antena:", err);
        Alert.alert("Erro", "Não foi possível obter dados da antena.");
      } finally {
        setLoading(false);
      }
    };
    fetchAntennaData();
  }, []);

  // Função para filtrar resultados com base na busca
  const filteredDevices = antennaDevices.filter((item: any) => {
    if (!item.mac) return false;
    return item.mac.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Função para “carregar mais” itens
  const handleLoadMore = () => {
    setDisplayLimit(displayLimit + 10);
  };

  // Função para o botão da câmera (aqui um placeholder)
  const handleOpenCamera = () => {
    Alert.alert("Câmera", "Funcionalidade de leitura de QR ainda não implementada.");
  };

  // Função de cadastro
  const handleAddDevice = async () => {
    if (!selectedMac) {
      Alert.alert("Atenção", "Selecione um MAC válido.");
      return;
    }
    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome do dispositivo.");
      return;
    }
    const body = {
      mac_tags: selectedMac,
      nome_tags: nome,
      apelido_tags: apelido,
      // id_usuario será preenchido no servidor com base no token
    };
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado, faça login novamente.");
        return router.replace("/auth/login");
      }
      const response = await fetch(CREATE_TAGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Dispositivo cadastrado com sucesso!");
        // Redireciona para a home ou outra página
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Erro", data.error || "Falha ao cadastrar dispositivo.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar dispositivo:", err);
      Alert.alert("Erro", "Não foi possível cadastrar dispositivo.");
    }
  };

  // Renderização enquanto carrega os dados
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Tela inicial (antes de mostrar o formulário)
  if (!showForm) {
    return (
      <View style={styles.landingContainer}>
        <Image
          source={{ uri: "https://www.svgrepo.com/show/354818/beacon.svg?text=Beacon" }} // Substitua pela URL local ou remota do ícone de beacon
          style={styles.beaconImage}
          resizeMode="contain"
        />
        <Text style={styles.landingText}>Adicionar Tag</Text>
        <TouchableOpacity
          style={styles.landingButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela do formulário
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Cadastrar Dispositivo</Text>

      {/* Seção para filtragem e opção de QR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar MAC..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.qrButton} onPress={handleOpenCamera}>
          <Text style={styles.qrButtonText}>Ler QR</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de dispositivos (limitada para visualização) */}
      <FlatList
        data={filteredDevices.slice(0, displayLimit)}
        keyExtractor={(item) => item.mac}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.deviceItem,
              item.mac === selectedMac && styles.selectedDevice
            ]}
            onPress={() => setSelectedMac(item.mac)}
          >
            <Text style={styles.deviceText}>{item.mac}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum dispositivo encontrado.</Text>
        }
      />
      {filteredDevices.length > displayLimit && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Carregar mais...</Text>
        </TouchableOpacity>
      )}

      {/* Campos do formulário */}
      <Text style={styles.label}>Nome do Dispositivo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: B10, Sala 1, etc."
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Apelido (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Relógio, Tag do João, etc."
        value={apelido}
        onChangeText={setApelido}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddDevice}>
        <Text style={styles.submitButtonText}>Cadastrar Dispositivo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos para a tela inicial (landing)
  landingContainer: {
    flex: 1,
    backgroundColor: "#eef2f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  beaconImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  landingText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#007AFF",
  },
  landingButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  // Estilos para o formulário
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  qrButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  qrButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedDevice: {
    backgroundColor: "#e6f0ff",
  },
  deviceText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#888",
  },
  loadMoreButton: {
    padding: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export { };
