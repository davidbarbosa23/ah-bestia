import type { Lang } from '../i18n/content';
import type { GalleryImage } from './photoGalleries';

interface StoryPhoto {
  filename: string;
  alt: Record<Lang, string>;
}

type StorySpread =
  | { layout: 'pair'; photos: [StoryPhoto, StoryPhoto] }
  | { layout: 'feature' | 'wide'; photos: [StoryPhoto] };

export interface PhotoStorySpread {
  layout: StorySpread['layout'];
  photos: (GalleryImage & { alt: Record<Lang, string> })[];
}

const photograph = (filename: string, en: string, es: string): StoryPhoto => ({ filename, alt: { en, es } });
const pair = (first: StoryPhoto, second: StoryPhoto): StorySpread => ({ layout: 'pair', photos: [first, second] });
const feature = (photo: StoryPhoto): StorySpread => ({ layout: 'feature', photos: [photo] });
const wide = (photo: StoryPhoto): StorySpread => ({ layout: 'wide', photos: [photo] });

// Authored reading order. Pairings follow subject, light, and visual geometry;
// a single frame marks a change of pace. Filenames identify assets, not captions.
const stories: Record<string, StorySpread[]> = {
  'spain-in-transit': [
    pair(
      photograph('Crossing.jpg', 'A person crossing beneath the angular concrete spans of a bridge.', 'Una persona cruza bajo los tramos angulares de un puente de hormigón.'),
      photograph('Bilbao_Bridge.jpg', 'Diagonal bridge ribs cast striped shadows across a walkway.', 'Las vigas diagonales de un puente proyectan sombras sobre una pasarela.'),
    ),
    pair(
      photograph('Estacion_Del_Norte.jpg', 'Passing silhouettes frame the clock on a railway station facade.', 'Las siluetas de transeúntes enmarcan el reloj de una estación de tren.'),
      photograph('Renfe.jpg', 'Red and white trains wait beside a station platform.', 'Trenes rojos y blancos esperan junto al andén de una estación.'),
    ),
    feature(photograph('Bilbao_Rail.jpg', 'A red railcar approaches branching tracks surrounded by trees.', 'Un vagón rojo se acerca por vías que se bifurcan entre árboles.')),
    pair(
      photograph('Canyon.jpg', 'A close view of a bicycle frame, cables, and saddle in deep shadow.', 'Detalle del cuadro, los cables y el sillín de una bicicleta entre sombras.'),
      photograph('Market.jpg', 'Warm overhead lights and a circular number sign inside a market.', 'Luces cálidas y un letrero circular con un número en el interior de un mercado.'),
    ),
    pair(
      photograph('Light.jpg', 'An ornate street lamp hangs between tall facades beneath a blue sky.', 'Una farola ornamentada cuelga entre fachadas altas bajo un cielo azul.'),
      photograph('Madrid_Central_Bird.jpg', 'A bird passes in front of a clock tower against a blue sky.', 'Un ave pasa frente a una torre con reloj bajo un cielo azul.'),
    ),
    pair(
      photograph('Madrid_Basilica.jpg', 'A dark vintage car passes an arched stone doorway.', 'Un automóvil antiguo oscuro pasa frente a una entrada de piedra con arco.'),
      photograph('Madrir_Real_Basilica.jpg', 'People stand before a candlelit altar in an ornate church interior.', 'Varias personas están frente a un altar iluminado por velas en una iglesia ornamentada.'),
    ),
    pair(
      photograph('Segovia_Alcazar.jpg', 'An aerial view of a castle and the winding roads below it.', 'Vista aérea de un castillo y de las carreteras sinuosas a sus pies.'),
      photograph('Segovia_Catedral.jpg', 'An aerial view of a cathedral among densely packed tiled roofs.', 'Vista aérea de una catedral entre tejados de tejas muy próximos.'),
    ),
    feature(photograph('Segovia.jpg', 'Stone aqueduct arches rise above a warmly lit window at dusk.', 'Los arcos de un acueducto de piedra se alzan sobre una ventana iluminada al anochecer.')),
    pair(
      photograph('Santiago_De_Compostela.jpg', 'A cathedral tower appears between the facades of a narrow street.', 'La torre de una catedral aparece entre las fachadas de una calle estrecha.'),
      photograph('Centro_Cidade.jpg', 'A directional street sign points toward the city centre beneath a blue sky.', 'Una señal indica la dirección del centro de la ciudad bajo un cielo azul.'),
    ),
    pair(
      photograph('Heno.jpg', 'Hay bales rest in a harvested golden field beneath a clear sky.', 'Pacas de heno reposan en un campo dorado bajo un cielo despejado.'),
      photograph('Musk_Deer.jpg', 'A deer crosses dry grass at the edge of a dark wooded hillside.', 'Un ciervo cruza la hierba seca junto a una ladera arbolada y oscura.'),
    ),
    feature(photograph('Covadonga.jpg', 'A brown cow stands beside a lake with mountains in the distance.', 'Una vaca marrón está junto a un lago con montañas al fondo.')),
    pair(
      photograph('Cadavedo_La_Regalina.jpg', 'A small tiled-roof shelter overlooks the coast beneath low clouds.', 'Un pequeño refugio con techo de tejas domina la costa bajo nubes bajas.'),
      photograph('San_Juan_De_Gaztelugatxe.jpg', 'A rocky island and its small building are framed by coastal trees.', 'Un islote rocoso y su pequeña construcción aparecen entre árboles costeros.'),
    ),
    pair(
      photograph('Boats.jpg', 'Sailboats float on pale blue water beside a wooded headland.', 'Veleros flotan sobre agua azul clara junto a un promontorio arbolado.'),
      photograph('Tossa_De_Mar.jpg', 'Stone coastal towers overlook turquoise water and rocky cliffs.', 'Torres de piedra dominan el agua turquesa y los acantilados rocosos.'),
    ),
    feature(photograph('Cadavedo_Playa.jpg', 'A seabird glides over a quiet blue sea beside a rocky cliff.', 'Un ave marina planea sobre un mar azul y tranquilo junto a un acantilado rocoso.')),
  ],
  random: [
    pair(
      photograph('Crossing.jpg', 'A pedestrian waits at a striped crossing as traffic blurs past.', 'Una persona espera junto a un paso de peatones mientras el tráfico pasa desenfocado.'),
      photograph('Building.jpg', 'Tall buildings rise above a dense patchwork of city streets.', 'Edificios altos se alzan sobre una trama densa de calles.'),
    ),
    wide(photograph('Market.jpg', 'A black and white view of people working amid a crowded market.', 'Vista en blanco y negro de personas trabajando en un mercado concurrido.')),
    pair(
      photograph('Chopper_Bike.jpg', 'A long green custom bicycle rests on grass beside other bicycles.', 'Una bicicleta personalizada verde y alargada reposa sobre el césped junto a otras bicicletas.'),
      photograph('Crew_District.jpg', 'A black road bicycle is isolated against a bright white background.', 'Una bicicleta de carretera negra aparece sobre un fondo blanco.'),
    ),
    pair(
      photograph('Cards.jpg', 'An ace of spades leans against printed pages in black and white.', 'Un as de picas se apoya sobre páginas impresas en blanco y negro.'),
      photograph('Les_Paul_100.jpg', 'A close view of amber guitar controls and metal strings.', 'Detalle de controles de guitarra de color ámbar y cuerdas metálicas.'),
    ),
    feature(photograph('Mundo_Aventura.jpg', 'A tall amusement ride glows with coloured lights against the night sky.', 'Una atracción alta brilla con luces de colores contra el cielo nocturno.')),
    pair(
      photograph('Church.jpg', 'A sunlit church tower rises above rooftops and trees.', 'La torre de una iglesia iluminada por el sol se alza sobre tejados y árboles.'),
      photograph('Sunset_Plane.jpg', 'An aircraft crosses a golden sunset above dark mountains.', 'Un avión cruza un atardecer dorado sobre montañas oscuras.'),
    ),
    wide(photograph('Clouds.jpg', 'A communications mast is silhouetted against large sunlit clouds.', 'Una antena de comunicaciones aparece en silueta frente a grandes nubes iluminadas.')),
    pair(
      photograph('Helicopter_Moon.jpg', 'A small helicopter flies beneath a pale moon in a blue sky.', 'Un pequeño helicóptero vuela bajo una luna clara en un cielo azul.'),
      photograph('Sunset_Moon.jpg', 'A golden moon emerges through dark clouds at dusk.', 'Una luna dorada aparece entre nubes oscuras al anochecer.'),
    ),
  ],
  autodromo: [
    feature(photograph('Corvette_2.jpg', 'A blue sports car rests on wet asphalt, viewed from above.', 'Un automóvil deportivo azul reposa sobre asfalto mojado, visto desde arriba.')),
    pair(
      photograph('Corvette.jpg', 'A blue sports car speeds along a circuit beside green grass.', 'Un automóvil deportivo azul recorre un circuito junto al césped verde.'),
      photograph('Performance.jpg', 'A low racing prototype passes along the track.', 'Un prototipo de competición de perfil bajo pasa por la pista.'),
    ),
    pair(
      photograph('Datsun.jpg', 'A yellow vintage race car crosses a motion-blurred section of track.', 'Un automóvil de competición antiguo y amarillo cruza un tramo de pista desenfocado por el movimiento.'),
      photograph('Datsun_2.jpg', 'Yellow and red vintage cars wait together in a shaded pit area.', 'Automóviles antiguos amarillos y rojos esperan en una zona de boxes a la sombra.'),
    ),
    feature(photograph('Corsa.jpg', 'A turquoise race car sits in the pits beside a person in red.', 'Un automóvil de competición turquesa está en boxes junto a una persona vestida de rojo.')),
  ],
  motocross: [
    feature(photograph('07.jpg', 'A motocross rider in a red helmet lifts a bike above the dirt.', 'Un piloto de motocross con casco rojo eleva la moto sobre la tierra.')),
    pair(
      photograph('02.jpg', 'A distant rider rises through dust on a tree-lined circuit.', 'Un piloto a lo lejos se eleva entre el polvo en un circuito rodeado de árboles.'),
      photograph('06.jpg', 'A rider jumps above a dusty crest beside dark woodland.', 'Un piloto salta sobre una cresta polvorienta junto a un bosque oscuro.'),
    ),
    pair(
      photograph('01.jpg', 'Several motocross riders round a dirt bend together.', 'Varios pilotos de motocross toman juntos una curva de tierra.'),
      photograph('03.jpg', 'Two riders follow different bends through a wooded dirt circuit.', 'Dos pilotos recorren distintas curvas de un circuito de tierra arbolado.'),
    ),
    feature(photograph('04.jpg', 'A rider and motorcycle are suspended in the air against a blue sky.', 'Un piloto y su moto quedan suspendidos en el aire contra un cielo azul.')),
    feature(photograph('05.jpg', 'Riders and an attendant gather beside parked motocross bikes.', 'Pilotos y un asistente se reúnen junto a motos de motocross estacionadas.')),
  ],
  dogs: [
    wide(photograph('16.jpg', 'Several puppies sleep together in a soft blanket.', 'Varios cachorros duermen juntos sobre una manta suave.')),
    pair(
      photograph('01.jpg', 'A mottled puppy looks to the side in a close portrait.', 'Un cachorro de pelaje moteado mira hacia un lado en un retrato cercano.'),
      photograph('02.jpg', 'A mottled puppy stands on a blanket and looks toward the camera.', 'Un cachorro de pelaje moteado está sobre una manta y mira hacia la cámara.'),
    ),
    pair(
      photograph('03.jpg', 'A tan puppy sits upright on a soft blanket.', 'Un cachorro de color canela está sentado sobre una manta suave.'),
      photograph('04.jpg', 'A tan puppy gazes upward beside a brick ledge.', 'Un cachorro de color canela mira hacia arriba junto a un borde de ladrillo.'),
    ),
    pair(
      photograph('05.jpg', 'A white and tan puppy lifts its chin toward the light.', 'Un cachorro blanco y canela levanta el mentón hacia la luz.'),
      photograph('06.jpg', 'A white and tan puppy rests its head between its front paws.', 'Un cachorro blanco y canela descansa la cabeza entre las patas delanteras.'),
    ),
    pair(
      photograph('07.jpg', 'A black puppy looks upward in a close portrait.', 'Un cachorro negro mira hacia arriba en un retrato cercano.'),
      photograph('08.jpg', 'A black puppy rests on a blanket and looks to the side.', 'Un cachorro negro descansa sobre una manta y mira hacia un lado.'),
    ),
    pair(
      photograph('09.jpg', 'A dark puppy with tan markings turns its head to the side.', 'Un cachorro oscuro con marcas canela gira la cabeza hacia un lado.'),
      photograph('10.jpg', 'A dark puppy with tan markings sits facing the camera.', 'Un cachorro oscuro con marcas canela está sentado frente a la cámara.'),
    ),
    pair(
      photograph('11.jpg', 'A pale puppy sits quietly with one paw on a blanket.', 'Un cachorro claro está sentado tranquilamente con una pata sobre una manta.'),
      photograph('12.jpg', 'A pale puppy tilts its head upward toward soft light.', 'Un cachorro claro inclina la cabeza hacia una luz suave.'),
    ),
    pair(
      photograph('14.jpg', 'A pale puppy tilts its head beside a brick wall.', 'Un cachorro claro inclina la cabeza junto a una pared de ladrillo.'),
      photograph('15.jpg', 'A dark puppy is outlined by warm backlight.', 'La luz cálida de fondo dibuja el contorno de un cachorro oscuro.'),
    ),
    feature(photograph('13.jpg', 'A tan puppy nuzzles the cheek of a pale puppy.', 'Un cachorro de color canela acaricia con el hocico la mejilla de un cachorro claro.')),
  ],
  'self-portrait': [
    pair(
      photograph('01.jpg', 'A man with glasses looks to the side beside a bright window.', 'Un hombre con gafas mira hacia un lado junto a una ventana luminosa.'),
      photograph('04.jpg', 'A man with glasses and a dark cap faces the camera in soft light.', 'Un hombre con gafas y gorra oscura mira hacia la cámara bajo una luz suave.'),
    ),
    pair(
      photograph('02.jpg', 'A man with glasses emerges from a dark background in side light.', 'Un hombre con gafas aparece sobre un fondo oscuro bajo una luz lateral.'),
      photograph('03.jpg', 'A close portrait of a man in a dark cap with warm light on his face.', 'Retrato cercano de un hombre con gorra oscura y luz cálida sobre el rostro.'),
    ),
  ],
};

export function getPhotoStory(slug: string, images: GalleryImage[]): PhotoStorySpread[] {
  const story = stories[slug];
  if (!story) throw new Error(`Missing authored photo story for ${slug}`);
  const assets = new Map(images.map((image) => [image.filename, image]));
  const seen = new Set<string>();
  const spreads = story.map(({ layout, photos }) => ({
    layout,
    photos: photos.map(({ filename, alt }) => {
      const asset = assets.get(filename);
      if (!asset) throw new Error(`Missing photograph ${filename} in ${slug}`);
      if (seen.has(filename)) throw new Error(`Repeated photograph ${filename} in ${slug}`);
      seen.add(filename);
      return { ...asset, alt };
    }),
  }));
  const omitted = images.filter(({ filename }) => !seen.has(filename));
  if (omitted.length) throw new Error(`Uncurated photographs in ${slug}: ${omitted.map(({ filename }) => filename).join(', ')}`);
  return spreads;
}
