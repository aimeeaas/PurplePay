import { TextInput } from 'react-native';

// Importa os estilos separados (boa prática)
import Style from './Style';

function TextInputBox({value, onChangeText, placeholder, keyboardType, style}){
    return(
        // TextInput: campo de entrada (input)
        <TextInput 
        // Valor atual
        value={value}
        // Função que atualiza o estado
        onChangeText={onChangeText}
        // Texto que aparece antes de digitar
        placeholder={placeholder}
        // Define teclado
        keyboardType={keyboardType}
        // Estilo padrão + extra
        style={[Style.input, style]}
        />
    )
}

export default TextInputBox;

// Components permitem reutilização de código, padronização visual e facilita manutenção.