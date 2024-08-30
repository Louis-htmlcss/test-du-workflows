import createScreen from "@/router/helpers/create-screen";

import NoteReaction from "@/views/account/NoteReaction";
import SettingsTabs from "@/views/settings/SettingsTabs";
import RestaurantQrCode from "@/views/account/Restaurant/Modals/QrCode";
import NewsItem from "@/views/account/News/Document";
import AddonLogs from "@/views/addon/AddonLogs";
import AddonPage from "@/views/addon/AddonPage";
import GradeSubjectScreen from "@/views/account/Grades/Modals/Subject";
import GradeDocument from "@/views/account/Grades/Document";
import RestaurantHistory from "@/views/account/Restaurant/Modals/History";
import ChatCreate from "@/views/account/Chat/Modals/ChatCreate";
import Chat from "@/views/account/Chat/Modals/Chat";

export default [
  createScreen("NoteReaction", NoteReaction, {
    headerTitle: "",
    headerTransparent: true,
    presentation: "modal",
  }),
  createScreen("RestaurantQrCode", RestaurantQrCode, {
    headerTitle: "",
    headerTransparent: true,
    presentation: "fullScreenModal",
  }),
  createScreen("RestaurantHistory", RestaurantHistory, {
    headerTitle: "",
    headerTransparent: true,
    presentation: "modal",
  }),
  createScreen("SettingsTabs", SettingsTabs, {
    headerTitle: "Onglets et navigation",
  }),
  createScreen("NewsItem", NewsItem, {
    headerTitle: "Item",
    presentation: "modal",
  }),
  createScreen("AddonLogs", AddonLogs, {
    headerTitle: "Logs",
    presentation: "modal",
  }),
  createScreen("AddonPage", AddonPage, {
    headerTitle: "Extension",
  }),
  createScreen("GradeSubject", GradeSubjectScreen, {
    headerTitle: "Détail de la matière",
    presentation: "modal",
  }),
  createScreen("GradeDocument", GradeDocument, {
    headerTitle: "Détail de la note",
    presentation: "modal",
  }),
  createScreen("ChatCreate", ChatCreate, {
    headerTitle: "Nouvelle discussion",
    presentation: "modal",
  }),
  createScreen("Chat", Chat, {
    headerTitle: "",
    presentation: "modal",
  }),
] as const;
