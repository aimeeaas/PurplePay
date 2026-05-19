// TouchableOpacity → componente clicável (botão)
// Text → exibe texto na tela
import { TouchableOpacity, Text } from 'react-native';

// Importa os estilos separados (boa prática)
import Style from './Style'

// Componente reutilizável
function CustomButtom({title, onPress, style}){
    return(
        // TouchableOpacity: botão clicável
        // onPress: evento de clique
        // style{[...]}: array de estilos
        // [Style.buttom, style] permite: estilo padrão e estilo personalizado na tela
        <TouchableOpacity onPress={onPress} style={[Style.buttom, style]}>
            <Text style={Style.buttomText}>{title}</Text>       
        </TouchableOpacity>
    )
}

export default CustomButtom;

// Components permitem reutilização de código, padronização visual e facilita manutenção.