import React, { useState, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@family_tree_v6";

const RELATIONS = [
  "Өвөө", "Эмээ", "Аав", "Ээж", "Их авга", "Бага авга", 
  "Их нагац", "Бага нагац", "Үеэл", "Хаяал", "Ах", "Эгч", 
  "Дүү", "Хүү", "Охин", "Бэр", "Хүргэн", "Ач", "Зээ"
];

const FAMILY_TYPES = [
  "Ариун гэр бүл (1-р гэрлэлт)",
  "Эвлэг гэр бүл (2-р гэрлэлт)",
  "Холион гэр бүл (3-р гэрлэлт)",
  "Завхуул гэр бүл (4+ гэрлэлт)"
];

const AVATARS = ["👨", "👩", "👴", "👵", "👦", "👧", "👶", "🧔"];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [formName, setFormName] = useState("");
  const [formRelation, setFormRelation] = useState("Хүү");
  const [formSpouse, setFormSpouse] = useState("");
  const [formSide, setFormSide] = useState("father");
  const [formFamilyType, setFormFamilyType] = useState(FAMILY_TYPES[0]);
  const [formAvatar, setFormAvatar] = useState("👨");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData(people);
  }, [people]);

  async function loadData() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setPeople(JSON.parse(jsonValue));
      } else {
        setPeople([
          { id: "1", name: "Баатар", spouse: "Цэцэг", relation: "Аав ба Ээж", side: "father", familyType: FAMILY_TYPES[0], avatar: "👨" },
          { id: "2", name: "Болд", spouse: "Туяа", relation: "Хүү ба Бэр", side: "father", familyType: FAMILY_TYPES[0], avatar: "👨" },
          { id: "3", name: "Сүхээ", spouse: "", relation: "Ач хүү", side: "father", familyType: FAMILY_TYPES[0], avatar: "👦" },
        ]);
      }
    } catch (e) {
      console.log("Уншиж чадсангүй");
    }
  }

  async function saveData(value) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.log("Хадгалж чадсангүй");
    }
  }

  function handleSave() {
    if (!formName.trim()) {
      Alert.alert("Анхаарна уу", "Та хүний нэрийг заавал оруулна уу.");
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      name: formName.trim(),
      spouse: formSpouse.trim(),
      relation: formRelation,
      side: formSide,
      familyType: formFamilyType,
      avatar: formAvatar,
    };

    setPeople([...people, newPerson]);
    setFormName("");
    setFormSpouse("");
    Alert.alert("Амжилттай", "Мэдээлэл амжилттай хадгалагдлаа!");
    setScreen("tree");
  }

  function handleDelete(id) {
    Alert.alert(
      "Устгахдаа итгэлтэй байна уу?",
      "Энэ хүний мэдээлэл ургийн модноос бүрмөсөн устгагдана.",
      [
        { text: "Цуцлах", style: "cancel" },
        { 
          text: "Устгах", 
          style: "destructive", 
          onPress: () => {
            const updated = people.filter(p => p.id !== id);
            setPeople(updated);
            setSelectedPerson(null);
          } 
        }
      ]
    );
  }

  function handleClearAllData() {
    Alert.alert(
      "Бүх датаг арилгах",
      "Та бүх бүртгэлийг устгахдаа итгэлтэй байна уу?",
      [
        { text: "Цуцлах", style: "cancel" },
        { 
          text: "Устгах", 
          style: "destructive", 
          onPress: async () => {
            setPeople([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
            Alert.alert("Амжилттай", "Бүх мэдээлэл цэвэрлэгдлээ.");
          } 
        }
      ]
    );
  }

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    return people.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.relation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [people, searchQuery]);

  const bgStyle = darkMode ? { backgroundColor: "#111827" } : { backgroundColor: "#F3F4F6" };
  const cardStyle = darkMode ? { backgroundColor: "#1F2937", borderColor: "#374151" } : { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" };
  const textStyle = darkMode ? { color: "#F9FAFB" } : { color: "#111827" };

  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, cardStyle]}>
        <Text style={[styles.headerTitle, textStyle]}>🇲🇳 УРГИЙН МОД</Text>
      </View>

      {screen === "home" && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroBox}>
            <Text style={styles.bigEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={[styles.mainTitle, textStyle]}>Ургийн сувалж</Text>
            <Text style={styles.subTitle}>Та ах дүү, үр хүүхдээ энд бүртгээрэй</Text>
          </View>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#2563EB" }]} onPress={() => setScreen("tree")}>
            <Text style={styles.btnEmoji}>🌳</Text>
            <Text style={styles.btnText}>УРГИЙН МОД ХАРАХ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#16A34A" }]} onPress={() => setScreen("add")}>
            <Text style={styles.btnEmoji}>➕</Text>
            <Text style={styles.btnText}>ШИНЭ ХҮН НЭМЭХ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#D97706" }]} onPress={() => setScreen("search")}>
            <Text style={styles.btnEmoji}>🔍</Text>
            <Text style={styles.btnText}>ХАЙЛТ ХИЙХ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "tree" && (
        <ScrollView horizontal contentContainerStyle={{ padding: 20 }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <Text style={[styles.sectionHeader, textStyle]}>УРГИЙН СҮЛЖЭЭ ГРАФИК</Text>
            
            {people.map((item, index) => (
              <View key={item.id} style={{ alignItems: "center" }}>
                <View style={styles.coupleBox}>
                  <TouchableOpacity style={styles.personNode} onPress={() => setSelectedPerson(item)}>
                    <Text style={{ fontSize: 32 }}>{item.avatar || "👨"}</Text>
                    <Text style={styles.personName}>{item.name}</Text>
                    <Text style={styles.personRelation}>{item.relation}</Text>
                  </TouchableOpacity>

                  {item.spouse ? (
                    <View style={styles.connectorContainer}>
                      <View style={styles.line} />
                      <Text style={{ fontSize: 16 }}>❤️</Text>
                      <View style={styles.line} />
                    </View>
                  ) : null}

                  {item.spouse ? (
                    <TouchableOpacity style={styles.personNode} onPress={() => setSelectedPerson(item)}>
                      <Text style={{ fontSize: 32 }}>👩</Text>
                      <Text style={styles.personName}>{item.spouse}</Text>
                      <Text style={styles.personRelation}>Ханилан суугч</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {index < people.length - 1 && (
                  <View style={styles.downBranch}>
                    <View style={styles.downLine} />
                    <Text style={{ fontSize: 18, color: "#16A34A" }}>▼</Text>
                  </View>
                )}
              </View>
            ))}

            {selectedPerson && (
              <View style={[styles.infoCard, cardStyle]}>
                <Text style={[styles.infoTitle, textStyle]}>Сонгосон хүн:</Text>
                <Text style={[styles.infoText, textStyle]}>Нэр: {selectedPerson.name}</Text>
                {selectedPerson.spouse ? <Text style={[styles.infoText, textStyle]}>Ханилагч: {selectedPerson.spouse}</Text> : null}
                <Text style={styles.infoSub}>Төрөл: {selectedPerson.relation}</Text>
                <Text style={styles.infoSub}>Гэр бүл: {selectedPerson.familyType}</Text>
                
                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => handleDelete(selectedPerson.id)}
                >
                  <Text style={styles.deleteBtnText}>🗑️ Энэ хүнийг устгах</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </ScrollView>
      )}

      {screen === "add" && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.formLabel, textStyle]}>1. Дүрс / Аватар сонгох:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {AVATARS.map((av) => (
              <TouchableOpacity
                key={av}
                style={[styles.avatarChip, formAvatar === av && styles.avatarActive]}
                onPress={() => setFormAvatar(av)}
              >
                <Text style={{ fontSize: 24 }}>{av}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.formLabel, textStyle]}>2. Хүний нэр оруулна уу:</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="Жишээ: Баатар"
            placeholderTextColor="#9CA3AF"
            value={formName}
            onChangeText={setFormName}
          />

          <Text style={[styles.formLabel, textStyle]}>3. Эхнэр эсвэл нөхрийн нэр (Байгаа бол):</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="Жишээ: Цэцэг"
            placeholderTextColor="#9CA3AF"
            value={formSpouse}
            onChangeText={setFormSpouse}
          />

          <Text style={[styles.formLabel, textStyle]}>4. Ураг төрлийн нэршил сонгох:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {RELATIONS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.chipButton, formRelation === r && styles.chipActive]}
                onPress={() => setFormRelation(r)}
              >
                <Text style={[styles.chipText, formRelation === r && { color: "#FFF" }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.formLabel, textStyle]}>5. Аавын тал уу, Ээжийн тал уу?</Text>
          <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
            <TouchableOpacity
              style={[styles.sideBtn, formSide === "father" && styles.sideActive]}
              onPress={() => setFormSide("father")}
            >
              <Text style={styles.sideBtnText}>👴 Аавын тал (Авга)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sideBtn, formSide === "mother" && styles.sideActive]}
              onPress={() => setFormSide("mother")}
            >
              <Text style={styles.sideBtnText}>👵 Ээжийн тал (Нагац)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>ХАДГАЛАХ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "search" && (
        <View style={styles.content}>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle, { marginBottom: 20 }]}
            placeholder="Хайх хүний нэрийг бичнэ үү..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView>
            {filteredPeople.map((p) => (
              <TouchableOpacity 
                key={p.id} 
                style={[styles.searchResult, cardStyle]} 
                onPress={() => { setSelectedPerson(p); setScreen("tree"); }}
              >
                <Text style={{ fontSize: 28 }}>{p.avatar || "👤"}</Text>
                <View style={{ marginLeft: 15 }}>
                  <Text style={[styles.personName, textStyle]}>
                    {p.name} {p.spouse ? "& " + p.spouse : ""}
                  </Text>
                  <Text style={styles.personRelation}>{p.relation} ({p.side === "father" ? "Авга" : "Нагац"})</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {screen === "settings" && (
        <View style={styles.content}>
          <TouchableOpacity style={[styles.settingRow, cardStyle, { marginBottom: 15 }]} onPress={() => setDarkMode(!darkMode)}>
            <Text style={{ fontSize: 24 }}>{darkMode ? "🌙" : "☀️"}</Text>
            <Text style={[styles.settingText, textStyle]}>Харанхуй горим асаах/утраах</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, cardStyle, { borderColor: "#EF4444" }]} onPress={handleClearAllData}>
            <Text style={{ fontSize: 24 }}>🗑️</Text>
            <Text style={[styles.settingText, { color: "#EF4444" }]}>Бүх датаг цэвэрлэх</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.bottomNav, cardStyle]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, screen === "home" && styles.activeNav]}>Нүүр</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("tree")}>
          <Text style={styles.navIcon}>🌳</Text>
          <Text style={[styles.navLabel, screen === "tree" && styles.activeNav]}>Мод</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("add")}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={[styles.navLabel, screen === "add" && styles.activeNav]}>Нэмэх</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("search")}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navLabel, screen === "search" && styles.activeNav]}>Хайх</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("settings")}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={[styles.navLabel, screen === "settings" && styles.activeNav]}>Тохиргоо</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, justifyContent: "center", alignItems: "center", borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 20, paddingBottom: 90 },
  heroBox: { alignItems: "center", marginVertical: 20 },
  bigEmoji: { fontSize: 60 },
  mainTitle: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  subTitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  bigButton: { flexDirection: "row", alignItems: "center", padding: 18, borderRadius: 16, marginBottom: 16 },
  btnEmoji: { fontSize: 28, marginRight: 15 },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  
  coupleBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 16, borderWidth: 2, borderColor: "#2563EB", elevation: 3 },
  personNode: { alignItems: "center", width: 100 },
  personName: { fontSize: 16, fontWeight: "bold", marginTop: 4, textAlign: "center" },
  personRelation: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  connectorContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 6 },
  line: { width: 15, height: 3, backgroundColor: "#EF4444" },
  downBranch: { alignItems: "center", marginVertical: 8 },
  downLine: { width: 3, height: 25, backgroundColor: "#16A34A" },

  infoCard: { marginTop: 20, padding: 20, borderRadius: 16, borderWidth: 1, width: 280 },
  infoTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  infoText: { fontSize: 16, marginBottom: 4 },
  infoSub: { fontSize: 14, color: "#16A34A", marginTop: 2 },
  deleteBtn: { marginTop: 15, backgroundColor: "#FEE2E2", padding: 10, borderRadius: 8, alignItems: "center" },
  deleteBtnText: { color: "#DC2626", fontWeight: "bold" },

  formLabel: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 8 },
  easyInput: { borderWidth: 1, padding: 16, borderRadius: 12, fontSize: 18 },
  avatarChip: { padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", marginRight: 10, backgroundColor: "#FFF" },
  avatarActive: { borderColor: "#2563EB", backgroundColor: "#DBEAFE" },
  chipButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#E5E7EB", marginRight: 8 },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 16, color: "#374151", fontWeight: "bold" },
  sideBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: "#E5E7EB", alignItems: "center" },
  sideActive: { backgroundColor: "#16A34A" },
  sideBtnText: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  saveBtn: { backgroundColor: "#2563EB", padding: 18, borderRadius: 14, alignItems: "center", marginTop: 25 },
  saveBtnText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },

  searchResult: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 20, borderRadius: 12, borderWidth: 1 },
  settingText: { fontSize: 18, fontWeight: "bold", marginLeft: 15 },

  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1 },
  navItem: { alignItems: "center" },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  activeNav: { color: "#2563EB", fontWeight: "bold" },
});
import React, { useState, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@family_tree_v7";

const ALL_RELATIONS = [
  "Өвөө", "Эмээ", "Аав", "Ээж", "Их авга", "Бага авга", 
  "Их нагац", "Бага нагац", "Үеэл", "Хаяал", "Ах", "Эгч", 
  "Дүү", "Хүү", "Охин", "Бэр", "Хүргэн", "Ач", "Зээ",
  "Авга ах", "Авга эгч", "Авга дүү", "Нагац ах", "Нагац эгч", "Нагац дүү"
];

const INITIAL_PEOPLE = [
  { id: "1", name: "Баатар", spouse: "Цэцэг", relation: "Өвөө ба Эмээ", side: "father", imageUrl: "https://via.placeholder.com/150/1D4ED8/FFFFFF?text=Өвөө" },
  { id: "2", name: "Болд", spouse: "Туяа", relation: "Аав ба Ээж", side: "father", imageUrl: "https://via.placeholder.com/150/16A34A/FFFFFF?text=Аав" },
  { id: "3", name: "Дорж", spouse: "", relation: "Ах", side: "father", imageUrl: "https://via.placeholder.com/150/D97706/FFFFFF?text=Ах" },
  { id: "4", name: "Сүрэн", spouse: "", relation: "Эгч", side: "father", imageUrl: "https://via.placeholder.com/150/DC2626/FFFFFF?text=Эгч" },
  { id: "5", name: "Ганзориг", spouse: "", relation: "Дүү", side: "father", imageUrl: "https://via.placeholder.com/150/2563EB/FFFFFF?text=Дүү" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRelation, setFormRelation] = useState("");
  const [relationSearch, setRelationSearch] = useState("");
  const [formSpouse, setFormSpouse] = useState("");
  const [formSide, setFormSide] = useState("father");
  const [formImageUrl, setFormImageUrl] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData(people);
  }, [people]);

  async function loadData() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null && JSON.parse(jsonValue).length > 0) {
        setPeople(JSON.parse(jsonValue));
      } else {
        setPeople(INITIAL_PEOPLE);
      }
    } catch (e) {
      setPeople(INITIAL_PEOPLE);
    }
  }

  async function saveData(value) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.log("Хадгалж чадсангүй");
    }
  }

  function handleSave() {
    if (!formName.trim()) {
      Alert.alert("Анхаарна уу", "Хүний нэрийг заавал оруулна уу.");
      return;
    }
    if (!formRelation.trim()) {
      Alert.alert("Анхаарна уу", "Ураг төрлийн нэршлийг сонгоно уу эсвэл бичнэ үү.");
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      name: formName.trim(),
      spouse: formSpouse.trim(),
      relation: formRelation,
      side: formSide,
      imageUrl: formImageUrl.trim() || "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=Хүн",
    };

    setPeople([...people, newPerson]);
    setFormName("");
    setFormSpouse("");
    setFormRelation("");
    setRelationSearch("");
    setFormImageUrl("");
    Alert.alert("Амжилттай", "Шинэ хүн ургийн модонд бүртгэгдлээ!");
    setScreen("tree");
  }

  function handleDelete(id) {
    Alert.alert("Устгах", "Энэ хүний мэдээллийг устгахдаа итгэлтэй байна уу?", [
      { text: "Цуцлах", style: "cancel" },
      {
        text: "Устгах",
        style: "destructive",
        onPress: () => {
          const updated = people.filter((p) => p.id !== id);
          setPeople(updated);
          setSelectedPerson(null);
        },
      },
    ]);
  }

  const filteredRelations = useMemo(() => {
    if (!relationSearch.trim()) return ALL_RELATIONS;
    return ALL_RELATIONS.filter((r) =>
      r.toLowerCase().includes(relationSearch.toLowerCase())
    );
  }, [relationSearch]);

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.relation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [people, searchQuery]);

  const bgStyle = darkMode ? { backgroundColor: "#111827" } : { backgroundColor: "#F3F4F6" };
  const cardStyle = darkMode ? { backgroundColor: "#1F2937", borderColor: "#374151" } : { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" };
  const textStyle = darkMode ? { color: "#F9FAFB" } : { color: "#111827" };

  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, cardStyle]}>
        <Text style={[styles.headerTitle, textStyle]}>УРГИЙН МОД</Text>
      </View>

      {screen === "home" && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroBox}>
            <Text style={[styles.mainTitle, textStyle]}>Монгол Ургийн Сувалж</Text>
            <Text style={styles.subTitle}>Та ах дүү, төрөл садангаа хялбар бүртгээрэй</Text>
          </View>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#2563EB" }]} onPress={() => setScreen("tree")}>
            <Text style={styles.btnText}>🌳 УРГИЙН МОД ХАРАХ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#16A34A" }]} onPress={() => setScreen("add")}>
            <Text style={styles.btnText}>➕ ШИНЭ ХҮН НЭМЭХ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, { backgroundColor: "#D97706" }]} onPress={() => setScreen("search")}>
            <Text style={styles.btnText}>🔍 ХАЙЛТ ХИЙХ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "tree" && (
        <ScrollView horizontal contentContainerStyle={{ padding: 20 }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <Text style={[styles.sectionHeader, textStyle]}>УРГИЙН СҮЛЖЭЭ</Text>

            {people.map((item, index) => (
              <View key={item.id} style={{ alignItems: "center" }}>
                <View style={[styles.coupleBox, cardStyle]}>
                  <TouchableOpacity style={styles.personNode} onPress={() => setSelectedPerson(item)}>
                    <Image source={{ uri: item.imageUrl }} style={styles.avatarImage} />
                    <Text style={[styles.personName, textStyle]}>{item.name}</Text>
                    <Text style={styles.personRelation}>{item.relation}</Text>
                  </TouchableOpacity>

                  {item.spouse ? (
                    <View style={styles.connectorContainer}>
                      <View style={styles.line} />
                      <Text style={{ fontSize: 12, color: "#EF4444" }}>❤️</Text>
                      <View style={styles.line} />
                    </View>
                  ) : null}

                  {item.spouse ? (
                    <TouchableOpacity style={styles.personNode} onPress={() => setSelectedPerson(item)}>
                      <Image source={{ uri: "https://via.placeholder.com/150/EC4899/FFFFFF?text=Ханилагч" }} style={styles.avatarImage} />
                      <Text style={[styles.personName, textStyle]}>{item.spouse}</Text>
                      <Text style={styles.personRelation}>Ханилан суугч</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {index < people.length - 1 && (
                  <View style={styles.downBranch}>
                    <View style={styles.downLine} />
                    <Text style={{ fontSize: 14, color: "#16A34A" }}>▼</Text>
                  </View>
                )}
              </View>
            ))}

            {selectedPerson && (
              <View style={[styles.infoCard, cardStyle]}>
                <Image source={{ uri: selectedPerson.imageUrl }} style={styles.largeAvatar} />
                <Text style={[styles.infoTitle, textStyle]}>{selectedPerson.name}</Text>
                {selectedPerson.spouse ? <Text style={[styles.infoText, textStyle]}>Ханилагч: {selectedPerson.spouse}</Text> : null}
                <Text style={styles.infoSub}>Ураг төрөл: {selectedPerson.relation}</Text>
                <Text style={styles.infoSub}>Тал: {selectedPerson.side === "father" ? "Аавын тал" : "Ээжийн тал"}</Text>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(selectedPerson.id)}>
                  <Text style={styles.deleteBtnText}>🗑️ Устгах</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </ScrollView>
      )}

      {screen === "add" && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.stepTitle, textStyle]}>Алхам 1: Хүний мэдээлэл бичих</Text>
          
          <Text style={[styles.formLabel, textStyle]}>Нэр:</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="Нэр энд бичнэ үү..."
            placeholderTextColor="#9CA3AF"
            value={formName}
            onChangeText={setFormName}
          />

          <Text style={[styles.formLabel, textStyle]}>Эхнэр эсвэл Нөхрийн нэр (байгаа бол):</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="Ханилагчийн нэр..."
            placeholderTextColor="#9CA3AF"
            value={formSpouse}
            onChangeText={setFormSpouse}
          />

          <Text style={[styles.stepTitle, textStyle, { marginTop: 20 }]}>Алхам 2: Ураг төрлийн хамаарал сонгох</Text>
          <Text style={[styles.formLabel, textStyle]}>Хамаарал хайх (Жишээ нь: "д" эсвэл "дүү"):</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="Хайх үгээ бичнэ үү..."
            placeholderTextColor="#9CA3AF"
            value={relationSearch}
            onChangeText={setRelationSearch}
          />

          <View style={styles.chipContainer}>
            {filteredRelations.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.chipButton, formRelation === r && styles.chipActive]}
                onPress={() => setFormRelation(r)}
              >
                <Text style={[styles.chipText, formRelation === r && { color: "#FFF" }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {formRelation ? <Text style={{ color: "#16A34A", fontWeight: "bold", marginTop: 5 }}>Сонгосон: {formRelation}</Text> : null}

          <Text style={[styles.stepTitle, textStyle, { marginTop: 20 }]}>Алхам 3: Зураг болон Тал сонгох</Text>

          <Text style={[styles.formLabel, textStyle]}>Зургийн URL холбоос (байгаа бол):</Text>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle]}
            placeholder="https://... эсвэл хоосон орхиж болно"
            placeholderTextColor="#9CA3AF"
            value={formImageUrl}
            onChangeText={setFormImageUrl}
          />

          <Text style={[styles.formLabel, textStyle]}>Ямар талын хамаатан бэ?</Text>
          <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
            <TouchableOpacity
              style={[styles.sideBtn, formSide === "father" && styles.sideActive]}
              onPress={() => setFormSide("father")}
            >
              <Text style={styles.sideBtnText}>Аавын тал</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sideBtn, formSide === "mother" && styles.sideActive]}
              onPress={() => setFormSide("mother")}
            >
              <Text style={styles.sideBtnText}>Ээжийн тал</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>БҮРТГЭХ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "search" && (
        <View style={styles.content}>
          <TextInput
            style={[styles.easyInput, cardStyle, textStyle, { marginBottom: 20 }]}
            placeholder="Хайх хүний нэр эсвэл хамаарлыг бичнэ үү..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView>
            {filteredPeople.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.searchResult, cardStyle]}
                onPress={() => {
                  setSelectedPerson(p);
                  setScreen("tree");
                }}
              >
                <Image source={{ uri: p.imageUrl }} style={styles.avatarImage} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={[styles.personName, textStyle]}>
                    {p.name} {p.spouse ? "& " + p.spouse : ""}
                  </Text>
                  <Text style={styles.personRelation}>{p.relation}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.bottomNav, cardStyle]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("home")}>
          <Text style={[styles.navLabel, screen === "home" && styles.activeNav]}>🏠 Нүүр</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("tree")}>
          <Text style={[styles.navLabel, screen === "tree" && styles.activeNav]}>🌳 Мод</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("add")}>
          <Text style={[styles.navLabel, screen === "add" && styles.activeNav]}>➕ Нэмэх</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setScreen("search")}>
          <Text style={[styles.navLabel, screen === "search" && styles.activeNav]}>🔍 Хайх</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, justifyContent: "center", alignItems: "center", borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 20, paddingBottom: 90 },
  heroBox: { alignItems: "center", marginVertical: 20 },
  mainTitle: { fontSize: 24, fontWeight: "bold" },
  subTitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  bigButton: { padding: 18, borderRadius: 16, marginBottom: 16, alignItems: "center" },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },

  coupleBox: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 16, borderWidth: 1, elevation: 2 },
  personNode: { alignItems: "center", width: 100 },
  avatarImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#E5E7EB" },
  largeAvatar: { width: 80, height: 80, borderRadius: 40, alignSelf: "center", marginBottom: 10 },
  personName: { fontSize: 15, fontWeight: "bold", marginTop: 4, textAlign: "center" },
  personRelation: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  connectorContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 4 },
  line: { width: 10, height: 2, backgroundColor: "#EF4444" },
  downBranch: { alignItems: "center", marginVertical: 6 },
  downLine: { width: 2, height: 20, backgroundColor: "#16A34A" },

  infoCard: { marginTop: 20, padding: 20, borderRadius: 16, borderWidth: 1, width: 280, alignItems: "center" },
  infoTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  infoText: { fontSize: 15, marginBottom: 4 },
  infoSub: { fontSize: 14, color: "#16A34A", marginTop: 2 },
  deleteBtn: { marginTop: 15, backgroundColor: "#FEE2E2", padding: 10, borderRadius: 8, width: "100%", alignItems: "center" },
  deleteBtnText: { color: "#DC2626", fontWeight: "bold" },

  stepTitle: { fontSize: 16, fontWeight: "bold", color: "#2563EB" },
  formLabel: { fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 4 },
  easyInput: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chipButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, backgroundColor: "#E5E7EB" },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 14, color: "#374151" },
  sideBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "#E5E7EB", alignItems: "center" },
  sideActive: { backgroundColor: "#16A34A" },
  sideBtnText: { fontSize: 14, fontWeight: "bold", color: "#FFF" },
  saveBtn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 20 },
  saveBtnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  searchResult: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1 },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 14, color: "#6B7280" },
  activeNav: { color: "#2563EB", fontWeight: "bold" },
});
