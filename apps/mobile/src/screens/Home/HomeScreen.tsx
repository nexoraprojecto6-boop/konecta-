import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Category } from "@konecta/types";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/**
 * Dados de feed são demonstrativos nesta fase: o KONECTA ainda não tem
 * um modelo de "publicações" (pedidos/ofertas) no backend — apenas
 * Category, ProfessionalProfile, Company e Service. Quando esse modelo
 * existir, esta lista passa a vir de api.listFeedPosts() ou equivalente.
 */
type FeedPost = {
  id: string;
  name: string;
  time: string;
  place: string;
  type: string;
  offer?: boolean;
  title: string;
  desc: string;
  tags: string[];
  likes: number;
  comments: number;
};

const DEMO_POSTS: FeedPost[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    time: "30 min atrás",
    place: "Luanda - Maianga",
    type: "Precisa de serviço",
    title: "Preciso de um eletricista urgente em casa.",
    desc: "O disjuntor está a cair toda hora e preciso resolver ainda hoje.",
    tags: ["Eletricista", "Residencial", "Maianga"],
    likes: 12,
    comments: 8,
  },
  {
    id: "2",
    name: "Ana Silva",
    time: "1 hora atrás",
    place: "Luanda - Talatona",
    type: "Oferece serviço",
    offer: true,
    title: "Design Gráfico | Logotipos, Flyers e Identidade Visual",
    desc: "Trabalho com criação de logotipos, artes para redes sociais, flyers e muito mais. Qualidade, agilidade e preço justo!",
    tags: ["Design Gráfico", "Marketing Digital", "Talatona"],
    likes: 24,
    comments: 5,
  },
  {
    id: "3",
    name: "Jorge Silva",
    time: "2 horas atrás",
    place: "Luanda - Kilamba",
    type: "Precisa de serviço",
    title: "Procuro um mecânico de confiança",
    desc: "Meu carro está a fazer um barulho estranho, alguém de confiança que possa dar uma olhada. Pode ser oficina ou profissional.",
    tags: ["Mecânica", "Automóveis", "Kilamba"],
    likes: 18,
    comments: 11,
  },
  {
    id: "4",
    name: "Beatriz Fernandes",
    time: "3 horas atrás",
    place: "Luanda - Coqueiros",
    type: "Oferece serviço",
    offer: true,
    title: "Cabeleireira e Estética",
    desc: "Trabalhos de cabelo, tranças, manicure, pedicure e limpeza de pele.",
    tags: ["Beleza", "Estética", "Coqueiros"],
    likes: 31,
    comments: 7,
  },
];

const CATEGORY_FALLBACK_ICON = "▣";

export function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [activeNav, setActiveNav] = useState<"feed" | "discover" | "contracts" | "account">("feed");

  useEffect(() => {
    let isMounted = true;
    api
      .listCategories()
      .then((all) => {
        if (!isMounted) return;
        setCategories(all.filter((c) => !c.parentId));
      })
      .catch(() => {
        // Silencioso: o carrossel simplesmente fica vazio se a API falhar,
        // sem quebrar o resto da tela.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DEMO_POSTS;
    return DEMO_POSTS.filter((p) =>
      `${p.name} ${p.title} ${p.desc} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [searchQuery]);

  function toggleLike(postId: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }

  function openAccountMenu() {
    navigation.navigate("SideMenu");
  }

  function openActionMenu() {
    Alert.alert("Ação KONECTA", undefined, [
      {
        text: "Fazer uma publicação",
        onPress: () =>
          Alert.alert("Em breve", "A criação de publicações chega numa próxima fase."),
      },
      {
        text: "Encontrar um serviço",
        onPress: () => navigation.navigate("Discovery"),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  function handleNavPress(page: typeof activeNav) {
    setActiveNav(page);
    if (page === "discover") navigation.navigate("Discovery");
    if (page === "account") navigation.navigate("Profile");
    if (page === "contracts") {
      Alert.alert("Contratos", "Esta área chega numa próxima fase.");
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
          <View style={styles.topbar}>
            <TouchableOpacity onPress={openAccountMenu} accessibilityLabel="Menu">
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            <View style={styles.brand}>
              <Text style={styles.brandMark}>K</Text>
              <View>
                <Text style={styles.brandName}>KONECTA</Text>
                <Text style={styles.tagline}>
                  Tudo o que você precisa. Onde você estiver.
                </Text>
              </View>
            </View>

            <View style={styles.topActions}>
              <TouchableOpacity
                accessibilityLabel="Notificações"
                onPress={() => navigation.navigate("Notifications")}
              >
                <View style={styles.notificationWrap}>
                  <Text style={styles.notificationIcon}>♧</Text>
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>3</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => navigation.navigate("Profile")}
                accessibilityLabel="Minha conta"
              />
            </View>
          </View>

          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar perfis, serviços, produtos ou posts..."
              placeholderTextColor="#7887a4"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchSubmit}
              onPress={() => setSearchQuery((q) => q)}
              accessibilityLabel="Pesquisar"
            >
              <Text style={styles.searchSubmitText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filters}>
          {["Todas as publicações", "Todos os locais", "Mais recentes"].map(
            (label, i) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.filterItem,
                  i < 2 && styles.filterItemBorder,
                ]}
                onPress={() =>
                  Alert.alert(label, "Filtros detalhados chegam numa próxima fase.")
                }
              >
                <Text style={styles.filterText} numberOfLines={1}>
                  {label}
                </Text>
                <Text style={styles.filterChevron}>⌄</Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>Categorias em destaque</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.length === 0 ? (
              <Text style={styles.categoryEmpty}>Sem categorias no momento</Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.category}
                  onPress={() => navigation.navigate("Discovery")}
                >
                  <View style={styles.categoryIconWrap}>
                    <Text style={styles.categoryIconText}>
                      {cat.icon ?? CATEGORY_FALLBACK_ICON}
                    </Text>
                  </View>
                  <Text style={styles.categoryLabel} numberOfLines={2}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.publish}
          onPress={() =>
            Alert.alert("Em breve", "A criação de publicações chega numa próxima fase.")
          }
        >
          <View style={styles.publishIconWrap}>
            <Text style={styles.publishIcon}>✎</Text>
          </View>
          <View style={styles.publishTextWrap}>
            <Text style={styles.publishTitle}>Fazer uma publicação</Text>
            <Text style={styles.publishSubtitle}>
              Partilhe o seu serviço, produto ou oportunidade
            </Text>
          </View>
          <Text style={styles.publishArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.feed}>
          {filteredPosts.length === 0 ? (
            <Text style={styles.emptyFeed}>Nenhuma publicação encontrada</Text>
          ) : (
            filteredPosts.map((post) => (
              <View key={post.id} style={styles.post}>
                <View style={styles.postHead}>
                  <View style={styles.postPhoto} />
                  <View style={styles.postUserInfo}>
                    <Text style={styles.postUser}>
                      {post.name} <Text style={styles.verified}>◆</Text>
                    </Text>
                    <Text style={styles.postMeta}>
                      {post.time} · ◉ {post.place}
                    </Text>
                  </View>
                  <View style={[styles.badge, post.offer && styles.badgeOffer]}>
                    <Text
                      style={[
                        styles.badgeText,
                        post.offer && styles.badgeOfferText,
                      ]}
                    >
                      {post.type}
                    </Text>
                  </View>
                </View>

                <View style={styles.postBody}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postDesc}>{post.desc}</Text>
                  <View style={styles.tags}>
                    {post.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity onPress={() => toggleLike(post.id)}>
                    <Text style={styles.postActionText}>
                      {likedIds.has(post.id) ? "♥" : "♡"}{" "}
                      {post.likes + (likedIds.has(post.id) ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Comentários", "Em breve nesta fase.")
                    }
                  >
                    <Text style={styles.postActionText}>◯ {post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() =>
                      Alert.alert(
                        "Contacto",
                        `A abrir contacto com ${post.name}.`,
                      )
                    }
                  >
                    <Text style={styles.contactButtonText}>
                      ◉ Entrar em contacto
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavPress("feed")}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navLabel}>Feed</Text>
          {activeNav === "feed" && <View style={styles.navActiveDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavPress("discover")}
        >
          <Text style={styles.navIcon}>⌕</Text>
          <Text style={styles.navLabel}>Descobrir</Text>
          {activeNav === "discover" && <View style={styles.navActiveDot} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navAction} onPress={openActionMenu}>
          <Text style={styles.navActionText}>K</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavPress("contracts")}
        >
          <Text style={styles.navIcon}>▣</Text>
          <Text style={styles.navLabel}>Contratos</Text>
          {activeNav === "contracts" && <View style={styles.navActiveDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavPress("account")}
        >
          <Text style={styles.navIcon}>♙</Text>
          <Text style={styles.navLabel}>Minha Conta</Text>
          {activeNav === "account" && <View style={styles.navActiveDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PURPLE = "#a90072";
const PINK = "#d50a73";
const ORANGE = "#f49a00";
const INK = "#102e5d";
const MUTED = "#6e7d9a";
const LINE = "#edf0f7";
const BG = "#f8f9fc";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingBottom: 110 },

  hero: {
    backgroundColor: "#18285d",
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuIcon: { color: "#fff", fontSize: 28 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, marginLeft: 10 },
  brandMark: { color: "#fff", fontSize: 30, fontWeight: "900" },
  brandName: { color: "#fff", fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  tagline: { color: "#fff", fontSize: 9, marginTop: 2 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  notificationWrap: { position: "relative" },
  notificationIcon: { color: "#fff", fontSize: 22 },
  notificationBadge: {
    position: "absolute",
    right: -4,
    top: -6,
    backgroundColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  notificationBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#6b3a2c",
  },

  searchWrap: {
    marginTop: 18,
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 5,
  },
  searchIcon: { fontSize: 22, color: MUTED, marginRight: 8 },
  searchInput: { flex: 1, color: INK, fontSize: 13 },
  searchSubmit: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSubmitText: { color: "#fff", fontSize: 20, fontWeight: "700" },

  filters: {
    marginHorizontal: 18,
    marginTop: -14,
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    minHeight: 62,
  },
  filterItem: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 4,
  },
  filterItemBorder: { borderRightWidth: 1, borderRightColor: LINE },
  filterText: { fontSize: 10, color: INK, fontWeight: "600" },
  filterChevron: { fontSize: 12, color: "#687994" },

  section: { paddingHorizontal: 18, marginTop: 16 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitleBar: {
    width: 5,
    height: 18,
    borderRadius: 6,
    backgroundColor: PURPLE,
    marginRight: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: INK },
  categoryRow: { gap: 12, paddingBottom: 4 },
  categoryEmpty: { fontSize: 12, color: MUTED },
  category: { width: 76, alignItems: "center" },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconText: { fontSize: 24, color: "#fff" },
  categoryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
    marginTop: 6,
  },

  publish: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "#a50072",
    borderRadius: 16,
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  publishIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  publishIcon: { fontSize: 22, color: "#fff" },
  publishTextWrap: { flex: 1 },
  publishTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  publishSubtitle: { color: "#fff", fontSize: 10, marginTop: 4 },
  publishArrow: { color: "#fff", fontSize: 24 },

  feed: { paddingHorizontal: 18, marginTop: 18, gap: 13 },
  emptyFeed: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 },
  post: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
  },
  postHead: { flexDirection: "row", alignItems: "center", gap: 9 },
  postPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#b17b59",
  },
  postUserInfo: { flex: 1 },
  postUser: { fontSize: 13, fontWeight: "800", color: INK },
  verified: { color: PURPLE },
  postMeta: { fontSize: 9, color: "#74819a", marginTop: 3 },
  badge: {
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "#fcebf6",
  },
  badgeOffer: { backgroundColor: "#e7f8f6" },
  badgeText: { fontSize: 9, fontWeight: "700", color: PURPLE },
  badgeOfferText: { color: "#15988b" },

  postBody: { marginTop: 10 },
  postTitle: { fontSize: 13, fontWeight: "700", color: INK, marginBottom: 5 },
  postDesc: { fontSize: 11, lineHeight: 15, color: "#637392" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { backgroundColor: "#f1f4fa", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 8, color: "#60708e" },

  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: "#edf0f5",
    marginTop: 12,
    paddingTop: 10,
  },
  postActionText: { fontSize: 11, color: "#53627d" },
  contactButton: {
    marginLeft: "auto",
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  contactButtonText: { fontSize: 10, fontWeight: "700", color: PURPLE },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#8c0069",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  navItem: { alignItems: "center", gap: 3, paddingBottom: 4 },
  navIcon: { color: "#fff", fontSize: 20 },
  navLabel: { color: "#fff", fontSize: 9 },
  navActiveDot: {
    width: 34,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginTop: 2,
  },
  navAction: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PURPLE,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -26,
  },
  navActionText: { color: "#fff", fontSize: 26, fontWeight: "900" },
});
