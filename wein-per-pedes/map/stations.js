const stations = [
  {
    "id": 1,
    "name": "Weingut Heiser-Buchner",
    "lat": 49.60983032162279,
    "lng": 8.180480003356935,
    "description": "Traditionelles Familienweingut mit langer Geschichte und feinsten Weinen aus der Pfalz.",
    "offerings": [
      {
        "name": "2021 Riesling Kabinett trocken",
        "description": "Fruchtig-frisch mit feiner Mineralität und Apfelnoten",
        "price": "4,50€/Glas"
      },
      {
        "name": "2022 Weißburgunder trocken",
        "description": "Eleganter Weißwein mit Aromen von Birne und Quitte",
        "price": "4,00€/Glas"
      },
      {
        "name": "Pfälzer Winzerbrot mit Schmalz",
        "description": "Hausgemachtes Bauernbrot mit frischem Schmalz und Zwiebeln",
        "price": "5,50€"
      },
      {
        "name": "Winzersekt Cuvée brut",
        "description": "Feiner Sekt aus Riesling und Weißburgunder, perlend und frisch",
        "price": "5,00€/Glas"
      }
    ]
  },
  {
    "id": 2,
    "name": "Weingut Jens Griebel",
    "lat": 49.606946998591404,
    "lng": 8.172918856143953,
    "description": "Modernes Familienweingut in dritter Generation mit Fokus auf regionaltypische Weine und nachhaltigem Anbau in den besten Lagen von Bockenheim.",
    "offerings": [
      {
        "name": "2022 Silvaner trocken",
        "description": "Charaktervoller Weißwein mit feiner Kräuternote und mineralischem Abgang",
        "price": "4,50€/Glas"
      },
      {
        "name": "2021 Grauburgunder "Kalkstein"",
        "description": "Cremiger Weißwein mit Aromen von reifen Birnen und Haselnuss",
        "price": "5,00€/Glas"
      },
      {
        "name": "2020 Spätburgunder Reserve",
        "description": "Eleganter Rotwein mit Noten von Kirsche und einer feinen Holznote",
        "price": "6,50€/Glas"
      },
      {
        "name": "Pfälzer Saumagen",
        "description": "Regionale Spezialität nach traditionellem Rezept der Familie Griebel",
        "price": "8,50€"
      },
      {
        "name": "Winzerplatte",
        "description": "Auswahl an hausgemachten Wurst- und Käsespezialitäten mit Bauernbrot",
        "price": "9,50€"
      }
    ]
  },
  {
    "id": 3,
    "name": "Weingut Lauerman & Weyer",
    "lat": 49.60104389956821,
    "lng": 8.169005513191225,
    "description": "Innovative Weinmanufaktur mit modernen Interpretationen klassischer Pfälzer Rebsorten.",
    "offerings": [
      {
        "name": "2022 Grauburgunder Spätlese",
        "description": "Vollmundig mit tropischen Fruchtnoten und feiner Restsüße",
        "price": "5,00€/Glas"
      },
      {
        "name": "2021 Spätburgunder Rosé",
        "description": "Frischer Sommerwein mit Aromen von roten Beeren",
        "price": "4,50€/Glas"
      },
      {
        "name": "Flammkuchen "Elsässer Art"",
        "description": "Mit Speck, Zwiebeln und Schmand auf dünnem Teig",
        "price": "7,50€"
      },
      {
        "name": "Merlot vom Fass",
        "description": "Harmonischer Rotwein mit weichen Tanninen und Brombeeraromen",
        "price": "5,50€/Glas"
      }
    ]
  },
  {
    "id": 4,
    "name": "Kindenheimer Kerweborsch",
    "lat": 49.60061422768533,
    "lng": 8.16139340400696,
    "description": "Die Kerweborsch sorgen mit traditionellen Speisen und guter Stimmung für echtes Dorffest-Feeling.",
    "offerings": [
      {
        "name": "Hausmacher Bratwurst",
        "description": "Deftige Pfälzer Bratwurst vom Grill mit Bauernbrot",
        "price": "4,50€"
      },
      {
        "name": "Dampfnudeln mit Weinsoße",
        "description": "Süße Spezialität nach altem Familienrezept",
        "price": "5,50€"
      },
      {
        "name": "Pfälzer Schorle",
        "description": "Klassische Weinschorle aus Riesling, erfrischend und süffig",
        "price": "3,00€/Glas"
      },
      {
        "name": "Kerwekuchen",
        "description": "Traditioneller Streuselkuchen nach altem Dorfrezept",
        "price": "2,50€/Stück"
      }
    ]
  },
  {
    "id": 5,
    "name": "TVK & HSVL",
    "lat": 49.605468,
    "lng": 8.1537649,
    "description": "Vereinsgemeinschaft mit herzlicher Atmosphäre und traditionellen Pfälzer Genüssen.",
    "offerings": [
      {
        "name": "Bratwurst vom Grill",
        "description": "Gegrillte Pfälzer Bratwurst mit Bauernbrot und Senf",
        "price": "4,50€"
      },
      {
        "name": "Fleischkäse im Brötchen",
        "description": "Warmer Fleischkäse im knusprigen Brötchen",
        "price": "4,00€"
      },
      {
        "name": "Weinschorle",
        "description": "Weiß oder rot, nach Wahl",
        "price": "3,00€/Glas"
      },
      {
        "name": "Kaffee und Kuchen",
        "description": "Hausgemachter Kuchen nach Tagesangebot",
        "price": "3,50€"
      }
    ]
  },
  {
    "id": 6,
    "name": "Weingut Gernot Weber",
    "lat": 49.608283614054756,
    "lng": 8.154631555080416,
    "description": "Prämiertes Weingut mit Fokus auf nachhaltigem Weinbau und charaktervollen Weinen.",
    "offerings": [
      {
        "name": "2022 Sauvignon Blanc",
        "description": "Frischer Weißwein mit Noten von Stachelbeeren und Zitrusfrüchten",
        "price": "5,50€/Glas"
      },
      {
        "name": "2020 Merlot Barrique",
        "description": "Im Eichenfass gereift, mit samtigen Tanninen und Vanillearomen",
        "price": "6,00€/Glas"
      },
      {
        "name": "Pfälzer Wurstsalat",
        "description": "Traditioneller Wurstsalat mit Käse, Zwiebeln und Essig-Öl-Dressing",
        "price": "6,50€"
      },
      {
        "name": "Käseauswahl",
        "description": "Regionale Käsesorten mit Weintrauben und Walnüssen",
        "price": "8,50€"
      }
    ]
  },
  {
    "id": 7,
    "name": "Weingut Schur",
    "lat": 49.607266816289865,
    "lng": 8.161852061748506,
    "description": "Kleines Familienweingut mit liebevoll ausgebauten Weinen und persönlicher Beratung.",
    "offerings": [
      {
        "name": "2022 Gewürztraminer Spätlese",
        "description": "Aromatischer Weißwein mit Rosennoten und exotischen Früchten",
        "price": "5,00€/Glas"
      },
      {
        "name": "2021 Cabernet Sauvignon",
        "description": "Kräftiger Rotwein mit Aromen von schwarzen Johannisbeeren",
        "price": "5,50€/Glas"
      },
      {
        "name": "Winzerplatte",
        "description": "Wurst- und Käseauswahl mit hausgemachten Chutneys",
        "price": "9,00€"
      },
      {
        "name": "Zwiebelkuchen",
        "description": "Traditioneller Pfälzer Zwiebelkuchen nach Familienrezept",
        "price": "4,50€/Stück"
      }
    ]
  },
  {
    "id": 8,
    "name": "Weingut Benß",
    "lat": 49.60975054645064,
    "lng": 8.171993494033815,
    "description": "Traditionsweingut in vierter Generation mit Fokus auf elegante und langlebige Weine.",
    "offerings": [
      {
        "name": "2021 Chardonnay Réserve",
        "description": "Edler Weißwein mit Holznoten und reifer Frucht, im Barrique gereift",
        "price": "6,00€/Glas"
      },
      {
        "name": "2020 Cuvée Rot "Heimaterde"",
        "description": "Kraftvolle Cuvée aus Merlot, Cabernet und Dornfelder",
        "price": "5,50€/Glas"
      },
      {
        "name": "Saumagen",
        "description": "Pfälzer Spezialität, deftig und würzig",
        "price": "8,50€"
      },
      {
        "name": "Winzersekt Rosé",
        "description": "Eleganter Sekt aus Spätburgunder, zart und fruchtig",
        "price": "5,00€/Glas"
      }
    ]
  }
];

const parkingSpots = [
  {
    "id": "P1",
    "name": "Parkplatz Bockenheim",
    "lat": 49.604,
    "lng": 8.1815,
    "description": "Parkplatz Weinstraße 92, direkt hinter der Rahl. Von hier aus entlang der Pestalozzistraße und Gartenstraße zur Route."
  },
  {
    "id": "P2",
    "name": "Parkplatz Kindenheim",
    "lat": 49.60704259649285,
    "lng": 8.1506484746933,
    "description": "Parkplatz an der Sport- und Freizeithalle Kindenheim."
  }
];

const walkingPath = [
  { lat: 49.60983049647383, lng: 8.180480003356935 },
  { lat: 49.609806163871966, lng: 8.179855048656465 },
  { lat: 49.609828758431256, lng: 8.179645836353304 },
  { lat: 49.6096671201997, lng: 8.179643154144289 },
  { lat: 49.60890219448143, lng: 8.17962169647217 },
  { lat: 49.60879982634167, lng: 8.17622870206833 },
  { lat: 49.60880330250016, lng: 8.175461590290071 },
  { lat: 49.60886761138746, lng: 8.175150454044344 },
  { lat: 49.608994490835215, lng: 8.174707889556887 },
  { lat: 49.60927605774511, lng: 8.173905909061434 },
  { lat: 49.60943701848394, lng: 8.173334598541262 },
  { lat: 49.60982180626028, lng: 8.171280026435854 },
  { lat: 49.609524600024024, lng: 8.171601891517641 },
  { lat: 49.60828013785922, lng: 8.172304630279543 },
  { lat: 49.60754694922243, lng: 8.172680139541628 },
  { lat: 49.60675232592164, lng: 8.173063695430757 },
  { lat: 49.606246520976214, lng: 8.173326551914217 },
  { lat: 49.60570247062367, lng: 8.17360818386078 },
  { lat: 49.604996629330884, lng: 8.173731565475466 },
  { lat: 49.60429973132493, lng: 8.173895180225374 },
  { lat: 49.603460334379, lng: 8.174053430557253 },
  { lat: 49.60259163898258, lng: 8.17413926124573 },
  { lat: 49.6020590888023, lng: 8.174192905426027 },
  { lat: 49.60185570498101, lng: 8.173868358135225 },
  { lat: 49.601760096908635, lng: 8.1738817691803 },
  { lat: 49.60165232031138, lng: 8.17364037036896 },
  { lat: 49.60141416795327, lng: 8.17288935184479 },
  { lat: 49.60128205373476, lng: 8.17210614681244 },
  { lat: 49.60107171325349, lng: 8.170850872993471 },
  { lat: 49.600937859747525, lng: 8.170386850833895 },
  { lat: 49.60078140713197, lng: 8.169920146465303 },
  { lat: 49.600525866780345, lng: 8.169319331645967 },
  { lat: 49.60046502364211, lng: 8.169077932834627 },
  { lat: 49.60044242474284, lng: 8.168753385543825 },
  { lat: 49.60083008133283, lng: 8.168659508228304 },
  { lat: 49.60089613909911, lng: 8.169021606445314 },
  { lat: 49.60083008133283, lng: 8.168662190437319 },
  { lat: 49.60044242474284, lng: 8.168748021125795 },
  { lat: 49.60038853501772, lng: 8.168332278728487 },
  { lat: 49.60001130527436, lng: 8.166814148426058 },
  { lat: 49.59991395518943, lng: 8.166108727455141 },
  { lat: 49.599821820108616, lng: 8.165207505226137 },
  { lat: 49.599727946451026, lng: 8.164789080619814 },
  { lat: 49.59962190376858, lng: 8.164472579956056 },
  { lat: 49.59933506584905, lng: 8.16400319337845 },
  { lat: 49.59927248280603, lng: 8.163732290267946 },
  { lat: 49.599225545471064, lng: 8.163442611694338 },
  { lat: 49.59913167066557, lng: 8.16253334283829 },
  { lat: 49.59912124012046, lng: 8.162412643432619 },
  { lat: 49.59905344152293, lng: 8.162187337875368 },
  { lat: 49.59890567502224, lng: 8.161739408969881 },
  { lat: 49.599350711597246, lng: 8.161575794219972 },
  { lat: 49.600275540239465, lng: 8.161243200302126 },
  { lat: 49.600605831932285, lng: 8.16137731075287 },
  { lat: 49.60134811088875, lng: 8.161111772060396 },
  { lat: 49.601946097895215, lng: 8.16087305545807 },
  { lat: 49.602556915887384, lng: 8.16063165664673 },
  { lat: 49.60232062789382, lng: 8.158797025680544 },
  { lat: 49.602295499699295, lng: 8.158705830574037 },
  { lat: 49.60222596720153, lng: 8.158729970455171 },
  { lat: 49.60183658338154, lng: 8.156222105026247 },
  { lat: 49.60123660425131, lng: 8.152542114257814 },
  { lat: 49.602238135395794, lng: 8.152126371860506 },
  { lat: 49.60309685457949, lng: 8.151753544807436 },
  { lat: 49.60322201076863, lng: 8.15179377794266 },
  { lat: 49.60336107282417, lng: 8.15190374851227 },
  { lat: 49.60365136358699, lng: 8.152123689651491 },
  { lat: 49.60461782816151, lng: 8.152839839458467 },
  { lat: 49.60493939935674, lng: 8.153185844421388 },
  { lat: 49.605468, lng: 8.1537649 },
  { lat: 49.605551247881884, lng: 8.153920769691469 },
  { lat: 49.60639426523135, lng: 8.153223395347597 },
  { lat: 49.60667758531512, lng: 8.15403074026108 },
  { lat: 49.60736241356413, lng: 8.15350502729416 },
  { lat: 49.60760227499073, lng: 8.153494298458101 },
  { lat: 49.60780563484099, lng: 8.153499662876131 },
  { lat: 49.60809416103613, lng: 8.154062926769258 },
  { lat: 49.60826449497621, lng: 8.154470622539522 },
  { lat: 49.6082766616634, lng: 8.154631555080416 },
  { lat: 49.607240744273426, lng: 8.155446946620943 },
  { lat: 49.60773263396671, lng: 8.156425952911379 },
  { lat: 49.60791339783656, lng: 8.156828284263613 },
  { lat: 49.608085470513046, lng: 8.157297670841219 },
  { lat: 49.608156732756754, lng: 8.157568573951723 },
  { lat: 49.60784908769045, lng: 8.157477378845217 },
  { lat: 49.60748234442497, lng: 8.157474696636202 },
  { lat: 49.60711559840043, lng: 8.15753370523453 },
  { lat: 49.606460315459415, lng: 8.157882392406465 },
  { lat: 49.60696959447597, lng: 8.160111308097841 },
  { lat: 49.607369366085884, lng: 8.161747455596926 },
  { lat: 49.60757098878463, lng: 8.162536025047304 },
  { lat: 49.607748277020406, lng: 8.163431882858278 },
  { lat: 49.608212351996535, lng: 8.16465497016907 },
  { lat: 49.608283614054756, lng: 8.164730072021486 },
  { lat: 49.608792874023955, lng: 8.167176246643068 },
  { lat: 49.60913006029114, lng: 8.169110119342806 },
  { lat: 49.60953329029058, lng: 8.171564340591432 },
  { lat: 49.60990349420656, lng: 8.171178102493288 },
  { lat: 49.61004253720457, lng: 8.171025216579439 },
  { lat: 49.610155509348424, lng: 8.171465098857881 },
  { lat: 49.6102841234704, lng: 8.1721168756485 },
  { lat: 49.610463139859085, lng: 8.17264258861542 },
  { lat: 49.610532660609486, lng: 8.173052966594698 },
  { lat: 49.6104996382654, lng: 8.173688650131227 },
  { lat: 49.61049790024666, lng: 8.174310922622682 },
  { lat: 49.61057263499605, lng: 8.17511022090912 },
  { lat: 49.61075686435403, lng: 8.176346719264986 },
  { lat: 49.61095325903488, lng: 8.177459836006166 },
  { lat: 49.61101756508584, lng: 8.177905082702638 },
  { lat: 49.61109229903848, lng: 8.179163038730623 },
  { lat: 49.61114791492889, lng: 8.17962169647217 },
  { lat: 49.611220910688736, lng: 8.180040121078493 },
  { lat: 49.611325190156016, lng: 8.180501461029055 },
  { lat: 49.61133735607934, lng: 8.181037902832033 },
  { lat: 49.61115834290129, lng: 8.180938661098482 },
  { lat: 49.610437069552106, lng: 8.1802573800087 },
  { lat: 49.60983049647383, lng: 8.1796270608902 }
];
