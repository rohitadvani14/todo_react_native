import React from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window')
interface Props {
    item: {
        task: string,
        completed: boolean
    };
    index: number;
    toggleComplete: Function
}
const SingleItem: React.FC<Props> = ({ item, index, toggleComplete }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => toggleComplete(index)} >
            <Text
                style={[styles.container, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}
            >{item.task}</Text>
        </TouchableOpacity>
    )
}

export default SingleItem;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12 / 414 * width,
        fontSize: 20,
        marginVertical: 4 / 812 * height,
    }
})