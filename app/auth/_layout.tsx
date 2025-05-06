// app/auth/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      {/* As telas serão resolvidas de acordo com os nomes (login, registro) */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: "Registro" }} />
    </Stack>
  );
}
