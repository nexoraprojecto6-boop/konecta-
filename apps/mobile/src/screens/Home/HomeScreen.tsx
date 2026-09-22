import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Nunito_400Regular } from "@expo-google-fonts/nunito/400Regular";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito/600SemiBold";
import { Nunito_700Bold } from "@expo-google-fonts/nunito/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";
import { Nunito_900Black } from "@expo-google-fonts/nunito/900Black";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const colors = {
  ink: "#09235B",
  blue: "#5173A9",
  magenta: "#B30068",
  pink: "#E4006B",
  paper: "#F7F9FE",
};

const photos = {
  hero: "https://images.unsplash.com/photo-1743172086091-b95acd708315?auto=format&fit=crop&w=1200&q=88",
  carlos: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  ana: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85",
  jorge: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=160&q=85",
  electric: "https://images.unsplash.com/photo-1758101755915-462eddc23f57?auto=format&fit=crop&w=500&q=85",
  design: "https://images.unsplash.com/photo-1519217651866-847339e674d4?auto=format&fit=crop&w=500&q=85",
  mechanic: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=85",
};

const categories: { label: string; icon: IoniconName; warm?: boolean }[] = [
  { label: "Serviços\nProfissionais", icon: "construct-outline" },
  { label: "Empresas", icon: "business-outline" },
  { label: "Produtos", icon: "cube-outline", warm: true },
  { label: "Empregos", icon: "briefcase-outline" },
  { label: "Transportes\ne Entregas", icon: "bus-outline" },
  { label: "Casa e\nConstrução", icon: "home-outline", warm: true },
  { label: "Saúde e\nBem-estar", icon: "heart-circle-outline" },
];

const posts = [
  {
    name: "Carlos Mendes",
    time: "30 min atrás",
    place: "Luanda - Maianga",
    title: "Preciso de um eletricista urgente em casa.",
    description: "O disjuntor está a cair toda hora e preciso resolver ainda hoje.",
    service: "Precisa de serviço",
    tags: ["Eletricista", "Residencial", "Maianga"],
    likes: 12,
    comments: 8,
    avatar: photos.carlos,
    photo: photos.electric,
  },
  {
    name: "Ana Silva",
    time: "1 hora atrás",
    place: "Luanda - Talatona",
    title: "Design Gráfico | Logotipos, Flyers e Identidade Visual",
    description: "Criação de logotipos, artes para redes sociais, flyers e muito mais.",
    service: "Oferece serviço",
    tags: ["Design Gráfico", "Marketing", "Talatona"],
    likes: 24,
    comments: 5,
    avatar: photos.ana,
    photo: photos.design,
  },
  {
    name: "Jorge Silva",
    time: "2 horas atrás",
    place: "Luanda - Kilamba",
    title: "Procuro um mecânico de confiança",
    description: "Meu carro está a fazer um barulho estranho. Preciso de uma avaliação.",
    service: "Precisa de serviço",
    tags: ["Mecânica", "Automóveis", "Kilamba"],
    likes: 18,
    comments: 11,
    avatar: photos.jorge,
    photo: photos.mechanic,
  },
];

function BrandMark({ size = 46, magenta = false }: { size?: number; magenta?: boolean }) {
  const color = magenta ? colors.magenta : "white";
  const scale = size / 46;
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.markStem, { backgroundColor: color, transform: [{ scale }] }]} />
      <View style={[styles.markTop, { backgroundColor: color, transform: [{ rotate: "43deg" }, { scale }] }]} />
      <View style={[styles.markBottom, { backgroundColor: color, transform: [{ rotate: "-43deg" }, { scale }] }]} />
      <View style={[styles.markDot, { backgroundColor: color, transform: [{ scale }] }]} />
    </View>
  );
}

function Logo() {
  return (
    <View style={styles.logoRow}>
      <BrandMark />
      <Text style={styles.logoText}>KONECTA</Text>
    </View>
  );
}

function Filter({
  icon,
  label,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.filter} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.magenta} />
      <Text numberOfLines={1} style={styles.filterText}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#4770AB" />
    </Pressable>
  );
}

function PostCard({ post }: { post: (typeof posts)[number] }) {
  const [liked, setLiked] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.author}>
          <Text style={styles.authorName}>{post.name} <Text style={styles.verified}>◆</Text></Text>
          <Text style={styles.meta}>{post.time}  ·  ⌖ {post.place}</Text>
        </View>
        <View style={[styles.servicePill, post.service.startsWith("Oferece") && styles.offerPill]}>
          <Text style={[styles.serviceText, post.service.startsWith("Oferece") && styles.offerText]}>{post.service}</Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={18} color="#4770AB" />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.copy}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>
          <View style={styles.tags}>
            {post.tags.map((tag) => <Text style={styles.tag} key={tag}>{tag}</Text>)}
          </View>
        </View>
        <Image source={{ uri: post.photo }} style={styles.postPhoto} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => setLiked((value) => !value)}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={25} color={colors.magenta} />
          <Text style={styles.actionText}>{post.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <Pressable style={styles.action}>
          <Ionicons name="chatbubble-outline" size={23} color="#3473B5" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </Pressable>
        <Pressable style={styles.contactButton} onPress={() => setSent(true)}>
          <Ionicons name={sent ? "checkmark-circle-outline" : "chatbubble-ellipses-outline"} size={19} color={colors.magenta} />
          <Text style={styles.contactText}>{sent ? "Contacto enviado" : "Entrar em contacto"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const show = (message: string) => Alert.alert("KONECTA", message);

  if (!fontsLoaded) return <View style={styles.screen} />;

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: photos.hero }} style={styles.hero}>
          <LinearGradient colors={["rgba(25,32,105,.66)", "rgba(115,0,82,.34)", "rgba(8,24,76,.88)"]} style={StyleSheet.absoluteFill} />
          <SafeAreaView style={styles.safeHeader}>
            <View style={styles.topbar}>
              <Pressable onPress={() => show("Menu principal")} hitSlop={12}>
                <Ionicons name="menu-outline" size={36} color="white" />
              </Pressable>
              <View style={styles.brand}>
                <Logo />
                <Text style={styles.tagline}>Tudo o que você precisa. Onde você estiver.</Text>
              </View>
              <View style={styles.profile}>
                <Pressable onPress={() => show("Você tem 3 notificações")}>
                  <Ionicons name="notifications-outline" size={31} color="white" />
                  <Text style={styles.badge}>3</Text>
                </Pressable>
                <Image source={{ uri: photos.carlos }} style={styles.profilePhoto} />
              </View>
            </View>
          </SafeAreaView>

          <View style={styles.search}>
            <Ionicons name="search-outline" size={28} color="#5275AE" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Pesquisar perfis, serviços ou produtos..."
              placeholderTextColor="#5D7AAE"
              returnKeyType="search"
              style={styles.searchInput}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                show(query ? `A pesquisar por "${query}"` : "Digite algo para pesquisar.");
              }}
            />
            <Pressable style={styles.searchButton} onPress={() => show(query ? `A pesquisar por "${query}"` : "Digite algo para pesquisar.")}>
              <Ionicons name="arrow-forward" size={25} color="white" />
            </Pressable>
          </View>

          <View style={styles.filters}>
            <Filter icon="options-outline" label="Todas as publicações" onPress={() => show("Escolha o tipo de publicação")} />
            <Filter icon="location-outline" label="Todas as categorias" onPress={() => show("Escolha uma categoria")} />
            <Filter icon="map-outline" label="Mais recentes" onPress={() => show("Ordenar publicações")} />
          </View>
        </ImageBackground>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((category, index) => (
            <Pressable key={category.label} style={styles.category} onPress={() => show(category.label.replace("\n", " "))}>
              <LinearGradient
                colors={category.warm ? ["#F16A00", "#FFB400"] : ["#EA006A", "#72005D"]}
                style={[styles.categoryCircle, index === 0 && styles.categoryActive]}
              >
                <Ionicons name={category.icon} size={32} color="white" />
              </LinearGradient>
              <Text style={styles.categoryText}>{category.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          <View style={styles.activeDot} /><View style={styles.dot} /><View style={styles.dot} />
        </View>

        <Pressable onPress={() => show("Criar uma nova publicação")}>
          <LinearGradient colors={["#850064", "#CE0061"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.publish}>
            <View style={styles.publishIcon}><Ionicons name="create-outline" size={32} color="white" /></View>
            <View style={styles.publishCopy}>
              <Text style={styles.publishTitle}>Fazer uma publicação</Text>
              <Text style={styles.publishDescription}>Partilhe o seu serviço, produto ou oportunidade</Text>
            </View>
            <Ionicons name="arrow-forward" size={26} color="white" />
          </LinearGradient>
        </Pressable>

        <View style={styles.feed}>
          {posts.map((post) => <PostCard post={post} key={post.name} />)}
        </View>
      </ScrollView>

      <LinearGradient colors={["#7E005D", "#C00066", "#7D005D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bottomBar}>
        {[
          { label: "Feed", icon: "home-outline" as IoniconName },
          { label: "Descobrir", icon: "search-outline" as IoniconName },
        ].map((tab) => (
          <Pressable key={tab.label} style={styles.tab} onPress={() => setActiveTab(tab.label)}>
            <Ionicons name={tab.icon} size={27} color="white" />
            <Text style={styles.tabText}>{tab.label}</Text>
            {activeTab === tab.label && <View style={styles.tabLine} />}
          </Pressable>
        ))}
        <Pressable style={styles.floatingLogo} onPress={() => show("KONECTA")}>
          <BrandMark size={52} />
        </Pressable>
        {[
          { label: "Contratos", icon: "briefcase-outline" as IoniconName },
          { label: "Minha Conta", icon: "person-outline" as IoniconName },
        ].map((tab) => (
          <Pressable key={tab.label} style={styles.tab} onPress={() => setActiveTab(tab.label)}>
            <Ionicons name={tab.icon} size={27} color="white" />
            <Text style={styles.tabText}>{tab.label}</Text>
            {activeTab === tab.label && <View style={styles.tabLine} />}
          </Pressable>
        ))}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scrollContent: { paddingBottom: 106 },
  hero: { height: 326, paddingHorizontal: 15 },
  safeHeader: { marginTop: 0 },
  topbar: { height: 82, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { alignItems: "center" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  markStem: { position: "absolute", left: 8, top: 8, width: 8, height: 32, borderRadius: 5 },
  markTop: { position: "absolute", left: 23, top: 1, width: 8, height: 27, borderRadius: 5 },
  markBottom: { position: "absolute", left: 23, top: 19, width: 8, height: 28, borderRadius: 5 },
  markDot: { position: "absolute", left: 6, top: 0, width: 12, height: 12, borderRadius: 7 },
  logoText: { color: "white", fontSize: 29, lineHeight: 38, fontFamily: "Nunito_900Black", letterSpacing: -1.2 },
  tagline: { color: "rgba(255,255,255,.96)", fontSize: 9, fontFamily: "Nunito_700Bold", marginTop: -4, letterSpacing: 0.1 },
  profile: { flexDirection: "row", alignItems: "center", gap: 7 },
  profilePhoto: { width: 42, height: 42, borderRadius: 22, borderWidth: 2, borderColor: "white" },
  badge: { position: "absolute", right: -4, top: -7, color: "white", backgroundColor: "#D80065", borderColor: "white", borderWidth: 1.5, width: 20, height: 20, borderRadius: 10, textAlign: "center", fontSize: 11, lineHeight: 17, fontWeight: "800" },
  search: { height: 59, borderRadius: 31, borderWidth: 1, borderColor: "rgba(255,255,255,.85)", backgroundColor: "white", flexDirection: "row", alignItems: "center", paddingLeft: 18, paddingRight: 6, gap: 10, marginTop: 48, shadowColor: "#001847", shadowOpacity: 0.24, shadowRadius: 12, elevation: 7 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 13, height: "100%", fontFamily: "Nunito_600SemiBold" },
  searchButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: "#E1117D", backgroundColor: colors.magenta, alignItems: "center", justifyContent: "center", shadowColor: colors.magenta, shadowOpacity: .2, shadowRadius: 5, elevation: 2 },
  filters: { height: 69, marginTop: 14, backgroundColor: "white", borderRadius: 22, borderWidth: 1, borderColor: "#E9EDF5", flexDirection: "row", paddingHorizontal: 5, shadowColor: "#173165", shadowOpacity: 0.14, shadowRadius: 9, elevation: 5, overflow: "hidden" },
  filter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 4, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "#D7DEEA" },
  filterText: { color: colors.ink, fontSize: 9, fontFamily: "Nunito_700Bold", maxWidth: 76 },
  categories: { paddingHorizontal: 18, paddingTop: 21, paddingBottom: 8, gap: 12 },
  category: { width: 76, alignItems: "center" },
  categoryCircle: { width: 63, height: 63, borderRadius: 32, borderWidth: 1, borderColor: "rgba(255,255,255,.75)", alignItems: "center", justifyContent: "center", shadowColor: "#4B0045", shadowOpacity: .16, shadowRadius: 4, elevation: 2 },
  categoryActive: { borderWidth: 3, borderColor: "white", outlineColor: colors.pink, outlineWidth: 2 },
  categoryText: { marginTop: 7, minHeight: 31, textAlign: "center", color: colors.ink, fontSize: 9, fontFamily: "Nunito_800ExtraBold", lineHeight: 12 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 9, height: 24, paddingTop: 5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#D7DEEB" },
  activeDot: { width: 15, height: 10, borderRadius: 5, backgroundColor: colors.magenta },
  publish: { marginHorizontal: 15, height: 82, borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, shadowColor: "#820052", shadowOpacity: .18, shadowRadius: 8, elevation: 4 },
  publishIcon: { width: 55, height: 55, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,.24)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.17)" },
  publishCopy: { flex: 1, marginLeft: 12 },
  publishTitle: { color: "white", fontSize: 17, fontFamily: "Nunito_800ExtraBold" },
  publishDescription: { color: "rgba(255,255,255,.94)", fontSize: 10, marginTop: 2, fontFamily: "Nunito_600SemiBold" },
  feed: { paddingHorizontal: 14, paddingTop: 16, gap: 14 },
  card: { backgroundColor: "white", borderRadius: 20, borderWidth: 1, borderColor: "#EDF1F7", padding: 14, shadowColor: "#18315A", shadowOpacity: 0.09, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  author: { flex: 1 },
  authorName: { color: colors.ink, fontSize: 13, fontFamily: "Nunito_800ExtraBold" },
  verified: { color: colors.magenta, fontSize: 8 },
  meta: { color: colors.blue, fontSize: 9, marginTop: 3, fontFamily: "Nunito_600SemiBold" },
  servicePill: { borderRadius: 15, backgroundColor: "#FFF0F7", paddingVertical: 6, paddingHorizontal: 8 },
  offerPill: { backgroundColor: "#EAFBF8" },
  serviceText: { color: colors.magenta, fontSize: 8, fontFamily: "Nunito_800ExtraBold" },
  offerText: { color: "#009E8B" },
  cardContent: { flexDirection: "row", gap: 10, marginTop: 9 },
  copy: { flex: 1 },
  postTitle: { color: colors.ink, fontSize: 15, lineHeight: 19, fontFamily: "Nunito_800ExtraBold" },
  description: { color: colors.blue, fontSize: 11, lineHeight: 15, marginTop: 2, fontFamily: "Nunito_400Regular" },
  postPhoto: { width: 105, height: 91, borderRadius: 11, borderWidth: 1, borderColor: "#E8EDF5" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 7 },
  tag: { backgroundColor: "#F2F5FA", borderRadius: 12, borderWidth: 1, borderColor: "#EDF1F6", paddingVertical: 4, paddingHorizontal: 7, color: colors.blue, fontSize: 8, fontFamily: "Nunito_600SemiBold" },
  actions: { borderTopWidth: 1, borderTopColor: "#EDF0F7", marginTop: 9, paddingTop: 9, flexDirection: "row", alignItems: "center", gap: 14 },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { color: colors.ink, fontSize: 12, fontFamily: "Nunito_700Bold" },
  contactButton: { marginLeft: "auto", borderWidth: 1.3, borderColor: colors.magenta, borderRadius: 19, paddingHorizontal: 11, paddingVertical: 7, flexDirection: "row", alignItems: "center", gap: 5 },
  contactText: { color: colors.magenta, fontSize: 9, fontFamily: "Nunito_800ExtraBold" },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 82, flexDirection: "row", alignItems: "center", paddingBottom: 5, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.25)", borderTopLeftRadius: 26, borderTopRightRadius: 26, shadowColor: "#41003C", shadowOpacity: .24, shadowRadius: 9, elevation: 12 },
  tab: { flex: 1, height: "100%", alignItems: "center", justifyContent: "center", gap: 2 },
  tabText: { color: "white", fontSize: 10, fontFamily: "Nunito_600SemiBold" },
  tabLine: { position: "absolute", bottom: 5, width: 46, height: 3, borderRadius: 2, backgroundColor: "white" },
  floatingLogo: { width: 78, height: 78, borderRadius: 39, marginTop: -35, backgroundColor: "#B70067", borderColor: "white", borderWidth: 5, alignItems: "center", justifyContent: "center", shadowColor: "#580043", shadowOpacity: .3, shadowRadius: 6, elevation: 7 },
});
