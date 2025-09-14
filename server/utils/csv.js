// utils/csv.js
import { Parser } from "json2csv";

export const exportToCSV = (data) => {
  const fields = ["user.name", "user.email", "course.title", "rating", "message", "createdAt"];
  const opts = { fields };
  const parser = new Parser(opts);
  return parser.parse(data);
};
