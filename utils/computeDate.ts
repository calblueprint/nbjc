const computeDate = (datetime: Date, format: number): string => {
  switch (format) {
    case 0: {
      const dateTimeFormat = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      return dateTimeFormat.format(datetime);
    }
    case 1: {
      const dateTimeFormat = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
      return dateTimeFormat.format(datetime);
    }
    default:
      return datetime.toString();
  }
};

export default computeDate;
