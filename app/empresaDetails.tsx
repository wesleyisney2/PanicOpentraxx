// app/empresaDetails.tsx
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// Ajuste para o efeito parallax
const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Para definir o offset de cada seção
const SECTION_1_OFFSET = 0;
const SECTION_2_OFFSET = 300;
const SECTION_3_OFFSET = 600;
const SECTION_4_OFFSET = 900;

export default function EmpresaDetails() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  /**
   * Interpolações do Header
   */
  // Altura do Header (parallax)
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  // Opacidade do background no Header
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0.4],
    extrapolate: "clamp",
  });

  // Título do Header se move para cima
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });

  /**
   * Animações de Seções
   * Cada seção terá a sua interpolação de fadeIn e slideIn dependendo do offset de rolagem.
   */

  // FadeIn e SlideIn para a Seção 1
  const section1Opacity = scrollY.interpolate({
    inputRange: [SECTION_1_OFFSET, SECTION_1_OFFSET + 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const section1TranslateX = scrollY.interpolate({
    inputRange: [SECTION_1_OFFSET, SECTION_1_OFFSET + 200],
    outputRange: [100, 0],
    extrapolate: "clamp",
  });

  // FadeIn e SlideIn para a Seção 2
  const section2Opacity = scrollY.interpolate({
    inputRange: [SECTION_2_OFFSET, SECTION_2_OFFSET + 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const section2TranslateX = scrollY.interpolate({
    inputRange: [SECTION_2_OFFSET, SECTION_2_OFFSET + 200],
    outputRange: [-100, 0],
    extrapolate: "clamp",
  });

  // FadeIn e SlideIn para a Seção 3
  const section3Opacity = scrollY.interpolate({
    inputRange: [SECTION_3_OFFSET, SECTION_3_OFFSET + 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const section3TranslateX = scrollY.interpolate({
    inputRange: [SECTION_3_OFFSET, SECTION_3_OFFSET + 200],
    outputRange: [100, 0],
    extrapolate: "clamp",
  });

  // FadeIn e SlideIn para a Seção 4
  const section4Opacity = scrollY.interpolate({
    inputRange: [SECTION_4_OFFSET, SECTION_4_OFFSET + 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const section4TranslateX = scrollY.interpolate({
    inputRange: [SECTION_4_OFFSET, SECTION_4_OFFSET + 200],
    outputRange: [-100, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.fill}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Espaço extra para o Header com parallax */}
        <View style={{ marginTop: HEADER_MAX_HEIGHT }} />

        {/* Seção 1 */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: section1Opacity,
              transform: [{ translateX: section1TranslateX }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Opentraxx - Revolucionando o Mercado</Text>
          <Text style={styles.sectionText}>
            Nossa empresa está na vanguarda da inovação, fornecendo soluções de segurança e monitoramento 
            que integram hardware e software de última geração, incluindo BLE e MDVR.
          </Text>
          <Image
            source={require("../assets/images/paralaxx.png")} // Exemplo de imagem para esta seção
            style={styles.sectionImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Seção 2 */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: section2Opacity,
              transform: [{ translateX: section2TranslateX }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Tecnologia de Beacons</Text>
          <Text style={styles.sectionText}>
            A integração de beacons BLE permite rastreamento preciso e respostas rápidas, garantindo 
            segurança em tempo real para diversos segmentos de mercado.
          </Text>
          <Image
            source={require("../assets/images/caminhao.png")} // Exemplo de imagem
            style={styles.sectionImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Seção 3 */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: section3Opacity,
              transform: [{ translateX: section3TranslateX }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Sistemas de Pânico</Text>
          <Text style={styles.sectionText}>
            Nosso sistema de pânico, aliado ao BLE, monitora situações de risco e aciona 
            protocolos de emergência de forma automática, aumentando a velocidade de resposta 
            e reduzindo incidentes.
          </Text>
          <Image
            source={require("../assets/images/fundo.jpg")} // Exemplo de imagem
            style={styles.sectionImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Seção 4 */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: section4Opacity,
              transform: [{ translateX: section4TranslateX }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>MDVR e Outras Inovações</Text>
          <Text style={styles.sectionText}>
            Nossos MDVRs (Mobile Digital Video Recorders) possibilitam o monitoramento de frotas e 
            veículos em tempo real, oferecendo segurança e controle para empresas de transporte, logística 
            e muito mais.
          </Text>
          <Image
            source={require("../assets/images/caminhao.png")} // Exemplo repetido, troque pela imagem que preferir
            style={styles.sectionImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Espaço extra ao final */}
        <View style={{ height: 80 }} />
      </Animated.ScrollView>

      {/* Header Parallax */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          style={[styles.backgroundImage, { opacity: backgroundOpacity }]}
          source={require("../assets/images/fundo.jpg")} // Imagem de fundo do header
          resizeMode="cover"
        />
        <Animated.Image
          style={[styles.overlayImage, { opacity: backgroundOpacity }]}
          source={require("../assets/images/caminhao.png")} // Imagem de sobreposição
          resizeMode="contain"
        />
      </Animated.View>

      {/* Barra Superior (Botão de Voltar e Título) */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Animated.Text
          style={[
            styles.headerTitle,
            { transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          Opentraxx
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fill: {
    flex: 1,
  },

  // Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: HEADER_MAX_HEIGHT,
  },
  overlayImage: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 150,
    height: 150,
  },
  headerBar: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    zIndex: 2,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Conteúdo
  scrollViewContent: {
    paddingHorizontal: 20,
  },

  // Seções
  sectionContainer: {
    marginBottom: 40,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },
  sectionImage: {
    marginTop: 5,
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
