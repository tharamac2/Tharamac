// src/components/buttons/PrimaryButton.js

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';

export default function PrimaryButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
