/**
 * Curated adventure prompts shown on the Home screen.
 * `titleTemplate` and `promptSeed` use {name} as a placeholder for the child's name.
 */
export const ADVENTURES = [
  {
    id: 'dragons-cave',
    themeIds: ['mythology', 'heroes'],
    titleTemplate: "{name} and the Dragon's Cave",
    summary:
      "{name} discovers a friendly dragon hiding in a mountain cave and must help it find its way home.",
    promptSeed:
      "{name} explores a glowing mountain cave and befriends a shy young dragon who has lost its way back to the dragon valley.",
  },
  {
    id: 'mars-mission',
    themeIds: ['space'],
    titleTemplate: "{name}'s Mission to Mars",
    summary:
      "{name} joins a junior space crew on a mission to plant the first garden on Mars.",
    promptSeed:
      "{name} is a young astronaut on a mission to Mars who must solve a problem with the spaceship's garden dome before landing.",
  },
  {
    id: 'whispering-forest',
    themeIds: ['animals', 'nature'],
    titleTemplate: "{name} and the Whispering Forest",
    summary:
      "{name} learns to understand the animals of an ancient forest and helps them solve a gentle mystery.",
    promptSeed:
      "{name} wanders into an old forest where the animals can whisper secrets, and helps a family of foxes find their missing cub.",
  },
  {
    id: 'championship-day',
    themeIds: ['sports', 'heroes'],
    titleTemplate: "{name}'s Championship Day",
    summary:
      "{name} steps up for the big game and discovers that teamwork matters more than winning.",
    promptSeed:
      "{name} plays in the championship match for their team and learns a lesson about courage and helping a teammate.",
  },
  {
    id: 'invention-lab',
    themeIds: ['invention'],
    titleTemplate: "{name}'s Amazing Invention Lab",
    summary:
      "{name} builds a wonderful contraption to help the whole neighborhood with a tricky problem.",
    promptSeed:
      "{name} sets up an invention lab in the garage and builds a clever machine to solve a problem for their neighbors.",
  },
  {
    id: 'lost-kingdom',
    themeIds: ['mythology', 'heroes'],
    titleTemplate: "{name} and the Lost Kingdom",
    summary:
      "{name} finds a hidden map and journeys to an ancient kingdom guarded by gentle giants.",
    promptSeed:
      "{name} finds an old map in an attic and travels to a hidden kingdom where kind giants protect a sleeping treasure.",
  },
  {
    id: 'coral-reef-rescue',
    themeIds: ['animals', 'nature'],
    titleTemplate: "{name} and the Coral Reef Rescue",
    summary:
      "{name} dives beneath the waves to help sea creatures protect their colorful reef home.",
    promptSeed:
      "{name} discovers they can breathe underwater for a day and helps a community of reef animals fix their damaged coral home.",
  },
  {
    id: 'robot-best-friend',
    themeIds: ['invention', 'space'],
    titleTemplate: "{name} and the Robot Best Friend",
    summary:
      "{name} builds a small robot that comes to life and helps on a backyard space adventure.",
    promptSeed:
      "{name} builds a little robot from spare parts that surprisingly comes to life and helps with a fun backyard space mission.",
  },
  {
    id: 'sky-race',
    themeIds: ['sports', 'space'],
    titleTemplate: "{name}'s Great Sky Race",
    summary:
      "{name} pilots a hot-air balloon in a friendly race across the clouds.",
    promptSeed:
      "{name} enters a hot-air balloon race across a kingdom in the clouds and helps a rival racer when trouble strikes.",
  },
  {
    id: 'museum-at-night',
    themeIds: ['mythology', 'invention'],
    titleTemplate: "{name} and the Museum at Night",
    summary:
      "{name} stays late at a museum and discovers the exhibits come to life after dark.",
    promptSeed:
      "{name} is accidentally locked in a museum overnight and discovers the ancient exhibits come to life, each needing a little help.",
  },
  {
    id: 'mountain-of-clouds',
    themeIds: ['nature', 'heroes'],
    titleTemplate: "{name} and the Mountain of Clouds",
    summary:
      "{name} climbs a mountain that touches the clouds to help a village find rain.",
    promptSeed:
      "{name} climbs a tall mountain to reach the cloud-keepers and ask for rain to help a village's dry fields.",
  },
  {
    id: 'galaxy-zoo',
    themeIds: ['animals', 'space'],
    titleTemplate: "{name}'s Galaxy Zoo Adventure",
    summary:
      "{name} visits a zoo on a space station full of curious creatures from other planets.",
    promptSeed:
      "{name} visits a zoo aboard a space station where animals from many planets live, and helps calm a homesick alien creature.",
  },
];

export function getAdventureTitle(adventure, name) {
  return adventure.titleTemplate.replace(/\{name\}/g, name);
}

export function getAdventureSummary(adventure, name) {
  return adventure.summary.replace(/\{name\}/g, name);
}

export function getAdventurePrompt(adventure, name) {
  return adventure.promptSeed.replace(/\{name\}/g, name);
}
