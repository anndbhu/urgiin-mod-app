import React, { useMemo, useState, useEffect } from "react";
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

const defaultPeople = [
  { id: "1", name: "Дорж", year: "1940", gender: "Эрэгтэй", relation: "Өвөө" },
  { id: "2", name: "Сэржмаа", year: "1942", gender: "Эмэгтэй", relation: "Эмээ" },
  { id: "3", name: "Бат", year: "1965", gender: "Эрэгтэй", relation: "Аав" },
  { id: "4", name: "Цэцэг", year: "1968", gender: "Эмэгтэй", relation: "Ээж" },
  { id: "5", name: "Ганбат", year: "1990", gender: "Эрэгтэй", relation: "Ах" },
  { id: "6", name: "Энхболд", year: "1995", gender: "Эрэгтэй", relation: "Би" },
  { id: "7", name: "Отгон", year: "2002", gender: "Эмэгтэй", relation: "Дүү" },
];

function Avatar({ gender = "Эрэгтэй", small = false }) {
  return (
    <View style={[styles.avatar, small && styles.avatarSmall]}>
      <Text style={[styles.avatarText, small && styles.avatarTextSmall]}>
        {gender === "Эмэгтэй" ? "👩" : "👨"}
      </Text>
    </View>
  );
}

function PersonCard({ person, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.personCard, selected && styles.personCardSelected]}
    >
      <Avatar gender={person.gender} />
      <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
      <Text style={styles.personMeta}>{person.relation}</Text>
      <Text style={styles.personYear}>
        {person.year ? person.year + " он" : ""}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [people, setPeople] = useState(defaultPeople);
  const [selectedId, setSelectedId] = useState("6");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    year: "",
    gender: "Эрэгтэй",
    relation: "Аав",
  });

  const selectedPerson = people.find((p) => p.id === selectedId) || people[0];

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) =>
      ${p.name} ${p.relation} ${p.year}.toLowerCase().includes(q)
    );
  }, [people, search]);

  function savePerson() {
    if (!form.name.trim()) {
      Alert.alert("Анхаарна уу", "Нэрээ оруулна уу.");
      return;
    }

    if (editingId) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name.trim(), year: form.year.trim(), gender: form.gender, relation: form.relation }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newPerson = {
        id: Date.now().toString(),
        name: form.name.trim(),
        year: form.year.trim(),
        gender: form.gender,
        relation: form.relation || "Хамаатан",
      };
      setPeople((prev) => [...prev, newPerson]);
      setSelectedId(newPerson.id);
    }

    setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Аав" });
    setScreen("tree");
  }

  function deletePerson(id) {
    Alert.alert(
      "Устгах",
      "Та энэ хүнийг ургийн модноос устгахдаа итгэлтэй байна уу?",
      [
        { text: "Цуцлах", style: "cancel" },
        {
          text: "Устгах",
          style: "destructive",
          onPress: () => {
            const updated = people.filter((p) => p.id !== id);
            setPeople(updated);
            if (updated.length > 0) setSelectedId(updated[0].id);
            setScreen("tree");
          },
        },
      ]
    );
  }

  function startEdit(person) {
    setEditingId(person.id);
    setForm({
      name: person.name,
      year: person.year,
      gender: person.gender,
      relation: person.relation,
    });
    setScreen("add");
  }

  function Header({ title, back = false }) {
    return (
      <View style={styles.header}>
        {back ? (
          <TouchableOpacity onPress={() => setScreen("home")} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => Alert.alert("Ургийн мод v1.1", "Хөгжүүлж буй систем")}
            style={styles.headerButton}
          >
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => setScreen("search")}
          style={styles.headerButton}
        >
          <Text style={styles.searchIcon}>⌕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Home() {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <Header title="УРГИЙН МОД" />
        <ScrollView contentContainerStyle={styles.homeContent}>
          <View style={styles.hero}>
            <Text style={styles.heroTree}>🌳</Text>
            <Text style={styles.welcome}>Сайн уу, Энхболд оо!</Text>
            <Text style={styles.subWelcome}>Өөрийн гэр бүлийнхээ модыг бүтээгээрэй.</Text>
          </View>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("tree")}>
            <Text style={styles.menuEmoji}>🌳</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Миний ургийн мод</Text>
              <Text style={styles.menuSubtitle}>Ургийн модоо харах ({people.length} хүн)</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("search")}>
            <Text style={styles.menuEmoji}>🔎</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Хайх</Text>
              <Text style={styles.menuSubtitle}>Гэр бүлийн хүнээ хайх</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => {
              setEditingId(null);
              setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Аав" });
              setScreen("add");
            }}
          >
            <Text style={styles.menuEmoji}>👨‍👩‍👧</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Гэр бүлийн гишүүд</Text>
              <Text style={styles.menuSubtitle}>Шинэ хүн нэмэх</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("settings")}>
            <Text style={styles.menuEmoji}>⚙️</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Тохиргоо</Text>
              <Text style={styles.menuSubtitle}>Апп-ын тохиргоо</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="home" />
      </SafeAreaView>
    );
  }

  function Tree() {
    const grand = people.filter((p) => p.relation === "Өвөө" || p.relation === "Эмээ");
    const parents = people.filter((p) => p.relation === "Аав" || p.relation === "Ээж");
    const children = people.filter((p) => ["Ах", "Би", "Дүү", "Хүү", "Охин"].includes(p.relation));
    const others = people.filter(
      (p) => !["Өвөө", "Эмээ", "Аав", "Ээж", "Ах", "Би", "Дүү", "Хүү", "Охин"].includes(p.relation)
    );

    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Миний ургийн мод" back />
        <ScrollView horizontal contentContainerStyle={styles.treeScroll}>
          <View style={styles.tree}>
            {grand.length > 0 && (
              <>
                <Text style={styles.treeSection}>ӨВӨӨ • ЭМЭЭ</Text>
                <View style={styles.row}>
                  {grand.map((p) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      selected={p.id === selectedId}
                      onPress={() => setSelectedId(p.id)}
                    />
                  ))}
                </View>
                <Text style={styles.connector}>│{"\n"}▼</Text>
              </>
            )}

            {parents.length > 0 && (
              <>
                <Text style={styles.treeSection}>ААВ • ЭЭЖ</Text>
                <View style={styles.row}>
                  {parents.map((p) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      selected={p.id === selectedId}
                      onPress={() => setSelectedId(p.id)}
                    />
                  ))}
                </View>
                <Text style={styles.connector}>│{"\n"}▼</Text>
              </>
            )}

            <Text style={styles.treeSection}>ХҮҮХДҮҮД / АХ ДҮҮС</Text>
            <View style={styles.row}>
              {children.map((p) => (
                <PersonCard
                  key={p.id}
                  person={p}
                  selected={p.id === selectedId}
                  onPress={() => setSelectedId(p.id)}
                />
              ))}
              <TouchableOpacity
                style={styles.addChild}
                onPress={() => {
                  setEditingId(null);
                  setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Дүү" });
                  setScreen("add");
                }}
              >
                <Text style={styles.plus}>＋</Text>
                <Text style={styles.addChildText}>Хүн нэмэх</Text>
              </TouchableOpacity>
            </View>

            {others.length > 0 && (
              <>
                <Text style={styles.treeSection}>БУСАД ХАМААТНУУД</Text>
                <View style={styles.row}>
                  {others.map((p) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      selected={p.id === selectedId}
                      onPress={() => setSelectedId(p.id)}
                    />
                  ))}
                </View>
              </>
            )}

            {selectedPerson && (
              <View style={styles.selectedPanel}>
                <Avatar gender={selectedPerson.gender} small />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedName}>{selectedPerson.name}</Text>
                  <Text style={styles.selectedMeta}>
                    {selectedPerson.relation} • {selectedPerson.year || "Төрсөн онгүй"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => setScreen("person")}
                >
                  <Text style={styles.smallButtonText}>Харах</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        <BottomNav active="tree" />
      </SafeAreaView>
    );
  }

  function AddPerson() {
    const relationsList = ["Өвөө", "Эмээ", "Аав", "Ээж", "Ах", "Дүү", "Хүү", "Охин", "Хамаатан"];

    return (
      <SafeAreaView style={styles.safe}>
        <Header title={editingId ? "Мэдээлэл засах" : "Шинэ хүн нэмэх"} back />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Нэр *</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: Бат"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />

          <Text style={styles.label}>Төрсөн он</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: 1990"
            keyboardType="number-pad"
            value={form.year}
            onChangeText={(v) => setForm({ ...form, year: v })}
          />

          <Text style={styles.label}>Хүйс</Text>
          <View style={styles.segment}>
            {["Эрэгтэй", "Эмэгтэй"].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setForm({ ...form, gender: g })}
                style={[styles.segmentButton, form.gender === g && styles.segmentActive]}
              >
                <Text style={form.gender === g ? styles.segmentActiveText : styles.segmentText}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Хамаарал / Төрөл</Text>
          <View style={styles.relationGrid}>
            {relationsList.map((rel) => (
              <TouchableOpacity
                key={rel}
                onPress={() => setForm({ ...form, relation: rel })}
                style={[
                  styles.relationBadge,
                  form.relation === rel && styles.relationBadgeActive,
                ]}
              >
                <Text
                  style={
                    form.relation === rel
                      ? styles.relationBadgeTextActive
                      : styles.relationBadgeText
                  }
                >
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={savePerson}>
            <Text style={styles.primaryButtonText}>
              {editingId ? "Өөрчлөлтийг хадгалах" : "Ургийн модонд нэмэх"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="add" />
      </SafeAreaView>
    );
  }

  function SearchScreen() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хайх" back />
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Нэр эсвэл хамаарлаар хайх..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <ScrollView contentContainerStyle={styles.searchList}>
          {filteredPeople.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.searchPerson}
              onPress={() => {
                setSelectedId(p.id);
                setScreen("person");
              }}
            >
              <Avatar gender={p.gender} small />
              <View style={{ flex: 1 }}>
                <Text style={styles.searchName}>{p.name}</Text>
                <Text style={styles.searchMeta}>{p.relation} • {p.year || "—"}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          {filteredPeople.length === 0 && (
            <Text style={styles.emptyText}>Хүн олдсонгүй.</Text>
          )}
        </ScrollView>
        <BottomNav active="search" />
      </SafeAreaView>
    );
  }

  function Person() {
    if (!selectedPerson) return null;
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хүний мэдээлэл" back />
        <ScrollView contentContainerStyle={styles.personContainer}>
          <Avatar gender={selectedPerson.gender} />
          <Text style={styles.profileName}>{selectedPerson.name}</Text>
          <Text style={styles.profileRelation}>{selectedPerson.relation}</Text>

          <View style={styles.infoCard}>
            <InfoRow icon="📅" label="Төрсөн он" value={selectedPerson.year || "Оруулаагүй"} />
            <InfoRow icon="⚥" label="Хүйс" value={selectedPerson.gender} />
            <InfoRow icon="👨‍👩‍👧" label="Төрөл" value={selectedPerson.relation} />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1, backgroundColor: "#2D6A4F" }]}
              onPress={() => startEdit(selectedPerson)}
            >
              <Text style={styles.primaryButtonText}>Засах</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1, backgroundColor: "#E63946" }]}
              onPress={() => deletePerson(selectedPerson.id)}
            >
              <Text style={styles.primaryButtonText}>Устгах</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomNav active="tree" />
      </SafeAreaView>
    );
  }

  function InfoRow({ icon, label, value }) {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  }

  function Settings() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Тохиргоо" back />
        <ScrollView contentContainerStyle={styles.settings}>
          <Text style={styles.settingsSection}>Ерөнхий</Text>
          <SettingRow title="🌐  Хэл" value="Монгол" />
          <SettingRow title="☀️  Харагдах байдал" value="Гэрэлтэй" />

          <Text style={styles.settingsSection}>Аюулгүй байдал</Text>
          <SettingRow title="🔑  Нууц үг өөрчлөх" />

          <Text style={styles.settingsSection}>Бусад</Text>
          <SettingRow title="ⓘ  Бидний тухай" />
        </ScrollView>
        <BottomNav active="settings" />
      </SafeAreaView>
    );
  }

  function SettingRow({ title, value }) {
    return (
      <TouchableOpacity style={styles.settingRow}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingValue}>{value || "›"}</Text>
      </TouchableOpacity>
    );
  }

  function BottomNav({ active }) {
    return (
      <View style={styles.bottomNav}>
        <NavItem icon="⌂" label="Нүүр" active={active === "home"} onPress={() => setScreen("home")} />
        <NavItem icon="⌕" label="Хайх" active={active === "search"} onPress={() => setScreen("search")} />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingId(null);
            setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Аав" });
            setScreen("add");
          }}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
        <NavItem icon="☷" label="Мод" active={active === "tree"} onPress={() => setScreen("tree")} />
        <NavItem icon="⚙" label="Тохиргоо" active={active === "settings"} onPress={() => setScreen("settings")} />
      </View>
    );
  }

  function NavItem({ icon, label, active, onPress }) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.navItem}>
        <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
        <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (screen === "home") return <Home />;
  if (screen === "tree") return <Tree />;
  if (screen === "add") return <AddPerson />;
  if (screen === "search") return <SearchScreen />;
  if (screen === "person") return <Person />;
  return <Settings />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F4" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1B4332" },
  headerButton: { padding: 8 },
  headerButtonText: { fontSize: 28, color: "#2D6A4F" },
  menuText: { fontSize: 20 },
  searchIcon: { fontSize: 20 },
  homeContent: { padding: 20 },
  hero: { alignItems: "center", marginVertical: 20 },
  heroTree: { fontSize: 60 },
  welcome: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#1B4332" },
  subWelcome: { fontSize: 14, color: "#666", marginTop: 4 },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  menuEmoji: { fontSize: 24, marginRight: 16 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "600" },
  menuSubtitle: { fontSize: 12, color: "#888" },
  chevron: { fontSize: 20, color: "#CCC" },
  treeScroll: { padding: 20 },
  tree: { alignItems: "center" },
  treeSection: { fontSize: 12, fontWeight: "bold", color: "#52B788", marginVertical: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  connector: { textAlign: "center", color: "#B7E4C7", marginVertical: 6 },
  personCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: 90,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  personCardSelected: { borderColor: "#2D6A4F", backgroundColor: "#D8F3DC" },
  personName: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  personMeta: { fontSize: 11, color: "#666" },
  personYear: { fontSize: 10, color: "#999" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  avatarSmall: { width: 30, height: 30, borderRadius: 15 },
  avatarText: { fontSize: 20 },
  avatarTextSmall: { fontSize: 14 },
  addChild: { width: 90, height: 95, borderRadius: 10, borderWidth: 1, borderColor: "#2D6A4F", borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
  plus: { fontSize: 20, color: "#2D6A4F" },
  addChildText: { fontSize: 11, color: "#2D6A4F" },
  selectedPanel: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 10, marginTop: 20, width: "100%", gap: 10 },
  selectedName: { fontSize: 15, fontWeight: "bold" },
  selectedMeta: { fontSize: 12, color: "#666" },
  smallButton: { backgroundColor: "#2D6A4F", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  smallButtonText: { color: "#FFF", fontSize: 12 },
  formContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, fontSize: 14 },
  segment: { flexDirection: "row", gap: 10 },
  segmentButton: { flex: 1, padding: 12, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#DDD", borderRadius: 8, alignItems: "center" },
  segmentActive: { backgroundColor: "#2D6A4F", borderColor: "#2D6A4F" },
  segmentText: { color: "#333" },
  segmentActiveText: { color: "#FFF", fontWeight: "bold" },
  relationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  relationBadge: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: "#DDD" },
  relationBadgeActive: { backgroundColor: "#2D6A4F", borderColor: "#2D6A4F" },
  relationBadgeText: { color: "#555", fontSize: 13 },
  relationBadgeTextActive: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  primaryButton: { backgroundColor: "#2D6A4F", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 24 },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 12, width: "100%" },
  searchWrap: { padding: 16, backgroundColor: "#FFF" },
  searchInput: { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 8 },
  searchList: { padding: 16 },
  searchPerson: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 8, gap: 12 },
  searchName: { fontSize: 15, fontWeight: "600" },
  searchMeta: { fontSize: 12, color: "#666" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 40 },
  personContainer: { padding: 20, alignItems: "center" },
  profileName: { fontSize: 20, fontWeight: "bold", marginTop: 12 },
  profileRelation: { fontSize: 14, color: "#666", marginBottom: 20 },
  infoCard: { backgroundColor: "#FFF", borderRadius: 10, padding: 16, width: "100%", gap: 16 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoIcon: { fontSize: 18, width: 30 },
  infoLabel: { flex: 1, color: "#666" },
  infoValue: { fontWeight: "600" },
  settings: { padding: 16 },
  settingsSection: { fontSize: 14, fontWeight: "bold", color: "#2D6A4F", marginTop: 16, marginBottom: 8 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#FFF", borderRadius: 8, marginBottom: 6 },
  settingTitle: { fontSize: 14 },
  settingValue: { color: "#999" },
  bottomNav: { flexDirection: "row", backgroundColor: "#FFF", height: 60, borderTopWidth: 1, borderTopColor: "#EEE", alignItems: "center", justifyContent: "space-around" },
  navItem: { alignItems: "center" },
  navIcon: { fontSize: 20, color: "#999" },
  navLabel: { fontSize: 10, color: "#999" },
  navActive: { color: "#2D6A4F", fontWeight: "bold" },
  fab: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#2D6A4F", justifyContent: "center", alignItems: "center", marginTop: -20 },
  fabText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
});
