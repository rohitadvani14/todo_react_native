import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet, Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import SingleItem from './SingleItem';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window')

export interface Props { }
interface TodoObj {
  task: string;
  completed: boolean;
}

const Home: React.FC<Props> = () => {
  const [inputValue, updateInput] = useState<string>('');
  const [todoList, updateList] = useState<TodoObj[]>([]);

  //getting ToDo list from local storage on initialization
  const getData = async () => {
    let oldList = await AsyncStorage.getItem('list');
    if (oldList) {
      let parsedList = JSON.parse(oldList);
      updateList(parsedList);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  //saving the copy of todo list in local storage on every update to persist data
  //custom hook
  const useLocalUpdate = () => {
    useEffect(() => {
      if (todoList.length > 0) {
        AsyncStorage.setItem('list', JSON.stringify(todoList));
      }
    }, [todoList])
  }
  //custom hook called
  useLocalUpdate();

  const addTask = (): void => {
    updateList([...todoList, { task: inputValue.trim(), completed: false }]);
    updateInput('');
    Keyboard.dismiss();
  }

  const toggleComplete = (index: number): void => {
    let oldTodoList = [...todoList];
    oldTodoList[index].completed = !oldTodoList[index].completed;
    updateList(oldTodoList);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Total todos remaining: {(todoList.filter(item => !item.completed).length)} out of {todoList.length}</Text>
      <View style={styles.addTodo} >
        <TextInput
          style={styles.inputTodo}
          value={inputValue}
          onChangeText={(text) => updateInput(text)}
          placeholder="Enter your task here"
        />
        <TouchableOpacity
          disabled={(inputValue.trim().length > 0) ? false : true}
          onPress={addTask} style={styles.add} >
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      {/* list  */}
      <View style={styles.flatlistContainer} >
        <FlatList
          data={todoList}
          renderItem={({ item, index }) => {
            return <SingleItem item={item} index={index} toggleComplete={toggleComplete} />
          }}
          ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1,borderColor: 'rgba(0,0,0,0.4)'}} />}
          ListEmptyComponent={() => <Text style={{ textAlign: 'center' }} >No task found.</Text>}
          keyExtractor={(item: TodoObj, index: number) => index.toString()}
        />
      </View>
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '16%'
  },
  text: {
    alignSelf: "center",
    fontSize: 20
  },
  addTodo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4%'
  },
  inputTodo: {
    borderWidth: 1,
    height: 40 / 812 * height,
    width: 260 / 414 * width,
    paddingHorizontal: 4,
    fontSize: 20
  },
  add: {
    height: 40 / 812 * height,
    width: 80 / 414 * width,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatlistContainer: { flex: 1, paddingVertical: 20 / 812 * height }
});

export default Home;