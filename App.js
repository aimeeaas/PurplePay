// App.js
import { View, StyleSheet, Text, Image } from 'react-native';
import FinanceScreen from './screens/FinanceScreen';

export default function App() {
  // Componente de header simples (logo + nome)
  const HeaderBar = () => (
    <View style={styles.header}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.brand}>PurplePay</Text>
    </View>
  );

  return (
    <View style={styles.app}>
      <HeaderBar />
      <FinanceScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 100,
    backgroundColor: '#69328d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  logo: {
    width: 50,
    height: 40,
    marginTop: 30,
  },

  brand: {
    color: '#f5f5f5',
    fontSize: 20,
    marginTop: 35,
  },
});
