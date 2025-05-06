// app/_layout.tsx
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { NativeModules } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BACKGROUND_FETCH_TASK = "background-fetch-tags";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return BackgroundFetch.Result.NoData;

    const response = await fetch("http://velaopentraxx.sytes.net:3320/read/tags", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    return BackgroundFetch.Result.NewData;
  } catch (err) {
    console.error("Erro na tarefa de background:", err);
    return BackgroundFetch.Result.Failed;
  }
});

const registerBackgroundFetchAsync = async () => {
  try {
    return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // executa a cada 60 segundos
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.error("Erro ao registrar BackgroundFetch:", err);
  }
};

export default function RootLayout() {
  useEffect(() => {

    console.log('BLE módulo:', NativeModules.BleMinewModule)
    NativeModules.BleMinewModule.startScan()
    registerBackgroundFetchAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
