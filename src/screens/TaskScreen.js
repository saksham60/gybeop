import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import axios from 'axios';

const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://gybeapis-v31.westus.azurecontainer.io/api/assignment/assignments/1');
        const fetchedTasks = response.data.map(task => ({
          id: task.assignmentId,
          title: task.assignmentInstructions,
          completed: task.assignmentStatus === 3, // Assuming 3 represents a completed task
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffcc00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi Terry!</Text>
      <Text style={styles.queue}>Today's job queue:</Text>
      {tasks.map(task => (
        <View key={task.id} style={styles.taskContainer}>
          <Switch
            value={task.completed}
            onValueChange={() => toggleTask(task.id)}
            thumbColor={task.completed ? '#ffcc00' : '#ccc'}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000033",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  queue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#333",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 5,
  },
  startButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffcc00",
    alignItems: "center",
    borderRadius: 5,
  },
  backText: {
    color: "white",
    fontSize: 18,
  },
  startText: {
    color: "#000033",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TaskScreen;
