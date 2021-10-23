
import {StaffGroupType} from "./staffLayout";



const tabs = (n) => n > 0 ? "\t".repeat(n) : "";
const indentParagraph = (text, indent) => text.split("\n").map(line => tabs(indent) + line).join("\n");


const lilyStaffGroup = (staffGroup, nameDict, indent = 0) => {
	let result = "";

	const headers = [];
	const instrument = nameDict[staffGroup.key];
	if (instrument)
		headers.push(`instrumentName = "${instrument}"`);

	const headerStatement = () => headers.length > 0 ? `\\with { ${headers.join(" ")} } ` : "";

	if (staffGroup.type !== StaffGroupType.Default) {
		switch (staffGroup.type) {
		case StaffGroupType.Brace:
			result += tabs(indent) + `\\new GrandStaff ${headerStatement()}<<\n`;
			break;

		case StaffGroupType.Bracket:
			result += tabs(indent) + `\\new StaffGroup ${headerStatement()}<<\n`;
			break;

		case StaffGroupType.Square:
			headers.push("systemStartDelimiter = #'SystemStartSquare");
			result += tabs(indent) + `\\new StaffGroup ${headerStatement()}<<\n`;
			break;
		}

		++indent;
	}

	if (staffGroup.staff) {
		//console.assert(statementDict[staffGroup.staff], "unknown staff id:", staffGroup.staff, Object.keys(statementDict), staffGroup);
		const statement = `\\new Staff "${staffGroup.staff}" ${headerStatement()}{}`;

		result += indentParagraph(statement, indent);
		result += "\n";
	}
	else if (staffGroup.subs) {
		for (const sub of staffGroup.subs)
			result += lilyStaffGroup(sub, nameDict, indent);
	}

	if (staffGroup.type !== StaffGroupType.Default) {
		--indent;
		result += tabs(indent) + ">>\n";
	}

	return result;
};

const encodeLilypond = (staffGroup, nameDict) => {
	return lilyStaffGroup(staffGroup, nameDict);
};


const encode = (lang, staffGroup, nameDict) => {
	switch (lang) {
	case "Lilypond":
		return encodeLilypond(staffGroup, nameDict);
	}
};



export {
	encodeLilypond,
	encode,
};
