// app/editUserConfig.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function EditUserConfig() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para os inputs do usuário
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState<string>(""); // armazenará o caminho relativo da foto
  const [uploading, setUploading] = useState(false);

  // Estados para o modal de segurança (funcionário)
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [secNome, setSecNome] = useState("");
  const [secEmail, setSecEmail] = useState("");
  const [secTelefone, setSecTelefone] = useState("");

  // Estado para o toast de sucesso
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          setEmail(parsed.email_usuario);
          setTelefone(parsed.telefone_usuario || "");
          setFoto(parsed.foto_usuario || "");
        } else {
          Alert.alert("Erro", "Dados do usuário não encontrados.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Função para selecionar imagem usando expo-image-picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão negada", "Você precisa permitir o acesso à galeria para escolher uma foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  // Função para fazer upload da imagem para o servidor
  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename!);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("foto_usuario", {
        uri,
        name: filename,
        type,
      } as any);

      // Supondo que sua rota de upload seja PATCH /update/usuario/:id/foto
      const response = await fetch(`http://velaopentraxx.sytes.net:3320/update/usuario/${user.id_usuario}/foto`, {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Foto atualizada com sucesso.");
        setFoto(data.foto);
        const updatedUser = { ...user, foto_usuario: data.foto };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        Alert.alert("Erro", data.error || "Falha ao atualizar a foto.");
      }
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  // Função para atualizar os dados do usuário (email, telefone, foto)
  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!email.trim()) {
      Alert.alert("Atenção", "O e‑mail é obrigatório.");
      return;
    }
    const userId = user.id_usuario;
    const payload = {
      email_usuario: email,
      telefone_usuario: telefone,
      foto_usuario: foto,
    };

    try {
      const response = await fetch(`http://velaopentraxx.sytes.net:3320/update/usuario/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        // Em vez de usar somente Alert, vamos mostrar um toast customizado
        setShowSuccessToast(true);
        // Atualiza o usuário no AsyncStorage
        const updatedUser = { ...user, email_usuario: email, telefone_usuario: telefone, foto_usuario: foto };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        // Após 2 segundos, oculta o toast e retorna para a tela anterior
        setTimeout(() => {
          setShowSuccessToast(false);
          router.back();
        }, 2000);
      } else {
        Alert.alert("Erro", data.error || "Falha ao atualizar os dados.");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados do usuário.");
    }
  };

  // Função para criar um funcionário de segurança
  const handleCreateSecurity = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!secNome.trim() || !secEmail.trim()) {
      Alert.alert("Atenção", "Nome e e‑mail do segurança são obrigatórios.");
      return;
    }
    const payload = {
      nome_funcionario: secNome,
      email_funcionario: secEmail,
      telefone_funcionario: secTelefone,
      id_usuario: user.id_usuario,
    };

    try {
    const response = await fetch("http://velaopentraxx.sytes.net:3320/create/funcionario", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Adiciona o token aqui
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Segurança criado com sucesso.");
        setShowSecurityModal(false);
        setSecNome("");
        setSecEmail("");
        setSecTelefone("");
      } else {
        Alert.alert("Erro", data.error || "Falha ao criar o segurança.");
      }
    } catch (error) {
      console.error("Erro ao criar segurança:", error);
      Alert.alert("Erro", "Não foi possível criar o segurança.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Configurações do Usuário</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E‑mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.buttonText}>
          {uploading ? "Enviando foto..." : "Escolher Foto"}
        </Text>
      </TouchableOpacity>

      {foto ? (
        <View style={styles.imagePreviewContainer}>
          <Text style={{ marginBottom: 5 }}>Pré-visualização da foto:</Text>
          <Image
            source={{ uri: `http://velaopentraxx.sytes.net:3320/${foto}` }}
            style={styles.imagePreview}
          />
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#f0ad4e" }]}
        onPress={() => setShowSecurityModal(true)}
      >
        <Text style={styles.buttonText}>Adicionar Segurança</Text>
      </TouchableOpacity>

      {/* Modal para Adicionar Segurança */}
      <Modal
        visible={showSecurityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cadastrar Segurança</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Segurança"
              value={secNome}
              onChangeText={setSecNome}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="E‑mail do Segurança"
              value={secEmail}
              onChangeText={setSecEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Telefone do Segurança"
              value={secTelefone}
              onChangeText={setSecTelefone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#28a745" }]}
              onPress={handleCreateSecurity}
            >
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#999", marginTop: 10 }]}
              onPress={() => setShowSecurityModal(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast customizado para sucesso */}
      {showSuccessToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Salvo com sucesso!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 5,
  },
  imagePickerButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#007AFF",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
