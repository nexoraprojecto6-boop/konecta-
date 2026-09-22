/**
 * Dados demonstrativos do feed. O KONECTA ainda não tem um modelo de
 * "publicações" no backend — apenas Category, ProfessionalProfile,
 * Company e Service. Quando esse modelo existir, isto passa a vir de
 * api.listFeedPosts() ou equivalente.
 */
export type FeedPost = {
  id: string;
  name: string;
  time: string;
  place: string;
  type: "need" | "offer";
  typeLabel: string;
  title: string;
  desc: string;
  tags: string[];
  likes: number;
  comments: number;
  avatarInitials: string;
  avatarColor: string;
  verified: boolean;
  image: string;
};

export const DEMO_POSTS: FeedPost[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    time: "30 min atrás",
    place: "Luanda - Maianga",
    type: "need",
    typeLabel: "Precisa de serviço",
    title: "Preciso de um eletricista urgente em casa.",
    desc: "O disjuntor está a cair toda hora e preciso resolver ainda hoje. Pode ser hoje à tarde.",
    tags: ["Eletricista", "Residencial", "Maianga"],
    likes: 12,
    comments: 8,
    avatarInitials: "CM",
    avatarColor: "#a90072",
    verified: true,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Ana Silva",
    time: "1 hora atrás",
    place: "Luanda - Talatona",
    type: "offer",
    typeLabel: "Oferece serviço",
    title: "Design Gráfico | Logotipos, Flyers e Identidade Visual",
    desc: "Trabalho com criação de logotipos, artes para redes sociais, flyers e muito mais. Qualidade, agilidade e preço justo!",
    tags: ["Design Gráfico", "Marketing", "Talatona"],
    likes: 24,
    comments: 5,
    avatarInitials: "AS",
    avatarColor: "#d60770",
    verified: true,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Jorge Simões",
    time: "2 horas atrás",
    place: "Luanda - Kilamba",
    type: "need",
    typeLabel: "Precisa de serviço",
    title: "Procuro mecânico de confiança para o meu carro",
    desc: "Meu carro está a fazer um barulho estranho. Alguém de confiança que possa dar uma olhada.",
    tags: ["Mecânica", "Automóveis", "Kilamba"],
    likes: 18,
    comments: 11,
    avatarInitials: "JS",
    avatarColor: "#5379b2",
    verified: false,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Beatriz Fernandes",
    time: "3 horas atrás",
    place: "Luanda - Coqueiros",
    type: "offer",
    typeLabel: "Oferece serviço",
    title: "Cabeleireira e Estética — Resultados profissionais",
    desc: "Tranças, manicure, pedicure, limpeza de pele e muito mais. Atendimento a domicílio disponível.",
    tags: ["Beleza", "Estética", "Coqueiros"],
    likes: 31,
    comments: 7,
    avatarInitials: "BF",
    avatarColor: "#f49a00",
    verified: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=400&fit=crop",
  },
];
