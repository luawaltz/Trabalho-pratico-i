import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export type Activity = {
  id: string;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');

  function addActivity() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o título e a descrição.');
      return;
    }
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    };
    setActivities(current => [newActivity, ...current]);
    setTitle('');
    setDescription('');
    setPriority('Média');
  }

  function toggleActivity(id: string) {
    setActivities(current => current.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  }

  function deleteActivity(id: string) {
    Alert.alert('Excluir atividade', 'Deseja excluir esta atividade?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => setActivities(current => current.filter(item => item.id !== id)) }
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <FlatList
        data={activities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={[styles.title, item.completed && styles.done]}>{item.title}</Text>
              <Text style={styles.priority}>{item.priority}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.status}>{item.completed ? 'Concluída' : 'Pendente'}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.completeButton} onPress={() => toggleActivity(item.id)}>
                <Text style={styles.actionText}>{item.completed ? 'Marcar pendente' : 'Concluir'}</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => deleteActivity(item.id)}>
                <Text style={styles.actionText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.logo}>🐾 MY EYES</Text>
              <Text style={styles.heading}>Rotina do Pet</Text>
              <Text style={styles.subtitle}>Cadastre e acompanhe os cuidados do seu pet.</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Nova atividade</Text>
              <View style={styles.formCard}>
                <Text style={styles.label}>Nome da atividade</Text>
                <TextInput style={styles.input} placeholder="Ex.: Passear com o pet" value={title} onChangeText={setTitle} placeholderTextColor="#999" />
                <Text style={styles.label}>Descrição</Text>
                <TextInput style={[styles.input, styles.multiline]} placeholder="Descreva a atividade" value={description} onChangeText={setDescription} multiline placeholderTextColor="#999" />
                <Text style={styles.label}>Prioridade</Text>
                <View style={styles.options}>
                  {['Baixa', 'Média', 'Alta'].map(item => (
                    <Pressable key={item} onPress={() => setPriority(item)} style={[styles.option, priority === item && styles.selected]}>
                      <Text style={[styles.optionText, priority === item && styles.selectedText]}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable style={styles.button} onPress={addActivity}>
                  <Text style={styles.buttonText}>Cadastrar atividade</Text>
                </Pressable>
              </View>
              <Text style={styles.sectionTitle}>Minhas atividades ({activities.length})</Text>
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma atividade cadastrada ainda.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  safe: { flex: 1, backgroundColor: '#F5F5FB' }, 
  header: { backgroundColor: '#5B50C8', padding: 24, paddingTop: 30, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }, 
  logo: { color: '#E4E1FF', fontWeight: '900', letterSpacing: 2 }, 
  heading: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 12 }, 
  subtitle: { color: '#E7E4FF', marginTop: 6, lineHeight: 20 }, 
  content: { paddingHorizontal: 16, paddingTop: 20 }, 
  sectionTitle: { color: '#28283F', fontSize: 19, fontWeight: '900', marginBottom: 12 }, 
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 22, borderWidth: 1, borderColor: '#E5E7F2' },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7F2', marginHorizontal: 16 }, 
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, 
  title: { flex: 1, color: '#28283F', fontSize: 16, fontWeight: '800' }, 
  done: { textDecorationLine: 'line-through', color: '#88889A' }, 
  priority: { backgroundColor: '#EEEEFA', color: '#5B50C8', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, fontSize: 12, fontWeight: '700' }, 
  description: { color: '#66667B', marginTop: 8, lineHeight: 20 }, 
  status: { color: '#5B50C8', fontSize: 12, fontWeight: '700', marginTop: 8 }, 
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 }, 
  completeButton: { backgroundColor: '#5B50C8', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 8 }, 
  deleteButton: { backgroundColor: '#FCE9EC', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 8 }, 
  actionText: { color: '#343451', fontWeight: '700', fontSize: 12 },
  label: { color: '#343451', fontWeight: '700', marginBottom: 6, marginTop: 8 }, 
  input: { backgroundColor: '#F7F7FC', borderWidth: 1, borderColor: '#E0E1ED', borderRadius: 10, padding: 12, color: '#24243A' }, 
  multiline: { minHeight: 70, textAlignVertical: 'top' }, 
  options: { flexDirection: 'row', gap: 8, marginBottom: 14 }, 
  option: { borderRadius: 9, paddingVertical: 9, paddingHorizontal: 15, backgroundColor: '#EEEEF7' }, 
  selected: { backgroundColor: '#5B50C8' }, 
  optionText: { color: '#55556B', fontWeight: '600' }, 
  selectedText: { color: '#FFFFFF' }, 
  button: { backgroundColor: '#5B50C8', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 5 }, 
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  empty: { color: '#77778C', textAlign: 'center', paddingHorizontal: 20, paddingVertical: 24 }, 
  listContent: { paddingBottom: 30 } 
});