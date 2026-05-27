import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import { AgroButton } from "../components/AgroButton";
import { AgroInput } from "../components/AgroInput";
import { EmptyState } from "../components/EmptyState";
import {
  listProductos,
  insertProducto,
  toggleDisponible
} from "../features/productos/productosRepository";
import { Producto } from "../types/models";
import { normalizeImageUrl } from "../utils/imageUrl";
import { agro } from "../theme/agroTheme";

function ProductThumb({ url, nombre }: { url?: string | null; nombre: string }) {
  const src = normalizeImageUrl(url);
  if (!src) {
    return (
      <View style={styles.thumbEmpty}>
        <Text style={styles.thumbEmoji}>📦</Text>
      </View>
    );
  }
  return <Image source={{ uri: src }} style={styles.thumb} accessibilityLabel={nombre} />;
}

export function ProductosScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Insumo");
  const [precio, setPrecio] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [stock, setStock] = useState("0");

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setItems(await listProductos());
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => void reload());
    return unsub;
  }, [navigation, reload]);

  const openModal = () => {
    setNombre("");
    setCategoria("Insumo");
    setPrecio("");
    setUnidad("kg");
    setStock("0");
    setModal(true);
  };

  const guardarNuevo = async () => {
    const p = parseFloat(precio.replace(",", "."));
    const s = parseFloat(stock.replace(",", "."));
    if (!nombre.trim()) return;
    if (Number.isNaN(p) || p < 0 || Number.isNaN(s) || s < 0) return;
    try {
      await insertProducto({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: p,
        unidad: unidad.trim(),
        stock: s
      });
      setModal(false);
      await reload();
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "No se pudo guardar");
    }
  };

  const catalogo = items.filter((i) => !i.esPropio).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      <Text style={styles.subtitle}>
        {items.length
          ? `${items.length} en catálogo${catalogo ? ` · ${catalogo} del panel` : ""}`
          : "Catálogo e inventario propio"}
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void reload()}>
            <Text style={styles.retry}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color={agro.green600} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={items}
          contentContainerStyle={items.length === 0 ? styles.listEmpty : styles.list}
          ListEmptyComponent={
            !error ? (
              <EmptyState
                emoji="🛒"
                title="Sin productos visibles"
                message="Crea uno con + Nuevo producto o pide al admin que publique en el panel con «Disponible» activo."
              />
            ) : null
          }
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ProductThumb url={item.imagen_url} nombre={item.nombre} />
              {item.esPropio ? (
                <Switch
                  value={item.disponible === 1}
                  onValueChange={async (v) => {
                    try {
                      await toggleDisponible(item.id, v);
                      await reload();
                    } catch (e) {
                      Alert.alert("Error", e instanceof Error ? e.message : "Sin permiso");
                    }
                  }}
                  trackColor={{ true: agro.green500 }}
                />
              ) : (
                <View style={styles.catalogBadge}>
                  <Text style={styles.catalogBadgeText}>Catálogo</Text>
                </View>
              )}
              <View style={styles.rowText}>
                <Text style={styles.bold}>
                  {item.nombre}
                  {item.destacado ? " ★" : ""}
                </Text>
                <Text style={styles.sub}>
                  {item.categoria} · Stock: {item.stock} {item.unidad} · S/ {item.precio.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>+ Nuevo producto</Text>
      </Pressable>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo producto</Text>
            <AgroInput placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <AgroInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} />
            <View style={styles.row2}>
              <View style={styles.flex}>
                <AgroInput
                  placeholder="Precio"
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.flex}>
                <AgroInput placeholder="Unidad" value={unidad} onChangeText={setUnidad} />
              </View>
            </View>
            <AgroInput
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="decimal-pad"
            />
            <AgroButton label="Guardar" onPress={() => void guardarNuevo()} />
            <Pressable style={styles.cancel} onPress={() => setModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: agro.gray50 },
  title: { fontSize: 24, fontWeight: "800", color: agro.green900 },
  subtitle: { fontSize: 14, color: agro.gray500, marginBottom: 12 },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: agro.radiusMd,
    padding: 12,
    marginBottom: 12
  },
  errorText: { color: "#b91c1c", fontSize: 13 },
  retry: { color: agro.green700, fontWeight: "700", marginTop: 6, fontSize: 13 },
  list: { paddingBottom: 80 },
  listEmpty: { flexGrow: 1, paddingBottom: 80 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    borderWidth: 1,
    borderColor: agro.gray200
  },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: agro.gray100 },
  thumbEmpty: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: agro.green50,
    alignItems: "center",
    justifyContent: "center"
  },
  thumbEmoji: { fontSize: 22 },
  catalogBadge: {
    backgroundColor: agro.green100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  catalogBadgeText: { fontSize: 10, fontWeight: "800", color: agro.green800 },
  rowText: { flex: 1 },
  bold: { fontWeight: "700", color: agro.gray900 },
  sub: { color: agro.gray500, fontSize: 12, marginTop: 2 },
  fab: {
    backgroundColor: agro.green600,
    padding: 16,
    borderRadius: agro.radiusXl,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    ...agro.shadow
  },
  fabText: { color: agro.white, fontWeight: "800", fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: agro.white,
    padding: 20,
    borderTopLeftRadius: agro.radiusLg,
    borderTopRightRadius: agro.radiusLg,
    gap: 4,
    maxHeight: "85%"
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: agro.green900, marginBottom: 8 },
  row2: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
  cancel: { alignItems: "center", padding: 12 },
  cancelText: { color: agro.gray600, fontWeight: "600" }
});
