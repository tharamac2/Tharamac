import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';

export default function PrimaryButton({ title, onPress, isLoading = false, style }) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress} 
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 2,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});