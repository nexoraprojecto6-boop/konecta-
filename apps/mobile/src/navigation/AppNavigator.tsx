import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { SplashScreen } from "../screens/Splash/SplashScreen";
import { OnboardingScreen } from "../screens/Onboarding/OnboardingScreen";
import { LoginScreen } from "../screens/Auth/LoginScreen";
import { RegisterScreen } from "../screens/Auth/RegisterScreen";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { ProfileScreen } from "../screens/Profile/ProfileScreen";
import { DiscoverySearchScreen } from "../screens/Discovery/DiscoverySearchScreen";
import { DiscoveryResultsScreen } from "../screens/Discovery/DiscoveryResultsScreen";
import { ProfessionalPublicScreen } from "../screens/Professional/ProfessionalPublicScreen";
import { CompanyPublicScreen } from "../screens/Company/CompanyPublicScreen";
import { ActivateProfessionalScreen } from "../screens/Professional/ActivateProfessionalScreen";
import { SideMenuScreen } from "../screens/SideMenu/SideMenuScreen";
import { NotificationsScreen } from "../screens/Notifications/NotificationsScreen";
import { FeedSearchScreen } from "../screens/Search/FeedSearchScreen";
import { FeedSearchResultsScreen } from "../screens/Search/FeedSearchResultsScreen";
import { PostDetailScreen } from "../screens/Post/PostDetailScreen";
import { CommentsScreen } from "../screens/Post/CommentsScreen";
import { ContactScreen } from "../screens/Post/ContactScreen";
import { CreatePostTypeScreen } from "../screens/CreatePost/CreatePostTypeScreen";
import { PostFormScreen } from "../screens/CreatePost/PostFormScreen";
import { PostPreviewScreen } from "../screens/CreatePost/PostPreviewScreen";
import { PostSuccessScreen } from "../screens/CreatePost/PostSuccessScreen";
import { ContractsScreen } from "../screens/Contracts/ContractsScreen";
import { ContractDetailScreen } from "../screens/Contracts/ContractDetailScreen";
import { AccountScreen } from "../screens/Account/AccountScreen";
import { FavoritesScreen } from "../screens/Account/FavoritesScreen";
import { SettingsScreen } from "../screens/Account/SettingsScreen";
import { HelpScreen } from "../screens/Account/HelpScreen";
import { AboutScreen } from "../screens/Account/AboutScreen";

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Discovery: undefined;
  DiscoveryResults: {
    q?: string;
    lat: number;
    lng: number;
    radiusKm: number;
  };
  ProfessionalPublic: { userId: string };
  CompanyPublic: { id: string };
  ActivateProfessional: undefined;
  SideMenu: undefined;
  Notifications: undefined;
  FeedSearch: undefined;
  FeedSearchResults: { query: string };
  PostDetail: { postId: string };
  Comments: { postId: string };
  Contact: { postId: string };
  CreatePostType: undefined;
  PostForm: { type: string };
  PostPreview: { type: string; title: string; desc: string; location: string; tags: string };
  PostSuccess: undefined;
  Contracts: undefined;
  ContractDetail: { contractId: string };
  Account: undefined;
  Favorites: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

export type AuthScreenProps = NativeStackScreenProps<AuthStackParamList>;

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Profile" component={ProfileScreen} options={{ title: "Editar perfil" }} />
      <RootStack.Screen name="Discovery" component={DiscoverySearchScreen} options={{ title: "O que você precisa?" }} />
      <RootStack.Screen name="DiscoveryResults" component={DiscoveryResultsScreen} options={{ title: "Resultados próximos" }} />
      <RootStack.Screen name="ProfessionalPublic" component={ProfessionalPublicScreen} options={{ title: "Profissional" }} />
      <RootStack.Screen name="CompanyPublic" component={CompanyPublicScreen} options={{ title: "Empresa" }} />
      <RootStack.Screen name="ActivateProfessional" component={ActivateProfessionalScreen} options={{ title: "Oferecer serviços" }} />
      <RootStack.Screen name="SideMenu" component={SideMenuScreen} options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notificações" }} />
      <RootStack.Screen name="FeedSearch" component={FeedSearchScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="FeedSearchResults" component={FeedSearchResultsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PostDetail" component={PostDetailScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="CreatePostType" component={CreatePostTypeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PostForm" component={PostFormScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PostPreview" component={PostPreviewScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PostSuccess" component={PostSuccessScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Contracts" component={ContractsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="ContractDetail" component={ContractDetailScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
}

export function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
