
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

const encodeLilypond = (layout, nameDict) => {
	return lilyStaffGroup(layout.group, nameDict);
};


const GROUP_SYMBOLS = [
	null,
	"brace",
	"bracket",
	"square",
];


const stateMusicxmlGroup = (statements, staffGroup, keys, nameDict, indent = 0) => {
	const indentTabs = tabs(indent);

	if (staffGroup.grand) {
		statements.push(indentTabs + `<score-part id="${staffGroup.key}">`);

		return;
	}

	const number = keys.indexOf(staffGroup.key) + 1;
	const name = nameDict[staffGroup.key];

	if (staffGroup.type > 0 || name) {
		statements.push(indentTabs + `<part-group number="${number}" type="start">`);
		statements.push(indentTabs + `	<group-symbol>${GROUP_SYMBOLS[staffGroup.type]}</group-symbol>`);
		statements.push(indentTabs + `	<group-name>${name}</group-name>`);
		statements.push(indentTabs + "</part-group>");
	}

	if (staffGroup.subs)
		staffGroup.subs.forEach(group => stateMusicxmlGroup(statements, group, keys, nameDict, indent + 1));

	if (staffGroup.staff)
		statements.push(indentTabs + `<score-part id="${staffGroup.key}">`);

	if (staffGroup.type > 0 || name) {
		statements.push(indentTabs + `<part-group number="${number}" type="stop">`);
		statements.push(indentTabs + `	<group-symbol>${GROUP_SYMBOLS[staffGroup.type]}</group-symbol>`);
		statements.push(indentTabs + "</part-group>");
	}
};


const encodeMusicxml = (layout, nameDict) => {
	const statements = [];
	const keys = layout.groups.map(g => g.key);
	stateMusicxmlGroup(statements, layout.group, keys, nameDict);

	return `<part-list>\n${statements.join("\n")}\n</part-list>`;
};


const encode = (lang, layout, nameDict) => {
	switch (lang) {
	case "Lilypond":
		return encodeLilypond(layout, nameDict);

	case "MusicXML":
		return encodeMusicxml(layout, nameDict);
	}
};



export {
	encodeLilypond,
	encode,
};
