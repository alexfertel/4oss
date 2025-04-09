import { Project, fetchData } from "oss-directory";

export async function getProjects() {
	const data = await fetchData();
	const rawProjects: Project[] = data.projects;
	const filteredProjects = rawProjects.filter((p) => Boolean(p.websites) && (p.websites?.length ?? 0) > 0);
	const activeProjects = filteredProjects.filter((p) => !p.description?.includes("Discontinued"));

	const projects = activeProjects;
	return shuffle(projects, projects.length);
}

function shuffle(array: Project[], k: number): Project[] {
	// Make a shallow copy of the array so the original is not modified
	const sample = [...array];

	// Ensure k is between 0 and the sample length.
	const n = Math.max(Math.min(k, sample.length), 0);

	// Perform an in-place shuffle on the first n elements using Fisher–Yates.
	for (let index = 0; index < n; index++) {
		const randomIndex = index + Math.floor(Math.random() * (sample.length - index));
		// Swap elements at index and randomIndex
		[sample[index], sample[randomIndex]] = [sample[randomIndex], sample[index]];
	}

	// Return the first n elements of the shuffled array.
	return sample.slice(0, n);
}

