// app/configuracoes.tsx
import React, { useContext, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity 
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ThemeContext } from "./theme/ThemeContext";

export default function Configuracoes() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  const [selectedLanguage, setSelectedLanguage] = useState("pt");

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: theme.primary }]}>Voltar</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.textColor }]}>Configurações</Text>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.textColor }]}>Tema</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? theme.primary : "#f4f3f4"}
          trackColor={{ false: "#767577", true: theme.primary }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.textColor }]}>Idioma</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={[styles.picker, { color: theme.textColor }]}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          mode="dropdown"
        >
          <Picker.Item label="Português" value="pt" />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Español" value="es" />
        </Picker>
      </View>

      <Text style={[styles.description, { color: theme.textColor }]}>
        Essas configurações serão aplicadas a todo o aplicativo. Ao mudar o tema, todas as telas
        refletem a nova paleta de cores. Para idioma, implemente uma solução de internacionalização
        para atualizar textos e mensagens conforme a preferência do usuário.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  settingText: {
    fontSize: 18,
  },
  picker: {
    width: 150,
    height: 44,
  },
  description: {
    fontSize: 14,
    marginTop: 20,
  },
});
