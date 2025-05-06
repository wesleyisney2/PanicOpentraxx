// app/tabs/_layout.tsx
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabsLayout() {
  const [userRole, setUserRole] = useState(null); // null = carregando

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem("user");
        if (userJSON) {
          const user = JSON.parse(userJSON);
          setUserRole(user.funcao_usuario); // assume que é 1 (segurança) ou 0 (master)
        } else {
          setUserRole("guest");
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        setUserRole("guest");
      }
    };
    loadUser();
  }, []);

  if (userRole === null) {
    // Enquanto carrega, exibe um indicador
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const isSecurity = userRole == 1 || userRole === "1";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      {/* Mostra a tela Adicionar somente se não for usuário de segurança */}
      {!isSecurity && (
        <Tabs.Screen
          name="adicionar"
          options={{
            title: "Adicionar",
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
