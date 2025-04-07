export const formattedDate = (date: Date) => {
   const datePart = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   }).replace(/\//g, "-");
   const timePart = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
   });

   return `${datePart} ${timePart}`;
}
