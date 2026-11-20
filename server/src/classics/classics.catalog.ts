// Hand-picked Internet Archive films. A keyword filter on the Archive's own listings let through
// films with nudity and uploads that are still under copyright, so only these titles are served:
// each is public domain (or freely licensed) and has no sexual content.

export interface CatalogEntry {
  id: string;
  title: string;
  year: number;
}

const entry = (id: string, title: string, year: number): CatalogEntry => ({
  id,
  title,
  year,
});

export const CATALOG = {
  classics: [
    entry('his_girl_friday', 'His Girl Friday', 1940),
    entry('charlie_chaplin_film_fest', 'Charlie Chaplin Festival', 1938),
    entry('meet_john_doe', 'Meet John Doe', 1941),
    entry('TheStranger_0', 'The Stranger', 1946),
    entry('JungleBook', 'Jungle Book', 1942),
    entry('gullivers_travels1939', "Gulliver's Travels", 1939),
    entry('TheMostDangerousGame', 'The Most Dangerous Game', 1932),
    entry('penny_serenade', 'Penny Serenade', 1941),
    entry('lost_world', 'The Lost World', 1925),
    entry('mclintok_widescreen', 'McLintock!', 1963),
    entry('suddenly', 'Suddenly', 1954),
    entry('dressed_to_kill', 'Sherlock Holmes: Dressed to Kill', 1946),
    entry('20000LeaguesUndertheSea', '20,000 Leagues Under the Sea', 1916),
    entry('angel_on_my_shoulder', 'Angel on My Shoulder', 1946),
    entry('ScarletStreet', 'Scarlet Street', 1945),
    entry('The_Pied_Piper_of_Hamelin', 'The Pied Piper of Hamelin', 1957),
    entry('royal_wedding', 'Royal Wedding', 1951),
    entry('amazing_adventure', 'The Amazing Adventure', 1936),
    entry('abraham_lincoln', 'Abraham Lincoln', 1930),
    entry('Sita_Sings_the_Blues', 'Sita Sings the Blues', 2008),
  ],
  horror: [
    entry('ThePhantomoftheOpera', 'The Phantom of the Opera', 1925),
    entry('Nosferatu_most_complete_version_93_mins.', 'Nosferatu', 1922),
    entry('The_House_On_Haunted_Hill', 'House on Haunted Hill', 1959),
    entry('CarnivalofSouls', 'Carnival of Souls', 1962),
    entry(
      'DasKabinettdesDoktorCaligariTheCabinetofDrCaligari',
      'The Cabinet of Dr. Caligari',
      1919,
    ),
    entry('WhiteZombie', 'White Zombie', 1932),
    entry('Horror_Express', 'Horror Express', 1972),
    entry('Horror_Hotel', 'Horror Hotel', 1960),
    entry('TheGhoul', 'The Ghoul', 1933),
    entry('King_of_the_Zombies', 'King of the Zombies', 1941),
    entry('Little_ShopOf_Horrors.avi', 'The Little Shop of Horrors', 1960),
    entry('cco_attackofthegiantleeches', 'Attack of the Giant Leeches', 1959),
    entry('FrankensteinfullMovie', 'Frankenstein', 1910),
  ],
  comedy: [
    entry('charlie_chaplin_film_fest', 'Charlie Chaplin Festival', 1938),
    entry('his_girl_friday', 'His Girl Friday', 1940),
    entry('TheFlyingDeuces', 'Laurel & Hardy: The Flying Deuces', 1939),
    entry('AfricaScreams', 'Abbott & Costello: Africa Screams', 1949),
    entry(
      'cco_jackandthebeanstalk',
      'Abbott & Costello: Jack and the Beanstalk',
      1952,
    ),
    entry(
      'disorder_in_the_court',
      'The Three Stooges: Disorder in the Court',
      1936,
    ),
    entry('brideless_groom', 'The Three Stooges: Brideless Groom', 1947),
    entry(
      'sing_a_song_of_six_pants',
      'The Three Stooges: Sing a Song of Six Pants',
      1947,
    ),
    entry('my_favorite_brunette', 'My Favorite Brunette', 1947),
    entry('AtWarWithTheArmy', 'At War with the Army', 1950),
    entry('mr_robinson_crusoe', 'Mr. Robinson Crusoe', 1932),
    entry('Little_ShopOf_Horrors.avi', 'The Little Shop of Horrors', 1960),
    entry('behave_yourself_ipod', 'Behave Yourself!', 1951),
    entry('private_snuffy_smith', 'Private Snuffy Smith', 1942),
    entry('westofhotdog', 'West of Hot Dog', 1924),
    entry('royal_wedding', 'Royal Wedding', 1951),
  ],
  scifi: [
    entry('Killers_from_space', 'Killers from Space', 1954),
    entry('teenagers_from_outerspace', 'Teenagers from Outer Space', 1959),
    entry('giant_gila_monster', 'The Giant Gila Monster', 1959),
    entry('The_Wasp_Women', 'The Wasp Woman', 1959),
    entry('lost_world', 'The Lost World', 1925),
    entry('transatlantic_tunnel', 'Transatlantic Tunnel', 1935),
    entry('20000LeaguesUndertheSea', '20,000 Leagues Under the Sea', 1916),
    entry('WarningFromSpaceImproved1', 'Warning from Space', 1956),
    entry(
      'MonsterFromAPrehistoricPlanet',
      'Monster from a Prehistoric Planet',
      1967,
    ),
    entry('EvilBrainFromOuterSpace', 'Evil Brain from Outer Space', 1964),
    entry('HorrorsOfTheRedPlanet', 'Horrors of the Red Planet', 1965),
    entry('CaptainZ-Ro', 'Captain Z-Ro', 1955),
    entry('StarWreckInThePirkining', 'Star Wreck: In the Pirkining', 2005),
  ],
} satisfies Record<string, CatalogEntry[]>;

// Free, openly licensed film used by the Play button on titles we can't stream
export const DEMO_ENTRY = entry('BigBuckBunny_124', 'Big Buck Bunny', 2008);

export const CATALOG_BY_ID = new Map<string, CatalogEntry>(
  [...Object.values(CATALOG).flat(), DEMO_ENTRY].map((e) => [e.id, e]),
);
