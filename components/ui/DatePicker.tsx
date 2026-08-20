/**
 * DatePicker Component
 * Date selection with calendar interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/Theme';
import { formatDate } from '@/utils/helpers';

interface DatePickerProps {
  value?: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  label,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  containerStyle,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onDateChange(newDate);
    setShowModal(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = Array(firstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isDateDisabled = (day: number | null) => {
    if (day === null) return true;
    const testDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minimumDate && testDate < minimumDate) return true;
    if (maximumDate && testDate > maximumDate) return true;
    return false;
  };

  const isDateSelected = (day: number | null) => {
    if (day === null) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const styles = getStyles();

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
      >
        <Ionicons name="calendar" size={20} color={theme.colors.primary} />
        <Text style={styles.buttonText}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                }
              >
                <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={styles.monthYear}>{monthYear}</Text>
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                }
              >
                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendar}>
              {calendarDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    isDateSelected(day) && styles.dayButtonSelected,
                    isDateDisabled(day) && styles.dayButtonDisabled,
                  ]}
                  onPress={() => day && !isDateDisabled(day) && handleDateSelect(day)}
                  disabled={isDateDisabled(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isDateSelected(day) && styles.dayTextSelected,
                      isDateDisabled(day) && styles.dayTextDisabled,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getStyles() {
  return StyleSheet.create({
    label: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },
    disabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.xl,
      padding: theme.spacing.lg,
      width: '90%',
      maxWidth: 340,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    monthYear: {
      fontSize: theme.typography.subtitle.fontSize,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    weekDays: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.md,
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      width: '14.28%',
      textAlign: 'center',
    },
    calendar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.lg,
    },
    dayButton: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.spacing.md,
      marginVertical: 4,
    },
    dayButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    dayButtonDisabled: {
      opacity: 0.3,
    },
    dayText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    dayTextSelected: {
      color: '#FFF',
      fontWeight: '600',
    },
    dayTextDisabled: {
      color: theme.colors.textTertiary,
    },
    closeButton: {
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    closeButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
