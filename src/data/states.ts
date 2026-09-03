import type { RegionId, StateInfo } from "../types";

export const STATES: StateInfo[] = [
  { id: "AL", name: "Alabama", capital: "Montgomery", regionId: "southeast", nickname: "Yellowhammer State", facts: ["Alabama’s state bird is the yellowhammer, a bright flicker woodpecker.", "The Saturn V moon rocket was tested near Huntsville, Alabama."] },
  { id: "AK", name: "Alaska", capital: "Juneau", regionId: "west", nickname: "The Last Frontier", facts: ["Alaska is so big that if it were folded in half, it would still be the largest state.", "Juneau is the only U.S. state capital you cannot drive to from the rest of the state."] },
  { id: "AZ", name: "Arizona", capital: "Phoenix", regionId: "southwest", nickname: "Grand Canyon State", facts: ["The Grand Canyon is so deep that weather at the rim and the river can feel like two different seasons.", "Arizona does not observe daylight saving time, except on the Navajo Nation."] },
  { id: "AR", name: "Arkansas", capital: "Little Rock", regionId: "southeast", nickname: "Natural State", facts: ["Arkansas is the only place in North America where diamonds are dug from a public park.", "The state’s name comes from a Quapaw word that French explorers wrote down as Arkansas."] },
  { id: "CA", name: "California", capital: "Sacramento", regionId: "west", nickname: "Golden State", facts: ["More people live in California than in any other state.", "Giant sequoias in California are among the largest living trees on Earth."] },
  { id: "CO", name: "Colorado", capital: "Denver", regionId: "west", nickname: "Centennial State", facts: ["Denver is nicknamed the Mile High City because it sits about 5,280 feet above sea level.", "Colorado became a state in 1876, one hundred years after the Declaration of Independence."] },
  { id: "CT", name: "Connecticut", capital: "Hartford", regionId: "northeast", nickname: "Constitution State", facts: ["The first written constitution in America, the Fundamental Orders, came from Connecticut in 1639.", "The lollipop-making machine was invented in New Haven, Connecticut."] },
  { id: "DE", name: "Delaware", capital: "Dover", regionId: "northeast", nickname: "First State", facts: ["Delaware was the first state to approve the U.S. Constitution, on December 7, 1787.", "No spot in Delaware is more than about 8 miles from a tidal shoreline."] },
  { id: "FL", name: "Florida", capital: "Tallahassee", regionId: "southeast", nickname: "Sunshine State", facts: ["Florida is the flattest state — its highest natural point is only 345 feet.", "St. Augustine, Florida, is the oldest continuously settled European city in the United States."] },
  { id: "GA", name: "Georgia", capital: "Atlanta", regionId: "southeast", nickname: "Peach State", facts: ["Georgia grows more peanuts than peaches, even though peaches are on the license plates.", "The Girl Scouts of the USA began in Savannah, Georgia, in 1912."] },
  { id: "HI", name: "Hawaii", capital: "Honolulu", regionId: "west", nickname: "Aloha State", facts: ["Hawaii is the only state made entirely of islands, and it is the farthest from the mainland.", "Mauna Kea is taller than Mount Everest if you measure from the ocean floor."] },
  { id: "ID", name: "Idaho", capital: "Boise", regionId: "west", nickname: "Gem State", facts: ["Idaho grows more potatoes than any other state.", "The state is called the Gem State because dozens of gemstones are found there, including star garnets."] },
  { id: "IL", name: "Illinois", capital: "Springfield", regionId: "midwest", nickname: "Prairie State", facts: ["Abraham Lincoln lived in Springfield, Illinois, before he became president.", "The first McDonald’s restaurant still standing is in Des Plaines, Illinois."] },
  { id: "IN", name: "Indiana", capital: "Indianapolis", regionId: "midwest", nickname: "Hoosier State", facts: ["The Indianapolis 500 is the largest single-day sporting event in the world.", "Santa Claus, Indiana, gets hundreds of thousands of letters each December."] },
  { id: "IA", name: "Iowa", capital: "Des Moines", regionId: "midwest", nickname: "Hawkeye State", facts: ["Iowa grows so much corn that it is sometimes called a sea of green in summer.", "The Iowa State Fair’s butter cow is sculpted fresh each year from hundreds of pounds of butter."] },
  { id: "KS", name: "Kansas", capital: "Topeka", regionId: "midwest", nickname: "Sunflower State", facts: ["Kansas grows more wheat than almost any other state and is famous for sunflowers.", "The geographic center of the 48 contiguous states is near Lebanon, Kansas."] },
  { id: "KY", name: "Kentucky", capital: "Frankfort", regionId: "southeast", nickname: "Bluegrass State", facts: ["Mammoth Cave in Kentucky is the longest known cave system on Earth.", "Kentucky bluegrass is actually green — it looks bluish when it blooms."] },
  { id: "LA", name: "Louisiana", capital: "Baton Rouge", regionId: "southeast", nickname: "Pelican State", facts: ["Louisiana’s parishes are the same idea as counties in other states.", "The Mississippi River ends in a bird-foot-shaped delta in Louisiana."] },
  { id: "ME", name: "Maine", capital: "Augusta", regionId: "northeast", nickname: "Pine Tree State", facts: ["Maine makes more wild blueberries than any other state.", "West Quoddy Head in Maine is the easternmost point in the United States."] },
  { id: "MD", name: "Maryland", capital: "Annapolis", regionId: "northeast", nickname: "Old Line State", facts: ["The U.S. Naval Academy is in Annapolis, Maryland.", "The Baltimore oriole is named for Maryland’s founding family colors, not the other way around."] },
  { id: "MA", name: "Massachusetts", capital: "Boston", regionId: "northeast", nickname: "Bay State", facts: ["The first Thanksgiving feast that people remember today happened in Massachusetts in 1621.", "The fig newton cookie is named after Newton, Massachusetts."] },
  { id: "MI", name: "Michigan", capital: "Lansing", regionId: "midwest", nickname: "Great Lakes State", facts: ["Michigan is the only state that touches four of the five Great Lakes.", "If you look at a map, Michigan’s Lower Peninsula looks a bit like a mitten."] },
  { id: "MN", name: "Minnesota", capital: "Saint Paul", regionId: "midwest", nickname: "North Star State", facts: ["Minnesota’s license plates say “10,000 Lakes,” and the state has even more than that.", "The Mall of America in Bloomington has an indoor theme park in the middle."] },
  { id: "MS", name: "Mississippi", capital: "Jackson", regionId: "southeast", nickname: "Magnolia State", facts: ["The Mississippi River shares its name with the state, but the river’s source is in Minnesota.", "The teddy bear got its name after a Mississippi hunting trip with President Theodore Roosevelt."] },
  { id: "MO", name: "Missouri", capital: "Jefferson City", regionId: "midwest", nickname: "Show-Me State", facts: ["The Gateway Arch in St. Louis is the tallest monument in the United States.", "Ice-cream cones became famous after the 1904 World’s Fair in St. Louis, Missouri."] },
  { id: "MT", name: "Montana", capital: "Helena", regionId: "west", nickname: "Treasure State", facts: ["Montana means “mountain” in Spanish, and the state has both high peaks and wide plains.", "Grasshopper Glacier in Montana holds millions of extinct grasshoppers frozen in ice."] },
  { id: "NE", name: "Nebraska", capital: "Lincoln", regionId: "midwest", nickname: "Cornhusker State", facts: ["Nebraska’s state capitol building has a gold-topped tower you can see for miles.", "Kool-Aid was invented in Hastings, Nebraska, in 1927."] },
  { id: "NV", name: "Nevada", capital: "Carson City", regionId: "west", nickname: "Silver State", facts: ["Nevada is the driest state and is home to a huge stretch of the Mojave Desert.", "The state is called the Silver State because of the famous Comstock Lode silver mines."] },
  { id: "NH", name: "New Hampshire", capital: "Concord", regionId: "northeast", nickname: "Granite State", facts: ["New Hampshire is the first state to hold a presidential primary each election.", "Mount Washington in New Hampshire once recorded a wind of 231 miles per hour."] },
  { id: "NJ", name: "New Jersey", capital: "Trenton", regionId: "northeast", nickname: "Garden State", facts: ["New Jersey has the most diners of any state and is sometimes called the diner capital.", "Thomas Edison’s labs in New Jersey helped invent the light bulb, the phonograph, and movies."] },
  { id: "NM", name: "New Mexico", capital: "Santa Fe", regionId: "southwest", nickname: "Land of Enchantment", facts: ["Santa Fe is the highest state capital, sitting more than 7,000 feet above sea level.", "New Mexico’s state question is “Red or green?” — about chile sauce."] },
  { id: "NY", name: "New York", capital: "Albany", regionId: "northeast", nickname: "Empire State", facts: ["New York City is huge, but the capital is Albany, up the Hudson River.", "The first American pizza restaurant opened in New York City in 1905."] },
  { id: "NC", name: "North Carolina", capital: "Raleigh", regionId: "southeast", nickname: "Tar Heel State", facts: ["The Wright brothers made the first powered airplane flight at Kitty Hawk, North Carolina.", "The Venus flytrap grows wild in only a small part of the Carolinas."] },
  { id: "ND", name: "North Dakota", capital: "Bismarck", regionId: "midwest", nickname: "Peace Garden State", facts: ["The International Peace Garden sits on the border of North Dakota and Canada.", "North Dakota grows more sunflowers for oil than any other state."] },
  { id: "OH", name: "Ohio", capital: "Columbus", regionId: "midwest", nickname: "Buckeye State", facts: ["Seven U.S. presidents were born in Ohio, more than almost any other state.", "The first professional baseball team, the Cincinnati Red Stockings, started in Ohio."] },
  { id: "OK", name: "Oklahoma", capital: "Oklahoma City", regionId: "southwest", nickname: "Sooner State", facts: ["Oklahoma has more man-made lakes than any other state.", "The state name comes from Choctaw words meaning “red people.”"] },
  { id: "OR", name: "Oregon", capital: "Salem", regionId: "west", nickname: "Beaver State", facts: ["Crater Lake in Oregon is the deepest lake in the United States.", "Oregon’s state flag is the only one with a different picture on the back."] },
  { id: "PA", name: "Pennsylvania", capital: "Harrisburg", regionId: "northeast", nickname: "Keystone State", facts: ["The Liberty Bell and Independence Hall are in Philadelphia, Pennsylvania.", "Hershey, Pennsylvania, is a whole town that smells like chocolate."] },
  { id: "RI", name: "Rhode Island", capital: "Providence", regionId: "northeast", nickname: "Ocean State", facts: ["Rhode Island is the smallest state, but it has more than 400 miles of coastline.", "The state is not an island — it was named for an island in Narragansett Bay."] },
  { id: "SC", name: "South Carolina", capital: "Columbia", regionId: "southeast", nickname: "Palmetto State", facts: ["The cabbage palmetto on the flag remembers a fort that cannonballs could not smash.", "Sweetgrass baskets in South Carolina are a Gullah art form older than the United States."] },
  { id: "SD", name: "South Dakota", capital: "Pierre", regionId: "midwest", nickname: "Mount Rushmore State", facts: ["Mount Rushmore shows Washington, Jefferson, Teddy Roosevelt, and Lincoln carved in granite.", "Pierre is one of the least-populated state capitals."] },
  { id: "TN", name: "Tennessee", capital: "Nashville", regionId: "southeast", nickname: "Volunteer State", facts: ["Nashville is called Music City, and the Grand Ole Opry began there as a radio show.", "Tennessee touches eight other states, tied for the most neighbors."] },
  { id: "TX", name: "Texas", capital: "Austin", regionId: "southwest", nickname: "Lone Star State", facts: ["Texas was its own country, the Republic of Texas, before it became a state.", "The capitol building in Austin is taller than the U.S. Capitol in Washington, D.C."] },
  { id: "UT", name: "Utah", capital: "Salt Lake City", regionId: "west", nickname: "Beehive State", facts: ["The Great Salt Lake is saltier than the ocean, so people float extra easily.", "Utah’s five national parks include arches, canyons, and hoodoos that look like stone statues."] },
  { id: "VT", name: "Vermont", capital: "Montpelier", regionId: "northeast", nickname: "Green Mountain State", facts: ["Vermont makes more maple syrup than any other state.", "Montpelier is the smallest state capital by population."] },
  { id: "VA", name: "Virginia", capital: "Richmond", regionId: "southeast", nickname: "Old Dominion", facts: ["Eight U.S. presidents were born in Virginia, including George Washington and Thomas Jefferson.", "The first permanent English settlement in America was Jamestown, Virginia, in 1607."] },
  { id: "WA", name: "Washington", capital: "Olympia", regionId: "west", nickname: "Evergreen State", facts: ["Washington is the only state named after a president.", "It grows more apples than any other state."] },
  { id: "WV", name: "West Virginia", capital: "Charleston", regionId: "southeast", nickname: "Mountain State", facts: ["West Virginia became a state during the Civil War, in 1863.", "The New River Gorge Bridge was once the longest steel-arch bridge in the Western Hemisphere."] },
  { id: "WI", name: "Wisconsin", capital: "Madison", regionId: "midwest", nickname: "Badger State", facts: ["Wisconsin is famous for cheese, and people there are nicknamed cheeseheads.", "The first kindergarten in the United States opened in Watertown, Wisconsin."] },
  { id: "WY", name: "Wyoming", capital: "Cheyenne", regionId: "west", nickname: "Equality State", facts: ["Yellowstone, mostly in Wyoming, was the world’s first national park.", "Wyoming was the first place in the U.S. where women could vote."] },
];

export const STATE_BY_ID: Record<string, StateInfo> = Object.fromEntries(STATES.map((s) => [s.id, s]));

export const REGION_STATES: Record<Exclude<RegionId, "all">, string[]> = {
  northeast: STATES.filter((s) => s.regionId === "northeast").map((s) => s.id),
  southeast: STATES.filter((s) => s.regionId === "southeast").map((s) => s.id),
  midwest: STATES.filter((s) => s.regionId === "midwest").map((s) => s.id),
  southwest: STATES.filter((s) => s.regionId === "southwest").map((s) => s.id),
  west: STATES.filter((s) => s.regionId === "west").map((s) => s.id),
};

export function getState(id: string): StateInfo {
  const state = STATE_BY_ID[id];
  if (!state) throw new Error(`Unknown state ${id}`);
  return state;
}

export function statesIn(ids: string[]): StateInfo[] {
  return ids.map(getState);
}

