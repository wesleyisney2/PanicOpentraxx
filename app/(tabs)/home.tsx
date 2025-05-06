// app/tabs/home.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
  Vibration
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Se quiser usar notificações locais
// import * as Notifications from "expo-notifications";

const SERVER_TAGS_URL = "http://velaopentraxx.sytes.net:3320/read/tags";
const SERVER_ALARM_URL = "http://velaopentraxx.sytes.net:3320/read/alarme/last";

// Configurações para vibração e cooldown para evitar duplicação de alertas
const VIBRATION_DURATION = 1000;
const ALERT_COOLDOWN_MS = 60000;

export default function Home() {
  const router = useRouter();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAlarm, setLastAlarm] = useState<any>(null);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [tagDetailModalVisible, setTagDetailModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  // Guarda o timestamp do último alerta exibido para evitar duplicações
  const lastAlarmTimestampRef = useRef<number>(0);

  // Busca as tags do usuário usando o token (a rota no servidor já filtra conforme o usuário)
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return router.replace("/auth/login");
        const response = await fetch(SERVER_TAGS_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    // Atualiza a cada 10 segundos para simular tempo real
    const interval = setInterval(fetchTags, 10000);
    return () => clearInterval(interval);
  }, []);

  // Busca o último alarme a cada 10 segundos
  useEffect(() => {
    const fetchLastAlarm = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const response = await fetch(SERVER_ALARM_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        // Se a resposta retornar uma mensagem, não há alarme
        if (data.message) {
          setLastAlarm(null);
          return;
        }
        setLastAlarm(data);

        // Se o status do alarme indicar pânico, exiba o alerta se estiver fora do cooldown
        if ((data.status === "panic-iBeacon" || data.status === "panic-EddystoneUID") && data.data_alarm) {
          const alarmTime = new Date(data.data_alarm).getTime();
          if (alarmTime - lastAlarmTimestampRef.current > ALERT_COOLDOWN_MS) {
            lastAlarmTimestampRef.current = alarmTime;
            Vibration.vibrate(VIBRATION_DURATION);
            // Opcional: Disparar notificação local
            // await Notifications.scheduleNotificationAsync({
            //   content: {
            //     title: "ALERTA DE PÂNICO!",
            //     body: `Tag: ${data.nome_tags || "Desconhecida"}`,
            //   },
            //   trigger: null,
            // });
            setAlarmModalVisible(true);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar último alarme:", err);
      }
    };

    fetchLastAlarm();
    const alarmInterval = setInterval(fetchLastAlarm, 10000);
    return () => clearInterval(alarmInterval);
  }, []);

  // Renderiza cada item da lista de tags
  const renderTagItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.tagCard}
      onPress={() => {
        setSelectedTag(item);
        setTagDetailModalVisible(true);
      }}
    >
      <Text style={styles.tagText}>Nome: {item.nome_tags}</Text>
      <Text style={styles.tagText}>Apelido: {item.apelido_tags}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Exemplo: Total de Tags Ativas (filtrando tags cujo status não seja "hibernacao")
  const totalAtivas = tags.filter(tag => tag.status !== "hibernacao").length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      {/* Linha de cards com métricas */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total de Tags Ativas</Text>
          <Text style={styles.cardContent}>{totalAtivas}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Último Alarme</Text>
          {lastAlarm ? (
            <>
              <Text style={styles.alarmDescription}>{lastAlarm.descricao_alarme}</Text>
              <Text style={styles.alarmDate}>
                {lastAlarm.data_formatada || new Date(lastAlarm.data_alarm).toLocaleString("pt-BR")}
              </Text>
            </>
          ) : (
            <Text style={styles.cardContent}>Nenhum</Text>
          )}
        </View>
      </View>
      {/* Lista de Tags */}
      <Text style={styles.subtitle}>Minhas Tags</Text>
      {tags.length === 0 ? (
        <Text style={styles.emptyText}>Você não tem tags cadastradas.</Text>
      ) : (
        <FlatList
          data={tags}
          keyExtractor={(item) => item.id_tags.toString()}
          renderItem={renderTagItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Modal de Alerta de Pânico – Tela completa em vermelho */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={alarmModalVisible}
        onRequestClose={() => setAlarmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>PÂNICO!</Text>
            <Text style={styles.modalSubTitle}>
              Tag: {lastAlarm?.nome_tags || "Desconhecida"}
            </Text>
            <Text style={styles.modalSubTitle}>
              Usuário: {lastAlarm?.id_usuario ? `ID: ${lastAlarm.id_usuario}` : "Desconhecido"}
            </Text>
            <Button title="Fechar Alerta" onPress={() => setAlarmModalVisible(false)} color="#fff" />
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes da Tag – Popup normal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tagDetailModalVisible}
        onRequestClose={() => setTagDetailModalVisible(false)}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedTag ? (
              <>
                <Text style={styles.modalTitle}>Detalhes da Tag</Text>
                <Text style={styles.modalText}>Nome: {selectedTag.nome_tags}</Text>
                <Text style={styles.modalText}>Apelido: {selectedTag.apelido_tags}</Text>
                <Text style={styles.modalText}>MAC: {selectedTag.mac_tags}</Text>
                {/* Adicione outros detalhes conforme necessário */}
              </>
            ) : (
              <Text style={styles.modalText}>Nenhuma tag selecionada.</Text>
            )}
            <Button title="Fechar" onPress={() => setTagDetailModalVisible(false)} color="#007AFF" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, marginBottom: 10, fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: {
    flex: 0.48,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTitle: { fontSize: 16, marginBottom: 10, fontWeight: "500" },
  cardContent: { fontSize: 20, fontWeight: "bold" },
  alarmDescription: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 5,
  },
  alarmDate: { fontSize: 16, color: "#666" },
  subtitle: { fontSize: 20, marginVertical: 10, fontWeight: "500" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  list: { paddingBottom: 20 },
  tagCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagText: { fontSize: 14 },
  // Estilos para o modal de alarme (tela inteira com fundo vermelho)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Estilos para o modal de detalhes (popup normal)
  detailModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});