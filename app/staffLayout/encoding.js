
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

	if (staffGroup.type !== StaffGroupType.Default || staffGroup.subs) {
		switch (staffGroup.type) {
		case StaffGroupType.Default:
			result += tabs(indent) + "<<\n";
			break;

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

	if (staffGroup.type !== StaffGroupType.Default || staffGroup.subs) {
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


const stateMusicxmlGroup = (statements, group, keys, nameDict, indent = 0) => {
	const indentTabs = tabs(indent);

	const number = keys.indexOf(group.key) + 1;
	const name = nameDict[group.key];

	if (group.grand) {
		statements.push(indentTabs + `<score-part id="${group.key}">`);
		if (name)
			statements.push(indentTabs + `	<part-name>${name}</part-name>`);
		statements.push(indentTabs + "</score-part>");

		return;
	}

	if (group.type > 0 || name) {
		statements.push(indentTabs + `<part-group number="${number}" type="start">`);
		statements.push(indentTabs + `	<group-symbol>${GROUP_SYMBOLS[group.type]}</group-symbol>`);
		if (name)
			statements.push(indentTabs + `	<group-name>${name}</group-name>`);
		statements.push(indentTabs + `	<group-barline>${group.bar > 1 ? "yes" : "no"}</group-barline>`);
		statements.push(indentTabs + "</part-group>");
	}

	if (group.subs)
		group.subs.forEach(group => stateMusicxmlGroup(statements, group, keys, nameDict, indent + 1));

	if (group.staff)
		statements.push(indentTabs + `<score-part id="${group.key}">`);

	if (group.type > 0 || name)
		statements.push(indentTabs + `<part-group number="${number}" type="stop" />`);
};


const encodeMusicxml = (layout, nameDict) => {
	const statements = [];
	const keys = layout.groups.map(g => g.key);
	stateMusicxmlGroup(statements, layout.group, keys, nameDict);

	return `<part-list>\n${statements.join("\n")}\n</part-list>`;
};


const bool = x => x ? "true" : "false";


const stateMEIGroup = (statements, group, nameDict, ids, indent = 0) => {
	const indentTabs = tabs(indent);

	const name = nameDict[group.key];

	if (group.subs) {
		const symbol = GROUP_SYMBOLS[group.type] ? ` symbol="${GROUP_SYMBOLS[group.type]}"` : "";
		statements.push(indentTabs + `<staffGrp bar.thru="${bool(group.bar > 1)}"${symbol}>`);

		if (name)
			statements.push(indentTabs + `	<label>${name}</label>`);

		group.subs.forEach(group => stateMEIGroup(statements, group, nameDict, ids, indent + 1));

		statements.push(indentTabs + "</staffGrp>");
	}

	if (group.staff)
		statements.push(indentTabs + `<staffDef n="${ids.indexOf(group.staff) + 1}">`);
};


const encodeMEI = (layout, nameDict) => {
	const statements = [];
	stateMEIGroup(statements, layout.group, nameDict, layout.staffIds);

	return statements.join("\n");
};


const encode = (lang, layout, nameDict) => {
	switch (lang) {
	case "Lilypond":
		return encodeLilypond(layout, nameDict);

	case "MusicXML":
		return encodeMusicxml(layout, nameDict);

	case "MEI":
		return encodeMEI(layout, nameDict);
	}
};



export {
	encodeLilypond,
	encode,
};
