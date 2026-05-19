// FinanceScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import TextInputBox from '../components/textInputBox/TextInputBox';
import CustomButtom from '../components/customButtom/CustomButtom';

import { database } from '../repository/RepositoryFinance';
// Picker de categorias
import { Picker } from '@react-native-picker/picker';

function FinanceScreen() {
  const screenHeight = Dimensions.get('window').height;

  // Helpers de data (para display)
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  };

  // Conversão simples de dd/mm/yyyy -> yyyy-mm-dd
  const toISODateFromDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    let [d, m, y] = parts;
    d = d?.toString().padStart(2, '0');
    m = m?.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Estados
  const [lista, setLista] = useState([]);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');

  const [editando, setEditando] = useState(null);

  const [filtro, setFiltro] = useState('');

  // Opções do picker
  const CATEGORIES = [
    { label: 'Selecione a categoria', value: '' },
    { label: 'Alimentação', value: 'alimentação' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Saúde', value: 'saude' },
    { label: 'Vestuário', value: 'vestuario' },
    { label: 'Lazer', value: 'lazer' },
    { label: 'Outros', value: 'outros' },
  ];

  // INIT
  useEffect(() => {
    async function setup() {
      await database.init();
      carregar();
    }

    setup();
  }, []);

  // CARREGAR
  async function carregar() {
    const data = await database.getFinance();
    setLista(data);
  }

  // Formatação automática de data (DD/MM/AAAA)
  const handleDateInput = (value) => {
    const digits = value.replace(/\D/g, '');
    let out = '';
    if (digits.length <= 2) {
      out = digits;
    } else if (digits.length <= 4) {
      out = digits.substring(0, 2) + '/' + digits.substring(2);
    } else {
      out =
        digits.substring(0, 2) +
        '/' +
        digits.substring(2, 4) +
        '/' +
        digits.substring(4, 8);
    }
    setData(out);
  };

  // SALVAR
  async function salvar() {
    if (!descricao || !valor || !data) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      // ISO para armazenar
      const dataISO = toISODateFromDisplay(data);

      if (editando) {
        await database.updateFinance(
          editando,
          descricao,
          valor,
          categoria,
          data
        );
        setEditando(null);
      } else {
        await database.addFinance(descricao, valor, categoria, data);
      }

      limpar();
      carregar();
    } catch (error) {
      console.error(error);
    }
  }

  function limpar() {
    setDescricao('');
    setValor('');
    setCategoria('');
    setData('');
  }

  // EDITAR
  function editar(item) {
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setCategoria(item.categoria);
    setData(item.data ? item.data : ''); // item.data é ISO; será formatado na exibição
    // Se estiver no formato ISO, vamos exibir dd/mm/yyyy no input
    // Converter ISO para dd/mm/yyyy para o input
    if (item.data) {
      const iso = item.data;
      const [y, m, d] = iso.split('-');
      setData(`${d}/${m}/${y}`);
    }
    setEditando(item.id);
  }

  // EXCLUIR
  async function excluir(id) {
    await database.deleteFinance(id);
    carregar();
  }

  // FILTRO
  async function filtrar() {
    if (!filtro) {
      carregar();
      return;
    }

    if (filtro.length === 4) {
      // ano
      const data = await database.getByYear(filtro);
      setLista(data);
    } else {
      // mês (ex: 2026-05)
      const data = await database.getByMonth(filtro);
      setLista(data);
    }
  }

  return (
    <ScrollView style={styles.container}>

      /* PRIMEIRA PÁGINA */
      <View>
        <Text style={styles.title}>Controle Financeiro 💸</Text>
        {/* INPUTS */}
        <TextInputBox
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInputBox
          placeholder="Valor"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />
        {/* Picker de Categoria */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}
            mode="dropdown"
            style={styles.picker}>
            {CATEGORIES.map((c) => (
              <Picker.Item label={c.label} value={c.value} key={c.value} />
            ))}
          </Picker>
        </View>

        {/* Data com preenchimento automático de dd/mm/yyyy */}
        <TextInputBox
          placeholder="Data"
          value={data}
          onChangeText={handleDateInput}
        />
        {/* BOTÃO */}
        <CustomButtom
          title={editando ? 'Atualizar' : 'Adicionar'}
          onPress={salvar}
          style={styles.botao1}
        />
      </View>
      
      /* SEGUNDA PÁGINA */
      <View>

        {/* FILTRO */}
        <View style={styles.buttons}>
        <TextInputBox
          placeholder="Filtrar (2026 ou 2026-12)"
          value={filtro}
          onChangeText={setFiltro}
          style={styles.filtro}
        />

        <CustomButtom title="Filtrar" onPress={filtrar} style={styles.botao2} />
        </View>

        {/* LISTA */}
        {lista.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.texto}>{item.descricao}</Text>

            <Text style={styles.sub}>
              R$ {item.valor} | {item.categoria}
            </Text>

            <Text style={styles.sub}>
              {item.data ? formatDateForDisplay(item.data) : ''}
            </Text>

            <View style={styles.buttons}>
              <CustomButtom
                title="Editar"
                onPress={() => editar(item)}
                style={styles.smallButton}
              />

              <CustomButtom
                title="Excluir"
                onPress={() => excluir(item.id)}
                style={styles.smallButton}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },

  botao1: {
    alignSelf: 'center',
    width: 170,
    height: 65,
    justifyContent: 'center',
    marginTop: 40,
  },

  botao2: {
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 100,
    marginLeft: -20,
  },

  filtro: {
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 100,
    marginLeft: -5,
    height: 70,
  },

  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0d4f2',
  },

  texto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#69328d',
  },

  sub: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    margin: 10,
  },

  smallButton: {
    width: 130,
    backgroundColor: '#69328d',
  },

  // Novo: estilo do Picker
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    padding: 7,
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    fontSize: 16,
  },

  picker: {
    height: 60,
    width: '100%',
  },
});

export default FinanceScreen;
