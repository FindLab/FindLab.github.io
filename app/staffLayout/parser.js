
import StaffLayout from "./staffLayout";



const parseCode = async (code) => {
	const grammar = await import("./grammar.jison.js");
	const raw = grammar.parse(code);

	return new StaffLayout(raw);
};



export {
	parseCode,
};
