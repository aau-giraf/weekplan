import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Button,
  View,
  Text,
} from 'react-native';
import React from 'react';
import ActivityTimePicker from './weekoverview_components/activity_components/ActivityTimePicker';
import useCopyDayData from '../hooks/useCopyDateActivities';
import ActivitySelectList from './weekoverview_components/activity_components/ActivitySelectList';

type CopyDateActivitiesModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CopyDateActivitiesModal({
  modalVisible,
  setModalVisible,
}: CopyDateActivitiesModalProps) {
  const {
    toggleActivitySelection,
    dates,
    selectedActivityIds,
    setDates,
    data,
    error,
    canSubmit,
    handleCopyActivities,
  } = useCopyDayData();

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => setModalVisible(false)}>
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}>
          <ActivityTimePicker
            value={dates.sourceDate}
            label={'Kopier Fra'}
            mode="date"
            onChange={(date) => setDates({ ...dates, sourceDate: date })}
          />

          <ActivityTimePicker
            value={dates.destinationDate}
            label={'Kopier til'}
            onChange={(date) => setDates({ ...dates, destinationDate: date })}
            mode="date"
          />
          {error && <Text style={{ fontSize: 16 }}>{error}</Text>}
          {!error && data && (
            <View style={{ display: 'flex', gap: 10 }}>
              <Text style={{ fontSize: 16 }}>Aktiviteter som vil kopieres</Text>
              <ActivitySelectList
                activities={data}
                toggleCheck={toggleActivitySelection}
                selectedIds={selectedActivityIds}
              />
            </View>
          )}
          <Button
            title="Kopier Aktiviteter"
            onPress={() => {
              setModalVisible(false);
              handleCopyActivities();
            }}
            disabled={!canSubmit}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    height: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
