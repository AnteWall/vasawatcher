export interface Split {
  location: string;
  time?: String;
  diff?: String;
  minPerKm?: String;
  kmPerHour?: String;
}

const HEADERS = [
  "Location".padEnd(23, " "),
  "Time".padEnd(15, " "),
  "Diff".padEnd(14, " "),
  "m/Min".padEnd(14, " "),
  "km/hour"
];

export default class VasaData {
  name: string;
  splits: Split[] = [];

  addSplit(split: Split) {
    this.splits.push(split);
  }

  toSlackTable() {
    const formattedSplits = this.splits.map(split => {
      return `${(split.location || "").padEnd(20, " ")}\t${(
        split.time || ""
      ).padEnd(10, " ")}\t${(split.diff || "").padEnd(10, " ")}\t${(
        split.minPerKm || ""
      ).padEnd(10, " ")}\t${split.kmPerHour}\n`;
    });

    const tableHead = `\`\`\`${HEADERS.join("")}\`\`\``;

    return `*${this.name}*\n\n${tableHead}\n\`\`\`${formattedSplits.join(
      ""
    )}\`\`\``;
  }

  toJSON() {
    return {
      name: this.name,
      splits: this.splits
    };
  }
}
