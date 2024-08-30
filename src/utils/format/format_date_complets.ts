function formatDate (date: string): string {
  const currentDate = new Date();
  const messageDate = new Date(date);
  const diffTime = Math.abs(currentDate.getTime() - messageDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays < 1) {
    return "il y a quelques minutes";
  } else if (diffDays === 1) {
    return "il y a 1 jour";
  } else if (diffDays < 30) {
    return `il y a ${diffDays} jours`;
  } else if (diffMonths === 1) {
    return "il y a 1 mois";
  } else if (diffMonths < 12) {
    return `il y a ${diffMonths} mois`;
  } else {
    return date;
  }
}

export default formatDate;