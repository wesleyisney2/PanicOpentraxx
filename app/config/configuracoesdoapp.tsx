// app/config/configuracoesdoapp.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ConfiguracoesDoApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações do App</Text>
      {/* Adicione aqui os controles de configuração */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, marginBottom: 20 }
});
