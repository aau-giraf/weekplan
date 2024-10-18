export type ActivityDTO = Omit<FullActivityDTO, "citizenId">;
export type FullActivityDTO = {
  activityId: number;
  citizenId: number;
  date: string;
  description: string;
  endTime: string;
  name: string;
  startTime: string;
  isCompleted: boolean;
};
