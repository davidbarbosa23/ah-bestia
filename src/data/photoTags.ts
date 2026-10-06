import type { Lang } from '../i18n/content';

export const photoTags = [
  'portrait',
  'people',
  'action',
  'car',
  'street',
  'nature',
  'architecture',
  'animals',
  'bicycle',
  'motorcycle',
  'travel',
  'detail',
  'editorial',
  'black-and-white',
] as const;
export type PhotoTag = (typeof photoTags)[number];

interface PhotoAnnotation {
  tags: readonly PhotoTag[];
  alt: Record<Lang, string>;
}

const photo = (tags: PhotoTag[], en: string, es: string): PhotoAnnotation => ({
  tags,
  alt: { en, es },
});

// Visually reviewed source images. Keys are folder/filename, never inferred from filenames.
// Add an annotation here when adding an archive photograph; magazine pages are separate.
export const photoAnnotations: Record<string, PhotoAnnotation> = {
  'spain/Bilbao_Bridge.jpg': photo(
    ['architecture', 'travel', 'black-and-white'],
    'Curved bridge railings and diagonal cables in Bilbao',
    'Barandillas curvas y cables diagonales de un puente en Bilbao',
  ),
  'spain/Bilbao_Rail.jpg': photo(
    ['travel', 'nature'],
    'Red funicular above branching tracks surrounded by trees',
    'Funicular rojo sobre vías que se bifurcan entre árboles',
  ),
  'spain/Boats.jpg': photo(
    ['nature', 'travel'],
    'Sailboats anchored in a blue coastal bay',
    'Veleros anclados en una bahía azul',
  ),
  'spain/Cadavedo_La_Regalina.jpg': photo(
    ['nature', 'architecture', 'travel'],
    'Traditional raised granary overlooking the cliffs at Cadavedo',
    'Hórreo tradicional frente a los acantilados de Cadavedo',
  ),
  'spain/Cadavedo_Playa.jpg': photo(
    ['nature', 'animals', 'travel'],
    'Seabird flying above a rocky coastline',
    'Ave marina volando sobre una costa rocosa',
  ),
  'spain/Canyon.jpg': photo(
    ['bicycle', 'detail', 'travel'],
    'Close view of a white Canyon bicycle frame and handlebar',
    'Detalle del cuadro y manillar de una bicicleta Canyon blanca',
  ),
  'spain/Centro_Cidade.jpg': photo(
    ['street', 'detail', 'travel'],
    'City-center direction sign beneath a clear blue sky',
    'Señal hacia el centro de la ciudad bajo un cielo azul',
  ),
  'spain/Covadonga.jpg': photo(
    ['animals', 'nature', 'travel'],
    'Cow standing beside a mountain lake in Covadonga',
    'Vaca junto a un lago de montaña en Covadonga',
  ),
  'spain/Crossing.jpg': photo(
    ['architecture', 'travel', 'people'],
    'Underside of a bridge reflected in still water',
    'Parte inferior de un puente reflejada en agua tranquila',
  ),
  'spain/Estacion_Del_Norte.jpg': photo(
    ['street', 'architecture', 'travel', 'people'],
    'Silhouetted passerby in front of a railway station facade',
    'Silueta de una persona frente a la fachada de una estación',
  ),
  'spain/Heno.jpg': photo(
    ['nature', 'travel'],
    'Hay bales in a sunlit harvested field',
    'Pacas de heno en un campo cosechado al sol',
  ),
  'spain/Light.jpg': photo(
    ['street', 'architecture', 'detail', 'travel'],
    'Ornate street lamp against warm stone facades',
    'Farola decorada frente a fachadas de piedra cálida',
  ),
  'spain/Madrid_Basilica.jpg': photo(
    ['street', 'architecture', 'car', 'travel', 'black-and-white'],
    'Small car passing the stone arches of a basilica in Madrid',
    'Auto pequeño frente a los arcos de una basílica en Madrid',
  ),
  'spain/Madrid_Central_Bird.jpg': photo(
    ['street', 'architecture', 'animals', 'travel'],
    'Pigeon flying in front of a Madrid church tower',
    'Paloma volando frente a la torre de una iglesia en Madrid',
  ),
  'spain/Madrir_Real_Basilica.jpg': photo(
    ['architecture', 'travel', 'people'],
    'Wedding ceremony along a red aisle inside an ornate basilica',
    'Ceremonia de boda sobre un pasillo rojo en una basílica ornamentada',
  ),
  'spain/Market.jpg': photo(
    ['street', 'travel'],
    'Dim market passage framed by illuminated shop signs',
    'Pasillo de mercado en penumbra con letreros iluminados',
  ),
  'spain/Musk_Deer.jpg': photo(
    ['animals', 'nature', 'travel'],
    'Deer crossing a golden field near the edge of a forest',
    'Ciervo cruzando un campo dorado junto al bosque',
  ),
  'spain/Renfe.jpg': photo(
    ['street', 'travel'],
    'Red and white Renfe train beside a station platform',
    'Tren Renfe rojo y blanco junto al andén',
  ),
  'spain/San_Juan_De_Gaztelugatxe.jpg': photo(
    ['nature', 'architecture', 'travel'],
    'Winding coastal path to the rocky island of San Juan de Gaztelugatxe',
    'Camino costero hacia el islote rocoso de San Juan de Gaztelugatxe',
  ),
  'spain/Santiago_De_Compostela.jpg': photo(
    ['street', 'architecture', 'travel'],
    'Cathedral tower framed by a narrow street in Santiago de Compostela',
    'Torre de la catedral entre calles estrechas de Santiago de Compostela',
  ),
  'spain/Segovia_Alcazar.jpg': photo(
    ['architecture', 'nature', 'travel'],
    'Aerial view of the Alcázar and its wooded surroundings in Segovia',
    'Vista aérea del Alcázar y sus alrededores arbolados en Segovia',
  ),
  'spain/Segovia_Catedral.jpg': photo(
    ['architecture', 'travel'],
    'Aerial view of Segovia cathedral among dense city rooftops',
    'Vista aérea de la catedral de Segovia entre tejados urbanos',
  ),
  'spain/Segovia.jpg': photo(
    ['architecture', 'street', 'travel', 'black-and-white'],
    'Stone aqueduct arches above a street in Segovia',
    'Arcos del acueducto de piedra sobre una calle de Segovia',
  ),
  'spain/Tossa_De_Mar.jpg': photo(
    ['nature', 'architecture', 'travel'],
    'Seaside fortress above the turquoise water at Tossa de Mar',
    'Fortaleza costera sobre el agua turquesa de Tossa de Mar',
  ),

  'random/Building.jpg': photo(
    ['architecture'],
    'Tall modern buildings among dense city blocks',
    'Edificios modernos altos entre manzanas urbanas',
  ),
  'random/Cards.jpg': photo(
    ['detail', 'black-and-white'],
    'Ace of spades resting above scattered playing cards',
    'As de picas sobre cartas de juego dispersas',
  ),
  'random/Chopper_Bike.jpg': photo(
    ['bicycle'],
    'Green chopper bicycle with extended front forks',
    'Bicicleta chopper verde con horquilla delantera alargada',
  ),
  'random/Church.jpg': photo(
    ['architecture', 'street'],
    'Church spire above city rooftops in warm evening light',
    'Torre de iglesia sobre los tejados con luz cálida de la tarde',
  ),
  'random/Clouds.jpg': photo(
    ['nature', 'architecture'],
    'Bright clouds rising behind a communications tower',
    'Nubes iluminadas detrás de una torre de comunicaciones',
  ),
  'random/Crew_District.jpg': photo(
    ['bicycle', 'detail', 'black-and-white'],
    'Black Crew bicycle frame and wheels against a white background',
    'Cuadro y ruedas de bicicleta Crew negra sobre fondo blanco',
  ),
  'random/Crossing.jpg': photo(
    ['street', 'action', 'people'],
    'Cyclist moving through a pedestrian crossing at night',
    'Ciclista pasando por un cruce peatonal de noche',
  ),
  'random/Helicopter_Moon.jpg': photo(
    ['nature', 'action'],
    'Helicopter below a bright moon in a blue sky',
    'Helicóptero bajo una luna brillante en un cielo azul',
  ),
  'random/Les_Paul_100.jpg': photo(
    ['detail'],
    'Golden electric guitar body with strings and control knobs',
    'Cuerpo dorado de guitarra eléctrica con cuerdas y controles',
  ),
  'random/Market.jpg': photo(
    ['street', 'black-and-white', 'people'],
    'Crowded market street beneath a web of overhead cables',
    'Calle de mercado concurrida bajo una red de cables',
  ),
  'random/Mundo_Aventura.jpg': photo(
    ['architecture', 'street'],
    'Neon-lit amusement ride against the night sky',
    'Atracción de parque iluminada con neón bajo el cielo nocturno',
  ),
  'random/Sunset_Moon.jpg': photo(
    ['nature'],
    'Golden moon partially covered by dark clouds',
    'Luna dorada parcialmente cubierta por nubes oscuras',
  ),
  'random/Sunset_Plane.jpg': photo(
    ['nature'],
    'Distant airplane against golden sunset clouds',
    'Avión distante entre nubes doradas al atardecer',
  ),

  'autodromo/Corsa.jpg': photo(
    ['car'],
    'Turquoise race car parked in the circuit paddock',
    'Auto de carreras turquesa estacionado en el paddock',
  ),
  'autodromo/Corvette.jpg': photo(
    ['car', 'action'],
    'Blue Corvette moving along a race track',
    'Corvette azul recorriendo una pista de carreras',
  ),
  'autodromo/Corvette_2.jpg': photo(
    ['car'],
    'Blue Corvette seen from above on dark pavement',
    'Corvette azul visto desde arriba sobre pavimento oscuro',
  ),
  'autodromo/Datsun.jpg': photo(
    ['car', 'action'],
    'Yellow Datsun racing past blurred trackside scenery',
    'Datsun amarillo pasando junto al paisaje desenfocado de la pista',
  ),
  'autodromo/Datsun_2.jpg': photo(
    ['car'],
    'Yellow classic Datsun parked among other cars',
    'Datsun clásico amarillo estacionado entre otros autos',
  ),
  'autodromo/Performance.jpg': photo(
    ['car', 'action'],
    'Open-cockpit race car speeding along the circuit',
    'Auto de carreras de cabina abierta recorriendo el circuito',
  ),

  'campeonato-distrital-mxac/01.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Motocross riders racing together on a dirt track',
    'Pilotos de motocross compitiendo sobre una pista de tierra',
  ),
  'campeonato-distrital-mxac/02.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Motocross rider approaching through a cloud of dust',
    'Piloto de motocross acercándose entre una nube de polvo',
  ),
  'campeonato-distrital-mxac/03.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Two motocross riders rounding a wooded dirt course',
    'Dos pilotos de motocross recorriendo una pista entre árboles',
  ),
  'campeonato-distrital-mxac/04.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Motocross rider airborne against the blue sky',
    'Piloto de motocross en el aire frente al cielo azul',
  ),
  'campeonato-distrital-mxac/05.jpg': photo(
    ['motorcycle', 'people'],
    'Helmeted riders waiting beside their dirt bikes',
    'Pilotos con casco esperando junto a sus motos',
  ),
  'campeonato-distrital-mxac/06.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Motocross rider lifting off a dusty jump',
    'Piloto de motocross despegando de un salto polvoriento',
  ),
  'campeonato-distrital-mxac/07.jpg': photo(
    ['action', 'motorcycle', 'people'],
    'Motocross rider suspended above the track',
    'Piloto de motocross suspendido sobre la pista',
  ),
  'campeonato-distrital-mxac/08.jpg': photo(
    ['bicycle'],
    'Bicycles parked on grass beside an event banner',
    'Bicicletas estacionadas sobre el césped junto a una bandera del evento',
  ),

  'bikes/3T_Back.jpg': photo(
    ['bicycle', 'detail'],
    'Rear frame junction of a red 3T bicycle',
    'Unión trasera del cuadro de una bicicleta 3T roja',
  ),
  'bikes/3T_Brand.jpg': photo(
    ['bicycle', 'detail'],
    '3T logo on a red bicycle head tube',
    'Logotipo 3T sobre el tubo frontal de una bicicleta roja',
  ),
  'bikes/3T_Crank.jpg': photo(
    ['bicycle', 'detail'],
    'Crank and chainring of a red 3T bicycle',
    'Bielas y plato de una bicicleta 3T roja',
  ),
  'bikes/3T_Derailleur.jpg': photo(
    ['bicycle', 'detail'],
    'Rear derailleur and cassette of a red 3T bicycle',
    'Desviador trasero y cassette de una bicicleta 3T roja',
  ),
  'bikes/3T_Front.jpg': photo(
    ['bicycle', 'detail'],
    'Front fork and wheel of a red 3T bicycle',
    'Horquilla y rueda delantera de una bicicleta 3T roja',
  ),
  'bikes/3T_Full.jpg': photo(
    ['bicycle'],
    'Full red 3T bicycle photographed against a dark background',
    'Bicicleta 3T roja completa sobre fondo oscuro',
  ),
  'bikes/3T_Handlebar.jpg': photo(
    ['bicycle', 'detail'],
    'Drop handlebar and head tube of a red 3T bicycle',
    'Manillar curvo y tubo frontal de una bicicleta 3T roja',
  ),
  'bikes/3T_Pedal.jpg': photo(
    ['bicycle', 'detail'],
    'Pedal beside the frame of a red 3T bicycle',
    'Pedal junto al cuadro de una bicicleta 3T roja',
  ),
  'bikes/3T_Rear-Wheel.jpg': photo(
    ['bicycle', 'detail'],
    'Rear wheel and drivetrain of a red 3T bicycle',
    'Rueda trasera y transmisión de una bicicleta 3T roja',
  ),
  'bikes/3T_Saddle.jpg': photo(
    ['bicycle', 'detail'],
    'Saddle and top tube of a red 3T bicycle',
    'Sillín y tubo superior de una bicicleta 3T roja',
  ),
  'bikes/Teek_Derailleur.jpg': photo(
    ['bicycle', 'detail'],
    'Rear derailleur of a silver Trek bicycle',
    'Desviador trasero de una bicicleta Trek plateada',
  ),
  'bikes/Trek_Crank.jpg': photo(
    ['bicycle', 'detail'],
    'Crankset and chainrings of a silver Trek bicycle',
    'Bielas y platos de una bicicleta Trek plateada',
  ),
  'bikes/Trek_Disc.jpg': photo(
    ['bicycle', 'detail'],
    'Disc brake rotor on a Trek bicycle wheel',
    'Disco de freno en la rueda de una bicicleta Trek',
  ),
  'bikes/Trek_Frame.jpg': photo(
    ['bicycle', 'detail'],
    'Silver Trek frame with its model lettering',
    'Cuadro Trek plateado con el nombre del modelo',
  ),
  'bikes/Trek_Front.jpg': photo(
    ['bicycle', 'detail'],
    'Front fork of a silver Trek bicycle',
    'Horquilla delantera de una bicicleta Trek plateada',
  ),
  'bikes/Trek_Full.jpg': photo(
    ['bicycle'],
    'Full silver Trek bicycle photographed against a dark background',
    'Bicicleta Trek plateada completa sobre fondo oscuro',
  ),
  'bikes/Trek_Handlebar.jpg': photo(
    ['bicycle', 'detail'],
    'Drop handlebar and front cables of a Trek bicycle',
    'Manillar curvo y cables delanteros de una bicicleta Trek',
  ),
  'bikes/Trek_Rear-Wheel.jpg': photo(
    ['bicycle', 'detail'],
    'Rear wheel and spokes of a silver Trek bicycle',
    'Rueda trasera y radios de una bicicleta Trek plateada',
  ),
  'bikes/Trek_Saddle.jpg': photo(
    ['bicycle', 'detail'],
    'Saddle above the silver frame of a Trek bicycle',
    'Sillín sobre el cuadro plateado de una bicicleta Trek',
  ),
  'bikes/Trek_Sensor.jpg': photo(
    ['bicycle', 'detail'],
    'Sensor mounted beside a Trek bicycle crank',
    'Sensor montado junto a las bielas de una bicicleta Trek',
  ),

  'dogs/01.jpg': photo(
    ['portrait', 'animals'],
    'Spotted puppy looking down in soft light',
    'Cachorro moteado mirando hacia abajo con luz suave',
  ),
  'dogs/02.jpg': photo(
    ['portrait', 'animals'],
    'Spotted puppy standing on a pale blanket',
    'Cachorro moteado sobre una manta clara',
  ),
  'dogs/03.jpg': photo(
    ['portrait', 'animals'],
    'Tan puppy sitting upright beside a blanket',
    'Cachorro café sentado junto a una manta',
  ),
  'dogs/04.jpg': photo(
    ['portrait', 'animals'],
    'Tan puppy looking up in profile',
    'Cachorro café mirando hacia arriba de perfil',
  ),
  'dogs/05.jpg': photo(
    ['portrait', 'animals'],
    'Brown and white puppy tilting its face upward',
    'Cachorro blanco y café levantando la cara',
  ),
  'dogs/06.jpg': photo(
    ['portrait', 'animals'],
    'Brown and white puppy resting its chin on a blanket',
    'Cachorro blanco y café apoyando la barbilla sobre una manta',
  ),
  'dogs/07.jpg': photo(
    ['portrait', 'animals'],
    'Black puppy facing the camera',
    'Cachorro negro frente a la cámara',
  ),
  'dogs/08.jpg': photo(
    ['portrait', 'animals'],
    'Black puppy resting on a blanket in profile',
    'Cachorro negro descansando de perfil sobre una manta',
  ),
  'dogs/09.jpg': photo(
    ['portrait', 'animals'],
    'Dark brown puppy sitting in soft side light',
    'Cachorro café oscuro sentado con luz lateral suave',
  ),
  'dogs/10.jpg': photo(
    ['portrait', 'animals'],
    'Brown puppy looking directly at the camera',
    'Cachorro café mirando directamente a la cámara',
  ),
  'dogs/11.jpg': photo(
    ['portrait', 'animals'],
    'White puppy sitting upright on a blanket',
    'Cachorro blanco sentado sobre una manta',
  ),
  'dogs/12.jpg': photo(
    ['portrait', 'animals'],
    'White puppy lifting its nose toward the light',
    'Cachorro blanco levantando la nariz hacia la luz',
  ),
  'dogs/13.jpg': photo(
    ['portrait', 'animals'],
    'Two puppies nuzzling together on a blanket',
    'Dos cachorros juntos sobre una manta',
  ),
  'dogs/14.jpg': photo(
    ['portrait', 'animals'],
    'White puppy sitting in a patch of sunlight',
    'Cachorro blanco sentado en un rayo de sol',
  ),
  'dogs/15.jpg': photo(
    ['portrait', 'animals'],
    'Dark puppy with ears lit from behind',
    'Cachorro oscuro con las orejas iluminadas desde atrás',
  ),
  'dogs/16.jpg': photo(
    ['animals'],
    'Puppies sleeping together on a soft blanket',
    'Cachorros durmiendo juntos sobre una manta suave',
  ),

  'Aroma-Colombiano/Aroma_Colombiano.jpg': photo(
    ['portrait', 'people'],
    'Aroma Colombiano musicians posing together with their instruments',
    'Músicos de Aroma Colombiano posando juntos con sus instrumentos',
  ),
  'Aroma-Colombiano/Bass.jpg': photo(
    ['detail'],
    'Warm wooden body and strings of a double bass',
    'Cuerpo de madera cálida y cuerdas de un contrabajo',
  ),
  'Aroma-Colombiano/Cris.jpg': photo(
    ['portrait', 'people'],
    'Musician holding percussion instruments against a gray backdrop',
    'Músico con instrumentos de percusión sobre fondo gris',
  ),
  'Aroma-Colombiano/Fede.jpg': photo(
    ['portrait', 'people'],
    'Musician holding a small stringed instrument over his shoulder',
    'Músico con un instrumento de cuerdas pequeño sobre el hombro',
  ),
  'Aroma-Colombiano/Juli.jpg': photo(
    ['portrait', 'people'],
    'Singer in a colorful floral outfit against a gray backdrop',
    'Cantante con vestido floral de colores sobre fondo gris',
  ),
  'Aroma-Colombiano/Santi.jpg': photo(
    ['portrait', 'people'],
    'Musician holding a clarinet against a gray backdrop',
    'Músico con clarinete sobre fondo gris',
  ),
  'Aroma-Colombiano/Sebass.jpg': photo(
    ['portrait', 'people'],
    'Double bass player behind his instrument',
    'Contrabajista detrás de su instrumento',
  ),

  'Self-Portrait/01.jpg': photo(
    ['portrait', 'people'],
    'Self portrait wearing glasses in bright side light',
    'Autorretrato con gafas y luz lateral intensa',
  ),
  'Self-Portrait/02.jpg': photo(
    ['portrait', 'people'],
    'Self portrait wearing glasses against a dark background',
    'Autorretrato con gafas sobre fondo oscuro',
  ),
  'Self-Portrait/03.jpg': photo(
    ['portrait', 'people'],
    'Close self portrait wearing a cap and glasses',
    'Autorretrato cercano con gorra y gafas',
  ),
  'Self-Portrait/04.jpg': photo(
    ['portrait', 'people'],
    'Self portrait wearing a dark cap against a pale background',
    'Autorretrato con gorra oscura sobre fondo claro',
  ),

  'friends/Dani/01.jpg': photo(
    ['portrait', 'people'],
    'Close studio portrait in a dark shirt against a gray backdrop',
    'Retrato cercano de estudio con camiseta oscura sobre fondo gris',
  ),
  'friends/Dani/02.jpg': photo(
    ['portrait', 'people'],
    'Smiling seated portrait in a white tank top with tattooed arms crossed',
    'Retrato sentado sonriendo con camiseta blanca sin mangas y brazos tatuados cruzados',
  ),
  'friends/Dani/03.jpg': photo(
    ['portrait', 'people'],
    'Studio portrait sitting cross-legged on a stool in a white tank top',
    'Retrato de estudio sentado con las piernas cruzadas sobre un taburete y camiseta blanca sin mangas',
  ),
  'friends/Dani/04.jpg': photo(
    ['portrait', 'people', 'black-and-white'],
    'Black-and-white close portrait with rim light outlining the head and shoulders',
    'Retrato cercano en blanco y negro con luz de contorno en la cabeza y los hombros',
  ),

  'friends/Rola/1001.jpg': photo(
    ['bicycle', 'action', 'people'],
    'Helmeted cyclist riding a road bicycle past a blurred wooded hillside',
    'Ciclista con casco en una bicicleta de ruta frente a una ladera arbolada desenfocada',
  ),
  'friends/Rola/1010.jpg': photo(
    ['portrait', 'people', 'bicycle'],
    'Seated portrait in cycling clothes and yellow-tinted glasses with a bicycle behind',
    'Retrato sentada con ropa de ciclismo y gafas amarillas, con una bicicleta detrás',
  ),
  'friends/Rola/1011.jpg': photo(
    ['portrait', 'people', 'bicycle'],
    'Smiling seated portrait resting the chin on one hand with a bicycle behind',
    'Retrato sentada sonriendo con el mentón apoyado en una mano y una bicicleta detrás',
  ),
  'friends/Rola/1020.jpg': photo(
    ['portrait', 'people'],
    'Seated portrait in a purple tank top and yellow-tinted glasses with one hand in the hair',
    'Retrato sentada con camiseta morada sin mangas y gafas amarillas, con una mano en el cabello',
  ),
  'friends/Rola/1021.jpg': photo(
    ['portrait', 'people'],
    'Close smiling portrait in yellow-tinted glasses with a hand resting against the forehead',
    'Retrato cercano sonriendo con gafas amarillas y una mano apoyada en la frente',
  ),
  'friends/Rola/1022.jpg': photo(
    ['portrait', 'people'],
    'Portrait looking to one side in yellow-tinted glasses under blue side light',
    'Retrato mirando hacia un lado con gafas amarillas y luz lateral azul',
  ),
  'friends/Rola/1023.jpg': photo(
    ['portrait', 'people'],
    'Seated portrait tilting the head onto one hand in yellow-tinted glasses',
    'Retrato sentada inclinando la cabeza sobre una mano con gafas amarillas',
  ),
  'friends/Rola/1024.jpg': photo(
    ['portrait', 'people'],
    'Seated studio portrait looking to one side with a hand near the chin',
    'Retrato de estudio sentada mirando hacia un lado con una mano cerca del mentón',
  ),
  'friends/Rola/1025.jpg': photo(
    ['portrait', 'people'],
    'Seated portrait looking upward with one hand beside yellow-tinted glasses',
    'Retrato sentada mirando hacia arriba con una mano junto a las gafas amarillas',
  ),
  'friends/Rola/1026.jpg': photo(
    ['portrait', 'people'],
    'Portrait adjusting yellow-tinted glasses with both hands against a dark backdrop',
    'Retrato ajustando las gafas amarillas con ambas manos sobre fondo oscuro',
  ),
  'friends/Rola/1027.jpg': photo(
    ['portrait', 'people'],
    'Close portrait in a black high-neck top and yellow-tinted glasses with blue side light',
    'Retrato cercano con blusa negra de cuello alto, gafas amarillas y luz lateral azul',
  ),

  'pets/Achira.jpg': photo(
    ['portrait', 'animals'],
    'Tabby kitten looking up toward the camera against a dark background',
    'Gatita atigrada mirando hacia la cámara sobre fondo oscuro',
  ),
  'pets/_A741246.jpg': photo(
    ['portrait', 'animals'],
    'White dog with pale blue eyes resting on a dark seat',
    'Perro blanco de ojos azul claro descansando sobre un asiento oscuro',
  ),
  'pets/Teddy.jpg': photo(
    ['portrait', 'animals'],
    'Small black and tan dog looking directly at the camera',
    'Perro pequeño negro y café mirando a la cámara',
  ),
  'pets/Toby.jpg': photo(
    ['portrait', 'animals'],
    'Close profile of an orange tabby cat',
    'Perfil cercano de un gato naranja atigrado',
  ),

  'friends/Juli/01.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Close portrait in a straw cowboy hat and green dress, looking to one side',
    'Retrato cercano con sombrero vaquero de paja y vestido verde, mirando hacia un lado',
  ),
  'friends/Juli/02.jpg': photo(
    ['portrait', 'people'],
    'Full-length studio portrait in a green dress, holding the brim of a cowboy hat',
    'Retrato de estudio de cuerpo entero con vestido verde, sujetando el ala de un sombrero vaquero',
  ),
  'friends/Juli/04.jpg': photo(
    ['portrait', 'editorial', 'black-and-white', 'people'],
    'Black-and-white seated portrait looking to one side against a dark backdrop',
    'Retrato en blanco y negro sentada mirando hacia un lado sobre fondo oscuro',
  ),
  'friends/Juli/05.jpg': photo(
    ['portrait', 'editorial', 'black-and-white', 'people'],
    'Black-and-white portrait reclining on a dark surface with an outstretched arm',
    'Retrato en blanco y negro recostada sobre una superficie oscura con el brazo extendido',
  ),
  'friends/Juli/06.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Seated studio portrait holding a straw cowboy hat against the body',
    'Retrato de estudio sentada sosteniendo un sombrero vaquero de paja contra el cuerpo',
  ),
  'friends/Juli/03.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Seated portrait wearing a straw cowboy hat in soft side light',
    'Retrato sentada con sombrero vaquero de paja y luz lateral suave',
  ),
  'friends/Juli/07.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Seated portrait facing the camera with hands resting on a straw hat',
    'Retrato sentada frente a la cámara con las manos sobre un sombrero de paja',
  ),
  'friends/Juli/08.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Seated portrait touching a cowboy hat with diagonal red and green motion trails',
    'Retrato sentada tocando un sombrero vaquero con estelas diagonales de movimiento rojas y verdes',
  ),
  'friends/Juli/09.jpg': photo(
    ['portrait', 'editorial', 'people'],
    'Seated portrait holding a cowboy hat with both hands under red and green light',
    'Retrato sentada sujetando un sombrero vaquero con ambas manos bajo luz roja y verde',
  ),
};
