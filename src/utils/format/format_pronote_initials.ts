function parse_initials (content: string): string {
  const initials = content.split(" ").map((word) => word[0].toUpperCase()).join("");
  let formattedInitials = initials.slice(1);
  if (formattedInitials.length === 0) {
    formattedInitials = "??";
  }

  return formattedInitials;
}

export default parse_initials;