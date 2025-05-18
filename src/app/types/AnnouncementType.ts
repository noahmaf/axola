type AnnouncementType = {
  value: string;
  label: string;
};

type SupportCategory = {
  value: string;
  label: string;
};

export default AnnouncementType;

export const announcementTypes: AnnouncementType[] = [
  { value: "General", label: "General" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Financial", label: "Financial" },
  { value: "Wellbeing", label: "Wellbeing" },
  { value: "Learning Resources", label: "Learning Resources" },
  { value: "Events", label: "Events" },
  { value: "Academic Support", label: "Academic Support" },
];

export const supportCategories: SupportCategory[] = [
  { value: "Academic", label: "Academic" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Financial", label: "Financial" },
  { value: "Learning Resources", label: "Learning Resources" },
  { value: "Registration", label: "Registration" },
  { value: "General", label: "General" },
];
