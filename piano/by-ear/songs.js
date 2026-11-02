// Opening phrases of well-known public-domain tunes (traditional, or published before 1929).
// Format: [id, title, by, category, bpm, notes, region?]
// region (optional): fr de it jp cn kr sa za au in ir; songs without one are listed under "Other".
// notes: space-separated tokens NOTE[:beats], e.g. "C4", "F#4:1.5", "Bb3:.5"; "r:1" is a rest. Default 1 beat.
// Categories: k = children's, f = folk & traditional, h = holiday, s = hymns & anthems, c = classical.
window.SONGS = [
  // ---- Children's ----
  ['twinkle', 'Twinkle, Twinkle, Little Star', 'Traditional', 'k', 100, 'C4 C4 G4 G4 A4 A4 G4:2 F4 F4 E4 E4 D4 D4 C4:2'],
  ['mary', 'Mary Had a Little Lamb', 'Traditional', 'k', 110, 'E4:1.5 D4:.5 C4 D4 E4 E4 E4:2 D4 D4 D4:2 E4 G4 G4:2'],
  ['birthday', 'Happy Birthday', 'Mildred & Patty Hill', 'k', 100, 'G4:.75 G4:.25 A4 G4 C5 B4:2 G4:.75 G4:.25 A4 G4 D5 C5:2'],
  ['rowboat', 'Row, Row, Row Your Boat', 'Traditional', 'k', 140, 'C4:1.5 C4:1.5 C4 D4:.5 E4:1.5 E4 D4:.5 E4 F4:.5 G4:3'],
  ['london', 'London Bridge Is Falling Down', 'Traditional', 'k', 110, 'G4:1.5 A4:.5 G4 F4 E4 F4 G4:2 D4 E4 F4:2 E4 F4 G4:2'],
  ['frere', 'Frère Jacques', 'Traditional (French)', 'k', 110, 'C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4:2 E4 F4 G4:2', 'fr'],
  ['macdonald', 'Old MacDonald Had a Farm', 'Traditional', 'k', 120, 'G4 G4 G4 D4 E4 E4 D4:2 B4 B4 A4 A4 G4:3'],
  ['itsy', 'Itsy Bitsy Spider', 'Traditional', 'k', 120, 'G3:.5 C4 C4:.5 C4 D4:.5 E4:1.5 E4 E4:.5 D4 C4:.5 D4 E4:.5 C4:1.5'],
  ['hotcross', 'Hot Cross Buns', 'Traditional', 'k', 110, 'E4 D4 C4:2 E4 D4 C4:2 C4:.5 C4:.5 C4:.5 C4:.5 D4:.5 D4:.5 D4:.5 D4:.5 E4 D4 C4:2'],
  ['yankee', 'Yankee Doodle', 'Traditional', 'k', 130, 'C4 C4 D4 E4 C4 E4 D4 G3 C4 C4 D4 E4 C4:2 B3:2'],
  ['blindmice', 'Three Blind Mice', 'Traditional', 'k', 110, 'E4 D4 C4:2 E4 D4 C4:2 G4 F4:.5 F4:.5 E4:2 G4 F4:.5 F4:.5 E4:2'],
  ['oldman', 'This Old Man', 'Traditional', 'k', 120, 'G4 E4 G4:2 G4 E4 G4:2 A4 G4 F4 E4 D4:.5 E4:.5 F4:2'],
  ['farmer', 'The Farmer in the Dell', 'Traditional', 'k', 110, 'G3:.5 C4 C4:.5 C4 C4:.5 C4:1.5 D4:.5 E4 E4:.5 E4 E4:.5 E4:1.5'],
  ['weasel', 'Pop Goes the Weasel', 'Traditional', 'k', 110, 'C4 C4:.5 D4 D4:.5 E4:.5 G4:.5 E4:.5 C4 G3:.5 C4 C4:.5 D4 D4:.5 E4:1.5 C4'],
  ['lightly', 'Lightly Row', 'Traditional (German)', 'k', 110, 'G4 E4 E4:2 F4 D4 D4:2 C4 D4 E4 F4 G4 G4 G4:2', 'de'],
  ['auclair', 'Au clair de la lune', 'Traditional (French)', 'k', 100, 'C4 C4 C4 D4 E4:2 D4:2 C4 E4 D4 D4 C4:4', 'fr'],
  ['alouette', 'Alouette', 'Traditional (French-Canadian)', 'k', 110, 'C4 D4:.5 E4:.5 E4 D4:.5 C4:.5 D4:.5 E4:.5 C4 G3:2', 'fr'],
  ['bingo', 'Bingo', 'Traditional', 'k', 130, 'G3 C4 C4 G3 G3 A3 A3 G3 G3 C4 C4 D4 D4 E4:2 C4:2'],
  ['rainrain', 'Rain, Rain, Go Away', 'Traditional', 'k', 110, 'G4 E4 G4:.5 G4:.5 E4 G4:.5 G4:.5 E4:.5 A4:.5 G4:.5 G4:.5 E4:2'],
  ['entchen', 'Alle meine Entchen', 'Traditional (German)', 'k', 100, 'C4:.5 D4:.5 E4:.5 F4:.5 G4 G4 A4:.5 A4:.5 A4:.5 A4:.5 G4:2 A4:.5 A4:.5 A4:.5 A4:.5 G4:2', 'de'],
  ['augustin', 'Oh du lieber Augustin', 'Traditional (Austrian)', 'k', 130, 'G4:1.5 A4:.5 G4 F4 E4 C4 C4:3 D4 G3 G3 E4 C4 C4:3'],
  ['jollygood', "For He's a Jolly Good Fellow", 'Traditional', 'k', 120, 'C4:.5 E4 E4:.5 E4 D4:.5 E4 F4:.5 E4:3'],
  ['shave', 'Shave and a Haircut', 'Traditional', 'k', 120, 'C4 G3:.5 G3:.5 A3 G3 r B3 C4:2'],

  // ---- Folk & traditional ----
  ['susanna', 'Oh! Susanna', 'Stephen Foster', 'f', 130, 'C4:.5 D4:.5 E4 G4 G4:1.5 A4:.5 G4 E4 C4:1.5 D4:.5 E4 E4 D4 C4 D4:3'],
  ['camptown', 'Camptown Races', 'Stephen Foster', 'f', 120, 'G4:.5 G4:.5 E4:.5 G4:.5 A4:.5 G4:.5 E4 E4:.5 D4:1.5 E4:.5 D4:1.5'],
  ['swanee', 'Old Folks at Home (Swanee River)', 'Stephen Foster', 'f', 100, 'E4:2 D4 C4 E4 D4 C4 C5 A4 C5 G4:3'],
  ['range', 'Home on the Range', 'Traditional', 'f', 130, 'G3 G3 C4 D4 E4:2 C4 B3 A3 F4 F4 F4:3'],
  ['saints', 'When the Saints Go Marching In', 'Traditional', 'f', 140, 'C4 E4 F4 G4:4 C4 E4 F4 G4:4 C4 E4 F4 G4:2 E4:2 C4:2 E4:2 D4:4'],
  ['kumbaya', 'Kumbaya', 'Traditional', 'f', 100, 'C4 E4 G4:2 G4 G4 A4 A4 G4:3'],
  ['michael', 'Michael, Row the Boat Ashore', 'Traditional', 'f', 110, 'C4 E4 G4:2 E4:.5 G4:.5 A4 G4:2 E4 G4 A4:2 G4:2'],
  ['clementine', 'Oh My Darling, Clementine', 'Traditional', 'f', 110, 'C4:.75 C4:.25 C4 G3:2 E4:.75 E4:.25 E4 C4:2 C4:.75 E4:.25 G4:1.5 G4:.5 F4 E4 D4:3'],
  ['bonnie', 'My Bonnie Lies over the Ocean', 'Traditional (Scottish)', 'f', 120, 'G3 E4:1.5 D4:.5 C4 D4 C4 A3 G3 E3:3'],
  ['mountain', "She'll Be Coming 'Round the Mountain", 'Traditional', 'f', 130, 'G3:.5 A3:.5 C4 C4 C4 C4 A3 G3 E3 G3 C4:3'],
  ['smoky', 'On Top of Old Smoky', 'Traditional', 'f', 140, 'C4 C4 E4 G4 C5:3 A4:3 A4 F4 G4 A4 G4:3'],
  ['daisy', 'Daisy Bell (Bicycle Built for Two)', 'Harry Dacre', 'f', 160, 'G4:3 E4:3 C4:3 G3:3 A3 B3 C4 A3:2 C4 G3:6'],
  ['ballgame', 'Take Me Out to the Ball Game', 'Albert Von Tilzer', 'f', 160, 'C4:2 C5 A4 G4 E4 G4:3 D4:3 C4:2 C5 A4 G4 E4 G4:3'],
  ['auralee', 'Aura Lee', 'George R. Poulton', 'f', 90, 'G4 C5 B4 C5 D5 A4 D5:2 C5 B4 A4 B4 C5:4'],
  ['greensleeves', 'Greensleeves', 'Traditional (English)', 'f', 160, 'A4 C5:2 D5 E5:1.5 F5:.5 E5 D5:2 B4 G4:1.5 A4:.5 B4 C5:2 A4 A4:1.5 G#4:.5 A4 B4:2 G#4 E4:2'],
  ['scarborough', 'Scarborough Fair', 'Traditional (English)', 'f', 120, 'D4:2 D4 A4:2 A4 E4:1.5 F4:.5 E4 D4:3 A4 C5:2 D5 C5:2 A4 B4 G4 A4:3'],
  ['sailor', 'Drunken Sailor', 'Traditional (sea shanty)', 'f', 100, 'A4:.5 A4:.25 A4:.25 A4:.5 A4:.25 A4:.25 A4:.5 D4:.5 F4:.5 A4:.5 G4:.5 G4:.25 G4:.25 G4:.5 G4:.25 G4:.25 G4:.5 C4:.5 E4:.5 G4:.5'],
  ['auld', 'Auld Lang Syne', 'Traditional (Scottish)', 'f', 100, 'C4 F4:1.5 F4:.5 F4 A4 G4:1.5 F4:.5 G4 A4 F4:1.5 F4:.5 A4 C5 D5:3'],
  ['cucaracha', 'La Cucaracha', 'Traditional (Mexican)', 'f', 130, 'C4:.5 C4:.5 C4:.5 F4 A4:2 C4:.5 C4:.5 C4:.5 F4 A4:2 F4:.5 F4:.5 E4:.5 E4:.5 D4:.5 D4:.5 C4:2'],
  ['sakura', 'Sakura Sakura', 'Traditional (Japanese)', 'f', 80, 'A4 A4 B4:2 A4 A4 B4:2 A4 B4 C5 B4 A4 B4:.5 A4:.5 F4:2', 'jp'],
  ['jasmine', 'Mo Li Hua (Jasmine Flower)', 'Traditional (Chinese)', 'f', 80, 'E4 E4:.5 G4:.5 A4:.5 C5:.5 C5:.5 A4:.5 G4 G4:.5 A4:.5 G4:2', 'cn'],
  ['korobeiniki', 'Korobeiniki', 'Traditional (Russian)', 'f', 140, 'E5 B4:.5 C5:.5 D5 C5:.5 B4:.5 A4 A4:.5 C5:.5 E5 D5:.5 C5:.5 B4:1.5 C5:.5 D5 E5 C5 A4 A4:2'],
  ['westminster', 'Westminster Chimes', 'Traditional', 'f', 70, 'E4 C4 D4 G3:2 G3 D4 E4 C4:2'],
  ['taps', 'Taps', 'Daniel Butterfield', 'f', 60, 'G3:.75 G3:.25 C4:3 G3:.75 C4:.25 E4:3 G3:.5 C4:.5 E4:2 G3:.5 C4:.5 E4:2 G3:.5 C4:.5 E4:2 C4:.75 E4:.25 G4:3'],

  // ---- Hymns & anthems ----
  ['amazing', 'Amazing Grace', 'Traditional (American)', 's', 90, 'D4 G4:2 B4:.5 G4:.5 B4:2 A4 G4:2 E4 D4:2 D4 G4:2 B4:.5 G4:.5 B4:2 A4 D5:3'],
  ['doxology', 'Old Hundredth (Doxology)', 'Louis Bourgeois', 's', 90, 'G4:2 G4 F#4 E4 D4 G4 A4 B4:2'],
  ['jesusloves', 'Jesus Loves Me', 'William Bradbury', 's', 110, 'G4 E4 E4 D4 E4 G4 G4:2'],
  ['fortress', 'A Mighty Fortress Is Our God', 'Martin Luther', 's', 90, 'C4 C4 C4 G3 A3 B3 C4:2 A3 G3:2'],
  ['starspangled', 'The Star-Spangled Banner', 'John Stafford Smith', 's', 90, 'G4:.75 E4:.25 C4 E4 G4 C5:2 E5:.75 D5:.25 C5 E4 F#4 G4:2'],
  ['mycountry', "God Save the King (My Country, 'Tis of Thee)", 'Traditional', 's', 90, 'C4 C4 D4 B3:1.5 C4:.5 D4 E4 E4 F4 E4:1.5 D4:.5 C4 D4 C4 B3 C4:3'],
  ['beautiful', 'America the Beautiful', 'Samuel A. Ward', 's', 100, 'G4 G4:1.5 E4:.5 E4 G4 G4:1.5 D4:.5 D4 E4 F4 G4 A4 B4 G4:3'],
  ['marseillaise', 'La Marseillaise', 'Rouget de Lisle', 's', 100, 'D4:.75 D4:.25 D4 G4 G4 A4 A4 D5:1.5 B4:.5 G4:.75 G4:.25 B4:.75 G4:.25 E4 C5:2 A4:.75 F#4:.25 G4:2', 'fr'],
  ['canada', 'O Canada', 'Calixa Lavallée', 's', 90, 'E4:2 G4:1.5 G4:.5 C4:3 D4 E4 F4 G4 A4 D4:3'],
  ['emperor', 'Emperor Hymn (Gott erhalte)', 'Joseph Haydn', 's', 90, 'C4:1.5 D4:.5 E4 D4 F4 E4 D4:.5 B3:.5 C4 A4 G4 F4 E4 D4:.5 E4:.5 C4:2', 'de'],

  // ---- Holiday ----
  ['jingle', 'Jingle Bells', 'James Lord Pierpont', 'h', 140, 'E4 E4 E4:2 E4 E4 E4:2 E4 G4 C4:1.5 D4:.5 E4:4'],
  ['silent', 'Silent Night', 'Franz Gruber', 'h', 120, 'G4:1.5 A4:.5 G4 E4:3 G4:1.5 A4:.5 G4 E4:3 D5:2 D5 B4:3 C5:2 C5 G4:3'],
  ['joy', 'Joy to the World', 'Lowell Mason (after Handel)', 'h', 120, 'C5:2 B4:1.5 A4:.5 G4:3 F4 E4:2 D4:2 C4:3 G4 A4:3 A4 B4:3 B4 C5:3'],
  ['hark', 'Hark! The Herald Angels Sing', 'Felix Mendelssohn', 'h', 110, 'G4 C5 C5:1.5 B4:.5 C5 E5 E5 D5 G5 G5 G5:1.5 F5:.5 E5 D5 E5:2', 'de'],
  ['deck', 'Deck the Halls', 'Traditional (Welsh)', 'h', 120, 'G4:1.5 F4:.5 E4 D4 C4 D4 E4 C4 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4 B3 C4:2'],
  ['wewish', 'We Wish You a Merry Christmas', 'Traditional (English)', 'h', 150, 'G3 C4 C4:.5 D4:.5 C4:.5 B3:.5 A3 A3 A3 D4 D4:.5 E4:.5 D4:.5 C4:.5 B3 G3 G3 E4 E4:.5 F4:.5 E4:.5 D4:.5 C4 A3 G3:.5 G3:.5 A3 D4 B3 C4:2'],
  ['adeste', 'O Come, All Ye Faithful', 'John Francis Wade', 'h', 110, 'G4:2 G4 D4 G4:2 A4:2 D4:4 B4 A4 B4 C5 B4:2 A4:2'],
  ['noel', 'The First Noel', 'Traditional (English)', 'h', 100, 'E4:.5 D4:.5 C4:1.5 D4:.5 E4 F4 G4:2 A4:.5 B4:.5 C5 B4 A4 G4:2'],
  ['godrest', 'God Rest Ye Merry, Gentlemen', 'Traditional (English)', 'h', 120, 'E4 E4 B4 B4 A4 G4 F#4 E4 D4 E4 F#4 G4 A4:2 B4:2'],
  ['wenceslas', 'Good King Wenceslas', 'Traditional', 'h', 120, 'G4 G4 G4 A4 G4 G4 D4:2 E4 D4 E4 F#4 G4:2 G4:2'],
  ['tannenbaum', 'O Christmas Tree', 'Traditional (German)', 'h', 100, 'D4 G4:.75 G4:.25 G4:1.5 A4:.5 B4:.75 B4:.25 B4:2 B4 A4 B4 C5:1.5 F#4:.5 A4 G4:2', 'de'],
  ['jolly', 'Jolly Old Saint Nicholas', 'Traditional', 'h', 120, 'B4 B4 B4 B4 A4 A4 A4:2 G4 G4 G4 G4 B4:4'],
  ['angels', 'Angels We Have Heard on High', 'Traditional (French)', 'h', 110, 'E4 E4 E4 G4 G4:1.5 F4:.5 E4:2 E4 D4 E4 G4 E4:1.5 D4:.5 C4:2', 'fr'],
  ['wethree', 'We Three Kings', 'John Henry Hopkins Jr.', 'h', 110, 'B4:2 A4 G4:2 E4 F#4 G4 F#4 E4:3'],
  ['dingdong', 'Ding Dong Merrily on High', 'Traditional (French)', 'h', 120, 'G4 G4 A4:.5 G4:.5 F#4:.5 E4:.5 D4:2', 'fr'],

  // ---- Classical ----
  ['furelise', 'Für Elise', 'Ludwig van Beethoven', 'c', 140, 'E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1.5 C4:.5 E4:.5 A4:.5 B4:1.5 E4:.5 G#4:.5 B4:.5 C5:1.5', 'de'],
  ['odetojoy', 'Ode to Joy', 'Ludwig van Beethoven', 'c', 110, 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:1.5 D4:.5 D4:2', 'de'],
  ['fifth', 'Symphony No. 5', 'Ludwig van Beethoven', 'c', 108, 'G4:.5 G4:.5 G4:.5 Eb4:3 r:.5 F4:.5 F4:.5 F4:.5 D4:3', 'de'],
  ['moonlight', 'Moonlight Sonata', 'Ludwig van Beethoven', 'c', 160, 'G#3 C#4 E4 G#3 C#4 E4 A3 C#4 E4 A3 D4 F#4:2', 'de'],
  ['nachtmusik', 'Eine kleine Nachtmusik', 'W. A. Mozart', 'c', 120, 'G4 r:.5 D4:.5 G4 r:.5 D4:.5 G4:.5 D4:.5 G4:.5 B4:.5 D5:2'],
  ['turkish', 'Rondo alla Turca', 'W. A. Mozart', 'c', 100, 'B4:.25 A4:.25 G#4:.25 A4:.25 C5 D5:.25 C5:.25 B4:.25 C5:.25 E5 F5:.25 E5:.25 D#5:.25 E5:.25 B5:.25 A5:.25 G#5:.25 A5:.25 B5:.25 A5:.25 G#5:.25 A5:.25 C6'],
  ['k545', 'Sonata in C, K. 545', 'W. A. Mozart', 'c', 90, 'C5:2 E5 G5 B4:1.5 C5:.25 D5:.25 C5:2'],
  ['sym40', 'Symphony No. 40', 'W. A. Mozart', 'c', 110, 'Eb5:.5 D5:.5 D5 Eb5:.5 D5:.5 D5 Eb5:.5 D5:.5 D5 Bb5:2'],
  ['minuetg', 'Minuet in G', 'Christian Petzold (Bach notebook)', 'c', 120, 'D5 G4:.5 A4:.5 B4:.5 C5:.5 D5 G4 G4 E5 C5:.5 D5:.5 E5:.5 F#5:.5 G5 G4 G4', 'de'],
  ['preludec', 'Prelude in C', 'J. S. Bach', 'c', 100, 'C4:.5 E4:.5 G4:.5 C5:.5 E5:.5 G4:.5 C5:.5 E5:.5', 'de'],
  ['invention', 'Invention No. 1', 'J. S. Bach', 'c', 60, 'C4:.25 D4:.25 E4:.25 F4:.25 D4:.25 E4:.25 C4:.25 G4:1', 'de'],
  ['jesujoy', "Jesu, Joy of Man's Desiring", 'J. S. Bach', 'c', 90, 'G3:.33 A3:.33 B3:.33 D4:.33 C4:.33 C4:.33 E4:.33 D4:.33 D4:.33 G4:.33 F#4:.33 G4:.33 D4:.33 B3:.33 G3:.33', 'de'],
  ['toccata', 'Toccata in D minor', 'J. S. Bach', 'c', 60, 'A4:.25 G4:.25 A4:2 G4:.25 F4:.25 E4:.25 D4:.25 C#4 D4:2', 'de'],
  ['littlefugue', 'Little Fugue in G minor', 'J. S. Bach', 'c', 80, 'G4:2 D5:2 Bb4:1.5 A4:.5 G4:.5 Bb4:.5 A4:.5 G4:.5 F#4:.5 A4:.5 D4:2', 'de'],
  ['canon', 'Canon in D', 'Johann Pachelbel', 'c', 100, 'F#5:2 E5:2 D5:2 C#5:2 B4:2 A4:2 B4:2 C#5:2', 'de'],
  ['spring', 'Spring (The Four Seasons)', 'Antonio Vivaldi', 'c', 120, 'E4 G#4 G#4 G#4 F#4:.5 E4:.5 B4:3 B4:.5 A4:.5 G#4 G#4 G#4 F#4:.5 E4:.5 B4:3', 'it'],
  ['surprise', 'Surprise Symphony', 'Joseph Haydn', 'c', 110, 'C4 C4 E4 E4 G4 G4 E4:2 F4 F4 D4 D4 B3 B3 G3:2'],
  ['brahms', 'Lullaby (Wiegenlied)', 'Johannes Brahms', 'c', 100, 'E4:.5 E4:.5 G4:2 E4:.5 E4:.5 G4:2 E4:.5 G4:.5 C5:2 B4 A4:2', 'de'],
  ['morning', 'Morning Mood', 'Edvard Grieg', 'c', 180, 'G4 E4 D4 C4 D4 E4 G4 E4 D4 C4 D4 E4 D4 E4 G4 E4 G4 A4 E4 A4 G4 E4 D4 C4:3'],
  ['mountainking', 'In the Hall of the Mountain King', 'Edvard Grieg', 'c', 100, 'A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4 D#4:.5 B3:.5 D#4 D4:.5 Bb3:.5 D4'],
  ['newworld', 'New World Symphony (Largo)', 'Antonín Dvořák', 'c', 70, 'E4:1.5 G4:.5 G4:2 E4:1.5 D4:.5 C4:2 D4 E4 G4 E4 D4:4'],
  ['swanlake', 'Swan Lake', 'P. I. Tchaikovsky', 'c', 90, 'F#4:3 B3:.5 C#4:.5 D4:.5 E4:.5 F#4:1.5 D4:.5 F#4:1.5 D4:.5 F#4:1.5 B3:.5 D4:.5 B3:.5 G3:.5 D4:.5 B3:3'],
  ['cancan', 'Can-Can (Galop infernal)', 'Jacques Offenbach', 'c', 140, 'C4:2 D4:.5 F4:.5 E4:.5 D4:.5 G4 G4 G4:.5 A4:.5 E4:.5 F4:.5 D4 D4', 'fr'],
  ['williamtell', 'William Tell Overture', 'Gioachino Rossini', 'c', 120, 'G4:.25 G4:.25 G4:.5 G4:.25 G4:.25 G4:.5 G4:.25 G4:.25 C5:.5 D5:.5 E5:.5', 'it'],
  ['funeral', 'Funeral March', 'Frédéric Chopin', 'c', 60, 'Bb3 Bb3:.75 Bb3:.25 Bb3:2 Db4:.75 C4:.25 C4:.75 Bb3:.25 Bb3:.75 A3:.25 Bb3:2'],
  ['bridal', 'Bridal Chorus (Here Comes the Bride)', 'Richard Wagner', 'c', 70, 'C4 F4:.75 F4:.25 F4:2 C4 G4:.75 E4:.25 F4:2', 'de'],
  ['donna', 'La donna è mobile', 'Giuseppe Verdi', 'c', 140, 'E4:.75 E4:.25 E4 G4:.75 F4:.25 D4:2 D4:.75 D4:.25 D4 F4:.75 E4:.25 C4:2', 'it'],
  ['entertainer', 'The Entertainer', 'Scott Joplin', 'c', 100, 'D4:.5 D#4:.5 E4:.5 C5 E4:.5 C5 E4:.5 C5:3 C5:.5 D5:.5 D#5:.5 E5:.5 C5:.5 D5:.5 E5 B4:.5 D5 C5:2'],
  ['alsosprach', 'Also sprach Zarathustra', 'Richard Strauss', 'c', 60, 'C4:3 G4:3 C5:3 E5:.5 Eb5:3', 'de'],
  ['gymnopedie', 'Gymnopédie No. 1', 'Erik Satie', 'c', 80, 'F#5 A5 G5 F#5 C#5 B4 C#5 D5:3 A4:6', 'fr'],

  // ---- Germany ----
  // source: https://de.wikipedia.org/wiki/Kuckuck,_Kuckuck,_ruft’s_aus_dem_Wald; traditional (melody Austrian/Bavarian folk, 1817; text Hoffmann von Fallersleben 1835); top voice of the two-part score
  ['de_kuckuck', 'Kuckuck, Kuckuck, ruft\'s aus dem Wald', 'Traditional (German)', 'k', 140, 'D5 B4 r D5 B4 r A4 G4 A4 G4:3 A4 A4 B4 C5:2 A4 B4 B4 C5 D5:2 B4', 'de'],
  // source: https://de.wikipedia.org/wiki/Fuchs,_du_hast_die_Gans_gestohlen; traditional (text Ernst Anschütz 1824)
  ['de_fuchs', 'Fuchs, du hast die Gans gestohlen (Fox, You Stole the Goose)', 'Traditional (German)', 'k', 120, 'D4 E4 F#4 G4 A4 A4 A4 A4 B4 G4 D5 B4 A4:4 B4 G4 D5 B4 A4:4', 'de'],
  // source: https://de.wikipedia.org/wiki/Alle_Vögel_sind_schon_da; traditional (text Hoffmann von Fallersleben 1835)
  ['de_allevoegel', 'Alle Vögel sind schon da (All the Birds Are Here)', 'Traditional (German)', 'k', 110, 'D4:1.5 F#4:.5 A4 D5 B4 D5:.5 B4:.5 A4:2 G4:1.5 A4:.5 F#4 D4 E4:2 D4', 'de'],
  // source: https://de.wikipedia.org/wiki/Kommt_ein_Vogel_geflogen; traditional
  ['de_kommtvogel', 'Kommt ein Vogel geflogen (A Bird Comes Flying)', 'Traditional (German)', 'k', 120, 'A4:.5 Bb4:.5 C5 A4 A4 A4 G4 G4:.5 A4:.5 Bb4 G4 G4:.5 D5:.5 C5', 'de'],
  // source: https://de.wikipedia.org/wiki/Weißt_du,_wie_viel_Sternlein_stehen; traditional (melody attested 1818; text Wilhelm Hey 1837)
  ['de_sternlein', 'Weißt du, wie viel Sternlein stehen (Do You Know How Many Stars)', 'Traditional (German)', 'k', 90, 'F4:.5 G4:.5 A4 A4 Bb4:.5 G4:.5 D5:.5 C5:.5 C5 A4:.5 C5:.5 C5:.5 Bb4:.5 Bb4 C5:.5 Bb4:.5 A4:2', 'de'],
  // source: https://de.wikipedia.org/wiki/Summ,_summ,_summ; traditional (Bohemian folk melody; text Hoffmann von Fallersleben 1843)
  ['de_summ', 'Summ, summ, summ (Buzz, Buzz, Buzz)', 'Traditional (German)', 'k', 100, 'D5 C5 B4 r A4:.5 B4:.5 C5:.5 A4:.5 G4 r B4:.5 C5:.5 D5:.5 B4:.5 A4:.5 B4:.5 C5:.5 A4:.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Muss_i_denn,_muss_i_denn_zum_Städtele_hinaus; traditional Swabian (arr. Friedrich Silcher 1827)
  ['de_mussidenn', 'Muss i denn (Must I Then)', 'Traditional (Swabian)', 'f', 110, 'Eb4:.5 F4:.5 G4 G4:.5 Bb4:.5 Ab4 Ab4:.5 C5:.5 Bb4 Bb4:.5 Ab4:.5 G4 G4', 'de'],
  // source: https://de.wikipedia.org/wiki/Heidenröslein (section "Vertonung von H. Werner"); Heinrich Werner 1829 (the popular folk-song setting, not Schubert's)
  ['de_heidenroeslein', 'Heidenröslein (Little Heath Rose)', 'Heinrich Werner', 'f', 100, 'F#4 F#4:.5 A4:.75 G4:.25 F#4:.5 E4 E4:.5 E4:1.5 F#4 F#4:.5 G4:.5 A4:.5 B4:.5 B4:1.5 A4', 'de'],
  // source: https://de.wikipedia.org/wiki/Ein_Jäger_aus_Kurpfalz; traditional
  ['de_jaeger', 'Ein Jäger aus Kurpfalz (A Hunter from the Palatinate)', 'Traditional (German)', 'f', 110, 'C4:.5 F4:.5 A4:.5 A4:.5 A4:.5 A4:1.5 C5:.5 C5:.5 Bb4:.5 Bb4:.5 A4:.5 A4:.5 G4:.5 G4:.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Der_Kuckuck_und_der_Esel; Carl Friedrich Zelter 1810
  ['de_kuckuckesel', 'Der Kuckuck und der Esel (The Cuckoo and the Donkey)', 'Carl Friedrich Zelter', 'k', 140, 'C5 A4 C5 A4 C5 Bb4 Bb4 r Bb4 G4 Bb4 G4 Bb4 A4:2', 'de'],
  // source: https://de.wikipedia.org/wiki/Die_Vogelhochzeit; traditional
  ['de_vogelhochzeit', 'Die Vogelhochzeit (The Birds\' Wedding)', 'Traditional (German)', 'k', 100, 'B4:.5 D5:.5 B4:.5 D5:.5 B4:.5 C5:.5 A4:.5 C5:.5 A4:.5 B4:.5 G4:.5 D5:.5 B4:.5 A4:.5 D5:.5 D5:.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Häschen_in_der_Grube; traditional
  ['de_haeschen', 'Häschen in der Grube (Little Hare in the Hollow)', 'Traditional (German)', 'k', 100, 'D4:.5 E4:.5 F#4:.5 G4:.5 A4 A4 B4:.5 G4:.5 D5:.5 B4:.5 A4 r B4:.5 G4:.5 D5:.5 B4:.5 A4', 'de'],
  // source: https://de.wikipedia.org/wiki/Schlaf,_Kindlein,_schlaf; Johann Friedrich Reichardt 1781 (after a folk tune)
  ['de_schlafkindlein', 'Schlaf, Kindlein, schlaf (Sleep, Baby, Sleep)', 'Johann Friedrich Reichardt', 'k', 80, 'A4 G4:.5 G4:.5 F4 r:.5 F4:.25 A4:.25 C5:.5 C5:.5 Bb4:.5 Bb4:.5 A4 r:.5 A4:.5 Bb4:.5 Bb4:.5 G4:.5 G4:.5 C5:.5 C5:.5 A4:.5 A4:.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Ich_geh’_mit_meiner_Laterne; traditional (attested 1818, printed by Fritz Jöde 1913)
  ['de_laterne', 'Ich geh mit meiner Laterne (I Walk with My Lantern)', 'Traditional (German)', 'k', 90, 'D4:.5 G4 G4:.5 B4:.5 G4:.5 B4:.5 D5:1.5 B4 G4:.5 A4:.5 A4:.5 A4:.5 A4:.5 B4:.5 A4:.5 G4:1.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Ihr_Kinderlein,_kommet; Johann Abraham Peter Schulz 1794
  ['de_kinderlein', 'Ihr Kinderlein, kommet (O Come, Little Children)', 'J. A. P. Schulz', 'h', 90, 'A4:.5 A4 F#4:.5 A4:.5 A4 F#4:.5 A4:.5 G4 E4:.5 G4:.5 F#4:1.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Kling,_Glöckchen,_klingelingeling; traditional (melody composer unknown; text Karl Enslin 1854)
  ['de_klingglocke', 'Kling, Glöckchen, klingelingeling (Ring, Little Bell)', 'Traditional (German)', 'h', 72, 'C5 A4:.5 Bb4:.5 C5:.25 D5:.25 C5:.25 D5:.25 C5 Bb4 G4:.5 C5:.5 A4:2', 'de'],
  // source: https://de.wikipedia.org/wiki/Leise_rieselt_der_Schnee; Eduard Ebel 1895 (melody attribution uncertain, possibly folk)
  ['de_leiserieselt', 'Leise rieselt der Schnee (Softly Falls the Snow)', 'Eduard Ebel', 'h', 96, 'B4 B4:.5 A4:.5 B4:.5 A4:.5 G4:2.5 r:.5 G4 E4:.5 G4:.5 F#4:.5 E4:.5 D4:2.5 r:.5 A4:.5 G#4:.5 A4:.5 C5:.5 B4:.5 A4:.5 G4:2.5', 'de'],
  // source: https://de.wikipedia.org/wiki/Es_ist_ein_Ros_entsprungen; traditional (Speyer hymnal 1599; harmonised by Michael Praetorius 1609); soprano line
  ['de_rosentsprungen', 'Es ist ein Ros entsprungen (Lo, How a Rose E\'er Blooming)', 'Traditional (German)', 'h', 80, 'C5:2 C5 C5 D5 C5 C5:2 A4:2 Bb4:2 A4 G4:2 F4:2 E4 F4:2', 'de'],
  // source: https://de.wikipedia.org/wiki/Lobe_den_Herren,_den_mächtigen_König_der_Ehren; Stralsund hymnal 1665
  ['de_lobeherren', 'Lobe den Herren (Praise to the Lord, the Almighty)', 'Traditional (German hymn)', 's', 110, 'F4 F4 C5 A4:1.5 G4:.5 F4 E4 D4 C4 D4 E4 F4 G4:3 F4:3', 'de'],

  // ---- France ----
  // source: https://fr.wikipedia.org/w/index.php?title=Sur_le_pont_d%27Avignon&action=raw (LilyPond); traditional
  ['fr_avignon', "Sur le pont d'Avignon", 'Traditional (French)', 'k', 120, 'F4:.5 F4:.5 F4 G4:.5 G4:.5 G4 A4:.5 Bb4:.5 C5:.5 F4:.5 E4:.5 F4:.5 G4:.5 C4:.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Il_%C3%A9tait_une_berg%C3%A8re&action=raw (LilyPond); traditional
  ['fr_bergere', 'Il était une bergère (There Was a Shepherdess)', 'Traditional (French)', 'k', 110, 'G4:.5 C5 D5:.5 E5 D5:.5 C5:1.5 G4 G4:.5 A4 A4:.5 G4:.5 G4:.5 G4:.5 A4 A4:.5 G4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Il_pleut,_il_pleut,_berg%C3%A8re&action=raw (LilyPond); Louis-Victor Simon, c. 1780
  ['fr_ilpleut', 'Il pleut, il pleut, bergère', 'Louis-Victor Simon', 'f', 110, 'A4:.5 C5 A4:.5 C5 A4:.5 F4:1.5 C4 r:.5 F4:.5 E4:.5 F4:.5 G4 G4:.5 A4:3', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Dansons_la_capucine&action=raw (LilyPond, first version); traditional
  ['fr_capucine', 'Dansons la capucine', 'Traditional (French)', 'k', 90, 'F4 G4:.5 G4:.5 C5:.5 C5:.5 A4:.5 A4:.5 F4 G4:.5 G4:.5 C5:.5 C5:.5 A4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Le_Bon_Roi_Dagobert&action=raw (LilyPond); traditional
  ['fr_dagobert', 'Le bon roi Dagobert (Good King Dagobert)', 'Traditional (French)', 'k', 120, 'B4:.5 B4 A4:.5 A4 G4:.5 G4:1.5 A4:1.5 B4:.5 C5:.5 B4:.5 A4:.5 G4:.5 A4:.5 G4:1.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Il_%C3%A9tait_un_petit_navire&action=raw (LilyPond); traditional
  ['fr_navire', 'Il était un petit navire (There Was a Little Ship)', 'Traditional (French)', 'k', 96, 'B4:.5 B4:.5 B4:.5 D4 B4 C5:.5 B4:.5 B4 A4:.5 A4:.5 A4:.5 A4:.5 D4 A4 B4:.5 A4:.5 A4 G4:.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Aupr%C3%A8s_de_ma_blonde&action=raw (LilyPond); traditional; refrain only
  ['fr_blonde', 'Auprès de ma blonde', 'Traditional (French)', 'f', 120, 'F4:1.5 G4:.5 A4:.5 Bb4:.5 A4:1.5 C5:1.5 G4 Bb4:.5 A4 G4:.5 F4 D4:.5 C4:1.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Nous_n%27irons_plus_au_bois&action=raw (LilyPond); traditional
  ['fr_bois', "Nous n'irons plus au bois", 'Traditional (French)', 'k', 110, 'F4:.5 A4:.5 Bb4:.5 C5 F5 C5:.75 D5:.25 C5:.5 Bb4:.5 A4 G4 F4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Meunier_tu_dors&action=raw (LilyPond); traditional
  ['fr_meunier', 'Meunier, tu dors (Miller, You Sleep)', 'Traditional (French)', 'k', 100, 'C4 F4:2 r A4 F4:2 r G4:.5 G4:.5 G4 G4:.5 G4:.5 G4 F4:.5 G4:.5 A4:2 F4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Dodo,_l%27enfant_do&action=raw (LilyPond); traditional lullaby
  ['fr_dodo', "Dodo, l'enfant do", 'Traditional (French)', 'k', 80, 'E4 C4 E4:.5 E4:.5 C4 D4:.5 E4:.5 F4:.5 E4:.5 D4:.5 G4:.5 E4:.5 C4:.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Il_court,_il_court,_le_furet&action=raw (LilyPond); traditional
  ['fr_furet', 'Il court, il court, le furet (The Ferret Runs)', 'Traditional (French)', 'k', 120, 'F4:.5 Bb4:.5 C5:.5 D5 C5:.5 C5:.5 G4 Bb4:.5 A4:.5 G4:.5 F4:.5 G4:.5 A4:.5 Bb4', 'fr'],
  // source: https://abcnotation.com/tunePage?a=tapazovaldoten.altervista.org/canzoni/cadet_rousselle/cadet_rousselle_abc/0001 (ABC, after Chants et chansons populaires de la France, 1858); traditional
  ['fr_cadet', 'Cadet Rousselle', 'Traditional (French)', 'k', 125, 'G4:.5 A4:.5 B4:.5 C5 C5:.5 C5 E5:.5 C5:1.5 D5:.5 D5:.5 D5:.5 D5 C5:.5 B4 A4:.5 G4:1.5', 'fr'],
  // source: https://abcnotation.com/tunePage?a=trillian.mit.edu/~jc/music/abc/test/svg/SVG02/0000 (ABC); traditional
  ['fr_tabac', "J'ai du bon tabac", 'Traditional (French)', 'k', 120, 'C4:.5 D4:.5 E4:.5 C4:.5 D4 D4:.5 E4:.5 F4 F4 E4 E4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=%C3%80_la_claire_fontaine&action=raw (LilyPond); traditional
  ['fr_fontaine', 'À la claire fontaine (At the Clear Fountain)', 'Traditional (French)', 'f', 90, 'F4 F4:.5 A4:.5 A4:.5 G4:.5 A4:.5 G4:.5 F4 F4:.5 A4:.5 A4:.5 G4:.5 A4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Le_Temps_des_cerises&action=raw (LilyPond); Antoine Renard, 1868
  ['fr_cerises', 'Le Temps des cerises (Cherry Time)', 'Antoine Renard', 'f', 100, 'C4:.5 F4:.5 F4:.5 F4:.5 F4 F4:.5 G4:.5 G4:.5 G4:.5 G4:.5 G4:.5 G4:.5 A4:.5 A4:.5 A4:.5 A4', 'fr'],
  // source: https://en.wikipedia.org/w/index.php?title=Il_est_n%C3%A9,_le_divin_Enfant&action=raw (LilyPond, refrain); traditional
  ['fr_ilestne', 'Il est né, le divin Enfant (He Is Born)', 'Traditional (French)', 'h', 110, 'D4 G4 G4 B4:.5 G4:.5 D4 G4 G4:2 G4 G4:.5 A4:.5 B4 C5:.5 B4:.5 A4 G4 A4:.5 F#4:.5 D4', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Entre_le_b%C5%93uf_et_l%27%C3%A2ne_gris&action=raw (LilyPond); traditional
  ['fr_boeuf', "Entre le bœuf et l'âne gris (Between the Ox and the Grey Donkey)", 'Traditional (French)', 'h', 140, 'E4:2 E4 F#4 G4:2 E4:2 B4:2 B4:2 B4:4 E5:4 B4:4 B4 A4 G4 A4 B4:4', 'fr'],
  // source: https://en.wikipedia.org/w/index.php?title=Bring_a_Torch,_Jeanette,_Isabella&action=raw (LilyPond, soprano); traditional (Provençal)
  ['fr_torch', 'Bring a Torch, Jeannette, Isabella (Un flambeau, Jeannette, Isabelle)', 'Traditional (French)', 'h', 110, 'D5 G4:.5 G4:.5 F#4:.5 G4:.5 A4:.5 B4:.5 C5:.5 B4 A4:.5 D5 G4:.5 G4:.5 F#4:.5 G4:.5 A4:.5 B4:.5 A4:.5 G4', 'fr'],
  // source: https://en.wikipedia.org/w/index.php?title=L%27Arl%C3%A9sienne_(Bizet)&action=raw (LilyPond, first excerpt); traditional Provençal carol used by Bizet, 1872; 16th rests folded into the preceding note
  ['fr_marcherois', 'March of the Kings (Marche des Rois)', 'Traditional (Provençal), arr. Georges Bizet', 'h', 100, 'C4 G3 C4:1.75 D4:.25 Eb4:.75 D4:.25 Eb4:.75 C4:.25 G4:1.75 Eb4:.25 F4 G4 Ab4:.5 G4:.5 F4:.5 Eb4:.5 D4 G4', 'fr'],
  // source: https://en.wikipedia.org/w/index.php?title=Habanera_(aria)&action=raw (LilyPond); Georges Bizet, 1875
  ['fr_habanera', 'Habanera (Carmen)', 'Georges Bizet', 'c', 72, 'D5:.5 C#5:.5 C5:.33 C5:.33 C5:.33 B4:.5 Bb4:.5 A4:.5 A4:.25 A4:.25 G#4:.5 G4:.5 F4:.17 G4:.17 F4:.17 E4:.25 F4:.25 G4:.5 F4:.5 E4:.5', 'fr'],
  // source: https://fr.wikipedia.org/w/index.php?title=Duo_des_fleurs&action=raw (LilyPond, Lakmé's part); Léo Delibes, 1883
  ['fr_flowerduet', 'Flower Duet (Lakmé)', 'Léo Delibes', 'c', 72, 'D#5:1.5 C#5:.25 D#5:.25 E5:.5 r:.5 D#5:1.5 C#5:.25 D#5:.25 E5:.5 r:.5 D#5:.25 E5:.25 D#5:.25 E5:.25 F#5:.25 G#5:.25 F#5:.25 E5:.25', 'fr'],
  // source: https://abcnotation.com/tunePage?a=trillian.mit.edu/~jc/music/abc/mirror/homepages.inf.ed.ac.uk/s0570628/Barcarolle/0000 (ABC, in G); Jacques Offenbach, 1881
  ['fr_barcarolle', 'Barcarolle (The Tales of Hoffmann)', 'Jacques Offenbach', 'c', 80, 'B4 C5:.5 C5 B4:.5 B4:.5 A4:.5 C5:.5 C5 B4:.5 B4:.5 A4:.5 C5:.5 C5 B4:.5 B4:2.5', 'fr'],

  // ---- Italy ----
  // source: https://www.flutetunes.com/tunes/o-sole-mio.mid (refrain; cross-checked with https://trillian.mit.edu/~jc/music/abc/Italy/song/O_Sole_Mio-C-32-6w.abc); 1898; refrain "Ma n'atu sole", key of G as in source; last note lengthened
  ['it_o_sole_mio', "'O sole mio", 'Eduardo di Capua', 'f', 80, 'G5:.5 G5:.5 F#5:.375 F#5:.125 D5:1 D5:1.5 F#5:.5 F#5:.5 E5:.375 E5:.125 C5:2.5 F#5:.5 F#5:.5 E5:.375 E5:.125 C5:1 C5:2', 'it'],
  // source: https://trillian.mit.edu/~jc/music/abc/Italy/song/SantaLucia_Cw.abc; 1849 (Teodoro Cottrau); first line "Sul mare luccica, l'astro d'argento"
  ['it_santa_lucia', 'Santa Lucia', 'Teodoro Cottrau', 'f', 100, 'G4 G4:1.5 C5:.5 C5:.5 B4:.5 B4:2 F4 F4:1.5 A4:.5 A4:.5 G4:.5 G4:2', 'it'],
  // source: https://trillian.mit.edu/~jc/music/abc/Italy/TornaASorrento_Amw.abc; 1902; verse "Vide 'o mare quant'è bello"
  ['it_torna_surriento', "Torna a Surriento (Come Back to Sorrento)", 'Ernesto De Curtis', 'f', 110, 'A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5 E5:2 D5:.5 E5:.5 F5:.5 D5:.5 F5:.5 D5:.5 A5 A5:2', 'it'],
  // source: https://it.wikipedia.org/w/index.php?title=Funiculì_funiculà&action=raw (LilyPond, ripresa; matches https://www.flutetunes.com/tunes/funiculi-funicula.mid); 1880; chorus "Jamme, jamme 'ncoppa, jamme jà"; last note lengthened
  ['it_funiculi', 'Funiculì, Funiculà', 'Luigi Denza', 'f', 180, 'D5:1.5 C5:.5 r:1 D5:1.5 C5:.5 r:1 Eb5 D5:.5 C5 Eb5:.5 D5:2.5 r:.5 D5:1.5 C5:.5 r:1 D5:1.5 C5:.5 r:1 Eb5 D5:.5 C5 Eb5:.5 Bb4:1.5', 'it'],
  // source: https://en.wikipedia.org/w/index.php?title=Bella_ciao&action=raw (LilyPond; matches https://www.flutetunes.com/tunes/bella-ciao.mid); traditional (anonymous partisan song on a folk melody); last note lengthened
  ['it_bella_ciao', 'Bella ciao', 'Traditional (Italian)', 'f', 120, 'A3:.5 D4:.5 E4:.5 F4:.5 D4:2 A3:.5 D4:.5 E4:.5 F4:.5 D4:2 A3:.5 D4:.5 E4:.5 F4 E4:.5 D4:.5 F4 E4:.5 D4:.5 A4:2', 'it'],
  // source: https://en.wikipedia.org/w/index.php?title=Il_Canto_degli_Italiani&action=raw (first LilyPond excerpt; matches https://trillian.mit.edu/~jc/music/abc/Italy/song/Inno_di_Mameli.abc); 1847
  ['it_mameli', "Il Canto degli Italiani (Fratelli d'Italia)", 'Michele Novaro', 's', 100, 'F4 F4:.75 G4:.25 F4 r D5 D5:.75 Eb5:.25 D5 r D5 F5:.75 Eb5:.25 D5 r C5 D5:.75 C5:.25 Bb4:2', 'it'],
  // source: https://it.wikipedia.org/w/index.php?title=Tu_scendi_dalle_stelle&action=raw (LilyPond soprano; matches https://trillian.mit.edu/~jc/music/abc/Italy/xmas/TuScendiDalleStelle_G.abc); 1754
  ['it_tu_scendi', 'Tu scendi dalle stelle', "Alfonso Maria de' Liguori", 'h', 90, 'Bb4:.5 Bb4 C5:.5 Bb4 Ab4:.5 Ab4:.5 G4:2 F4:.5 G4:.5 Ab4:.5 Bb4:.5 Bb4:.5 Ab4:.5 G4:.5 F4:2.5', 'it'],
  // source: https://www.flutetunes.com/tunes/puccini-gianni-schicchi-o-mio-babbino-caro.mid (cross-checked with https://trillian.mit.edu/~jc/music/abc/Italy/song/O_Mio_Babbino_Caro-C1-27-.abc); 1918
  ['it_babbino_caro', 'O mio babbino caro', 'Giacomo Puccini', 'c', 70, 'Ab4:.5 Ab4:.5 Ab4:.5 C5 G4:.5 F4:1.5 Eb4:1.5 Ab4:.5 Bb4:.5 C5:.5 Ab4 Ab5:.5 Eb5:1.5', 'it'],
  // source: https://trillian.mit.edu/~jc/music/abc/Italy/song/Ciribiribin_F.abc; 1898
  ['it_ciribiribin', 'Ciribiribin', 'Alberto Pestalozza', 'f', 140, 'C5 A4 G4:2 F4 E4:2 F4 D4:.5 E4:.5 C4:3 F4 G4 A4:2 C5 D5:2 F5 E5:3', 'it'],
  // source: https://trillian.mit.edu/~jc/music/abc/Italy/song/Core_nGrato-C-W.abc; 1911; refrain "Core, core 'ngrato"
  ['it_core_ngrato', "Core 'ngrato (Catarì)", 'Salvatore Cardillo', 'f', 72, 'E5:2.5 B4:.5 B4:.33 E5:.33 B4:.34 A4 A4:2 B4:.5 C5:.5 D5:2.5 B4:.5 B4:.33 D5:.33 B4:.34 G4:3', 'it'],
  // source: https://www.flutetunes.com/tunes/the-carnival-of-venice-duet.mid (matches Kerr's Merry Melodies v.3, https://trillian.mit.edu/~jc/music/book/Kerr/MM3-V1.abc); traditional (Venetian)
  ['it_carnevale_venezia', 'The Carnival of Venice (Il carnevale di Venezia)', 'Traditional (Italian)', 'f', 120, 'D5:.5 E5 D5:.5 C5 B4:.5 D5 C5:.5 A4:1.5 B4 C5:.5 E5 D5:.5 B4:2.5', 'it'],
  // source: https://en.wikipedia.org/w/index.php?title=Largo_al_factotum&action=raw (LilyPond); 1816; up an octave from baritone pitch; slurred C-C on "Lar-" written as one note
  ['it_factotum', 'Largo al factotum (The Barber of Seville)', 'Gioachino Rossini', 'c', 135, 'C5:2 D5:.5 B4:.5 C5:.5 D5:.5 B4:.5 C5:.5 D5:.5 B4:.5 C5:.5 r:1 E5:1.5 E4:.5', 'it'],
  // source: https://trillian.mit.edu/~jc/music/book/Kerr/MM4-V1.abc (#329 "Anvil Chorus (il Trovatore)"); 1853
  ['it_anvil_chorus', 'Anvil Chorus (Il trovatore)', 'Giuseppe Verdi', 'c', 110, 'F#5:2 F#5:1.5 F#5:.5 F#5:1.5 E5:.5 D5:1.5 B4:.5 A4:1.5 C#5:.5 E5:1.5 G5:.5 F#5:2 D5', 'it'],
  // source: https://www.mutopiaproject.org/ftp/VerdiG/Traviata_02/Traviata_02.ly (piano reduction, melody line; matches Kerr MM4 #367); 1853; grace notes omitted; last note lengthened
  ['it_brindisi', "Libiamo ne' lieti calici (Brindisi, La traviata)", 'Giuseppe Verdi', 'c', 104, 'F4:.5 D5:2 F4:.5 D5:.5 D5:.5 F4:.5 D5:.5 D5:.5 C#5:.5 D5:.5 F5:2 Eb5:.5 D5:.5 C5:1', 'it'],
  // source: https://www.mutopiaproject.org/ftp/ClementiM/O36/sonatina-1/sonatina-1.ly; c. 1797; first 3 bars, right hand
  ['it_clementi_sonatina', 'Sonatina in C, Op. 36 No. 1', 'Muzio Clementi', 'c', 130, 'C5 E5:.5 C5:.5 G4 G4 C5 E5:.5 C5:.5 G4 G5 F5:.5 E5:.5 D5:.5 C5:.5 B4:.5 C5:.5 B4:.5 C5:.5', 'it'],
  // source: https://www.mutopiaproject.org/ftp/PaganiniN/O1/Caprice_24/Caprice_24.ly (matches https://www.flutetunes.com/tunes/paganini-caprice-no24.mid); 1820
  ['it_paganini_24', 'Caprice No. 24', 'Niccolò Paganini', 'c', 90, 'A4:.5 r:.25 A4:.25 A4:.25 C5:.25 B4:.25 A4:.25 E5:.5 r:.25 E4:.25 E4:.25 G#4:.25 F#4:.25 E4:.25 A4:.5 r:.25 A4:.25 A4:.25 C5:.25 B4:.25 A4:.25 E5 E4:.5', 'it'],
  // source: https://www.mutopiaproject.org/ftp/VivaldiA/O8/winter/winter-lys.zip (winter2.ly, solo violin; matches https://www.flutetunes.com/tunes/vivaldi-the-four-seasons-winter-largo.mid); 1725
  ['it_winter_largo', 'Winter: Largo (The Four Seasons)', 'Antonio Vivaldi', 'c', 60, 'Eb5:.5 Bb5:.25 Ab5:.25 G5:.5 F5:.25 Eb5:.25 F5:.5 Bb4:.5 r:.5 Bb4:.5 Ab5:.25 G5:.25 F5:.25 Eb5:.25 D5:.5 Ab5:.5 Ab5:.5 G5:.5 r:.5 G5:.5', 'it'],
  // source: https://www.flutetunes.com/tunes/verdi-nabucco-va-pensiero.mid; 1842; F# major as in source
  ['it_va_pensiero', "Va, pensiero (Nabucco)", 'Giuseppe Verdi', 'c', 60, 'A#4:.75 G#4:.25 F#4 C#4:.5 r:.25 C#5:.25 C#5 A#4:.75 F#4:.25 F#4:.33 F4:.33 G#4:.34 B4', 'it'],
  // source: https://www.flutetunes.com/tunes/verdi-aida-grand-march.mid; 1871; trumpet theme
  ['it_aida_march', 'Triumphal March (Aida)', 'Giuseppe Verdi', 'c', 100, 'Eb4 Ab4:3 Bb4:.33 Eb4:.33 Bb4:.34 C5 C5 C5 C5:.33 Db5:.33 Ab4:.34 C5:1.5 Bb4:.5 Ab4', 'it'],
  // source: https://www.flutetunes.com/tunes/puccini-turandot-nessun-dorma.mid; 1926; "Ma il mio mistero è chiuso in me", key as in source
  ['it_nessun_dorma', 'Nessun dorma (Turandot)', 'Giacomo Puccini', 'c', 60, 'D5:.5 E5:.5 F#5:.5 E5:.5 D5:.5 E5:.75 C#5:.25 B4:2 r:.5 E5:.5 F#5:.5 G5:.5 F#5:.5 E5:.5 F#5:.75 D5:.25 C#5 D5', 'it'],
  // source: https://www.flutetunes.com/tunes/leoncavallo-pagliacci-vesti-la-giubba.mid (matches https://trillian.mit.edu/~jc/music/abc/Italy/Vesti_la_Giubba.abc); 1892
  ['it_vesti_la_giubba', 'Vesti la giubba (Pagliacci)', 'Ruggero Leoncavallo', 'c', 70, 'E5 D#5:.75 G4:.25 B4 B4:.5 B4:.25 B4:.25 B4 A#4:.75 E4:.25 G4 G4', 'it'],
  // source: https://www.flutetunes.com/tunes/mascagni-cavalleria-rusticana-intermezzo.mid; 1890; down an octave
  ['it_intermezzo', 'Intermezzo (Cavalleria rusticana)', 'Pietro Mascagni', 'c', 60, 'F4 A4 C5 C5:1.5 Bb4:.5 A4:.5 G4:.5 D5:.5 F4:.5 A4:2 G4 A4:2.5 F4:.5 E4:.5 D4:.5 D5:.75 B4:.25 C5:2', 'it'],
  // source: https://www.flutetunes.com/tunes/boccherini-minuet.mid; 1771; grace notes omitted; last note lengthened
  ['it_boccherini_minuet', 'Minuet (String Quintet in E, Op. 11 No. 5)', 'Luigi Boccherini', 'c', 90, 'A5:.25 G#5:.25 A5:.25 B5:.25 A5:.25 r:.25 A4 C#5 E5:.5 E5:.5 D5:.5 D5 D5:.25 C#5:.25 D5:.25 E5:.25 D5:.5', 'it'],
  // source: https://www.flutetunes.com/tunes/tarantella-napoletana.mid (cf. https://trillian.mit.edu/~jc/music/abc/Italy/TarantellaNapoletana.abc); traditional; down an octave
  ['it_tarantella', 'Tarantella napoletana', 'Traditional (Neapolitan)', 'f', 160, 'A4 A4:.5 E4 E4:.5 A4 A4:.5 E4 E4:.5 E4 E4:.5 F4 F4:.5 F4:.5 G4:.5 F4:.5 F4 E4:.5 E4:.5 F4:.5 E4:.5', 'it'],
  // source: https://www.flutetunes.com/tunes/quel-mazzolin-di-fiori.mid; traditional (alpine song)
  ['it_mazzolin', 'Quel mazzolin di fiori', 'Traditional (Italian)', 'f', 100, 'G5:.5 G5:1.5 G5:.5 A5:.75 G5:.25 F#5:.5 G5:.5 A5:.5 G5:2 r:.5 E5 D5 C5 B4 C5 D5:.75 C5:.25 B4:.5 A4:.5 G4', 'it'],
  // source: https://www.flutetunes.com/tunes/te-voglio-bene-assaje.mid; 1839 (attributed to Filippo Campanella / Gaetano Donizetti)
  ['it_te_voglio_bene', 'Te voglio bene assaje', 'Traditional (Neapolitan)', 'f', 110, 'F4:.5 G4:.5 A4:.5 Bb4 C5:.5 D5 Bb4:.5 F4 r:.5 Eb5:.5 D5:.5 C5:.5 B4 C5:.5 D5:1.5 Bb4', 'it'],
  // source: https://www.flutetunes.com/tunes/bellini-norma-casta-diva.mid; 1831; down an octave
  ['it_casta_diva', 'Casta diva (Norma)', 'Vincenzo Bellini', 'c', 60, 'A4:3.75 Bb4:.125 A4:.125 G4:.25 A4:.25 C5:.75 Bb4:.25 A4:.25 G4:.25 G4:2.25 F4:.25 A4:.25 G4:.25 F4', 'it'],

  // ---- Japan ----
  // source: https://ja.wikipedia.org/wiki/赤とんぼ_(童謡) (LilyPond score); Kōsaku Yamada 1927
  ['jp_akatombo', 'Akatombo (Red Dragonfly)', 'Kōsaku Yamada', 'k', 66, 'C4:.5 F4:.5 F4:1.5 G4:.5 A4:.5 C5:.5 F5:.5 D5:.5 C5 D5:.5 F4:.5 F4 G4 A4:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/花_(瀧廉太郎) (LilyPond score); Rentarō Taki 1900
  ['jp_hana', 'Hana (Flower)', 'Rentarō Taki', 'c', 120, 'C4:1.5 C4:.5 F4 r:.5 F4:.5 G4:.5 F4:.5 E4:.5 D4:.5 C4:2 A3:.5 C4:.5 F4:.5 G4:.5 A4 C5 G4:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/お正月_(歌曲) (LilyPond score); Rentarō Taki 1901
  ['jp_oshogatsu', 'Oshōgatsu (New Year)', 'Rentarō Taki', 'h', 120, 'F4:2 G4 F4:.5 G4:.5 A4 C5 A4:2 G4 G4 F4 G4 A4:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/雪_(童謡) (LilyPond score); Monbushō shōka 1911
  ['jp_yuki', 'Yuki (Snow)', 'Monbushō shōka', 'k', 92, 'C5:.75 D5:.25 C5:.75 D5:.25 C5 A4:.5 r:.5 A4:.75 Bb4:.25 A4:.75 Bb4:.25 A4 F4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/うさぎ_(童謡) (LilyPond score); traditional
  ['jp_usagi', 'Usagi (Rabbit)', 'Traditional (Japanese)', 'k', 72, 'F4 F4:.5 A4:.5 B4:.5 A4:.5 B4:.5 r:.5 F4:.5 F4:.5 F4:.5 A4:.5 B4:.5 A4:.5 B4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/故郷_(唱歌) (LilyPond score); Teiichi Okano 1914
  ['jp_furusato', 'Furusato (Hometown)', 'Teiichi Okano', 'f', 80, 'G4 G4 G4 A4:1.5 B4:.5 A4 B4 B4 C5 D5:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/シャボン玉_(唱歌) (LilyPond score); Shinpei Nakayama 1923
  ['jp_shabondama', 'Shabondama (Soap Bubbles)', 'Shinpei Nakayama', 'k', 100, 'A3:.5 D4:.25 D4:.25 D4:.5 E4:.5 F#4:.5 A4:.5 A4:.5 r:.5 B4:.5 G4:.5 D5:.5 B4:.5 A4:.5 B4:.5 A4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/朧月夜_(歌曲) (LilyPond score, written in C and transposed to D as in the source); Teiichi Okano 1914
  ['jp_oborozukiyo', 'Oborozukiyo (Hazy Moon Night)', 'Teiichi Okano', 'f', 72, 'F#4:.5 F#4:.5 D4:1.5 E4:.5 F#4:.5 A4:.5 A4:.5 B4:.5 A4 E4 F#4:1.5 D4:.5 E4:.5 A4:.5 F#4:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/桃太郎_(童謡) (LilyPond score); Teiichi Okano, Jinjō shōgaku shōka 1911
  ['jp_momotaro', 'Momotarō', 'Teiichi Okano', 'k', 100, 'A4:1.5 B4:.5 A4:.5 A4:.5 F#4 A4:.5 A4:.5 F#4:.5 D4:.5 E4:1.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/君が代 (LilyPond score, 2nd block); Hiromori Hayashi 1880
  ['jp_kimigayo', 'Kimigayo (National Anthem)', 'Hiromori Hayashi', 's', 60, 'D4 C4 D4 E4 G4 E4 D4:2 E4 G4 A4 G4:.5 A4:.5 D5 B4 A4 G4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/ソーラン節 (LilyPond score); traditional (Hokkaido)
  ['jp_soran', 'Sōran Bushi', 'Traditional (Japanese)', 'f', 100, 'G4 A4:.5 C5:.5 E5 D5:.5 C5:.5 E5 D5:.5 C5:.5 D5 C5:.5 G4:.5 A4 C5:.5 G4:.5 A4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/背くらべ (LilyPond score); Shinpei Nakayama 1923
  ['jp_sekurabe', 'Sei Kurabe (Comparing Heights)', 'Shinpei Nakayama', 'k', 96, 'D4:.5 D4:.5 E4 F#4 A4:.5 B4:.5 A4 F#4 B4:.5 B4:.5 D5 B4 A4:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/ふじの山 (LilyPond score); Monbushō shōka 1910
  ['jp_fujinoyama', 'Fuji no Yama (Mount Fuji)', 'Monbushō shōka', 'k', 96, 'G4:1.5 G4:.5 A4 G4 E4 C4:.5 D4:.5 E4 r D4:1.5 G4:.5 G4 F4:.5 E4:.5 D4:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/靴が鳴る (LilyPond score); Ryūtarō Hirota 1919
  ['jp_kutsuganaru', 'Kutsu ga Naru (Shoes Squeak)', 'Ryūtarō Hirota', 'k', 120, 'C4 C4:.5 D4:.5 E4 r G4 G4:.5 A4:.5 G4 r E4 E4:.5 D4:.5 C4 C4:.5 D4:.5 E4 D4:.5 C4:.5 D4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/春の小川 (LilyPond score); Teiichi Okano 1912
  ['jp_harunoogawa', 'Haru no Ogawa (Spring Brook)', 'Teiichi Okano', 'k', 110, 'E4 G4 A4 G4 E4 G4 C5 C5 A4 A4 G4 E4 C4 D4 E4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/夕焼小焼 (LilyPond score); Shin Kusakawa 1923
  ['jp_yuyakekoyake', 'Yūyake Koyake (Evening Glow)', 'Shin Kusakawa', 'k', 120, 'G4:2 G4 A4 G4 G4 G4 E4 C4 C4 D4 E4 D4:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/夏は来ぬ (LilyPond score); Sakunosuke Koyama 1896
  ['jp_natsuwakinu', 'Natsu wa Kinu (Summer Has Come)', 'Sakunosuke Koyama', 'f', 100, 'G4 E4:.5 F4:.5 G4:1.5 G4:.5 A4:.5 C5:.5 G4:.5 D5:.5 C5:.5 A4:.5 G4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/茶摘み (LilyPond score); Monbushō shōka 1912
  ['jp_chatsumi', 'Chatsumi (Tea Picking)', 'Monbushō shōka', 'k', 104, 'D4 G4 A4 B4:1.5 B4:.5 B4 B4 D5:1.5 D5:.5 D5 B4 A4 G4 A4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/七つの子 (LilyPond score); Nagayo Motoori 1921
  ['jp_nanatsunoko', 'Nanatsu no Ko (Seven Little Ones)', 'Nagayo Motoori', 'k', 80, 'B4 A4:.5 G4:.5 A4 r B4:.5 G4:.5 E4:.5 G4:.5 D4 r E4:.5 D4:.5 B3:.5 D4:.5 E4 G4 A4:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/通りゃんせ (LilyPond score); traditional
  ['jp_toryanse', 'Tōryanse', 'Traditional (Japanese)', 'k', 100, 'A4:2 A4 G4 A4 A4:.5 G4:.5 E4 r Bb4 Bb4:.5 Bb4:.5 D5 Bb4:.5 A4:.5 Bb4:.5 A4:.5 G4:.5 G4:.5 A4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/あめふり (LilyPond score); Shinpei Nakayama 1925
  ['jp_amefuri', 'Amefuri (Rainfall)', 'Shinpei Nakayama', 'k', 100, 'C4:.75 C4:.25 C4:.75 D4:.25 E4:.75 D4:.25 G4:.75 E4:.25 C5:.75 A4:.25 G4:.75 E4:.25 G4:1.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/浜辺の歌 (LilyPond score, 6/8); Tamezō Narita 1918
  ['jp_hamabenouta', 'Hamabe no Uta (Song of the Seashore)', 'Tamezō Narita', 'c', 60, 'Eb4:.5 Eb4 Ab4:.25 Bb4:.25 C5 Bb4:.25 Ab4:.25 Bb4 F4:.5 Ab4 G4:.25 F4:.25 Eb4 Ab4:.5 C5 Bb4:.25 Ab4:.25 Bb4:2', 'jp'],
  // source: https://ja.wikipedia.org/wiki/かごめかごめ (LilyPond score); traditional
  ['jp_kagome', 'Kagome Kagome', 'Traditional (Japanese)', 'k', 72, 'A4 A4:.5 B4:.5 A4:.5 A4:.5 A4:.5 r:.5 A4:.5 A4:.25 A4:.25 A4:.5 G4:.25 G4:.25 A4:.5 A4:.25 G4:.25 E4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/あんたがたどこさ (LilyPond score); traditional
  ['jp_antagata', 'Antagata Dokosa', 'Traditional (Japanese)', 'k', 108, 'E4:.75 E4:.25 E4:.75 G4:.25 A4:.75 G4:.25 A4 B4:.75 G4:.25 A4 B4:.75 B4:.25 A4:.75 G4:.25 E4:.5 r:.5 E4:.75 G4:.25 G4:.75 G4:.25 A4:.5', 'jp'],
  // source: https://ja.wikipedia.org/wiki/この道 (LilyPond score); Kōsaku Yamada 1927
  ['jp_konomichi', 'Kono Michi (This Road)', 'Kōsaku Yamada', 'c', 66, 'B3:.5 E4:.5 F#4:.5 G#4 G#4 r:.5 C#5:.5 B4:.5 G#4:.5 F#4:.5 G#4:.5 F#4 E4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/赤い靴 (LilyPond score); Nagayo Motoori 1922
  ['jp_akaikutsu', 'Akai Kutsu (Red Shoes)', 'Nagayo Motoori', 'k', 90, 'C4:.5 D4:.5 Eb4:.5 F4:.5 G4:2 G4 Ab4:.5 F4:.5 G4:2 G4 C5 Eb5 C5 D5:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/春が来た (LilyPond score); Teiichi Okano 1910
  ['jp_harugakita', 'Haru ga Kita (Spring Has Come)', 'Teiichi Okano', 'k', 120, 'G4 E4:.5 F4:.5 G4 A4 G4 E4:.5 F4:.5 G4 C5 A4 G4 E4:1.5 C4:.5 D4:3', 'jp'],
  // source: https://ja.wikipedia.org/wiki/もみじ_(曲) (LilyPond score); Teiichi Okano 1911
  ['jp_momiji', 'Momiji (Autumn Leaves)', 'Teiichi Okano', 'k', 100, 'A4 G4:.5 F4:.5 G4 A4 F4:2 C4 r F4 E4:.5 F4:.5 G4 C5 A4 G4:.5 F4:.5 G4', 'jp'],
  // source: https://ja.wikipedia.org/wiki/鯉のぼり_(弘田龍太郎) (LilyPond score); Monbushō shōka 1913
  ['jp_koinobori', 'Koinobori (Carp Streamers)', 'Monbushō shōka', 'h', 96, 'F4:.75 G4:.25 A4:.75 Bb4:.25 C5:1.5 Bb4:.5 A4:.75 Bb4:.25 G4:.75 Bb4:.25 A4 r F4:.75 G4:.25 A4:.75 Bb4:.25 A4 F4 G4:3', 'jp'],

  // ---- China ----
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0483.krn (also matches zh.wikipedia 康定情歌 <score>); traditional (Sichuan); phrases 1-2
  ['cn_kangding', 'Kangding Love Song (Kangding Qingge)', 'Traditional (Sichuan)', 'f', 78, 'A4:.5 C5:.5 D5:.5 D5:.25 C5:.25 D5:.75 A4:.25 G4 A4:.5 C5:.5 D5:.5 D5:.25 C5:.25 D5:.5 A4:1.5', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0487.krn; traditional (Yunnan, Midu shan ge); transposed down an octave
  ['cn_xiaohe', 'Flowing Stream (Xiao He Tang Shui)', 'Traditional (Yunnan)', 'f', 72, 'G4:3 G4:.5 Bb4:.5 C5:.5 D5:.5 D5:.5 C5:1.5 Bb4:.5 G4:.5 D5:.5 C5:2.5 G4:3 G4:.5 Bb4:.5 G4:.5 F4:.5 D4:.5 C4:.5 G4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0445.krn; traditional (Anhui); version (1), phrases 1-2
  ['cn_fengyang', 'Fengyang Flower Drum (Fengyang Huagu)', 'Traditional (Anhui)', 'f', 100, 'E5 E5:.5 D5:.5 B4:2 E5 E5:.5 D5:.5 B4:2 B4:1.5 D5:.5 E5 G5 E5:.5 D5:.5 B4:.5 G4:.5 A4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0436.krn; traditional (Hebei); 5/4 + 4/4 as in source
  ['cn_xiaobaicai', 'Little Cabbage (Xiao Baicai)', 'Traditional (Hebei)', 'f', 72, 'E5 C#5 C#5 B4:2 E5 E5:.5 C#5:.5 C#5:.5 B4:.5 A4:2 A4 C#5 B4 F#4:2 B4 A4 G#4:.5 F#4:.5 E4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0437.krn; traditional (Hebei)
  ['cn_fengzheng', 'Flying a Kite (Fang Fengzheng)', 'Traditional (Hebei)', 'f', 80, 'E4:.5 E4:.5 D4:.25 C4:.25 D4:.25 E4:.25 G4:1.5 A4:.5 C5 E5:.5 D5:.25 E5:.25 C5:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0438.krn; traditional (Hebei); first phrase
  ['cn_xiaofangniu', 'Little Cowherd (Xiao Fang Niu)', 'Traditional (Hebei)', 'f', 100, 'C5:.5 A4:.5 C5 r:.5 D5 C5:.5 A4:.75 C5:.25 D5:.5 F5:.5 C5:.5 A4:.5 G4', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0451.krn; traditional (Jiangsu)
  ['cn_wuxijing', 'Scenes of Wuxi (Wuxi Jing)', 'Traditional (Jiangsu)', 'f', 72, 'A4:.5 A4:.25 G4:.25 A4:.5 D5:.5 C5:.25 D5:.25 C5:.25 A4:.25 G4 A4:.5 C5:.25 C5:.25 C5:.25 A4:.25 G4:.25 A4:.25 C5:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0449.krn; traditional (Jiangsu); transposed down an octave; first phrase
  ['cn_luchaihua', 'Pull a Reed Flower (Ba Gen Luchai Hua)', 'Traditional (Jiangsu)', 'f', 90, 'Bb4:.5 D5:.5 C5:.5 Bb4:.25 G4:.25 Bb4:.5 D5:.5 C5:.5 Bb4:.25 G4:.25', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0481.krn; traditional (Sichuan); phrases 1-2
  ['cn_taiyang', 'The Sun Rises Joyfully (Taiyang Chulai Xiyangyang)', 'Traditional (Sichuan)', 'f', 100, 'E5:.5 F#5:.5 E5:.5 D5:.5 E5 F#5:.5 r:.5 D5:.5 E5:.5 F#5:.5 E5 D5:.5 B4:.5 r:.5', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0482.krn; traditional (Sichuan); phrase 1 and most of phrase 2 (final E4 cadence omitted)
  ['cn_huaihua', 'When Will the Locust Tree Bloom (Huaihua Jishi Kai)', 'Traditional (Sichuan)', 'f', 60, 'G5:.25 G5:.25 G5:.25 E5:.25 E5 D5:.25 G5:.25 E5 D5:.25 E5:.25 B4:3 r D5:.25 D5:.25 B4:.25 E5:.25 A4 D5:.5 B4:.5 E5:.75 B4:.25 A4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0490.krn; traditional (Yunnan); first phrase
  ['cn_xiuhebao', 'Embroidering a Purse (Xiu Hebao)', 'Traditional (Yunnan)', 'f', 66, 'F#5:.5 F#5:.25 E5:.25 C#5:.75 E5:.25 F#5:1.5 A5:.5 E5:.5 F#5:.5 F#5:.25 E5:.25 C#5:.5 B4:.5 C#5:.25 B4:.25 A4:.5 F#4:.5', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0230.krn; traditional (northern Shaanxi); the folk tune later used for "The East Is Red"; first phrase
  ['cn_qibaima', 'Riding a White Horse (Qi Bai Ma)', 'Traditional (Shaanxi)', 'f', 80, 'C5 C5:.5 D5:.5 G4:1.5 C5:.5 A4:.5 G4:.5 F4:.5 D4:.5 G4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0465.krn; traditional (Taiwanese children's song); first phrase
  ['cn_tianwuwu', 'The Sky Is Dark (Thinn Oo-oo / Tian Wuwu)', 'Traditional (Taiwanese)', 'k', 96, 'E4:.5 D4:.5 E4 E4:.5 A3:.5 C4 D4:.5 E4:.25 E4:.25 C4:.5 A3:.5 C4:.5 D4:.25 E4:.25 D4:.5 G3:.5 A3:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0467.krn; traditional (Hengchun, Taiwan); phrases 1-2
  ['cn_sixiangqi', 'Su-siunn-khi (Sixiang Qi)', 'Traditional (Taiwanese)', 'f', 60, 'G4:.5 D4:.5 C5:.5 A4:.25 C5:.25 D5:1.5 E5:.5 G4 D4 E5:.5 D5:.25 E5:.25 D5:.5 C5:.5 A4:.75 C5:.25 G4:.5 E4:.25 G4:.25 A4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0466.krn; traditional (Taiwanese); phrases 1-2
  ['cn_niulige', 'Ox Plough Song (Niu Li Ge)', 'Traditional (Taiwanese)', 'f', 100, 'B3 D4:.5 B3:.5 D4 E4:.5 D4:.5 B3:2 F#4:.5 A4:.5 F#4:.5 E4:.5 D4:.5 B3:.5 F#4 E4:1.5 F#4:.5', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/han/han0484.krn; traditional (Sichuan); phrases 1-2
  ['cn_huangyang', 'Boxwood Carrying Pole (Huangyang Biandan)', 'Traditional (Sichuan)', 'f', 72, 'F#4:.25 A4:.25 F#4:.5 A4:.5 F#4:.25 A4:.25 F#4:.5 A4:.5 A4:.5 F#4:.25 A4:.25 B4 B4:.25 A4:.25 F#4:.25 A4:.25 F#4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/natmin/natmn190.krn; traditional (Mongolian, Ordos); transposed down an octave; phrases 1-2
  ['cn_senjidema', 'Senjidma (Senjidema)', 'Traditional (Mongolian)', 'f', 90, 'E4:1.5 F#4:.5 A4:1.5 F#4:.5 A4 C#4 C#4:.5 B3:.5 A3 A4 E4 F#4:.5 E4:.5 C#5:.5 B4:.5 A4:1.5 B4:.5 A4:2', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/natmin/natmn171.krn; traditional (Mongolian); phrases 1-2
  ['cn_nuoenjiya', 'Nuo En Ji Ya', 'Traditional (Mongolian)', 'f', 66, 'A4 D5:.5 C5:.5 A4:.75 G4:.25 E4 D5:.5 G5:.5 E5:3 D5:.75 E5:.25 A5:.5 G5:.5 E5:.75 D5:.25 C5:.5 A4:.5 C5:.5 E5:.5 D5:3', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/natmin/natmn182.krn; traditional (Hui, Ningxia); phrases 1-2
  ['cn_galaohan', 'Little Old Man (Ga Laohan)', 'Traditional (Hui, Ningxia)', 'f', 100, 'D5:.5 F5:.5 D5:.5 C5:.5 D5:.5 F5:.5 D5:.5 C5:.5 D5:2 D5 r F5:.5 D5:.5 D5:.5 C5:.5 D5 C5:.5 A4:.5 G4:2 G4', 'cn'],
  // source: https://github.com/ccarh/essen-folksong-collection/blob/main/asia/china/natmin/natmn186.krn; traditional (Kazakh, Xinjiang); first phrase
  ['cn_wodehuaer', 'My Flower (Wo de Hua\'er)', 'Traditional (Kazakh)', 'f', 72, 'C5:.5 C5:.5 B4:.75 G4:.25 A4 G4:.25 F4:.25 E4:.25 G4:.25 D4:4', 'cn'],
  // source: https://zh.wikipedia.org/w/index.php?title=送别_(歌曲)&action=raw (<score>); J. P. Ordway "Dreaming of Home and Mother" (pub. 1868), Chinese lyrics Li Shutong 1915
  ['cn_songbie', 'Farewell (Song Bie)', 'John P. Ordway / Li Shutong', 'f', 80, 'G4 E4:.5 G4:.5 C5:2 A4 C5 G4:2 G4 C4:.5 D4:.5 E4 D4:.5 C4:.5 D4:3', 'cn'],
  // source: https://zh.wikipedia.org/w/index.php?title=中華民國國歌&action=raw (<score>); music Cheng Maoyun, 1928 (chosen and published 1928-29)
  ['cn_rocanthem', 'National Anthem of the Republic of China (San Min Chu-i)', 'Cheng Maoyun', 's', 72, 'C4 C4:3 E4 E4:3 G4 G4:3 E4 D4:3 E4 C5:3 A4:.5 G4:.5 A4:3 E4 A4:3 G4:.5 F#4:.5 G4:3', 'cn'],

  // ---- Korea ----
  // source: https://en.wikipedia.org/w/index.php?title=Arirang&action=raw (LilyPond score, F major 9/8); traditional; bars 1-4
  ['kr_arirang', 'Arirang', 'Traditional (Korean)', 'f', 90, 'C4:2.5 D4:.5 C4 D4:.5 F4:2.5 G4:.5 F4 G4:.5 A4:1.5 G4:.5 A4:.5 G4:.5 F4 D4:.5 C4:2.5 D4:.5 C4:.5 D4:.5', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%EB%B0%80%EC%96%91%EC%95%84%EB%A6%AC%EB%9E%91&action=raw (LilyPond, F major 9/8); traditional; "nal jom boso" x3, last note (tied melisma) shortened
  ['kr_miryang_arirang', 'Miryang Arirang (밀양아리랑)', 'Traditional (Korean)', 'f', 150, 'D5:.5 D5 C5:.5 D5:.5 C5:.5 A4:1.5 D5:.5 D5 C5:.5 D5:.5 C5:.5 A4:1.5 D5:1.5 C5:.5 D5:.5 C5:.5 A4:.5 G4:.5 A4:.5 C5:2', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%EB%8F%84%EB%9D%BC%EC%A7%80%ED%83%80%EB%A0%B9&action=raw (LilyPond, F major 9/8); traditional; bars 1-4
  ['kr_doraji', 'Doraji Taryeong (도라지 타령)', 'Traditional (Korean)', 'f', 160, 'A4:1.5 A4:1.5 A4:1.5 A4:2.5 G4:.5 F4:1.5 C5:3 D5 C5:.5 A4:2.5 G4:.5 F4:1.5', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%ED%95%9C%EC%98%A4%EB%B0%B1%EB%85%84&action=raw (LilyPond, E minor pentatonic); traditional (Gangwon-do); refrain "amuryeom geureochi", bars 1-2
  ['kr_han_obaengnyeon', 'Han Obaengnyeon (한오백년)', 'Traditional (Korean)', 'f', 72, 'B3:.5 B3:.5 B3:2 E4:.5 E4:1.5 E4:.5 G4:.5 B4:.5 B4:.5 A4:.25 G4:.25 B4:.5 A4:.5 G4:.5 E4:.25 D4:.25 B3:1.5 E4:.25 D4:.25 B3:.5', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%EA%B5%B0%EB%B0%A4%ED%83%80%EB%A0%B9&action=raw (LilyPond, G minor 12/8); traditional Gyeonggi minyo of the late Joseon era, anonymous; bars 2-4 (bar 1 is rests)
  ['kr_gunbam_taryeong', 'Gunbam Taryeong (군밤타령)', 'Traditional (Korean)', 'f', 170, 'D5 C5:1.5 G4:.5 Bb4 Bb4:2 D5 C5:1.5 G4:.5 Bb4 Bb4:2 Bb4:1.5 D5:1.5 C5 D5:.5 Bb4 Bb4:.5', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%EB%8F%99%EB%8C%80%EB%AC%B8%EC%9D%84_%EC%97%B4%EC%96%B4%EB%9D%BC&action=raw (LilyPond, C); traditional; matches en.wikipedia "Dong, Dong, Dongdaemun" score (in F); bars 1-4
  ['kr_dongdaemun', 'Dong, Dong, Dongdaemun (동동 동대문을 열어라)', 'Traditional (Korean)', 'k', 120, 'G4 G4 G4:.5 A4:.5 G4:.5 F4:.5 E4 E4 E4 r:1 F4 F4 F4:.5 G4:.5 F4:.5 E4:.5 D4 D4 D4 r:1', 'kr'],
  // source: https://ko.wikipedia.org/w/index.php?title=%EA%B0%80%EC%8B%9C%EB%A6%AC&action=raw (LilyPond, Eb major 12/8, after the Siyong hyangakbo); Goryeo song, traditional; bars 1-3
  ['kr_gasiri', 'Gasiri (가시리)', 'Traditional (Korean, Goryeo)', 'f', 60, 'Bb4:1.5 C5:1.5 Bb4 G4:.5 F4:1.5 Bb4 F5:.5 Eb5 C5:.5 Bb4:3 C5 Eb5:.5 C5:1.5 Bb4 G4:.5 F4:1.5', 'kr'],

  // ---- South America ----
  // source: https://www.mamalisa.com/?t=es&p=209 (Mama Lisa MIDI /midi/ciranda.mid, parsed); traditional
  ['sa_ciranda', 'Ciranda, Cirandinha', 'Traditional (Brazil)', 'k', 100, 'F4:.5 Bb4:.5 Bb4:.5 D5:.5 D5:.5 F5:.5 F5:.5 G5:.5 Eb5:.5 D5:.5 D5:.5 C5:.5 C5:.5 Bb4:1.5', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=208 (Mama Lisa MIDI /midi/escravos.mid, parsed); traditional
  ['sa_escravos', 'Escravos de Jó', 'Traditional (Brazil)', 'k', 100, 'G4:.5 C5 B4:.5 A4:.5 G4:1.5 G4:.5 F4:.5 E4:.5 F4:.5 A4:.5 G4:2 G4 E4 G4 E4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=213 (Mama Lisa MIDI /midi/ocravo.mid, parsed); traditional; 3/4
  ['sa_cravo', 'O Cravo e a Rosa (The Carnation and the Rose)', 'Traditional (Brazil)', 'k', 100, 'G4:.5 Bb4 G4:.5 Eb5:.5 D5:.5 C5:.5 Bb4 Ab4 F4 Ab4 F4:.5 C5:.5 Bb4:.5 A4:.5 Bb4 Bb4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=210 (Mama Lisa MIDI /midi/pirulito.mid, parsed); traditional
  ['sa_pirulito', 'Pirulito Que Bate Bate', 'Traditional (Brazil)', 'k', 100, 'E4:.25 F4:.25 G4:.5 G4:.25 G4:.25 F4:.5 E4:.5 A4:.5 A4:.5 r:.5 D4:.25 E4:.25 F4:.5 F4:.25 F4:.25 E4:.5 D4:.5 G4:1.5', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=2042 (Mama Lisa MIDI /midi/sambalele.mid, parsed); traditional; same pitches as github.com/Josef-Friedrich/scores-free songs/s/Samba-lelé.mscx, which has a syncopated rhythm instead
  ['sa_sambalele', 'Samba Lelê', 'Traditional (Brazil)', 'k', 100, 'G4:.5 G4:.25 B4:.25 D5:.5 B4:.25 G4:.25 A4 C5 F#4:.5 F#4:.25 A4:.25 C5:.5 A4:.25 F#4:.25 G4 B4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=212 (Mama Lisa MIDI /midi/terezinha.mid, parsed); traditional
  ['sa_terezinha', 'Terezinha de Jesus', 'Traditional (Brazil)', 'k', 100, 'G4:.5 B4:.5 E4:.5 E4:.5 G4:.5 B4:.5 E4 B4:.5 B4:.5 C5:.5 B4:.5 A4:.5 G4:.5 A4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=2305 (Mama Lisa MIDI /midi/cai_cai_balao.mid, parsed); traditional
  ['sa_caicaibalao', 'Cai, Cai Balão (Fall, Fall, Balloon)', 'Traditional (Brazil)', 'k', 90, 'G4:.5 G4:.75 F4:.25 E4:.5 G4:.5 G4:.75 F4:.25 E4:.5 G4:.5 A4:.5 G4:.5 F4:.5 E4:.5 D4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=3194 (Mama Lisa MIDI /midi/se_essa_rua_fosse_minha.mid, parsed); traditional
  ['sa_seessarua', 'Se Essa Rua Fosse Minha (If This Street Were Mine)', 'Traditional (Brazil)', 'k', 70, 'E4:.5 E4:.5 A4:.5 A4:.5 E4:.5 C4:.5 A3:.5 C4:.5 F4:.5 E4:.5 E4 D4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=2535 (Mama Lisa MIDI /midi/capelina_de_melao.mid, parsed); traditional
  ['sa_capelinha', 'Capelinha de Melão', 'Traditional (Brazil)', 'k', 100, 'E4:.5 F4:.5 G4:.5 G4:.5 E4:.5 F4:.5 G4 G4:.5 C5:.5 A4 C5 G4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=4412 (Mama Lisa MIDI /midi/barata.mid, parsed); traditional
  ['sa_barata', 'A Barata Diz Que Tem (The Cockroach Says She Has)', 'Traditional (Brazil)', 'k', 90, 'G4:.5 F4:.5 E4:.5 D4:.5 E4:.5 F4:.5 G4 G4:.5 A4:.5 F4:.5 E4:.5 F4:.5 G4:.5 E4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=4826 (Mama Lisa MIDI /midi/sapo_jururu.mid, parsed); traditional
  ['sa_sapocururu', 'Sapo Cururu (Sapo Jururu)', 'Traditional (Brazil)', 'k', 80, 'D4:.75 E4:.25 D4:.5 B3:.5 G4:2 D4:.5 E4:.5 D4:.5 B3:.5 G4:2', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/a.canoa.virou.abcx (ABC); traditional; matches Mama Lisa MIDI (p=214, in A major)
  ['sa_canoavirou', 'A Canoa Virou (The Canoe Tipped Over)', 'Traditional (Brazil)', 'k', 100, 'G4:.5 G4:.5 G4 G4:.5 F4:.5 E4 E4:.5 G4:.5 C5 C5:.5 B4:.5 A4 A4:.5 A4:.5', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/xOutras/Peixe Vivo.abcx (ABC); traditional; same tune as songs/club-br/peixe.vivo.club.abcx (in F)
  ['sa_peixevivo', 'Peixe Vivo (Living Fish)', 'Traditional (Brazil)', 'f', 90, 'B4:.5 D5:.5 D5:.5 C5:.5 C5:.5 E5:.5 E5:.5 D5:.5 B4:.5 D5:.5 D5:.5 C5:.5 A4:.5 C5:.5 C5:.5 B4:.5', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/alecrim.dourado.abcx (ABC); traditional
  ['sa_alecrim', 'Alecrim Dourado (Golden Rosemary)', 'Traditional (Brazil)', 'k', 110, 'D5 C5 B4 B4:.5 A4:.5 B4 D5 C5:.5 C5:.5 C5:.5 B4:.5 C5 D5', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/balaio.abcx (ABC); traditional; rhythm matches Mama Lisa MIDI (p=4347) and Josef-Friedrich/scores-free Balaio.mscx
  ['sa_balaio', 'Balaio', 'Traditional (Brazil)', 'f', 80, 'D5:.5 D5:.25 B4:.5 G4:.25 E4:.5 D4:.5 C5:.25 A4:.5 F#4:.25 E4:.5 D4:.5 E4:.25 E4:.5 E4:.25 C4:.5 C4:.5 D4:.75', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/prenda.minha.abcx (ABC, "Parte I", the sung tune); traditional
  ['sa_prendaminha', 'Prenda Minha', 'Traditional (Brazil)', 'f', 100, 'G4 G4 G4:.5 G4:.5 F#4:.5 E4:.5 D4:.5 D4:.5 C4:.5 B3:.5 A3:.5 A3:.5 B3:.5 C4:.5 D4 F#4 D4 C4 B3:4', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/boi.barroso.abcx (ABC); traditional
  ['sa_boibarroso', 'Boi Barroso', 'Traditional (Brazil)', 'f', 100, 'D5:.5 C5:.5 B4:.5 B4:.5 B4:.5 C5:.5 D5:.5 D5:.5 D5:.5 C5:.5 B4:.5 E5:.5 E5:.5 D5:.5 C5', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/minuano/pezinho.abcx (ABC); traditional
  ['sa_pezinho', 'Pezinho (Little Foot)', 'Traditional (Brazil)', 'f', 90, 'D5:.5 D5:.5 D5:.5 B4:.5 D5:.5 D5:.5 D5:.5 E5:.5 D5:.5 C5:.5 B4:.5 D5 A4', 'sa'],
  // source: https://en.wikipedia.org/wiki/Luar_do_Sertão (<score>); 1914; also github.com/flvani/diatonic-map songs/minuano/luar.do.sertao.abcx
  ['sa_luardosertao', 'Luar do Sertão (Hinterland Moonlight)', 'João Pernambuco and Catulo da Paixão Cearense (Brazil)', 'f', 80, 'G4:.5 C5:1.5 D5:.5 E5:1.5 D5:.5 F5:1.5 E5:.5 D5:1.5 C5:.5 B4:1.5 A4:.5 G4:1.5 F4:.5 E4:3', 'sa'],
  // source: https://trillian.mit.edu/~jc/music/abc/Argentina/tango/Cumparsita_Am.abc (ABC); 1916; opening matches en/de.wikipedia <score> (given there in G minor)
  ['sa_cumparsita', 'La Cumparsita', 'Gerardo Matos Rodríguez (Uruguay)', 'f', 100, 'E4:.25 E4:.25 E4 D5 B4 G#4 r:.5 E4:.5 F4:.5 E4:.5 D#4 E4:.5 E4:.25 E4:.25 E4 E5 C5 A4', 'sa'],
  // source: https://trillian.mit.edu/~jc/music/abc/Argentina/tango/Choclo_Am.abc (ABC); 1903; grace notes omitted
  ['sa_elchoclo', 'El Choclo', 'Ángel Villoldo (Argentina)', 'f', 66, 'E4:.25 E4:.25 F4:.25 F4:.25 E4:.25 E4:.25 A4:.25 A4:.25 C5:.25 C5:.25 F5:.25 F5:.5 E5:.5', 'sa'],
  // source: https://en.wikipedia.org/wiki/Yo_tenía_diez_perritos (<score>); traditional (documented in Chile in the 1910s and in Venezuela)
  ['sa_diezperritos', 'Yo Tenía Diez Perritos (I Had Ten Little Dogs)', 'Traditional (Venezuela, Chile)', 'k', 100, 'G4:.25 G4:.25 G4:.5 C5:.5 B4:.5 A4:.5 A4:.5 G4:.5 r:.5 G4:.25 G4:.25 G4:.5 C5:.5 B4:.5 A4:.5 A4:.5 G4:.5', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=2774 (Mama Lisa MIDI /midi/pollitos.mid, parsed; same file on the Chile and Peru pages); traditional
  ['sa_pollitos', 'Los Pollitos Dicen (The Little Chicks Say)', 'Traditional (Chile, Ecuador, Peru)', 'k', 100, 'A4:.5 E4:.5 A4:.5 B4:.5 C#5 C#5 B4:.5 D5:.5 C#5:.5 B4:.5 A4 A4 A4:.5 G#4:.5 F#4:.5 E4:.5 B4 B4', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=727 (Mama Lisa MIDI /midi/aserrin_argentina_uruguay.mid, parsed); traditional
  ['sa_aserrin', 'Aserrín, Aserrán', 'Traditional (Argentina, Uruguay)', 'k', 90, 'G4:.5 G4:.5 C5 G4:.5 G4:.5 E4 G4:.5 G4:.5 A4:.5 G4:.5 A4:.5 B4:.5 C5', 'sa'],
  // source: https://www.mamalisa.com/?t=es&p=2601 (Mama Lisa MIDI /midi/arrozconleche.mid, parsed; same file on the Colombia page); traditional
  ['sa_arrozconleche', 'Arroz con Leche (Rice Pudding)', 'Traditional (Peru, Colombia)', 'k', 100, 'C4:.5 F4:1.5 A4:.5 F4 F4:.5 C4:.5 F4 F4:.5 A4:.5 G4:1.5 A4:.5 Bb4:.5 A4:.5 G4:.5 F4:.5 E4', 'sa'],
  // source: https://github.com/flvani/diatonic-map songs/xOutras/Hino Nacional Brasileiro.abcx (ABC); 1831; same notes in Cantor Cristão no. 577 ABC (abcnotation.com, dropbox FormatoABC.zip/cc577-cifragem)
  ['sa_hinonacional', 'Brazilian National Anthem (Hino Nacional Brasileiro)', 'Francisco Manuel da Silva (Brazil)', 's', 110, 'C4 F4:.75 E4:.25 F4:.75 G4:.25 A4:.75 G4:.25 A4:.75 Bb4:.25 B4:1.5 C5:.5 F4 C4', 'sa'],
  // source: https://abcnotation.com/tunePage?a=www.dropbox.com/scl/fo/ivaekyt6boyna8hvye254/APyWrNxr3f7FntWoSJ1Pbbs/FormatoABC.zip/cifragem/cc576-cifragem/0000 (Cantor Cristão no. 576, ABC); 1906
  ['sa_hinobandeira', 'Hino à Bandeira (Brazilian Flag Anthem)', 'Francisco Braga (Brazil)', 's', 100, 'Ab4 G4 F4 Eb4:.75 F4:.25 G4 Ab4:.75 Bb4:.25 C5 Ab4:.5 r:.5 Db5 C5 Eb4 Eb4:.5 Ab4:.5 F4 Eb4:.75 D4:.25 Eb4:1.5', 'sa'],
  // source: https://abcnotation.com/tunePage?a=www.dropbox.com/scl/fo/ivaekyt6boyna8hvye254/APyWrNxr3f7FntWoSJ1Pbbs/FormatoABC.zip/cifragem/cc575-cifragem_1t/0000 (Cantor Cristão no. 575, ABC); 1890; the "Liberdade! Liberdade!" refrain
  ['sa_proclamacao', 'Hino da Proclamação da República (Liberdade! Liberdade!)', 'Leopoldo Miguez (Brazil)', 's', 110, 'Ab4:.75 Ab4:.25 Eb5:2 Ab4 Ab4:.75 Ab4:.25 Eb5:2 Ab4 Ab4:.75 Ab4:.25 Db5 C5 Ab4 Bb4 C5:2.5', 'sa'],

  // ---- South Africa ----
  // source: https://abcnotation.com/tunePage?a=trillian.mit.edu/~jc/music/abc/anthem/Nkosi_Sikeleli_Afrika/0000 (ABC, K:Bb); 1897; cross-checked with flutetunes.com SA anthem MIDI (in G)
  ['za_nkosi_sikelel', "Nkosi Sikelel' iAfrika (God Bless Africa)", 'Enoch Sontonga', 's', 80, 'Bb4:.5 A4:.5 Bb4:.5 C5:.5 D5 D5 C5 C5 Bb4:2 D5:.5 D5:.5 C5:.5 D5:.5 Eb5 Eb5 D5:.5 D5:.5 D5 C5:2', 'za'],
  // source: https://www.flutetunes.com/tunes/sarie-marais.mid (score MIDI); traditional (c. 1900, after "Sweet Ellie Rhee" 1865); note: thesession.org/tunes/12099 polka setting differs in bar 2
  ['za_sarie_marais', 'My Sarie Marais', 'Traditional (Afrikaans)', 'f', 110, 'D4 G4 G4:.5 A4:.5 B4 D4:.5 D4:.5 E4 E4:.5 E4:.5 A4:1.5 G4:.5 F#4 F#4:.5 E4:.5 D4 C5 B4:2', 'za'],
  // source: https://media.8notes.com/school/midi/voice/siyahamba_voice.mid (8notes.com/scores/35041.asp); traditional; cross-checked with 8notes choir MIDI (in F)
  ['za_siyahamba', "Siyahamba (We Are Marching in the Light of God)", 'Traditional (Zulu)', 'f', 110, 'D4:.5 D4:.5 B4:2.5 B4:.5 A4:.5 B4:.5 G4:.5 G4:.5 E4:.5 D4 C5 B4:.5 A4:.5 A4:.5 A4:.5 G4:.5 A4:.5 A4:.5 B4:.5 G4:3.5', 'za'],
  // source: https://media.8notes.com/school/midi/viola/shosholoza_vla.mid (8notes.com/scores/25577.asp); traditional (Ndebele/Zulu)
  ['za_shosholoza', 'Shosholoza', 'Traditional (South African)', 'f', 100, 'D4:1.5 E4:.5 F#4:.5 E4:.5 D4 r:.5 G4:.5 G4:.5 D4:.5 G4:.5 F#4 E4:.5 E4:.75 E4:.25 E4:.5 E4:.5 F#4:.5 F#4:.5 E4:.5 F#4 E4:.5 D4', 'za'],
  // source: https://www.flutetunes.com/tunes/marching-to-pretoria.mid (score MIDI); traditional (Boer War era); pitches cross-checked with colinhume.com ABC
  ['za_marching_to_pretoria', 'Marching to Pretoria', 'Traditional (South African)', 'f', 120, 'C5:.5 Bb4:.5 A4:.5 A4:.5 A4:.5 A4:.5 A4:.5 A4:.5 A4:.5 A4:.5 A4:.5 C5 Bb4:.5 A4:.75 A4:.25 A4:.5 A4:.5 G4:.5 Bb4 A4:.5', 'za'],

  // ---- Australia ----
  // source: https://en.wikipedia.org/w/index.php?title=Waltzing_Matilda&action=raw (LilyPond, Cowan's melody); 1903 (Marie Cowan, after Christina Macpherson 1895); cross-checked with folkinfo.org ABC (Singing Together 1985)
  ['au_waltzing_matilda', 'Waltzing Matilda', 'Christina Macpherson / Marie Cowan', 'f', 110, 'A4:.75 A4:.25 A4:.5 A4:.5 G4 G4 F4 A4:.5 F4:.5 D4:.5 E4:.5 F4 C4 F4:.75 A4:.25 C5', 'au'],
  // source: https://www.flutetunes.com/tunes/advance-australia-fair.mid (score MIDI); 1878; cross-checked with 8notes.com SATB MIDI (in C); transposed down an octave
  ['au_advance_australia_fair', 'Advance Australia Fair', 'Peter Dodds McCormick', 's', 100, 'D4 G4 D4 B3 D4 G4:1.5 G4:.5 G4 B4 A4 G4 F#4 G4 A4:3', 'au'],
  // source: https://abcnotation.com/tunePage?a=colinhume.com/ABC.txt/0251 (ABC, K:D); traditional words to Henry Clay Work's "Ring the Bell, Watchman" (1865); cross-checked with LesterBailey ABC (K:G)
  ['au_click_go_the_shears', 'Click Go the Shears', 'Traditional (Australian)', 'f', 140, 'F#4 F#4:.75 E4:.25 D4 F#4:.75 A4:.25 D5 D5:.75 C#5:.25 B4:2 A4 A4:.75 B4:.25 A4 F#4:.75 D4:.25 E4 E4:.75 F#4:.25 E4:2', 'au'],
  // source: https://en.wikipedia.org/w/index.php?title=Botany_Bay_(song)&action=raw (LilyPond, Eb); traditional; cross-checked with flutetunes.com MIDI (in F)
  ['au_botany_bay', 'Botany Bay', 'Traditional (Australian)', 'f', 150, 'Eb4:.5 F4:.5 G4 Bb4 Bb4 F4 Ab4 Ab4 G4:.5 F4:.5 Eb4:4 Bb4 G4 Bb4 Eb5 Ab4 C5 Eb5 Bb4:3', 'au'],
  // source: https://en.wikipedia.org/w/index.php?title=The_Wild_Colonial_Boy&action=raw (LilyPond); traditional
  ['au_wild_colonial_boy', 'The Wild Colonial Boy', 'Traditional (Australian)', 'f', 150, 'A4 D4:2 F#4 A4:2 A4 B4:2 G4 E4:2 D4 C#4:2 A3 F#4:2 E4 D4:3', 'au'],
  // source: https://en.wikipedia.org/w/index.php?title=Moreton_Bay_(song)&action=raw (LilyPond); traditional
  ['au_moreton_bay', 'Moreton Bay', 'Traditional (Australian)', 'f', 80, 'D4:.5 D4:.5 A3:.5 D4 F#4:.5 A4:.5 D5:.5 C#5:.5 B4 D5:.5 B4:.5 A4:.5 F#4:.5 D4 E4:.5 F#4:.5 E4:.5 D4:.5 B3', 'au'],
  // source: https://abcnotation.com/tunePage?a=trillian.mit.edu/~jc/music/abc/mirror/folkinfo.org/Bound_for_South_Australia/0000 (ABC); traditional shanty; cross-checked with flutetunes.com MIDI (in D)
  ['au_bound_for_south_australia', 'Bound for South Australia', 'Traditional (sea shanty)', 'f', 100, 'G4:.5 E4:.5 G4:.5 G4:.5 C5:.5 A4:.5 G4:.5 G4 A4:.5 G4:.5 G4 A4:.5 G4:.5 G4', 'au'],
  // source: https://austradmusic.au/tunes/view_tune.php?name=Along_the_Road_to_Gundagai (ABC, chorus); 1922 (Jack O'Hagan)
  ['au_road_to_gundagai', 'Along the Road to Gundagai', "Jack O'Hagan", 'f', 100, 'D5:.5 C5:.5 B4 B4:.5 G4:.5 A4 A4:.5 F#4:.5 G4 G4:.5 E4:.5 D4:.5 E4:.5 F#4:.5 G4:.5 B4:.5 A4:1.5 C5:.5 B4 G4:3.5', 'au'],
  // source: https://austradmusic.au/tunes/view_tune.php?name=Oh_The_Springtime_It_Brings_on_the_Shearing (ABC); traditional
  ['au_springtime_shearing', 'The Springtime It Brings On the Shearing', 'Traditional (Australian)', 'f', 140, 'D5:.5 C5:.5 B4 B4 B4 C5 A4 F#4 G4 G4:3.5 r:.5 G4:.5 A4:.5 B4 A4 B4 C5 A4 B4 C5:4.5', 'au'],
  // source: https://austradmusic.au/tunes/view_tune.php?name=Thousand_Miles_Away_(A) (ABC); traditional
  ['au_thousand_miles_away', 'A Thousand Miles Away', 'Traditional (Australian)', 'f', 100, 'A4:.5 D4:.5 D4:.25 D4:.25 F#4:.5 A4:.5 D5 D5:.5 D5:.25 E5:.25 F#5:.5 D5:.5 D5:.5 A4:.5 B4:1.5 C#5:.5', 'au'],
  // source: https://abcnotation.com/tunePage?a=sniff.numachi.com/~rickheit/dtrad/abc_dtrad.tar.gz/abc_dtrad/STRFORBE/0000 (Digital Tradition ABC); traditional
  ['au_streets_of_forbes', 'The Streets of Forbes', 'Traditional (Australian)', 'f', 90, 'A3:.5 B3:.5 C4:.5 B3:.5 A3 E4 E4 E4:2 r E4:.5 F#4:.5 G4:.5 F#4:.5 E4 A4 A4 E4:2', 'au'],

  // ---- India ----
  // source: https://www.flutetunes.com/tunes/jana-gana-mana.mid (MIDI of flutetunes.com score); Rabindranath Tagore 1911; transposed down an octave, opening line only
  ['in_jana_gana_mana', 'Jana Gana Mana (National Anthem of India)', 'Rabindranath Tagore', 's', 104, 'C4:.5 D4:.5 E4:.5 E4:.5 E4:.5 E4:.5 E4:.5 E4:.5 E4 E4:.5 E4:.5 D4:.5 E4:.5 F4 E4', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-a/aamar-sonaar-bangla-ami.mid (geetabitan.com staff notation + MIDI); Tagore 1905; leading rest dropped, last note shortened
  ['in_amar_shonar_bangla', 'Amar Shonar Bangla (My Golden Bengal)', 'Rabindranath Tagore', 's', 160, 'F4 F4 E4 E4:.5 F4:1.5 D4:2 D4 Bb3:.25 C4:.25 Bb3:3.5 A3 Bb3 C4 C4:.5 D4:1.5 D4 C4 D4 Bb3 C4:3', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-j/jodi-tor-daak-shune.mid (geetabitan.com staff notation + MIDI); Tagore 1905
  ['in_ekla_chalo_re', 'Ekla Chalo Re (Jodi Tor Dak Shune)', 'Rabindranath Tagore', 'f', 180, 'B3 B3 B3:2 C4:2 C4 D4 D4:2 D4:3 F4:3 E4:3 D4 C4:2 D4:2 E4 E4 D4 E4:.5 D4:.5 C4:2', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-o/o-aamar-desher-maati.mid (geetabitan.com); Tagore 1905
  ['in_o_amar_desher_mati', 'O Amar Desher Mati (O Soil of My Country)', 'Rabindranath Tagore', 'f', 120, 'C4 C4 C4:2 C4 B3:.5 C4:.5 D4:.5 Eb4:.5 Eb4 D4:2 D4 D4:2 F4 G4:2 D4:.5 F4:.5 Eb4:2 D4 C4:4', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-a/aamra-sobai-raaja.mid (geetabitan.com); Tagore 1905 (per geetabitan)
  ['in_amra_shobai_raja', 'Amra Shobai Raja (We Are All Kings)', 'Rabindranath Tagore', 'f', 220, 'C4:2 C4 C5 C5:2 B4 B4:2 A4 A4:2 G4 G4:2 A4 A4:2 G4 E4:2 G4:6', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-g/gram-chhara-oi-rangamatir.mid (geetabitan.com); Tagore 1909; last note shortened
  ['in_gram_chhara', 'Gram Chhara Oi Ranga Matir Poth (The Red Earth Road)', 'Rabindranath Tagore', 'f', 180, 'A3:3 C4 C4:2 C4:2 E4:2 G4:2 G4:2 F4 G4:.5 F4:.5 F4:4', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-m/megher-kole-rode-hesechhe.mid (geetabitan.com); Tagore 1908
  ['in_megher_kole', 'Megher Kole Rod Hesechhe (Sun Smiles from the Clouds)', 'Rabindranath Tagore', 'k', 160, 'C4 C4:2 E4 G4:2 G4:.5 A4:1.5 B4 B4 G4:2 G4 D4:2 E4 E4:2 F4 D4 E4:.5 D4:3.5', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-a/aaj-dhaaner-khete-roudro.mid (geetabitan.com); Tagore 1908
  ['in_aaj_dhaner_khete', 'Aaj Dhaner Khete Roudro Chhayay (Sun and Shade on the Paddy Fields)', 'Rabindranath Tagore', 'k', 200, 'C4:2 A3:.5 C4:1.5 C4:2 C4:2 C4 D4 E4 G4:2 G4 G4:2 G4 A4 G4:.5 A4:.5 B4 B4:2 B4:2', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-o/ore-bhai-phagun-legechhe.mid (geetabitan.com); Tagore 1915
  ['in_phagun_legechhe', 'Ore Bhai Phagun Legechhe (Spring Has Come)', 'Rabindranath Tagore', 'f', 180, 'C5 B4 C5:2 G4 Bb4:2 Ab4 G4 F4 G4 Ab4 B4:2 C5:2', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-t/tumi-robe-nirobe.mid (geetabitan.com); Tagore 1895
  ['in_tumi_robe_nirobe', 'Tumi Robe Nirobe (You Will Dwell Silently)', 'Rabindranath Tagore', 'f', 120, 'E4 E4 D4 E4:2 D4:2 E4 E4:5 F4 E4:2 G4 G4 A4 G4 G4:3', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-b/bhaalobashi-bhaalobashi.mid (geetabitan.com); Tagore 1924
  ['in_bhalobashi', 'Bhalobashi Bhalobashi (I Love, I Love)', 'Rabindranath Tagore', 'f', 120, 'C5 A4:2 Bb4 F4:2 G4 A4:2 Bb4 A4:5', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-a/aamar-poran-jaaha-chaay.mid (geetabitan.com); Tagore 1888 (Mayar Khela)
  ['in_amar_poran', 'Amar Poran Jaha Chay (All My Heart Desires)', 'Rabindranath Tagore', 'f', 150, 'F4 G4 F4 Eb4 D4 C4 C4:.5 D4:.5 C4 C4:6 C4 C4:.5 G4:.5 F4:6', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-j/jakhon-porbe-na.mid (geetabitan.com); Tagore 1916
  ['in_jakhon_porbe_na', 'Jakhon Porbe Na Mor Payer Chinho (When My Footprints Fade)', 'Rabindranath Tagore', 'f', 180, 'C4 C4:2 Bb3:2 C4 C4 C4:2 C4 D4:2 D4:2 E4 E4 E4 E4 D4:7', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-m/mamo-chitte-niti-nritte.mid (geetabitan.com); Tagore 1910
  ['in_mamo_chitte', 'Mamo Chitte Niti Nritte (Ever Dancing in My Heart)', 'Rabindranath Tagore', 'f', 180, 'C4 C4 C4:2 D4:2 D4 D4 D4:2 Eb4:2 D4 C4 D4:2 G4:2', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-h/ha-re-re-re-re.mid (geetabitan.com); Tagore 1907 (per geetabitan)
  ['in_ha_re_re', 'Ha Re Re Re (Amay Chhere De Re)', 'Rabindranath Tagore', 'f', 220, 'E5 E5:2 E5 D5:2 D5 C5:2 C5 A4:2 G4 A4:2 A4 G4:2 F#4 G4:5', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-t/tomar-holo-suru-aamar-holo.mid (geetabitan.com); Tagore 1916
  ['in_tomar_holo_shuru', 'Tomar Holo Shuru (Yours Begins, Mine Ends)', 'Rabindranath Tagore', 'f', 150, 'C4:2 E4:4 D4 C4 C4 C4 D4:6 D4 A3 B3:4 C4 D4 D4 D4 C4:6', 'in'],
  // source: https://www.geetabitan.com/lyrics/staff-notation-pdf-midi-a/aakash-bhora-surja-taara.mid (geetabitan.com); Tagore 1924
  ['in_akash_bhora', 'Akash Bhora Surjo Tara (Sky Full of Sun and Stars)', 'Rabindranath Tagore', 'f', 120, 'C4 C4:2 C4:3 C4:6 C4:2 C4 C4 B3 D4 D4:6 D4:2 F4 F4 F4 E4 G4:.5 F4:5.5', 'in'],

  // ---- Persia (Iran) ----
  // source: http://anamnese.online.fr/iran/persianm.abc (ABC by Eric Forgeot, after Kambiz Roshanravan; also folktunefinder.com/tunes/53102); traditional; K:Em, first 4 bars, 12-tone (no koron/sori)
  ['ir_mikham_beram_kooh', 'Mikham Beram Kooh (I Want to Go to the Mountain)', 'Traditional (Persian)', 'f', 100, 'E4:.5 E4 B4:.5 B4:.5 A4:.5 B4:3 C5:.5 C5 B4:.5 A4:.5 G4:.5 A4:3', 'ir'],
];
