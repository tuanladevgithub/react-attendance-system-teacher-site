export const formatTimeDisplay = (hour: number, min: number) => {
  const type = hour < 12 ? "AM" : "PM";
  let hourDisplay = "";
  if (type === "AM") hourDisplay = hour < 10 ? `0${hour}` : `${hour}`;
  else hourDisplay = hour - 12 < 10 ? `0${hour - 12}` : `${hour - 12}`;

  const minDisplay = min < 10 ? `0${min}` : `${min}`;

  return `${hourDisplay}:${minDisplay}${type}`;
};
