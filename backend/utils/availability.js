const parseTimeToMinutes = (timeValue) => {
  if (!timeValue || typeof timeValue !== "string") return null;
  const [hoursRaw, minutesRaw] = timeValue.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const formatAvailabilityWindow = (availability = {}) => {
  const startTime = availability?.startTime || "--:--";
  const endTime = availability?.endTime || "--:--";
  return `${startTime} - ${endTime}`;
};

const isValidAvailabilityRange = (startTime, endTime) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  return startMinutes !== endMinutes;
};

const isWithinAvailability = (availability = {}, now = new Date()) => {
  const startMinutes = parseTimeToMinutes(availability?.startTime);
  const endMinutes = parseTimeToMinutes(availability?.endTime);

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
};

module.exports = {
  parseTimeToMinutes,
  formatAvailabilityWindow,
  isValidAvailabilityRange,
  isWithinAvailability,
};
