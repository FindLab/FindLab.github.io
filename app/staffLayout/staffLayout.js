
export const StaffGroupType = {
	Default: 0,
	Brace: 1,
	Bracket: 2,
	Square: 3,
};


export const StaffConjunctionType = {
	Blank: 0,
	Dashed: 1,
	Solid: 2,
};


const singleGroup = (id) => ({type: StaffGroupType.Default, staff: id});


const BOUNDS_TO_GROUPTYPE = {
	"{": StaffGroupType.Brace,
	"}": StaffGroupType.Brace,
	"<": StaffGroupType.Bracket,
	">": StaffGroupType.Bracket,
	"[": StaffGroupType.Square,
	"]": StaffGroupType.Square,
};

const OPEN_BOUNDS = "{<[";
const CLOSE_BOUNDS = "}>]";


const CONJUNCTIONS_MAP = {
	",": StaffConjunctionType.Blank,
	"-": StaffConjunctionType.Solid,
	".": StaffConjunctionType.Dashed,
};


const randomB64 = () => {
	const code = btoa(Math.random().toString().substr(2)).replace(/=/g, "");

	return code.split("").reverse().slice(0, 6).join("");
};


const makeUniqueName = (set, index, prefix) => {
	let name = prefix;
	if (!name)
		name = index.toString();
	else if (set.has(name))
		name += "_" + index.toString();

	while (set.has(name))
		name = (prefix ? prefix + "_" : "") + randomB64();

	return name;
};


const makeGroupsFromRaw = (parent, seq) => {
	let remains = seq;
	while (remains.length) {
		const word = remains.shift();
		const bound = BOUNDS_TO_GROUPTYPE[word];
		if (bound) {
			if (CLOSE_BOUNDS.includes(word) && bound === parent.type)
				break;

			if (OPEN_BOUNDS.includes(word)) {
				const group = {type: bound, level: Number.isFinite(parent.level) ? parent.level + 1 : 0};
				remains = makeGroupsFromRaw(group, remains);

				parent.subs = parent.subs || [];
				parent.subs.push(group);
			}
		}
		else {
			parent.subs = parent.subs || [];
			parent.subs.push(singleGroup(word));
		}
	}

	while (parent.type === StaffGroupType.Default && parent.subs && parent.subs.length === 1) {
		const sub = parent.subs[0];
		parent.type = sub.type;
		parent.subs = sub.subs;
		parent.staff = sub.staff;
		parent.level = sub.level;
	}

	while (parent.subs && parent.subs.length === 1 && parent.subs[0].type === StaffGroupType.Default) {
		const sub = parent.subs[0];
		parent.subs = sub.subs;
		parent.staff = sub.staff;
	}

	parent.grand = parent.type === StaffGroupType.Brace && parent.subs && parent.subs.every(sub => sub.staff);

	return remains;
};


const groupHead = (group) => {
	if (group.staff)
		return group.staff;
	else if (group.subs)
		return groupHead(group.subs[0]);
};


const groupTail = (group) => {
	if (group.staff)
		return group.staff;
	else if (group.subs)
		return groupTail(group.subs[group.subs.length - 1]);
};


const groupKey = (group) => {
	if (group.staff)
		return group.staff;
	else if (group.subs)
		return `${groupHead(group)}-${groupTail(group)}`;
};


const groupDict = (group, dict) => {
	dict[groupKey(group)] = group;

	if (group.subs)
		group.subs.forEach(sub => groupDict(sub, dict));
};


class StaffLayout {
	constructor (raw) {
		// make unique ids
		const ids = new Set();
		raw.forEach((item, i) => {
			item.id = makeUniqueName(ids, i + 1, item.id);
			ids.add(item.id);
		});
		this.staffIds = raw.map(item => item.id);
		this.conjunctions = raw.slice(0, raw.length - 1).map(item => item.conjunction ? CONJUNCTIONS_MAP[item.conjunction] : StaffConjunctionType.Blank);

		// make groups
		const seq = [].concat(...raw.map(item => [...item.leftBounds, item.id, ...item.rightBounds]));
		this.group = {type: StaffGroupType.Default};
		makeGroupsFromRaw(this.group, seq);

		this.bounds = raw.map(item => [item.leftBounds.join(""), item.rightBounds.join("")]);

		const dict = {};
		groupDict(this.group, dict);
		this.groups = Object.entries(dict).map(([key, group]) => {
			let ids = key.split("-");
			if (ids.length === 1)
				ids = [ids[0], ids[0]];
			const range = ids.map(id => this.staffIds.indexOf(id));

			return {
				group,
				range,
				key,
			};
		});

		this.maskCache = new Map();
	}


	get stavesCount () {
		if (!this.staffIds)
			return null;

		return this.staffIds.length;
	}


	conjunctionBetween (upStaff, downStaff) {
		if (downStaff <= upStaff)
			return null;

		let con = StaffConjunctionType.Solid;
		for (let i = upStaff; i < downStaff; i++)
			con = Math.min(con, this.conjunctions[i]);

		return con;
	}


	static makeMaskLayout (layout, mask) {
		const staffIds = layout.staffIds.filter((_, i) => mask & (1 << i));
		if (staffIds.length === layout.staffIds.length) {
			return {
				staffIds: layout.staffIds,
				conjunctions: layout.conjunctions,
				groups: layout.groups,
				bounds: layout.bounds,
			};
		}

		const groups = layout.groups
			.map(g => ({ids: layout.staffIds.slice(g.range[0], g.range[1] + 1).filter(id => staffIds.includes(id)), ...g}))
			.filter(({ids}) => ids.length)
			.map(({ids, ...g}) => ({
				key: g.key,
				group: g.group,
				range: [staffIds.indexOf(ids[0]), staffIds.indexOf(ids[ids.length - 1])],
			}));

		const conjunctions = staffIds.slice(0, staffIds.length - 1).map((id, i) => {
			const nextId = staffIds[i + 1];
			return layout.conjunctionBetween(layout.staffIds.indexOf(id), layout.staffIds.indexOf(nextId));
		});

		return {
			staffIds,
			conjunctions,
			groups,
		};
	}


	mask (mask) {
		if (!this.maskCache.get(mask))
			this.maskCache.set(mask, StaffLayout.makeMaskLayout(this, mask));

		return this.maskCache.get(mask);
	}
};



export default StaffLayout;
