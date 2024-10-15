import React, { useEffect, useRef, useState } from "react";
import { ActivityDTO } from "../DTO/activityDTO";
import useActivity from "./useActivity";
import { formatDate } from "../utils/formatDate";
import { useDate } from "../providers/DateProvider";

type useCopyDayDataProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const useCopyDayData = ({
  modalVisible,
  setModalVisible,
}: useCopyDayDataProps) => {
  const { selectedDate } = useDate();
  const { useFetchActivities: sourceData } = useActivity({
    date: selectedDate,
  });

  const [sourceDate, setSourceDate] = useState<Date>(
    new Date(selectedDate.getTime() - 86400000), // Yesterday's date
  );
  const [destinationDate, setDestinationDate] = useState<Date>(selectedDate);

  const [alert, setAlert] = useState<string | undefined>();
  const [canSubmit, setCanSubmit] = useState(false);

  const selection = useRef<boolean[]>(
    new Array(sourceData.data?.length ?? 0).fill(true),
  );

  useEffect(() => {
    if (sourceData.data) {
      selection.current = new Array(sourceData.data.length).fill(true);
    }
  }, [sourceData.data]);

  useEffect(() => {
    console.log("SD:", sourceDate);
  }, [selectedDate]);

  const toggleActivitySelection = (index: number): boolean => {
    return (selection.current[index] = !selection.current[index]);
  };

  const getSelectedActivities = (): ActivityDTO[] => {
    return (
      sourceData.data?.filter((_activity, index) => selection.current[index]) ??
      []
    );
  };

  const changeDate = async (
    selectedDate: Date | undefined,
    field: "source" | "destination",
  ) => {
    if (!selectedDate) return;

    if (field === "destination") {
      setDestinationDate(selectedDate);
    } else {
      setSourceDate(selectedDate);
      await sourceData.refetch();
    }
    const noActivities = sourceData.data?.length === 0;

    setAlert(
      noActivities
        ? `Ingen aktiviteter fundet for ${formatDate(sourceDate)}`
        : "",
    );
    setCanSubmit(!noActivities);
  };

  return {
    sourceDate,
    destinationDate,
    changeDate,
    selection: {
      toggle: toggleActivitySelection,
      getSelectedActivities,
    },
    submit: {
      alertText: alert,
      canSubmit,
    },
    modal: {
      visible: modalVisible,
      set: setModalVisible,
    },
    external: sourceData,
  };
};
export default useCopyDayData;
